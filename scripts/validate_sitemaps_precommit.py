#!/usr/bin/env python3
"""Valida sitemaps públicos e suas URLs canônicas antes do commit/deploy.

Exemplo:
    python3 scripts/validate_sitemaps_precommit.py

O processo falha (código 1) se encontrar XML inválido, sitemap redirecionado,
URL duplicada, URL de página sem barra final, redirect, 4xx/5xx ou canonical
HTML diferente do <loc>.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import sys
import time
import xml.etree.ElementTree as ET
from dataclasses import asdict, dataclass
from html import unescape
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

DEFAULT_BASE = "https://condominiosnapraia.com.br"
DEFAULT_SITEMAPS = ("/sitemap.xml", "/sitemap-condominios.xml", "/sitemap-imoveis.xml")
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


@dataclass
class UrlCheck:
    sitemap: str
    url: str
    status: int | None = None
    content_type: str = ""
    canonical: str = ""
    error: str = ""


class ValidationFailure(Exception):
    pass


def canonicalize(url: str) -> str:
    """Normaliza apenas o necessário para comparar URLs canônicas."""
    parsed = urlparse(url.strip())
    if parsed.path.endswith('.html'):
        return parsed.geturl()
    return parsed.geturl().rstrip("/") + "/"


def is_page_url(url: str) -> bool:
    path = urlparse(url).path
    return not path.endswith(".xml")


def load_sitemap(url: str, session: requests.Session) -> tuple[str, list[str]]:
    response = session.get(url, allow_redirects=False, timeout=30)
    if response.status_code != 200:
        raise ValidationFailure(f"sitemap {url}: HTTP {response.status_code}")
    if "xml" not in response.headers.get("content-type", "").lower():
        raise ValidationFailure(
            f"sitemap {url}: Content-Type inesperado {response.headers.get('content-type', '')!r}"
        )
    try:
        root = ET.fromstring(response.content)
    except ET.ParseError as exc:
        raise ValidationFailure(f"sitemap {url}: XML inválido: {exc}") from exc

    tag = root.tag.rsplit("}", 1)[-1]
    if tag not in {"urlset", "sitemapindex"}:
        raise ValidationFailure(f"sitemap {url}: raiz XML inesperada: {tag}")

    locs = []
    for element in root.findall(".//sm:loc", NS):
        if element.text and element.text.strip():
            locs.append(unescape(element.text.strip()))
    if not locs:
        raise ValidationFailure(f"sitemap {url}: nenhum <loc> encontrado")
    return tag, locs


def check_url(item: tuple[str, str], timeout: int, retries: int) -> UrlCheck:
    sitemap, url = item
    result = UrlCheck(sitemap=sitemap, url=url)
    parsed = urlparse(url)
    if parsed.scheme != "https" or not parsed.netloc:
        result.error = "URL não usa HTTPS ou não possui host válido"
        return result
    if parsed.query or parsed.fragment:
        result.error = "URL possui query string ou fragmento"
        return result
    if is_page_url(url) and not parsed.path.endswith(("/", ".html")):
        result.error = "URL de página sem barra final"
        return result

    response = None
    last_error = None
    for attempt in range(retries + 1):
        try:
            response = requests.get(
                url,
                allow_redirects=False,
                timeout=timeout,
                headers={
                    "User-Agent": "CondominiosNaPraia-SitemapValidator/1.1",
                    "Connection": "close",
                },
            )
            # 429 e 5xx podem ser transitórios; 3xx/4xx restantes são definitivos.
            if response.status_code == 200 or (response.status_code < 500 and response.status_code != 429):
                break
            last_error = f"HTTP transitório {response.status_code}"
        except requests.RequestException as exc:
            last_error = str(exc)
            response = None
        if attempt < retries:
            time.sleep(min(2 ** attempt, 4))

    if response is None:
        result.error = f"erro de rede após {retries + 1} tentativas: {last_error}"
        return result

    result.status = response.status_code
    result.content_type = response.headers.get("content-type", "")
    if response.status_code != 200:
        result.error = f"HTTP {response.status_code}; Location={response.headers.get('location', '')}"
        return result
    if is_page_url(url) and "html" in result.content_type.lower():
        soup = BeautifulSoup(response.text, "html.parser")
        node = soup.find("link", rel=lambda value: value and "canonical" in value)
        if not node or not node.get("href"):
            result.error = "canonical ausente"
            return result
        result.canonical = node["href"].strip()
        if canonicalize(result.canonical) != canonicalize(url):
            result.error = f"canonical divergente: {result.canonical}"
    elif is_page_url(url):
        result.error = f"Content-Type não HTML: {result.content_type}"
    return result


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default=DEFAULT_BASE)
    parser.add_argument("--sitemap", action="append", dest="sitemaps")
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--timeout", type=int, default=25)
    parser.add_argument("--retries", type=int, default=2, help="Tentativas extras para timeout, 429 e 5xx")
    parser.add_argument("--limit", type=int, default=0, help="Limita URLs por execução; 0 = todas")
    parser.add_argument("--output", default="sitemap-validation-report.json")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    base = args.base_url.rstrip("/")
    sitemap_paths = tuple(args.sitemaps or DEFAULT_SITEMAPS)
    sitemap_urls = [path if path.startswith("http") else base + "/" + path.lstrip("/") for path in sitemap_paths]
    session = requests.Session()
    all_items: list[tuple[str, str]] = []
    failures: list[str] = []
    sitemap_stats = {}

    for sitemap_url in sitemap_urls:
        try:
            root_tag, locs = load_sitemap(sitemap_url, session)
            sitemap_stats[sitemap_url] = {"root": root_tag, "urls": len(locs)}
            all_items.extend((sitemap_url, loc) for loc in locs)
        except ValidationFailure as exc:
            failures.append(str(exc))

    seen: dict[str, list[str]] = {}
    for sitemap, url in all_items:
        seen.setdefault(url, []).append(sitemap)
    for url, sources in seen.items():
        if len(sources) > 1:
            failures.append(f"URL duplicada em {len(sources)} sitemaps: {url}")

    if args.limit:
        all_items = all_items[: args.limit]

    checks: list[UrlCheck] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = [pool.submit(check_url, item, args.timeout, args.retries) for item in all_items]
        for future in concurrent.futures.as_completed(futures):
            checks.append(future.result())
    checks.sort(key=lambda item: item.url)
    failures.extend(f"{item.url}: {item.error}" for item in checks if item.error)

    report = {
        "base_url": base,
        "sitemaps": sitemap_stats,
        "urls_auditadas": len(checks),
        "falhas": len(failures),
        "erros": failures,
        "checks": [asdict(item) for item in checks],
    }
    Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Sitemaps: {len(sitemap_stats)} | URLs auditadas: {len(checks)} | Falhas: {len(failures)}")
    if failures:
        print("VALIDAÇÃO FALHOU")
        for failure in failures[:80]:
            print(f"- {failure}")
        if len(failures) > 80:
            print(f"- ... e mais {len(failures) - 80} falhas; veja {args.output}")
        return 1
    print("OK: sitemaps sem redirects, 4xx/5xx, duplicatas ou canonicals divergentes")
    return 0


if __name__ == "__main__":
    sys.exit(main())

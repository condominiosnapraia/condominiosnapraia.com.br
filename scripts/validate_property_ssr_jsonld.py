#!/usr/bin/env python3
"""Valida SSR e JSON-LD das páginas canônicas de imóveis em produção.

Exemplos:
    python3 scripts/validate_property_ssr_jsonld.py --limit 10
    python3 scripts/validate_property_ssr_jsonld.py --workers 6 --timeout 60
    python3 scripts/validate_property_ssr_jsonld.py --url https://condominiosnapraia.com.br/imovel/exemplo/

O teste consulta o HTML bruto, sem navegador e sem depender de JavaScript.
Isso permite confirmar se buscadores e crawlers recebem H1, descrição, imagem,
canonical e RealEstateListing no HTML inicial.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import re
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
DEFAULT_SITEMAP = "/sitemap-imoveis.xml"
USER_AGENT = "PortalMeuLitoral-SSR-JSONLD-Validator/1.0"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

# Identificadores internos que não devem aparecer no HTML público.
PRIVACY_PATTERNS = (
    # Aceita somente identificadores compactos; evita falsos positivos como “quadra de tênis”.
    re.compile(r"\b(?:quadra|torre|unidade|box)\s*(?:n[ºo°.]?\s*)?(?:[a-z]\d*|\d+)\b", re.I),
    # “Apartamento 2 dormitórios” é legítimo; número de unidade exige marcador explícito.
    re.compile(r"\b(?:apt(?:o)?|apartamento)\s*(?:n[ºo°.]|número|num\.?)\s*\d+\b", re.I),
    re.compile(r"\b(?:xan|cap|maq|oso)-\d{3}\b", re.I),
    re.compile(r"\bcasa\s*(?:n[ºo°.]?|número)\s*[a-z0-9-]+\b", re.I),
    # Preserva medidas legítimas, por exemplo: lote 390,20 m².
    re.compile(
        r"\blote\s+(?:n[ºo°.]?\s*)?"
        r"(?!\d+(?:[.,]\d+)?\s*m(?:2|²)\b)(?:[a-z]\d*|\d+)\b",
        re.I,
    ),
)


@dataclass
class CheckResult:
    url: str
    status: int | None = None
    content_type: str = ""
    elapsed_ms: int | None = None
    canonical: str = ""
    h1: str = ""
    schema_types: list[str] | None = None
    errors: list[str] | None = None
    attempts: int = 0

    def __post_init__(self) -> None:
        if self.schema_types is None:
            self.schema_types = []
        if self.errors is None:
            self.errors = []


class ValidationFailure(Exception):
    pass


def canonicalize(url: str) -> str:
    parsed = urlparse(url.strip())
    path = parsed.path or "/"
    if path.endswith(".html"):
        normalized_path = path
    else:
        normalized_path = path.rstrip("/") + "/"
    return f"{parsed.scheme.lower()}://{parsed.netloc.lower()}{normalized_path}"


def is_internal_identifier(value: str) -> bool:
    return any(pattern.search(value) for pattern in PRIVACY_PATTERNS)


def load_sitemap(sitemap_url: str, timeout: int) -> list[str]:
    response = requests.get(
        sitemap_url,
        headers={"User-Agent": USER_AGENT},
        allow_redirects=False,
        timeout=timeout,
    )
    if response.status_code != 200:
        raise ValidationFailure(f"sitemap HTTP {response.status_code}: {sitemap_url}")
    if "xml" not in response.headers.get("content-type", "").lower():
        raise ValidationFailure(
            f"sitemap Content-Type inesperado {response.headers.get('content-type', '')!r}"
        )
    try:
        root = ET.fromstring(response.content)
    except ET.ParseError as exc:
        raise ValidationFailure(f"sitemap XML inválido: {exc}") from exc
    urls = []
    for element in root.findall(".//sm:loc", NS):
        if element.text and element.text.strip():
            value = unescape(element.text.strip())
            if "/imovel/" in urlparse(value).path:
                urls.append(value)
    if not urls:
        raise ValidationFailure(f"nenhuma URL /imovel/ encontrada em {sitemap_url}")
    return sorted(set(urls))


def parse_jsonld(soup: BeautifulSoup, result: CheckResult) -> list[dict]:
    blocks = soup.find_all("script", attrs={"type": re.compile(r"application/ld\+json", re.I)})
    if not blocks:
        result.errors.append("JSON-LD ausente")
        return []

    parsed_blocks: list[dict] = []
    for index, block in enumerate(blocks, start=1):
        raw = block.string or block.get_text()
        try:
            value = json.loads(raw)
        except json.JSONDecodeError as exc:
            result.errors.append(f"JSON-LD {index} inválido: {exc.msg}")
            continue
        values = value if isinstance(value, list) else [value]
        for item in values:
            if isinstance(item, dict):
                parsed_blocks.append(item)
            else:
                result.errors.append(f"JSON-LD {index} não contém objeto")
    return parsed_blocks


def first_meta(soup: BeautifulSoup, attrs: dict) -> str:
    node = soup.find("meta", attrs=attrs)
    return str(node.get("content", "")).strip() if node else ""


def check_jsonld(soup: BeautifulSoup, result: CheckResult, expected_url: str) -> None:
    data = parse_jsonld(soup, result)
    types: list[str] = []
    listings = []
    for item in data:
        item_type = item.get("@type", "")
        item_types = item_type if isinstance(item_type, list) else [item_type]
        types.extend(str(value) for value in item_types if value)
        if "RealEstateListing" in item_types:
            listings.append(item)

    result.schema_types = sorted(set(types))
    if not listings:
        result.errors.append("RealEstateListing ausente")
        return

    listing = listings[0]
    if listing.get("@context") != "https://schema.org":
        result.errors.append("RealEstateListing sem @context https://schema.org")
    for field in ("name", "description", "image", "url", "itemOffered"):
        value = listing.get(field)
        if not value:
            result.errors.append(f"RealEstateListing sem campo obrigatório: {field}")
    schema_url = str(listing.get("url", "")).strip()
    if schema_url and canonicalize(schema_url) != canonicalize(expected_url):
        result.errors.append(f"JSON-LD url divergente: {schema_url}")
    image = listing.get("image")
    if isinstance(image, list):
        image = image[0] if image else ""
    if image and not str(image).startswith("https://"):
        result.errors.append("imagem do JSON-LD não usa HTTPS")
    offers = listing.get("offers")
    if offers:
        if str(offers.get("priceCurrency", "")) != "BRL":
            result.errors.append("offers.priceCurrency diferente de BRL")
        try:
            if float(offers.get("price", 0)) <= 0:
                result.errors.append("offers.price não é positivo")
        except (TypeError, ValueError):
            result.errors.append("offers.price não é numérico")


def public_content_strings(soup: BeautifulSoup) -> list[str]:
    """Retorna texto público e metadados, ignorando CSS, JS e atributos de URL."""
    values: list[str] = []
    title = soup.find("title")
    if title:
        values.append(title.get_text(" ", strip=True))
    for attrs in (
        {"name": re.compile(r"^(description|twitter:title|twitter:description)$", re.I)},
        {"property": re.compile(r"^(og:title|og:description)$", re.I)},
    ):
        for node in soup.find_all("meta", attrs=attrs):
            content = str(node.get("content", "")).strip()
            if content:
                values.append(content)

    visible_soup = BeautifulSoup(str(soup), "html.parser")
    for node in visible_soup.find_all(["style", "script", "noscript"]):
        node.decompose()
    visible_text = visible_soup.get_text(" ", strip=True)
    if visible_text:
        values.append(visible_text)

    # O JSON-LD é validado separadamente, mas seus campos editoriais também são públicos.
    for block in soup.find_all("script", attrs={"type": re.compile(r"application/ld\+json", re.I)}):
        try:
            payload = json.loads(block.string or block.get_text())
        except json.JSONDecodeError:
            continue
        objects = payload if isinstance(payload, list) else [payload]
        for item in objects:
            if not isinstance(item, dict):
                continue
            for field in ("name", "description"):
                if item.get(field):
                    values.append(str(item[field]))
            offered = item.get("itemOffered")
            if isinstance(offered, dict):
                for field in ("name", "description"):
                    if offered.get(field):
                        values.append(str(offered[field]))
    return values


def check_html(response: requests.Response, result: CheckResult) -> None:
    html = response.text
    soup = BeautifulSoup(html, "html.parser")

    title = soup.find("title")
    if not title or not title.get_text(" ", strip=True):
        result.errors.append("title ausente ou vazio")

    description = first_meta(soup, {"name": re.compile(r"^description$", re.I)})
    if not description:
        result.errors.append("meta description ausente ou vazia")
    elif len(description) > 160:
        result.errors.append(f"meta description excede 160 caracteres: {len(description)}")

    canonical_node = soup.find("link", rel=lambda value: value and "canonical" in value)
    canonical = str(canonical_node.get("href", "")).strip() if canonical_node else ""
    result.canonical = canonical
    if not canonical:
        result.errors.append("canonical ausente")
    elif canonicalize(canonical) != canonicalize(result.url):
        result.errors.append(f"canonical divergente: {canonical}")
    elif not canonical.startswith("https://"):
        result.errors.append("canonical não usa HTTPS")

    h1_nodes = soup.find_all("h1")
    if not h1_nodes:
        result.errors.append("H1 ausente no HTML inicial")
    elif len(h1_nodes) != 1:
        result.errors.append(f"quantidade de H1 inesperada: {len(h1_nodes)}")
    else:
        result.h1 = h1_nodes[0].get_text(" ", strip=True)
        if not result.h1:
            result.errors.append("H1 vazio")

    ssr = soup.find(id="ssr-imovel")
    if not ssr or ssr.get("data-ssr") != "true":
        result.errors.append("bloco SSR #ssr-imovel ausente ou sem data-ssr=true")
    else:
        if not ssr.find("h1"):
            result.errors.append("bloco SSR sem H1")
        if not ssr.find("img"):
            result.errors.append("bloco SSR sem imagem")
        if not ssr.find(class_="ip-desc"):
            result.errors.append("bloco SSR sem descrição")

    og_image = first_meta(soup, {"property": re.compile(r"^og:image$", re.I)})
    if not og_image or not og_image.startswith("https://"):
        result.errors.append("og:image ausente ou sem HTTPS")

    check_jsonld(soup, result, result.url)

    # A busca cobre somente texto público, metas editoriais e campos do JSON-LD.
    public_text = " | ".join(public_content_strings(soup))
    for pattern in PRIVACY_PATTERNS:
        match = pattern.search(public_text)
        if match:
            result.errors.append(f"identificador interno exposto: {match.group(0)!r}")


def fetch_and_check(url: str, timeout: int, retries: int) -> CheckResult:
    result = CheckResult(url=url)
    parsed = urlparse(url)
    if parsed.scheme != "https" or not parsed.netloc:
        result.errors.append("URL não usa HTTPS ou não possui host válido")
        return result
    if parsed.query or parsed.fragment:
        result.errors.append("URL possui query string ou fragmento")
        return result
    if not parsed.path.endswith("/"):
        result.errors.append("URL de página sem barra final")
        return result

    for attempt in range(1, retries + 2):
        result.attempts = attempt
        started = time.perf_counter()
        try:
            response = requests.get(
                url,
                headers={"User-Agent": USER_AGENT},
                allow_redirects=False,
                timeout=timeout,
            )
            result.elapsed_ms = round((time.perf_counter() - started) * 1000)
            result.status = response.status_code
            result.content_type = response.headers.get("content-type", "")
            if response.status_code in {408, 425, 429} or response.status_code >= 500:
                if attempt <= retries:
                    time.sleep(min(2 ** (attempt - 1), 8))
                    continue
            break
        except requests.RequestException as exc:
            result.elapsed_ms = round((time.perf_counter() - started) * 1000)
            if attempt <= retries:
                time.sleep(min(2 ** (attempt - 1), 8))
                continue
            result.errors.append(f"erro de rede após {attempt} tentativas: {exc}")
            return result

    if result.status != 200:
        result.errors.append(
            f"HTTP {result.status}; Location={response.headers.get('location', '')}"
        )
        return result
    if "html" not in result.content_type.lower():
        result.errors.append(f"Content-Type não HTML: {result.content_type}")
        return result
    check_html(response, result)
    return result


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default=DEFAULT_BASE)
    parser.add_argument("--sitemap", default=DEFAULT_SITEMAP)
    parser.add_argument("--url", action="append", dest="urls", help="URL específica; pode repetir")
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--timeout", type=int, default=60)
    parser.add_argument("--retries", type=int, default=2)
    parser.add_argument("--limit", type=int, default=0, help="Limita URLs; 0 = todas")
    parser.add_argument("--output", default="property-ssr-jsonld-report.json")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    base = args.base_url.rstrip("/")
    if args.urls:
        urls = sorted(set(args.urls))
    else:
        sitemap_url = args.sitemap if args.sitemap.startswith("http") else base + "/" + args.sitemap.lstrip("/")
        try:
            urls = load_sitemap(sitemap_url, args.timeout)
        except (requests.RequestException, ValidationFailure) as exc:
            print(f"ERRO ao carregar sitemap: {exc}", file=sys.stderr)
            return 2
    if args.limit:
        urls = urls[: args.limit]

    results: list[CheckResult] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = [pool.submit(fetch_and_check, url, args.timeout, args.retries) for url in urls]
        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())
    results.sort(key=lambda item: item.url)

    failures = [item for item in results if item.errors]
    report = {
        "base_url": base,
        "sitemap": args.sitemap if not args.urls else None,
        "urls_auditadas": len(results),
        "falhas": len(failures),
        "ok": len(results) - len(failures),
        "checks": [asdict(item) for item in results],
    }
    Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"SSR/JSON-LD: {len(results)} URLs | OK: {report['ok']} | Falhas: {report['falhas']}")
    if failures:
        print("VALIDAÇÃO FALHOU")
        for item in failures[:40]:
            print(f"- {item.url}")
            for error in item.errors or []:
                print(f"  * {error}")
        if len(failures) > 40:
            print(f"- ... e mais {len(failures) - 40} URLs; veja {args.output}")
        return 1
    print("OK: SSR, H1, canonical, meta, Open Graph, JSON-LD e privacidade validados")
    return 0


if __name__ == "__main__":
    sys.exit(main())

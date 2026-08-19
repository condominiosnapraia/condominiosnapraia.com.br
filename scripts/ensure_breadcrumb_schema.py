#!/usr/bin/env python3
"""Ensure BreadcrumbList JSON-LD exists on public sitemap pages.

The script only edits local static HTML files represented in sitemap.xml. It
never writes to Supabase and skips pages that already contain BreadcrumbList.
"""
from __future__ import annotations

import html as html_lib
import json
import re
from pathlib import Path
from urllib.parse import urlparse
from xml.etree import ElementTree as ET

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
SITE = "https://condominiosnapraia.com.br"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def local_candidates(path: str) -> list[Path]:
    clean = path.lstrip("/")
    if not clean:
        return [ROOT / "index.html"]
    if clean.endswith("/"):
        return [ROOT / clean / "index.html"]
    return [ROOT / clean, ROOT / f"{clean}.html", ROOT / clean / "index.html"]


def clean_text(value: str | None, fallback: str) -> str:
    text = re.sub(r"\s+", " ", html_lib.unescape(value or "")).strip()
    return text or fallback


def page_label(soup: BeautifulSoup, path: str) -> str:
    h1 = soup.find("h1")
    if h1:
        return clean_text(h1.get_text(" ", strip=True), "Página")
    title = soup.find("title")
    if title:
        return clean_text(title.get_text(" ", strip=True), "Página")
    if path == "/blog/":
        return "Blog"
    return "Página do Portal Meu Litoral"


def breadcrumb_items(url: str, path: str, label: str) -> list[dict]:
    items = [{"@type": "ListItem", "position": 1, "name": "Início", "item": SITE + "/"}]
    if path.startswith("/blog/") or path == "/blog":
        items.append({"@type": "ListItem", "position": 2, "name": "Blog", "item": SITE + "/blog/"})
        if path not in ("/blog", "/blog/"):
            items.append({"@type": "ListItem", "position": 3, "name": label, "item": url})
    elif path.startswith("/imovel/") or path.startswith("/imoveis"):
        items.append({"@type": "ListItem", "position": 2, "name": "Imóveis", "item": SITE + "/imoveis/"})
        if path.startswith("/imovel/"):
            items.append({"@type": "ListItem", "position": 3, "name": label, "item": url})
    elif path.startswith("/condominio") or path.startswith("/condomini") or "condominio" in path:
        items.append({"@type": "ListItem", "position": 2, "name": "Condomínios", "item": SITE + "/condominios/"})
        items.append({"@type": "ListItem", "position": 3, "name": label, "item": url})
    elif path == "/contemplado-imoveis" or path.startswith("/contemplado-imoveis/"):
        items.append({"@type": "ListItem", "position": 2, "name": "Crédito contemplado", "item": SITE + "/contemplado-imoveis"})
        if path != "/contemplado-imoveis":
            items.append({"@type": "ListItem", "position": 3, "name": label, "item": url})
    else:
        items.append({"@type": "ListItem", "position": 2, "name": label, "item": url})
    return items


def schema_script(url: str, path: str, soup: BeautifulSoup) -> str:
    label = page_label(soup, path)
    schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumb_items(url, path, label),
    }
    payload = json.dumps(schema, ensure_ascii=False, separators=(",", ":"))
    return f'<script type="application/ld+json">{payload}</script>'


def has_breadcrumb(soup: BeautifulSoup) -> bool:
    for script in soup.find_all("script", attrs={"type": re.compile(r"^application/ld\+json$", re.I)}):
        if re.search(r'"@type"\s*:\s*"BreadcrumbList"', script.string or script.get_text(" "), re.I):
            return True
    return False


def main() -> None:
    root = ET.parse(SITEMAP).getroot()
    urls = [node.text.strip() for node in root.findall(".//sm:loc", NS) if node.text]
    changed: list[str] = []
    skipped: list[str] = []
    missing_local: list[str] = []
    for url in urls:
        parsed = urlparse(url)
        path = parsed.path
        local = next((candidate for candidate in local_candidates(path) if candidate.is_file()), None)
        if not local:
            missing_local.append(url)
            continue
        if path == "/":
            continue
        original = local.read_text(encoding="utf-8", errors="ignore")
        soup = BeautifulSoup(original, "html.parser")
        if has_breadcrumb(soup):
            skipped.append(url)
            continue
        marker = re.search(r"</head>", original, re.I)
        if not marker:
            skipped.append(url)
            continue
        injected = schema_script(url, path, soup)
        updated = original[: marker.start()] + injected + "\n" + original[marker.start():]
        local.write_text(updated, encoding="utf-8")
        changed.append(url)
    summary = {
        "sitemap_urls": len(urls),
        "changed": len(changed),
        "skipped_existing": len(skipped),
        "missing_local": len(missing_local),
        "changed_urls": changed,
        "missing_local_urls": missing_local,
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

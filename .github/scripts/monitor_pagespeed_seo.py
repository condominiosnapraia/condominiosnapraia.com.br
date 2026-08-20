#!/usr/bin/env python3
from __future__ import annotations

import datetime as dt
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from html import unescape
from pathlib import Path

ROOT = "https://condominiosnapraia.com.br"
REPORT_DIR = Path(os.environ.get("REPORT_DIR", "reports"))
STATE_PATH = Path(os.environ.get("STATE_PATH", ".monitor-state.json"))
REPORT_DIR.mkdir(parents=True, exist_ok=True)

URLS = {
    "homepage": f"{ROOT}/",
    "imoveis": f"{ROOT}/imoveis/",
    "condominios": f"{ROOT}/condominios/",
    "credito_contemplado": f"{ROOT}/contemplado-imoveis/",
    "favoritos": f"{ROOT}/favoritos/",
}
SITEMAPS = {
    "sitemap-index.xml": f"{ROOT}/sitemap-index.xml",
    "sitemap.xml": f"{ROOT}/sitemap.xml",
    "sitemap-condominios.xml": f"{ROOT}/sitemap-condominios.xml",
    "sitemap-imoveis.xml": f"{ROOT}/sitemap-imoveis.xml",
}
ASSETS = {
    "favicon_svg": f"{ROOT}/img/favicon.svg",
    "hero_mobile_avif": f"{ROOT}/img/hero-praia-mobile.avif",
}


def now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


def fetch(url: str, timeout: int = 35) -> dict:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "PortalMeuLitoral-WeeklyMonitor/1.0"},
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = response.read()
            return {
                "url": url,
                "final_url": response.geturl(),
                "status": response.status,
                "headers": dict(response.headers.items()),
                "body": body,
                "error": None,
            }
    except urllib.error.HTTPError as error:
        body = error.read() if error.fp else b""
        return {
            "url": url,
            "final_url": error.geturl(),
            "status": error.code,
            "headers": dict(error.headers.items()) if error.headers else {},
            "body": body,
            "error": str(error),
        }
    except Exception as error:  # network failures are part of the report
        return {
            "url": url,
            "final_url": url,
            "status": None,
            "headers": {},
            "body": b"",
            "error": str(error),
        }


def text_body(result: dict) -> str:
    return result["body"].decode("utf-8", errors="replace")


def first_match(pattern: str, text: str, flags: int = re.I | re.S) -> str | None:
    match = re.search(pattern, text, flags)
    return unescape(match.group(1).strip()) if match else None


def seo_record(name: str, url: str) -> dict:
    result = fetch(url)
    body = text_body(result)
    canonical = first_match(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)', body)
    if canonical is None:
        canonical = first_match(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical', body)
    description = first_match(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)', body)
    if description is None:
        description = first_match(r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description', body)
    robots = first_match(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']*)', body)
    if robots is None:
        robots = first_match(r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']robots', body)
    title = first_match(r'<title[^>]*>(.*?)</title>', body)
    return {
        "name": name,
        "url": url,
        "status": result["status"],
        "final_url": result["final_url"],
        "redirected": result["final_url"] != url,
        "title": title,
        "description": description,
        "canonical": canonical,
        "robots": robots,
        "content_length": len(result["body"]),
        "error": result["error"],
    }


def metric_value(audits: dict, key: str) -> float | None:
    value = audits.get(key, {}).get("numericValue")
    return float(value) if isinstance(value, (int, float)) else None


def run_pagespeed(url: str, strategy: str) -> dict:
    query = {
        "url": url,
        "strategy": strategy,
        "category": "performance",
    }
    api_key = os.environ.get("PAGESPEED_API_KEY", "").strip()
    if api_key:
        query["key"] = api_key
    endpoint = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?" + urllib.parse.urlencode(query)
    result = fetch(endpoint, timeout=120)
    if result["status"] != 200:
        return {
            "url": url,
            "strategy": strategy,
            "status": result["status"],
            "error": result["error"] or text_body(result)[:500],
        }
    try:
        payload = json.loads(text_body(result))
        lighthouse = payload.get("lighthouseResult", {})
        audits = lighthouse.get("audits", {})
        score = lighthouse.get("categories", {}).get("performance", {}).get("score")
        return {
            "url": url,
            "strategy": strategy,
            "status": 200,
            "performance": round(score * 100, 1) if isinstance(score, (int, float)) else None,
            "fcp_ms": metric_value(audits, "first-contentful-paint"),
            "lcp_ms": metric_value(audits, "largest-contentful-paint"),
            "tbt_ms": metric_value(audits, "total-blocking-time"),
            "cls": metric_value(audits, "cumulative-layout-shift"),
            "inp_ms": metric_value(audits, "interaction-to-next-paint"),
            "tti_ms": metric_value(audits, "interactive"),
            "speed_index_ms": metric_value(audits, "speed-index"),
        }
    except Exception as error:
        return {"url": url, "strategy": strategy, "status": 200, "error": f"invalid PageSpeed response: {error}"}


def sitemap_record(name: str, url: str) -> dict:
    result = fetch(url)
    body = text_body(result)
    if name == "sitemap-index.xml":
        count = len(re.findall(r"<sitemap(?:\s|>)", body, re.I))
    else:
        count = len(re.findall(r"<url(?:\s|>)", body, re.I))
    return {
        "name": name,
        "url": url,
        "status": result["status"],
        "count": count,
        "content_type": result["headers"].get("Content-Type", ""),
        "error": result["error"],
    }


def asset_record(name: str, url: str) -> dict:
    result = fetch(url)
    return {
        "name": name,
        "url": url,
        "status": result["status"],
        "content_type": result["headers"].get("Content-Type", ""),
        "content_length": len(result["body"]),
        "cache_control": result["headers"].get("Cache-Control", ""),
        "error": result["error"],
    }


def parse_robots() -> dict:
    result = fetch(f"{ROOT}/robots.txt")
    body = text_body(result)
    return {
        "url": f"{ROOT}/robots.txt",
        "status": result["status"],
        "has_sitemap_index": f"Sitemap: {ROOT}/sitemap-index.xml" in body,
        "has_allow_root": bool(re.search(r"^Allow:\s*/", body, re.M)),
        "error": result["error"],
    }


def compare_metrics(current: dict, previous: dict | None) -> list[str]:
    if not previous:
        return []
    findings = []
    if current.get("performance") is not None and previous.get("performance") is not None and current["performance"] <= previous["performance"] - 5:
        findings.append(f"{current['strategy']} Performance caiu de {previous['performance']} para {current['performance']}")
    if current.get("lcp_ms") is not None and previous.get("lcp_ms") is not None and current["lcp_ms"] >= previous["lcp_ms"] + 500:
        findings.append(f"{current['strategy']} LCP aumentou de {previous['lcp_ms']:.0f} ms para {current['lcp_ms']:.0f} ms")
    if current.get("tbt_ms") is not None and current["tbt_ms"] > 300:
        findings.append(f"{current['strategy']} TBT acima de 300 ms: {current['tbt_ms']:.0f} ms")
    if current.get("cls") is not None and current["cls"] > 0.05:
        findings.append(f"{current['strategy']} CLS acima de 0,05: {current['cls']:.3f}")
    return findings


def main() -> int:
    previous_state = {}
    if STATE_PATH.exists():
        try:
            previous_state = json.loads(STATE_PATH.read_text(encoding="utf-8"))
        except Exception:
            previous_state = {}
    previous = previous_state.get("last", {})

    seo = [seo_record(name, url) for name, url in URLS.items()]
    robots = parse_robots()
    sitemaps = [sitemap_record(name, url) for name, url in SITEMAPS.items()]
    assets = [asset_record(name, url) for name, url in ASSETS.items()]
    pagespeed = []
    for strategy in ("mobile", "desktop"):
        pagespeed.append(run_pagespeed(ROOT + "/", strategy))

    findings = []
    hard_failures = []
    for item in seo:
        if item["status"] != 200:
            hard_failures.append(f"{item['name']} HTTP {item['status']}")
        if not item["canonical"]:
            hard_failures.append(f"{item['name']} sem canonical")
    if not robots["has_sitemap_index"]:
        hard_failures.append("robots.txt sem sitemap-index.xml")
    for item in sitemaps:
        if item["status"] != 200:
            hard_failures.append(f"{item['name']} HTTP {item['status']}")
    for item in assets:
        if item["status"] != 200:
            hard_failures.append(f"asset {item['name']} HTTP {item['status']}")
    for current in pagespeed:
        previous_item = previous.get("pagespeed", {}).get(current.get("strategy"))
        findings.extend(compare_metrics(current, previous_item))

    pagespeed_unavailable = [item for item in pagespeed if item.get("status") != 200]
    availability_notes = []
    if pagespeed_unavailable:
        strategies = ", ".join(item.get("strategy", "unknown") for item in pagespeed_unavailable)
        availability_notes.append(f"PageSpeed indisponível para {strategies}; a API pode estar em quota ou sem chave. Métricas não foram inventadas.")
    metric_findings = bool(findings)
    previous_streak = int(previous_state.get("metric_regression_streak", 0) or 0)
    metric_streak = previous_streak + 1 if metric_findings else 0
    issue = bool(hard_failures) or metric_streak >= 2
    all_findings = hard_failures + findings

    current = {
        "checked_at": now_iso(),
        "pagespeed": {item["strategy"]: item for item in pagespeed},
        "seo": seo,
        "robots": robots,
        "sitemaps": sitemaps,
        "assets": assets,
        "findings": all_findings,
        "warnings": availability_notes,
        "hard_failures": hard_failures,
        "metric_regression_streak": metric_streak,
    }
    STATE_PATH.write_text(json.dumps({"last": current, "metric_regression_streak": metric_streak}, ensure_ascii=False, indent=2), encoding="utf-8")

    report = {
        "checked_at": current["checked_at"],
        "root": ROOT,
        "issue": issue,
        "metric_attention": metric_findings,
        "metric_regression_streak": metric_streak,
        "findings": all_findings,
        "warnings": availability_notes,
        "page_speed_available": not pagespeed_unavailable,
        "pagespeed": pagespeed,
        "seo": seo,
        "robots": robots,
        "sitemaps": sitemaps,
        "assets": assets,
        "previous_available": bool(previous),
    }
    (REPORT_DIR / "weekly-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = [
        "# Monitoramento semanal PageSpeed e SEO — Portal Meu Litoral",
        "",
        f"Verificado em: {current['checked_at']}",
        f"Regressão crítica: {'SIM' if issue else 'NÃO'}",
        f"Atenção de métrica: {'SIM' if metric_findings else 'NÃO'} (sequência: {metric_streak})",
        f"PageSpeed disponível: {'SIM' if not pagespeed_unavailable else 'NÃO'}",
        "",
        "## PageSpeed",
        "",
        "| Estratégia | Performance | FCP | LCP | TBT | CLS | Status |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]
    for item in pagespeed:
        def fmt(value, suffix=""):
            return "—" if value is None else f"{value:.0f}{suffix}"
        lines.append(f"| {item.get('strategy', '—')} | {item.get('performance', '—')} | {fmt(item.get('fcp_ms'), ' ms')} | {fmt(item.get('lcp_ms'), ' ms')} | {fmt(item.get('tbt_ms'), ' ms')} | {item.get('cls', '—')} | {item.get('status', '—')} |")
    lines.extend(["", "## SEO técnico", ""])
    for item in seo:
        lines.append(f"- {item['name']}: HTTP {item['status']}; canonical={'OK' if item['canonical'] else 'FALHA'}; title={'OK' if item['title'] else 'FALHA'}; description={'OK' if item['description'] else 'FALHA'}.")
    lines.extend(["", "## Sitemaps e assets", ""])
    for item in sitemaps:
        lines.append(f"- {item['name']}: HTTP {item['status']}; itens detectados: {item['count']}.")
    for item in assets:
        lines.append(f"- {item['name']}: HTTP {item['status']}; {item['content_type']}; {item['content_length']} bytes.")
    lines.extend(["", "## Achados", ""])
    report_findings = all_findings + availability_notes
    lines.extend([f"- {finding}" for finding in report_findings] or ["- Nenhuma regressão crítica ou atenção de métrica nesta execução."])
    lines.extend(["", "A rotina não modifica código, CRM, Supabase, registros ou rotas."])
    (REPORT_DIR / "weekly-report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    github_output = os.environ.get("GITHUB_OUTPUT")
    if github_output:
        with open(github_output, "a", encoding="utf-8") as output:
            output.write(f"issue={'true' if issue else 'false'}\n")
            output.write(f"metric_attention={'true' if metric_findings else 'false'}\n")
            output.write(f"report_path={REPORT_DIR / 'weekly-report.md'}\n")
    print(json.dumps({"issue": issue, "metric_attention": metric_findings, "findings": all_findings}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())

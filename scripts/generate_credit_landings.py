from __future__ import annotations

import html
import json
import re
import shutil
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'contemplado-imoveis' / 'index.html'
CSS_PATH = ROOT / 'css' / 'carta-contemplada.css'
BASE_URL = 'https://condominiosnapraia.com.br'
PREFIX = 'carta-contemplada-imovel-'

CSS = r'''
:root{--cc-ocean:#0c4a6e;--cc-ocean-deep:#082f49;--cc-teal:#0e7490;--cc-gold:#b7791f;--cc-gold-soft:#f8eddc;--cc-green:#128044;--cc-green-dark:#0d6737;--cc-ink:#163246;--cc-muted:#607080;--cc-line:#e5e9ec;--cc-paper:#fff;--cc-mist:#f4f7f8;--cc-cream:#fbf8f2;--cc-radius:18px;--cc-shadow:0 20px 60px rgba(10,50,75,.12)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cc-mist);color:var(--cc-ink);font-family:'Outfit',system-ui,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit}.cc-header{position:sticky;top:0;z-index:20;background:rgba(8,47,73,.96);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.12)}.cc-header-inner{max-width:1180px;margin:auto;min-height:68px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:18px}.cc-brand{display:flex;align-items:center;gap:11px;text-decoration:none}.cc-brand-mark{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(135deg,#d6a348,#8c6428);color:#fff;font-size:17px;box-shadow:0 6px 16px rgba(0,0,0,.16)}.cc-brand-name{display:block;color:#fff;font-weight:700;font-size:15px;line-height:1.1}.cc-brand-sub{display:block;margin-top:4px;color:#f4d28e;text-transform:uppercase;font-size:8px;letter-spacing:.16em}.cc-header-links{display:flex;align-items:center;gap:10px}.cc-header-link{color:rgba(255,255,255,.82);text-decoration:none;font-size:12px;padding:9px 12px;border-radius:8px;transition:background .18s,color .18s}.cc-header-link:hover,.cc-header-link:focus-visible{background:rgba(255,255,255,.1);color:#fff}.cc-header-cta{display:inline-flex;align-items:center;gap:7px;color:#fff;background:var(--cc-green);font-size:12px;font-weight:700;text-decoration:none;padding:10px 15px;border-radius:9px;box-shadow:0 7px 16px rgba(0,0,0,.12);transition:transform .18s,background .18s}.cc-header-cta:hover,.cc-header-cta:focus-visible{background:var(--cc-green-dark);transform:translateY(-1px)}.cc-hero{position:relative;overflow:hidden;background:linear-gradient(135deg,#0a3b5b 0%,#0d5c7b 58%,#168b9a 100%);color:#fff}.cc-hero:before{content:'';position:absolute;width:560px;height:560px;right:-180px;top:-250px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.18),transparent 67%)}.cc-hero:after{content:'';position:absolute;left:-120px;bottom:-270px;width:480px;height:480px;border-radius:50%;border:1px solid rgba(255,255,255,.15)}.cc-hero-inner{position:relative;z-index:1;max-width:1180px;margin:auto;padding:26px 24px 68px}.cc-breadcrumb{display:flex;flex-wrap:wrap;gap:7px;align-items:center;color:rgba(255,255,255,.68);font-size:11px;margin-bottom:38px}.cc-breadcrumb a{text-decoration:none}.cc-breadcrumb a:hover,.cc-breadcrumb a:focus-visible{color:#fff;text-decoration:underline}.cc-breadcrumb-sep{opacity:.55}.cc-hero-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(310px,430px);gap:54px;align-items:center}.cc-eyebrow{display:inline-flex;align-items:center;gap:8px;color:#f6d48f;text-transform:uppercase;letter-spacing:.19em;font-size:10px;font-weight:700}.cc-eyebrow-dot{width:7px;height:7px;border-radius:50%;background:#f6d48f;box-shadow:0 0 0 5px rgba(246,212,143,.14)}.cc-hero h1{max-width:720px;margin:15px 0 15px;font-family:'Fraunces',Georgia,serif;font-size:clamp(36px,5.2vw,66px);font-weight:500;line-height:1.04;letter-spacing:-.035em}.cc-hero-intro{max-width:650px;margin:0;color:rgba(255,255,255,.78);font-size:16px;line-height:1.7}.cc-code{display:inline-block;margin-top:22px;padding:7px 12px;border:1px solid rgba(255,255,255,.2);border-radius:999px;color:#fff;background:rgba(0,0,0,.12);font-size:11px;font-weight:700;letter-spacing:.12em}.cc-hero-card{background:rgba(255,255,255,.97);color:var(--cc-ink);padding:28px;border:1px solid rgba(255,255,255,.45);border-radius:24px;box-shadow:0 24px 70px rgba(0,25,45,.22)}.cc-card-topline{display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--cc-muted);font-size:11px;text-transform:uppercase;letter-spacing:.12em;font-weight:700}.cc-adm-pill{display:inline-flex;align-items:center;gap:7px;color:var(--cc-ocean);font-size:13px;text-transform:none;letter-spacing:0;font-weight:700}.cc-adm-dot{width:9px;height:9px;border-radius:50%;display:inline-block}.cc-amount-label{margin-top:26px;color:var(--cc-muted);font-size:12px}.cc-amount{margin-top:5px;color:var(--cc-ocean-deep);font-family:'Fraunces',Georgia,serif;font-size:clamp(38px,5vw,56px);line-height:1.05;letter-spacing:-.03em}.cc-amount span{font-family:'Outfit',sans-serif;font-size:.42em;vertical-align:top;position:relative;top:.2em;margin-right:4px;letter-spacing:0}.cc-hero-card-note{margin-top:14px;padding-top:14px;border-top:1px solid var(--cc-line);color:var(--cc-muted);font-size:12px;line-height:1.6}.cc-main{max-width:1080px;margin:-34px auto 0;padding:0 24px 80px;position:relative;z-index:2}.cc-layout{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(280px,.75fr);gap:22px}.cc-panel{background:var(--cc-paper);border:1px solid var(--cc-line);border-radius:var(--cc-radius);box-shadow:0 10px 35px rgba(10,50,75,.06)}.cc-panel-main{padding:30px}.cc-panel h2,.cc-section h2{margin:0;color:var(--cc-ocean-deep);font-family:'Fraunces',Georgia,serif;font-weight:500;letter-spacing:-.02em}.cc-panel h2{font-size:28px}.cc-section h2{font-size:clamp(28px,4vw,42px);line-height:1.1}.cc-panel-lede{margin:8px 0 24px;color:var(--cc-muted);font-size:14px;line-height:1.6}.cc-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.cc-stat{padding:17px;background:var(--cc-cream);border:1px solid #f0e5d6;border-radius:13px}.cc-stat-label{color:var(--cc-muted);font-size:11px}.cc-stat-value{margin-top:5px;color:var(--cc-ocean);font-size:21px;font-weight:700;line-height:1.2}.cc-stat-note{margin-top:4px;color:var(--cc-muted);font-size:10px}.cc-panel-cta{position:sticky;top:90px;padding:28px;background:linear-gradient(160deg,#fff 0%,#f5faf9 100%)}.cc-cta-kicker{color:var(--cc-green);font-size:10px;letter-spacing:.17em;text-transform:uppercase;font-weight:800}.cc-panel-cta h2{margin-top:11px;font-size:30px}.cc-cta-copy{margin:12px 0 22px;color:var(--cc-muted);font-size:14px;line-height:1.65}.cc-whatsapp{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px 16px;border-radius:10px;background:var(--cc-green);color:#fff;text-decoration:none;font-size:13px;font-weight:800;box-shadow:0 10px 20px rgba(18,128,68,.2);transition:background .18s,transform .18s}.cc-whatsapp:hover,.cc-whatsapp:focus-visible{background:var(--cc-green-dark);transform:translateY(-1px)}.cc-back{display:block;margin-top:13px;color:var(--cc-ocean);font-size:12px;text-align:center;text-decoration:none}.cc-back:hover,.cc-back:focus-visible{text-decoration:underline}.cc-trust{display:grid;gap:9px;margin-top:25px;padding-top:20px;border-top:1px solid var(--cc-line)}.cc-trust-item{display:flex;gap:9px;color:var(--cc-muted);font-size:11px;line-height:1.45}.cc-trust-icon{color:var(--cc-gold);font-weight:800}.cc-section{max-width:900px;margin:74px auto 0;padding:0 24px}.cc-section-lede{max-width:760px;margin:15px 0 0;color:var(--cc-muted);font-size:16px;line-height:1.8}.cc-editorial-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:28px}.cc-editorial-card{padding:24px;background:var(--cc-paper);border:1px solid var(--cc-line);border-radius:16px}.cc-editorial-card h3{margin:0 0 9px;color:var(--cc-ocean);font-family:'Fraunces',Georgia,serif;font-size:22px;font-weight:500}.cc-editorial-card p{margin:0;color:var(--cc-muted);font-size:14px;line-height:1.7}.cc-checks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:28px}.cc-check{padding:21px;background:#fff;border:1px solid var(--cc-line);border-radius:15px}.cc-check-number{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#fff3db;color:#7a4e13;font-size:12px;font-weight:800}.cc-check h3{margin:15px 0 7px;color:var(--cc-ocean);font-size:15px}.cc-check p{margin:0;color:var(--cc-muted);font-size:13px;line-height:1.65}.cc-faq{margin-top:26px}.cc-faq details{background:#fff;border:1px solid var(--cc-line);border-radius:12px;margin:9px 0}.cc-faq summary{padding:17px 18px;color:var(--cc-ocean);font-size:14px;font-weight:700;cursor:pointer;list-style:none}.cc-faq summary::-webkit-details-marker{display:none}.cc-faq summary:after{content:'+';float:right;color:var(--cc-gold);font-size:20px;font-weight:400;line-height:14px}.cc-faq details[open] summary:after{content:'−'}.cc-faq p{margin:0;padding:0 18px 18px;color:var(--cc-muted);font-size:13px;line-height:1.7}.cc-related{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:26px}.cc-related-card{display:block;padding:19px;background:#fff;border:1px solid var(--cc-line);border-radius:14px;text-decoration:none;transition:transform .18s,box-shadow .18s,border-color .18s}.cc-related-card:hover,.cc-related-card:focus-visible{transform:translateY(-2px);border-color:#bad5dd;box-shadow:0 12px 28px rgba(10,50,75,.09)}.cc-related-adm{display:flex;align-items:center;gap:7px;color:var(--cc-muted);font-size:10px;text-transform:uppercase;letter-spacing:.1em;font-weight:800}.cc-related-dot{width:7px;height:7px;border-radius:50%}.cc-related-value{margin-top:12px;color:var(--cc-ocean);font-family:'Fraunces',Georgia,serif;font-size:25px}.cc-related-meta{margin-top:5px;color:var(--cc-muted);font-size:11px}.cc-disclaimer{max-width:900px;margin:44px auto 0;padding:17px 18px;color:var(--cc-muted);background:#eef3f4;border-left:3px solid var(--cc-gold);font-size:11px;line-height:1.65}.cc-footer{margin-top:78px;background:#092f48;color:rgba(255,255,255,.75);padding:45px 24px 78px}.cc-footer-inner{max-width:1080px;margin:auto;display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:35px}.cc-footer-brand{color:#fff;font-family:'Fraunces',Georgia,serif;font-size:23px}.cc-footer-text{max-width:330px;margin:10px 0 0;color:rgba(255,255,255,.62);font-size:12px;line-height:1.65}.cc-footer-title{margin-bottom:12px;color:#f1cf8a;text-transform:uppercase;letter-spacing:.13em;font-size:10px;font-weight:800}.cc-footer a{display:flex;align-items:center;width:max-content;height:28px;padding:0;margin:0;color:rgba(255,255,255,.84);font-size:12px;line-height:18px;text-decoration:none}.cc-footer a:hover,.cc-footer a:focus-visible{color:#fff;text-decoration:underline}.cc-footer-bottom{max-width:1080px;margin:32px auto 0;padding-top:18px;border-top:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.72);font-size:10px}.cc-mobile-nav{display:none}@media(max-width:800px){.cc-header-inner{min-height:62px;padding:0 16px}.cc-header-links .cc-header-link{display:none}.cc-header-cta{padding:9px 11px;font-size:11px}.cc-brand-name{font-size:14px}.cc-brand-sub{font-size:7px}.cc-hero-inner{padding:20px 18px 56px}.cc-breadcrumb{margin-bottom:30px;font-size:10px}.cc-hero-grid{grid-template-columns:1fr;gap:28px}.cc-hero h1{font-size:clamp(39px,12vw,57px)}.cc-hero-intro{font-size:14px}.cc-hero-card{padding:22px;border-radius:19px}.cc-amount{font-size:47px}.cc-main{margin:-25px auto 0;padding:0 16px 40px}.cc-layout{grid-template-columns:1fr;gap:14px}.cc-panel-main{padding:22px}.cc-panel h2{font-size:25px}.cc-panel-cta{position:static;padding:22px}.cc-section{margin-top:56px;padding:0 16px}.cc-section h2{font-size:32px}.cc-section-lede{font-size:14px}.cc-editorial-grid,.cc-checks,.cc-related{grid-template-columns:1fr}.cc-editorial-card,.cc-check{padding:20px}.cc-disclaimer{margin:34px 16px 0}.cc-footer{padding:36px 18px 78px}.cc-footer-inner{grid-template-columns:1fr;gap:24px}.cc-footer-bottom{margin-top:25px}.cc-mobile-nav{position:fixed;display:flex;left:0;right:0;bottom:0;z-index:30;justify-content:space-around;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom));background:rgba(9,47,72,.97);box-shadow:0 -9px 24px rgba(0,0,0,.18)}.cc-mobile-nav a{flex:1;color:#fff;text-align:center;text-decoration:none;font-size:10px}.cc-mobile-nav strong{display:block;margin-top:3px;font-size:10px}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.cc-header-cta,.cc-whatsapp,.cc-related-card{transition:none}}
'''


def esc(value: object) -> str:
    return html.escape('' if value is None else str(value), quote=True)


def slugify(value: object) -> str:
    text = unicodedata.normalize('NFD', str(value or '')).encode('ascii', 'ignore').decode('ascii').lower()
    text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
    return text or 'sem-codigo'


def brl(value: object, decimals: int = 2) -> str:
    try:
        number = float(value or 0)
    except (TypeError, ValueError):
        number = 0.0
    formatted = f'{number:,.{decimals}f}'
    return 'R$ ' + formatted.replace(',', 'X').replace('.', ',').replace('X', '.')


def amount_short(value: object) -> str:
    try:
        number = float(value or 0)
    except (TypeError, ValueError):
        number = 0
    if number >= 1_000_000:
        return f'R$ {number / 1_000_000:.1f}'.replace('.', ',') + ' milhão'
    if number >= 1_000:
        return f'R$ {number / 1_000:.0f} mil'
    return brl(number, 0)


def load_cards() -> list[dict]:
    source = SOURCE.read_text(encoding='utf-8')
    match = re.search(r'const CARTAS\s*=\s*(\[.*?\]);\s*\n', source, re.S)
    if not match:
        raise SystemExit('CARTAS array not found in contemplado-imoveis/index.html')
    data = json.loads(match.group(1))
    if not isinstance(data, list) or not data:
        raise SystemExit('CARTAS array is empty')
    return data


def build_paths(cards: list[dict]) -> dict[str, str]:
    seen: defaultdict[str, int] = defaultdict(int)
    paths: dict[str, str] = {}
    for card in cards:
        base = PREFIX + slugify(card.get('cod'))
        seen[base] += 1
        suffix = '' if seen[base] == 1 else f'-{seen[base]}'
        paths[str(card.get('id'))] = '/' + base + suffix + '/'
    return paths


def whatsapp_url(card: dict, base_url: str) -> str:
    message = (
        f"Olá! Tenho interesse na carta contemplada {card.get('adm') or card.get('adm_id')} "
        f"código {card.get('cod')} com crédito de {brl(card.get('credito'))}. "
        f"A entrada informada é de {brl(card.get('entrada'))} e a parcela é de "
        f"{brl(card.get('parcela'))}. Pode confirmar a disponibilidade e me orientar?"
    )
    from urllib.parse import quote
    return 'https://wa.me/5551982868888?text=' + quote(message)


def schema_for(card: dict, url: str, description: str, related_faq: list[tuple[str, str]]) -> str:
    props = [
        {'@type': 'PropertyValue', 'name': 'Código da carta', 'value': str(card.get('cod') or '')},
        {'@type': 'PropertyValue', 'name': 'Crédito disponível', 'value': brl(card.get('credito'))},
        {'@type': 'PropertyValue', 'name': 'Entrada informada', 'value': brl(card.get('entrada'))},
        {'@type': 'PropertyValue', 'name': 'Prazo informado', 'value': f"{card.get('prazo') or 0} parcelas"},
        {'@type': 'PropertyValue', 'name': 'Parcela informada', 'value': brl(card.get('parcela'))},
        {'@type': 'PropertyValue', 'name': 'Saldo informado', 'value': brl(card.get('saldo'))},
    ]
    financial = {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        '@id': url + '#produto-financeiro',
        'name': f"Carta de crédito contemplada {card.get('cod')}",
        'description': description,
        'category': 'Carta de crédito contemplada para imóvel',
        'identifier': str(card.get('cod') or ''),
        'url': url,
        'provider': {'@type': 'RealEstateAgent', 'name': 'Portal Meu Litoral — Condomínios na Praia', 'url': BASE_URL + '/'},
        'additionalProperty': props,
    }
    breadcrumb = {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Início', 'item': BASE_URL + '/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Crédito contemplado', 'item': BASE_URL + '/contemplado-imoveis/'},
            {'@type': 'ListItem', 'position': 3, 'name': f"Carta {card.get('cod')}", 'item': url},
        ],
    }
    faq = {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        'mainEntity': [
            {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}}
            for q, a in related_faq
        ],
    }
    def safe_json(obj: object) -> str:
        return json.dumps(obj, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
    return '\n'.join(f'<script type="application/ld+json">{safe_json(obj)}</script>' for obj in (financial, breadcrumb, faq))


def page_html(card: dict, url_path: str, related: list[dict], paths: dict[str, str]) -> str:
    adm = str(card.get('adm') or card.get('adm_id') or 'Administradora')
    code = str(card.get('cod') or '')
    credit = brl(card.get('credito'))
    entry = brl(card.get('entrada'))
    installment = brl(card.get('parcela'))
    term = int(float(card.get('prazo') or 0))
    balance = brl(card.get('saldo'))
    url = BASE_URL + url_path
    title = f'Carta contemplada {code} | {amount_short(card.get("credito"))} | Portal Meu Litoral'
    description = (
        f"Carta de crédito contemplada {adm}, código {code}, com crédito de {credit}, "
        f"entrada informada de {entry} e {term} parcelas de {installment}. "
        'Consulte a disponibilidade e as condições para usar em seu imóvel.'
    )
    faq_items = [
        ('A carta de crédito contemplada pode ser usada para comprar imóvel?',
         'A utilização depende das regras da administradora, do contrato da cota e da análise cadastral. Confirme com o consultor se esta carta atende ao imóvel que você pretende comprar.'),
        ('Os valores desta landing são definitivos?',
         'Não. Crédito, entrada, parcela, saldo e disponibilidade são informações de referência do catálogo e precisam ser confirmados antes de qualquer decisão ou transferência.'),
        ('Como faço para receber atendimento sobre esta carta?',
         f'Clique no botão de WhatsApp e informe o código {code}. O consultor poderá confirmar a disponibilidade, explicar a documentação e orientar a próxima etapa.'),
    ]
    faq_markup = ''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in faq_items)
    related_markup = ''
    for item in related:
        item_url = paths[str(item.get('id'))]
        related_markup += (
            f'<a class="cc-related-card" href="{esc(item_url)}">'
            f'<div class="cc-related-adm"><span class="cc-related-dot" style="background:{esc(item.get("cor") or "#0e7490")}"></span>{esc(item.get("adm") or item.get("adm_id"))}</div>'
            f'<div class="cc-related-value">{esc(amount_short(item.get("credito")))}</div>'
            f'<div class="cc-related-meta">Código {esc(item.get("cod"))} · {esc(item.get("prazo") or 0)} parcelas · {esc(brl(item.get("parcela")))}</div>'
            '</a>'
        )
    schema = schema_for(card, url, description, faq_items)
    wpp = whatsapp_url(card, BASE_URL)
    adm_color = esc(card.get('cor') or '#0e7490')
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="{esc(url)}">
  <meta name="theme-color" content="#0c4a6e">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Portal Meu Litoral">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:url" content="{esc(url)}">
  <meta property="og:image" content="{BASE_URL}/img/og-home.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc(title)}">
  <meta name="twitter:description" content="{esc(description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/carta-contemplada.css">
  <link rel="stylesheet" href="/css/portal-footer.css?v=20260821-a11y">
  {schema}
</head>
<body>
  <header class="cc-header">
    <div class="cc-header-inner">
      <a class="cc-brand" href="/">
        <span class="cc-brand-mark" aria-hidden="true">⌂</span>
        <span><span class="cc-brand-name">Portal Meu Litoral</span><span class="cc-brand-sub">Condomínios na Praia</span></span>
      </a>
      <nav class="cc-header-links" aria-label="Navegação principal">
        <a class="cc-header-link" href="/imoveis/">Imóveis</a>
        <a class="cc-header-link" href="/condominios/">Condomínios</a>
        <a class="cc-header-link" href="/contemplado-imoveis/">Todas as cartas</a>
        <a class="cc-header-cta" href="{esc(wpp)}" target="_blank" rel="noopener">Falar no WhatsApp</a>
      </nav>
    </div>
  </header>
  <main>
    <section class="cc-hero">
      <div class="cc-hero-inner">
        <div class="cc-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Início</a><span class="cc-breadcrumb-sep">/</span><a href="/contemplado-imoveis/">Crédito contemplado</a><span class="cc-breadcrumb-sep">/</span><span>Carta {esc(code)}</span>
        </div>
        <div class="cc-hero-grid">
          <div>
            <div class="cc-eyebrow"><span class="cc-eyebrow-dot"></span>Crédito contemplado para imóvel</div>
            <h1>Carta contemplada para comprar seu imóvel</h1>
            <p class="cc-hero-intro">Uma opção de crédito da <strong>{esc(adm)}</strong> para quem pesquisa imóveis no Litoral Norte Gaúcho e quer comparar condições antes de avançar.</p>
            <span class="cc-code">CÓDIGO {esc(code)}</span>
          </div>
          <div class="cc-hero-card">
            <div class="cc-card-topline"><span>Crédito disponível</span><span class="cc-adm-pill"><i class="cc-adm-dot" style="background:{adm_color}"></i>{esc(adm)}</span></div>
            <div class="cc-amount-label">Valor informado no catálogo</div>
            <div class="cc-amount"><span>R$</span>{esc(f'{float(card.get("credito") or 0):,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.'))}</div>
            <div class="cc-hero-card-note">Condições sujeitas à confirmação da administradora e à análise da operação.</div>
          </div>
        </div>
      </div>
    </section>
    <div class="cc-main">
      <div class="cc-layout">
        <section class="cc-panel cc-panel-main" aria-labelledby="condicoes-title">
          <h2 id="condicoes-title">Condições desta carta</h2>
          <p class="cc-panel-lede">Compare os principais valores informados para a carta <strong>{esc(code)}</strong>. O consultor confirma os detalhes atualizados antes de qualquer negociação.</p>
          <div class="cc-stats">
            <div class="cc-stat"><div class="cc-stat-label">Entrada informada</div><div class="cc-stat-value">{esc(entry)}</div><div class="cc-stat-note">valor de referência</div></div>
            <div class="cc-stat"><div class="cc-stat-label">Parcelas restantes</div><div class="cc-stat-value">{term}x</div><div class="cc-stat-note">prazo informado</div></div>
            <div class="cc-stat"><div class="cc-stat-label">Valor da parcela</div><div class="cc-stat-value">{esc(installment)}</div><div class="cc-stat-note">parcela de referência</div></div>
            <div class="cc-stat"><div class="cc-stat-label">Saldo informado</div><div class="cc-stat-value">{esc(balance)}</div><div class="cc-stat-note">confirme com o consultor</div></div>
          </div>
        </section>
        <aside class="cc-panel cc-panel-cta" aria-labelledby="cta-title">
          <div class="cc-cta-kicker">Atendimento consultivo</div>
          <h2 id="cta-title">Quer confirmar esta carta?</h2>
          <p class="cc-cta-copy">Envie o código <strong>{esc(code)}</strong> para receber a confirmação da disponibilidade, a documentação necessária e a orientação para o seu imóvel.</p>
          <a class="cc-whatsapp" href="{esc(wpp)}" target="_blank" rel="noopener">Conversar pelo WhatsApp</a>
          <a class="cc-back" href="/contemplado-imoveis/">← Ver todas as cartas contempladas</a>
          <div class="cc-trust"><div class="cc-trust-item"><span class="cc-trust-icon">✓</span><span>Informações organizadas por código e administradora.</span></div><div class="cc-trust-item"><span class="cc-trust-icon">✓</span><span>Atendimento focado em imóveis do Litoral Norte.</span></div><div class="cc-trust-item"><span class="cc-trust-icon">✓</span><span>Confirmação necessária antes de qualquer decisão.</span></div></div>
        </aside>
      </div>
    </div>
    <section class="cc-section" aria-labelledby="como-usar-title">
      <h2 id="como-usar-title">Como usar uma carta de crédito contemplada para comprar imóvel</h2>
      <p class="cc-section-lede">A carta contemplada pode ser uma alternativa para pesquisar casas, apartamentos, terrenos ou imóveis em condomínio, sempre respeitando as regras da administradora, o contrato da cota e a análise da operação.</p>
      <div class="cc-editorial-grid">
        <article class="cc-editorial-card"><h3>Compare o crédito com o imóvel</h3><p>Use o valor do crédito como ponto de partida para filtrar imóveis compatíveis. Custos de transferência, documentação, avaliação e eventuais diferenças precisam ser confirmados no atendimento.</p></article>
        <article class="cc-editorial-card"><h3>Confirme a administradora</h3><p>Cada administradora define procedimentos, documentos e critérios próprios. Por isso, a página apresenta a referência da carta, mas a confirmação final deve ser feita antes de qualquer compromisso.</p></article>
      </div>
    </section>
    <section class="cc-section" aria-labelledby="verificar-title">
      <h2 id="verificar-title">O que verificar antes de fechar</h2>
      <div class="cc-checks">
        <article class="cc-check"><span class="cc-check-number">01</span><h3>Disponibilidade atual</h3><p>Confirme se a carta {esc(code)} continua disponível e se os valores permanecem atualizados.</p></article>
        <article class="cc-check"><span class="cc-check-number">02</span><h3>Regras de utilização</h3><p>Verifique se o imóvel escolhido atende às regras do contrato e da administradora.</p></article>
        <article class="cc-check"><span class="cc-check-number">03</span><h3>Documentação</h3><p>Peça a relação de documentos e entenda as etapas de análise, transferência e liberação.</p></article>
      </div>
    </section>
    <section class="cc-section" aria-labelledby="faq-title">
      <h2 id="faq-title">Dúvidas sobre esta carta contemplada</h2>
      <div class="cc-faq">{faq_markup}</div>
    </section>
    <section class="cc-section" aria-labelledby="related-title">
      <h2 id="related-title">Outras cartas para comparar</h2>
      <p class="cc-section-lede">Veja alternativas próximas por administradora e valor de crédito. Cada opção possui uma página própria com código e condições informadas.</p>
      <div class="cc-related">{related_markup}</div>
    </section>
    <p class="cc-disclaimer">Os valores de crédito, entrada, parcela, prazo e saldo são referências do catálogo público no momento da publicação. A disponibilidade, a transferência, as taxas, a documentação e a aprovação dependem da administradora responsável e devem ser confirmadas com o Portal Meu Litoral.</p>
  </main>
  <footer class="cc-footer">
    <div class="cc-footer-inner">
      <div><div class="cc-footer-brand">Portal Meu Litoral</div><p class="cc-footer-text">Condomínios na Praia. Imóveis, condomínios e crédito contemplado para quem pesquisa o Litoral Norte Gaúcho.</p></div>
      <div><div class="cc-footer-title">Navegar</div><a href="/">Início</a><a href="/imoveis/">Imóveis à venda</a><a href="/condominios/">Condomínios</a><a href="/contemplado-imoveis/">Cartas contempladas</a></div>
      <div><div class="cc-footer-title">Atendimento</div><a href="{esc(wpp)}" target="_blank" rel="noopener">WhatsApp</a><a href="/contato/">Fale conosco</a><a href="/sobre/">Sobre o Portal</a></div>
    </div>
    <div class="cc-footer-bottom">© 2026 Portal Meu Litoral — Condomínios na Praia. Consulte as condições antes de contratar.</div>
  </footer>
  <nav class="cc-mobile-nav" aria-label="Navegação rápida"><a href="/"><span aria-hidden="true">⌂</span><strong>Início</strong></a><a href="/contemplado-imoveis/"><span aria-hidden="true">▦</span><strong>Cartas</strong></a><a href="{esc(wpp)}" target="_blank" rel="noopener"><span aria-hidden="true">◉</span><strong>WhatsApp</strong></a></nav>
</body>
</html>
'''


def update_catalog(cards: list[dict], paths: dict[str, str]) -> None:
    path = SOURCE
    text = path.read_text(encoding='utf-8')
    marker = "const PER = 24;\nlet lista = [];\nlet pg = 1;"
    replacement = """const PER = 24;
let lista = [];
let pg = 1;

function cartaPath(c){
  const code = String(c.cod || 'sem-codigo').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') || 'sem-codigo';
  const same = CARTAS.filter(x => String(x.cod || '').toLowerCase() === String(c.cod || '').toLowerCase());
  const idx = same.findIndex(x => String(x.id) === String(c.id));
  return '/carta-contemplada-imovel-' + code + (idx > 0 ? '-' + (idx + 1) : '') + '/';
}
function openLanding(event,url){
  if(event && event.target && event.target.closest && event.target.closest('a,button')) return;
  window.location.href = url;
}"""
    if marker not in text:
        raise SystemExit('catalog marker not found')
    text = text.replace(marker, replacement, 1)
    old_start = "function render(){\n  const start=(pg-1)*PER, pagina=lista.slice(start,start+PER);"
    old_end = "  buildPag();\n}\n\nfunction buildPag(){"
    start = text.find(old_start)
    end = text.find(old_end, start)
    if start < 0 or end < 0:
        raise SystemExit('catalog render block not found')
    new_render = """function render(){
  const start=(pg-1)*PER, pagina=lista.slice(start,start+PER);
  const grid=document.getElementById('grid');
  if(!pagina.length){
    grid.innerHTML='<div class="empty"><div class="empty-ico">🔍</div><p>Nenhuma carta encontrada com esses filtros.</p></div>';
    document.getElementById('pag').innerHTML='';
    return;
  }
  grid.innerHTML=pagina.map(c=>{
    const landing=cartaPath(c);
    return `
    <article class="carta" role="link" tabindex="0" data-landing="${landing}" onclick="openLanding(event,this.dataset.landing)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openLanding(event,this.dataset.landing)}">
      <div class="carta-top">
        <div class="carta-adm-row">
          ${admIcoHtml(c.adm_id,28)}
          <div><div class="carta-adm-nome">${getAdm(c.adm_id).nome||c.adm_id}</div><div class="carta-adm-cod">CÓD: ${c.cod}</div></div>
        </div>
        <div class="carta-credito-lbl">Crédito disponível</div>
        <div class="carta-credito"><span>R$</span>${c.credito.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      </div>
      <div class="carta-body">
        <div class="carta-specs">
          <div class="spec"><div class="spec-lbl">Parcelas</div><div class="spec-val">${c.prazo}x</div></div>
          <div class="spec"><div class="spec-lbl">Valor da parcela</div><div class="spec-val">${brl(c.parcela)}</div></div>
        </div>
        <div class="carta-entrada">Entrada: <strong>${brl(c.entrada)}</strong></div>
        <div class="carta-footer">
          <a class="btn-ver" href="${landing}" style="text-decoration:none" onclick="event.stopPropagation()">Ver carta</a>
          <a class="btn-wpp" href="https://wa.me/5551982868888?text=${encodeURIComponent('Olá! Tenho interesse na carta '+getAdm(c.adm_id).nome+' cód '+c.cod+' de '+brl(c.credito)+' com parcela de '+brl(c.parcela)+'. Pode me dar mais informações?')}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${wppSvg} WhatsApp</a>
        </div>
      </div>
    </article>`;
  }).join('');
  buildPag();
}

function buildPag(){"""
    text = text[:start] + new_render + text[end + len(old_end):]
    path.write_text(text, encoding='utf-8')


def main() -> None:
    cards = load_cards()
    paths = build_paths(cards)
    CSS_PATH.write_text(CSS.strip() + '\n', encoding='utf-8')
    update_catalog(cards, paths)
    for entry in ROOT.iterdir():
        if entry.is_dir() and entry.name.startswith(PREFIX):
            shutil.rmtree(entry)
    by_adm: defaultdict[str, list[dict]] = defaultdict(list)
    for card in cards:
        by_adm[str(card.get('adm_id') or '')].append(card)
    for card in cards:
        current_id = str(card.get('id'))
        pool = [x for x in by_adm[str(card.get('adm_id') or '')] if str(x.get('id')) != current_id]
        pool.sort(key=lambda x: abs(float(x.get('credito') or 0) - float(card.get('credito') or 0)))
        related = pool[:3]
        if len(related) < 3:
            all_others = [x for x in cards if str(x.get('id')) != current_id and x not in related]
            all_others.sort(key=lambda x: abs(float(x.get('credito') or 0) - float(card.get('credito') or 0)))
            related.extend(all_others[:3-len(related)])
        folder = ROOT / paths[current_id].strip('/')
        folder.mkdir(parents=True, exist_ok=True)
        (folder / 'index.html').write_text(page_html(card, paths[current_id], related, paths), encoding='utf-8')
    print(json.dumps({'cards': len(cards), 'pages': len(paths), 'css': str(CSS_PATH), 'sample': paths[str(cards[0].get('id'))]}, ensure_ascii=False))


if __name__ == '__main__':
    main()

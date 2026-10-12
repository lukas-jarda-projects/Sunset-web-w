# Statický web na GitHub Pages — implementační plán

> **Pro Claude:** POVINNÝ SUB-SKILL: při provádění použij `superpowers:executing-plans` (krok po kroku s kontrolními body).

**Cíl:** Web sunset-apartment.com poběží jako čisté HTML + CSS + malý vanilla JS na GitHub Pages — bez Node na serveru, bez buildu, upravitelný přímo v HTML.

**Architektura:** Kostra stránek vznikne jednorázovým převodem dnešního živého SSR výstupu (je to hotové HTML s třídami Quasaru). Zkompilované CSS Quasaru zůstane jako jeden soubor. Dynamické widgety Quasaru (karusel, záložky, mobilní menu, galerie s lightboxem, počítadla) se nahradí vlastním markupem a `site/js/web.js`. Výsledek leží v `site/`, nasazuje ho GitHub Actions workflow, který soubory jen nahraje (žádný build). Repo se před zveřejněním vyčistí od cizího kódu a interních údajů (`git filter-repo`) a pak se na Pages převede doména.

**Technologie:** HTML, CSS, vanilla JS (ES2017, bez knihoven). Pomocné nástroje jen v Pythonu 3: `tools/kontrola.py` je čistá stdlib, převodní skript potřebuje `beautifulsoup4` v lokálním venv. Node se nikde nepoužívá.

**Stav:** Plán napsán 2026-10-12, provádění nezačalo. Nanečisto ve scratchpadu (mimo repo) ověřeno:
- `kontrola.py`, `prevod_z_ssr.py` a `galerie_z_vue.py` proběhnou proti živému webu s výstupem popsaným v Tasku 2,
- kontrola chytí smazanou fotku (mutace),
- čištění historie z Tasku 11 dá 0 citlivých řetězců.

`web.js` a `pages.yml` jsou ověřené **jen syntakticky** (`node --check`, `yaml.safe_load`), v prohlížeči a na GitHubu zatím neběžely.

---

## Výchozí stav (ověřeno 2026-10-12)

- Živý web: Quasar 1 SSR (Express) na `185.175.84.157`, služba `sunset-apartment.com.service` na serveru Altisimy. Router běží v SSR režimu history, adresy jsou `/`, `/about`, `/photo`, `/contact`.
- Web za běhu nevolá žádné API. Formulář je pryč (commit `5b42f20`). `axios`, `socketio`, `vuelidate` a `vue-print-nb` jsou mrtvé závislosti, Sentry je vypnutý (`quasar.conf.js`, boot `'sentry'` zakomentován). i18n obsahuje jen ukázkový soubor a přepínač jazyků se nevykresluje.
- **Textové úpravy od Vaška jsou HOTOVÉ** (Bolt místo Uberu, „Užitečné informace“ a „Volné termíny“ odstraněny; sekce jsou v Pugu zakomentované `//-`). Hotová je i **úprava log Netflix/YouTube v sekci O apartmánu** (`38b2ac2`, `c81504b`). Převod je jen převezme, nic se znovu neupravuje.
- Na živém webu je `meta description` na všech 4 stránkách stejná a obecná („Sunset Apartment - pobyt u moře“), stránka má `<html lang=en-us>` a 15 obrázků nemá `alt` (2 loga v hlavičce na každé stránce, 4 navíc na O apartmánu, 3 na Kontaktu). Ověřeno nanečisto spuštěným převodem a kontrolou z tohoto plánu. V `src/index.template.html:7` je `gtag/js?id==G-5Y4HJPKVK0` (dvě `=`), a jestli GA vůbec měří, neověřeno.
- Interaktivní prvky:
  - `Index.vue:70` karusel (4 snímky, autoplay 2800 ms, šipky, tečky, swipe, nekonečný),
  - `Index.vue:146-158` 4× `animated-number` (1200 ms, restart při návratu do pohledu),
  - záložky Autem / Letecky (`PageSectionDoubleCard`),
  - `Layout.vue:19` horní záložky menu + `Layout.vue:38` mobilní drawer,
  - `PhotoPage.vue:139` svislé záložky (4 galerie: 21 + 5 + 17 + 8 = 51 fotek) + `TinyBox.vue` (lightbox, swipe, smyčka).
- Galerie v SSR HTML nejsou: vykresluje je až JS. Zdrojem fotek je pole `poschodi/podkrovi/okoli/ostrov` v `src/pages/Public/PhotoPage.vue`. Všech 51 souborů existuje v `src/statics/galerie/`.
- Repo `lukas-jarda-projects/Sunset-web-w`: soukromé, organizace na plánu **free**, jediná větev `master`, 0 forků, 166 commitů, ~104 MB. Autoři: lukas-wana (noreply), `qwanap@gmail.com`, Jaroslav Povolný (`qwanap@gmail.com`, `qwanap@gmail.com`), „OpenClaw Ad Radar“.
- Prověřena celá historie: hesla ani tokeny v ní nejsou (`.npmrc` nikdy necommitnut, Jenkinsfile bez přístupů, `password: secret` jsou jen testovací data v `lib/fs`). V historii ale jsou věci, které se zveřejnit nesmí: sdílený kód `lib/`, celé weby jiných klientů ze šablony Altisimy a snímky obrazovky systému jídelen s možnými daty zákazníků. Soupis a postup jsou v Tasku 11 (ověřeno nanečisto).
- DNS: NS i MX u **Váš Hosting** (`ns.vas-hosting.cz/.eu/.com`), A `185.175.84.157`, `www` je alias na apex, SPF `v=spf1 a mx ?all`. **Pošta na doméně neběží** (potvrdil uživatel) → MX a SPF se nechají beze změny.

## Rozhodnutí

| rozhodnutí | důvod |
|---|---|
| Varianta B (čisté HTML), ne Quasar build v CI | úpravy bez buildu; SEO stejné jako dnes (každá stránka je hotové HTML) |
| Kostra z živého SSR HTML, ne ruční přepis z Pugu | vzhled sedí 1:1, obsah je přesně ten, co je dnes vidět (včetně hotových úprav) |
| Zkompilované CSS Quasaru se ponechá celé (225 KB) | utility třídy (`row`, `col-*`, `q-mt-*`) fungují bez Vue; ořez CSS je volitelný až po spuštění |
| Relativní odkazy všude kromě `404.html` | náhled na `lukas-jarda-projects.github.io/Sunset-web-w/` běží v podsložce; absolutní `/css/…` by tam nefungovalo |
| Nasazení přes Actions (`upload-pages-artifact`), web v `site/` | v rootu repa zůstanou plány a nástroje a nevystaví se jako web; Jekyll se nespouští |
| Stávající repo zveřejnit **po vyčištění historie** | rozhodnutí uživatele 2026-10-12 (varianta „stávající repo, historii vyčistit“) |
| Pošta: MX a SPF beze změny | pošta neběží; záznamy nevadí a jejich mazání nikdo nechtěl |

## Otevřené (rozhodne uživatel před Taskem 11 / 13)

1. **E-maily v historii** (Task 11): na co přepsat `qwanap@gmail.com` a `qwanap@gmail.com`? Návrh: na Jardův GitHub noreply (`ID+login@users.noreply.github.com`, zná ho jen on). Přepsat i vlastní `qwanap@gmail.com` na `lukas-wana@users.noreply.github.com`? Domluvit s Jardou i samotné zveřejnění: je spoluautor a v historii je jeho kód (`lib/`).
2. **Přístup do DNS u Váš Hosting** (Task 13): kdo ho má (ty, nebo Vašek)? Bez něj se doména nepřevede.
3. **Starý server** (Task 14): službu na `185.175.84.157` spravuje Altisima/Jarda. Kdo ji po převodu vypne?

---

## Task 0: Příprava

**Soubory:** Upravit: `.gitignore`

**Krok 1:** Do `.gitignore` připsat:

```
# nástroje statického webu
tools/.venv/
.reference/
```

**Krok 2:** Vytvořit venv pro převodní skript (jen pro Task 2, web sám ho nepotřebuje):

```
python -m venv tools/.venv
tools/.venv/Scripts/python -m pip install beautifulsoup4
```

Očekávané: `Successfully installed beautifulsoup4-…`

**Krok 3:** Uložit referenční snímky živého webu pro vizuální porovnání v Tasku 9. V prohlížeči (Claude in Chrome) nasnímat `/`, `/about`, `/photo`, `/contact` na 1280 px a 400 px do `.reference/` (ten se necommituje).

**Krok 4:** Commit

```
git add .gitignore
git commit -m "Příprava převodu na statický web"
```

---

## Task 1: Kontrolní skript (test celého webu)

**Soubory:** Vytvořit: `tools/kontrola.py`

Skript je „test“ statického webu. Kontroluje:
- všechny lokální odkazy, obrázky, skripty a `url()` v HTML i CSS míří na existující soubory,
- žádné absolutní cesty `/…` (kromě `404.html`),
- `lang="cs"`, neprázdný `<title>` a `meta description`, `alt` u obrázků,
- cizí skripty jen z povolených hostů,
- zakázané texty (odstraněné sekce, Uber, jídelna, překlep v GA) a povinné texty,
- stejné menu na všech stránkách a 51 fotek v galerii.

**Krok 1:** Napsat `tools/kontrola.py`:

```python
"""Kontrola statického webu v site/.

Spuštění:  python tools/kontrola.py
Výstup 0 = v pořádku, 1 = nalezené chyby (vypíše je).
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

SITE = Path(__file__).resolve().parent.parent / "site"
STRANKY = ["index.html", "about/index.html", "photo/index.html", "contact/index.html", "404.html"]
ZAKAZANE = ["Užitečné informace", "Volné termíny", "jidelna-sql", "altisima", "UBER", "id==G-"]
POVINNE = {
    "index.html": ["BOLT", "Autem", "Letecky"],
    "photo/index.html": ["První patro", "Podkroví", "Okolí apartmánu", "Ostrov Pag"],
}
FOTEK_V_GALERII = 51
POVOLENE_HOSTY_SKRIPTU = {"www.googletagmanager.com"}
URL_V_CSS = re.compile(r"url\(\s*[\"']?([^\"')]+)[\"']?\s*\)")


class Sber(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.odkazy, self.skripty, self.nav = [], [], []
        self.lang, self.title, self.description = None, "", None
        self.bez_alt, self.fotek = 0, 0
        self._v_title, self._v_nav = False, 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "title":
            self._v_title = True
        if tag == "meta" and a.get("name") == "description":
            self.description = a.get("content")
        if tag == "nav":
            self._v_nav += 1
        if self._v_nav and tag == "a" and a.get("href"):
            self.nav.append(a["href"])
        for k in ("href", "src"):
            if a.get(k):
                self.odkazy.append((tag, a[k]))
        for u in URL_V_CSS.findall(a.get("style") or ""):
            self.odkazy.append((tag, u))
        if tag == "script" and a.get("src"):
            self.skripty.append(a["src"])
        if tag == "img" and not a.get("alt"):
            self.bez_alt += 1
        if tag == "a" and "statics/galerie/" in (a.get("href") or ""):
            self.fotek += 1

    def handle_endtag(self, tag):
        if tag == "title":
            self._v_title = False
        if tag == "nav":
            self._v_nav -= 1

    def handle_data(self, data):
        if self._v_title:
            self.title += data


def cil(soubor, url, koren_povolen=False):
    """Vrátí cílovou cestu lokálního odkazu, nebo None u externích a kotev."""
    if url.startswith(("#", "mailto:", "tel:", "data:", "//")) or urlparse(url).scheme:
        return None
    cesta = unquote(urlparse(url).path)
    if not cesta:
        return None
    if cesta.startswith("/"):
        if not koren_povolen:
            return "ABSOLUTNI"
        t = SITE / cesta.lstrip("/")
    else:
        t = soubor.parent / cesta
    t = t.resolve()
    if cesta.endswith("/") or t.is_dir():
        t = t / "index.html"
    return t


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    if not SITE.is_dir():
        print(f"CHYBA: chybí složka {SITE}")
        return 1
    chyby, menu, pocet_odkazu = [], {}, 0
    for rel in STRANKY:
        f = SITE / rel
        if not f.is_file():
            chyby.append(f"{rel}: soubor chybí")
            continue
        text = f.read_text(encoding="utf-8")
        s = Sber()
        s.feed(text)
        je_404 = rel == "404.html"
        if s.lang != "cs":
            chyby.append(f"{rel}: <html lang> je {s.lang!r}, má být 'cs'")
        if not s.title.strip():
            chyby.append(f"{rel}: prázdný <title>")
        if not je_404 and not s.description:
            chyby.append(f"{rel}: chybí <meta name=description>")
        if s.bez_alt:
            chyby.append(f"{rel}: {s.bez_alt}x <img> bez alt")
        for tag, url in s.odkazy:
            pocet_odkazu += 1
            t = cil(f, url, koren_povolen=je_404)
            if t == "ABSOLUTNI":
                chyby.append(f"{rel}: absolutní cesta {url} (pod /Sunset-web-w/ nefunguje, piš relativně)")
            elif t is not None and not t.exists():
                chyby.append(f"{rel}: <{tag}> míří na neexistující {url}")
        for src in s.skripty:
            host = urlparse(src).netloc
            if host and host not in POVOLENE_HOSTY_SKRIPTU:
                chyby.append(f"{rel}: cizí skript {src}")
        for slovo in POVINNE.get(rel, []):
            if slovo not in text:
                chyby.append(f"{rel}: chybí povinný text {slovo!r}")
        if rel == "photo/index.html" and s.fotek != FOTEK_V_GALERII:
            chyby.append(f"{rel}: galerie má {s.fotek} fotek, má {FOTEK_V_GALERII}")
        if not je_404:
            menu[rel] = [str(cil(f, h)) for h in s.nav]
    vzor = menu.get("index.html")
    for rel, polozky in menu.items():
        if not polozky:
            chyby.append(f"{rel}: v <nav> nejsou odkazy")
        elif polozky != vzor:
            chyby.append(f"{rel}: menu se liší od index.html")
    for css in SITE.rglob("*.css"):
        for url in URL_V_CSS.findall(css.read_text(encoding="utf-8")):
            t = cil(css, url)
            if t == "ABSOLUTNI":
                chyby.append(f"{css.relative_to(SITE)}: absolutní url({url})")
            elif t is not None and not t.exists():
                chyby.append(f"{css.relative_to(SITE)}: url({url}) neexistuje")
    for f in list(SITE.rglob("*.html")) + list(SITE.rglob("*.js")) + list(SITE.rglob("*.css")):
        text = f.read_text(encoding="utf-8")
        for slovo in ZAKAZANE:
            if slovo in text:
                chyby.append(f"{f.relative_to(SITE)}: zakázaný text {slovo!r}")
    velikost = sum(p.stat().st_size for p in SITE.rglob("*") if p.is_file()) / 1_048_576
    for c in chyby:
        print("CHYBA:", c)
    print(f"{'NEPROŠLO' if chyby else 'OK'}: {len(chyby)} chyb, {pocet_odkazu} odkazů, web {velikost:.1f} MB")
    return 1 if chyby else 0


if __name__ == "__main__":
    sys.exit(main())
```

**Krok 2:** Spustit a ověřit, že selže, protože web ještě není:

```
python tools/kontrola.py
```

Očekávané: `CHYBA: chybí složka …\site`, exit 1.

**Krok 3:** Commit

```
git add tools/kontrola.py
git commit -m "Kontrolní skript statického webu"
```

---

## Task 2: Převod živého SSR výstupu na kostru `site/`

**Soubory:** Vytvořit: `tools/prevod_z_ssr.py`, vygeneruje `site/**`

Skript (jednorázový, commitne se kvůli dohledatelnosti původu) udělá tohle:
- stáhne 4 stránky a CSS z živého webu,
- odstraní Vue bundly (`/js/*.js`), skript s `__INITIAL_STATE__` a preload/prefetch odkazy,
- stáhne všechny lokální soubory, na které HTML a CSS odkazují (z názvu odstraní 8znakový hash),
- přepíše odkazy na relativní,
- nastaví `lang="cs"`, opraví `id==` v GA,
- HTML zformátuje (`prettify`), aby šlo upravovat ručně.

**Krok 1:** Napsat `tools/prevod_z_ssr.py`:

```python
"""Jednorázový převod živého SSR webu na statické soubory v site/.

Spuštění:  tools/.venv/Scripts/python tools/prevod_z_ssr.py
Přepíše HTML v site/, stažené soubory přeskočí, pokud už existují.
"""
import posixpath
import re
from pathlib import Path
from urllib.parse import quote, unquote
from urllib.request import urlopen

from bs4 import BeautifulSoup

ZDROJ = "https://sunset-apartment.com"
SITE = Path(__file__).resolve().parent.parent / "site"
STRANKY = {"/": "index.html", "/about": "about/index.html", "/photo": "photo/index.html", "/contact": "contact/index.html"}
HASH = re.compile(r"\.[0-9a-f]{8}(\.\w+)$")
URL_V_CSS = re.compile(r"url\(\s*([\"']?)([^\"')]+)\1\s*\)")


def stahni(vzdalena, mistni):
    cil = SITE / mistni
    if cil.exists():
        return
    cil.parent.mkdir(parents=True, exist_ok=True)
    with urlopen(ZDROJ + "/" + quote(unquote(vzdalena))) as r:
        cil.write_bytes(r.read())
    print("stazeno", mistni)


def lokalni(url):
    """Vrátí cestu souboru vůči kořeni webu, nebo None, není-li lokální."""
    if url.startswith("//") or "://" in url or url.startswith(("#", "data:", "mailto:", "tel:")):
        return None
    if url.startswith("/"):
        return url[1:]
    if url.startswith("statics/"):
        return url
    return None


def prevod_odkazu(url, prefix):
    if url in STRANKY:
        cil = STRANKY[url].removesuffix("index.html")
        return (prefix + cil) or "./"
    cesta = lokalni(url)
    if cesta is None:
        return url
    cista = HASH.sub(r"\1", cesta.split("?")[0])
    stahni(cesta.split("?")[0], cista)
    return prefix + cista


def prevod_css(text, prefix):
    return URL_V_CSS.sub(lambda m: f'url("{prevod_odkazu(m.group(2), prefix)}")', text)


def prevod_css_souboru(text):
    """CSS leží v css/ a Quasar v něm odkazuje relativně (../fonts/…): převést na cestu od kořene."""
    def nahrada(m):
        url = m.group(2)
        if lokalni(url) is None and "://" not in url and not url.startswith(("data:", "#")):
            url = "/" + posixpath.normpath("css/" + url)
        return f'url("{prevod_odkazu(url, "../")}")'
    return URL_V_CSS.sub(nahrada, text)


def main():
    SITE.mkdir(exist_ok=True)
    for cesta, soubor in STRANKY.items():
        prefix = "../" * soubor.count("/")
        with urlopen(ZDROJ + cesta) as r:
            soup = BeautifulSoup(r.read().decode("utf-8"), "html.parser")
        soup.html["lang"] = "cs"
        for s in soup.find_all("script"):
            if (s.get("src") or "").startswith("/js/") or "__INITIAL_STATE__" in (s.string or ""):
                s.decompose()
        for l in soup.find_all("link"):
            rel = set(l.get("rel") or [])
            if (l.get("href") or "").startswith("/js/") or rel & {"preload", "prefetch"}:
                l.decompose()
        for tag in soup.find_all(True):
            for attr in ("href", "src"):
                if tag.get(attr):
                    tag[attr] = prevod_odkazu(tag[attr].replace("id==", "id="), prefix)
            if tag.get("style"):
                tag["style"] = prevod_css(tag["style"], prefix)
        cil = SITE / soubor
        cil.parent.mkdir(parents=True, exist_ok=True)
        # formatter="minimal": čeština zůstane jako znaky (html5 by z ř udělal &rcaron;)
        cil.write_text(soup.prettify(formatter="minimal"), encoding="utf-8", newline="\n")
        print("stranka", soubor)
    for css in (SITE / "css").glob("*.css"):
        css.write_text(prevod_css_souboru(css.read_text(encoding="utf-8")), encoding="utf-8", newline="\n")
        print("css", css.name)


if __name__ == "__main__":
    main()
```

Pozor: zkompilované CSS Quasaru odkazuje na písma **relativně** (`url(../fonts/RedHatText-Regular.e828eaa6.woff)`), ne absolutně. Proto má CSS soubor vlastní převod `prevod_css_souboru`, který cestu nejdřív vztáhne ke kořeni webu. První verze plánu to neměla a písma se nestáhla; chytila to až kontrola.

**Krok 2:** Spustit:

```
tools/.venv/Scripts/python tools/prevod_z_ssr.py
```

Očekávané: řádky `stazeno …` (CSS, písma, obrázky karuselu, ikony, PDF) a 4× `stranka …`.

**Krok 3:** Zkontrolovat:

```
python tools/kontrola.py
```

Očekávané: NEPROŠLO, ale chyby musí být jen tyto druhy:
- `404.html: soubor chybí`,
- `v <nav> nejsou odkazy` u všech 4 stránek,
- `<img> bez alt` (index 2, about 6, photo 2, contact 5),
- `photo/index.html: galerie má 0 fotek`.

Celkem 10 chyb (ověřeno nanečisto 2026-10-12). Názvy záložek fotogalerie SSR vykreslil, takže povinné texty projdou už teď.

**Žádná chyba odkazu na neexistující soubor** — ta by znamenala vadu převodu, ne očekávaný stav; pak opravit skript, ne ručně soubory. Ověřit i, že v HTML nejsou české znaky jako entity: `grep -c "&rcaron;\|&aacute;" site/index.html` → 0.

**Krok 4:** Zkontrolovat, že HTML neobsahuje zbytky Vue: `grep -c "__INITIAL_STATE__\|/js/" site/*.html site/*/index.html` → 0 u všech.

**Krok 5:** Commit

```
git add tools/prevod_z_ssr.py site/
git commit -m "Kostra statického webu z živého SSR výstupu"
```

---

## Task 3: Sdílené menu, mobilní drawer a `web.js`

**Soubory:** Vytvořit: `site/js/web.js`, `site/css/web.css`. Upravit: všechny 4 `site/**/index.html`

**Krok 1:** Napsat `site/js/web.js` (celý JS webu, každá část se zapne jen tam, kde je její markup):

```js
// Interaktivita webu Sunset Apartment. Bez knihoven, bez buildu.
(function () {
  'use strict'
  var klid = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Mobilní menu: tlačítko .js-menu otevře/zavře body.menu-open
  document.querySelectorAll('.js-menu').forEach(function (b) {
    b.addEventListener('click', function () { document.body.classList.toggle('menu-open') })
  })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.body.classList.remove('menu-open')
  })

  // Swipe: zavolá vlevo()/vpravo() po vodorovném tahu prstem > 40 px
  function swipe (el, vlevo, vpravo) {
    var x = null
    el.addEventListener('touchstart', function (e) { x = e.touches[0].clientX }, { passive: true })
    el.addEventListener('touchend', function (e) {
      if (x === null) return
      var dx = e.changedTouches[0].clientX - x
      x = null
      if (dx < -40) vlevo()
      if (dx > 40) vpravo()
    })
  }

  // Karusel: .js-carousel > .slide, [data-prev], [data-next], [data-dot="i"], data-interval
  document.querySelectorAll('.js-carousel').forEach(function (k) {
    var slidy = k.querySelectorAll('.slide')
    var tecky = k.querySelectorAll('[data-dot]')
    var i = 0
    var casovac = null
    function ukaz (n) {
      i = (n + slidy.length) % slidy.length
      slidy.forEach(function (s, j) { s.classList.toggle('active', j === i) })
      tecky.forEach(function (t, j) { t.setAttribute('aria-current', j === i ? 'true' : 'false') })
    }
    function start () {
      var ms = parseInt(k.dataset.interval, 10)
      if (ms && !klid) casovac = setInterval(function () { ukaz(i + 1) }, ms)
    }
    function stop () { clearInterval(casovac) }
    k.querySelectorAll('[data-prev]').forEach(function (b) { b.addEventListener('click', function () { ukaz(i - 1) }) })
    k.querySelectorAll('[data-next]').forEach(function (b) { b.addEventListener('click', function () { ukaz(i + 1) }) })
    tecky.forEach(function (t) { t.addEventListener('click', function () { ukaz(parseInt(t.dataset.dot, 10)) }) })
    k.addEventListener('mouseenter', stop)
    k.addEventListener('mouseleave', start)
    swipe(k, function () { ukaz(i + 1) }, function () { ukaz(i - 1) })
    ukaz(0)
    start()
  })

  // Počítadla: .js-count[data-to][data-time]; počítá znovu při každém vstupu do pohledu
  var pocitadla = document.querySelectorAll('.js-count')
  function pocitej (el) {
    var cil = parseInt(el.dataset.to, 10)
    var cas = parseInt(el.dataset.time, 10) || 1200
    if (klid) { el.textContent = cil; return }
    var t0 = null
    function krok (t) {
      if (t0 === null) t0 = t
      var p = Math.min((t - t0) / cas, 1)
      el.textContent = Math.round(cil * p)
      if (p < 1) requestAnimationFrame(krok)
    }
    requestAnimationFrame(krok)
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (zaznamy) {
      zaznamy.forEach(function (z) { if (z.isIntersecting) pocitej(z.target) })
    })
    pocitadla.forEach(function (el) { io.observe(el) })
  } else {
    pocitadla.forEach(function (el) { el.textContent = el.dataset.to })
  }

  // Záložky: .js-tabs s [role=tab][aria-controls] a [role=tabpanel]
  document.querySelectorAll('.js-tabs').forEach(function (skupina) {
    var tlacitka = skupina.querySelectorAll('[role=tab]')
    function vyber (b) {
      tlacitka.forEach(function (x) {
        var ano = x === b
        x.setAttribute('aria-selected', ano ? 'true' : 'false')
        document.getElementById(x.getAttribute('aria-controls')).hidden = !ano
      })
    }
    tlacitka.forEach(function (b) { b.addEventListener('click', function () { vyber(b) }) })
  })

  // Lightbox: odkazy v .js-gallery > a[href] na velké foto; smyčka, šipky, Esc, swipe
  var box = null
  var obr = null
  var seznam = []
  var poloha = 0
  function ukazFoto (n) {
    poloha = (n + seznam.length) % seznam.length
    obr.src = seznam[poloha].href
    obr.alt = seznam[poloha].querySelector('img').alt
  }
  function zavri () { box.hidden = true; document.body.classList.remove('lightbox-open') }
  function vytvorBox () {
    box = document.createElement('div')
    box.className = 'lightbox'
    box.hidden = true
    box.innerHTML = '<button class="lb-close" aria-label="Zavřít">&times;</button>' +
      '<button class="lb-prev" aria-label="Předchozí">&#8249;</button>' +
      '<img alt="">' +
      '<button class="lb-next" aria-label="Další">&#8250;</button>'
    document.body.appendChild(box)
    obr = box.querySelector('img')
    box.querySelector('.lb-close').addEventListener('click', zavri)
    box.querySelector('.lb-prev').addEventListener('click', function () { ukazFoto(poloha - 1) })
    box.querySelector('.lb-next').addEventListener('click', function () { ukazFoto(poloha + 1) })
    box.addEventListener('click', function (e) { if (e.target === box) zavri() })
    swipe(box, function () { ukazFoto(poloha + 1) }, function () { ukazFoto(poloha - 1) })
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return
      if (e.key === 'Escape') zavri()
      if (e.key === 'ArrowLeft') ukazFoto(poloha - 1)
      if (e.key === 'ArrowRight') ukazFoto(poloha + 1)
    })
  }
  document.querySelectorAll('.js-gallery').forEach(function (g) {
    var odkazy = Array.prototype.slice.call(g.querySelectorAll('a[href]'))
    odkazy.forEach(function (a, j) {
      a.addEventListener('click', function (e) {
        e.preventDefault()
        if (!box) vytvorBox()
        seznam = odkazy
        ukazFoto(j)
        box.hidden = false
        document.body.classList.add('lightbox-open')
      })
    })
  })
})()
```

**Krok 2:** Hlavička ve všech 4 stránkách. V SSR HTML najít blok `q-header` → `q-toolbar` → `q-tabs` (desktop) a `q-drawer` (mobil). Nahradit ho jedním `<header>` se stejnými třídami pro vzhled:
- jeden `<nav>` s odkazy (relativně: na `index.html` `./`, `about/`, `photo/`, `contact/`; na podstránkách `../`, `../about/` atd.),
- tlačítko `<button class="js-menu" aria-label="Menu">` s ikonou Material Icons `menu` (font už je v CSS),
- aktivní položku označit `aria-current="page"`,
- oběma logům v hlavičce dát `alt="Sunset Apartment"` (dnes ho nemají; kontrola hlásí 2× `bez alt` na každé stránce).

Drawer = tentýž `<nav>`, na úzkém displeji ho CSS zobrazí jako vysouvací panel. Nedávej druhý `<nav>`: kontrola porovnává menu a duplicitní odkazy by ji rozbily. Na konec `<body>` každé stránky přidat `<script src="…js/web.js" defer></script>` (relativní prefix podle hloubky) a do `<head>` `<link rel="stylesheet" href="…css/web.css">` za CSS Quasaru.

**Krok 3:** `site/css/web.css`: styly hlavičky (aktivní položka barvou `secondary` z `src/css/quasar.variables.styl`), mobilní panel (`@media (max-width: 1023px)`: `nav` mimo obraz, `body.menu-open nav` vysunutý, poloprůhledné pozadí), tlačítko `.js-menu` jen pod 1024 px. Hranice 1024 px odpovídá Quasaru `gt-sm`, kde se dnes desktopové záložky skrývají (`Layout.vue:19` `.gt-sm`).

**Krok 4:** `python tools/kontrola.py`. Očekávané: zmizí chyby menu a `bez alt` u log. Zůstanou ostatní obrázky bez alt, galerie, 404 a záložky fotogalerie.

**Krok 5:** Ruční ověření v prohlížeči: spustit `python -m http.server -d site 8000` a projít `http://localhost:8000/` na 1280 a 400 px. Menu musí odkazovat na všechny 4 stránky, na 400 px se otevírat tlačítkem a zavírat Esc. Server pak ukončit.

**Krok 6:** Commit `git add site/ && git commit -m "Hlavička, mobilní menu a web.js"`

---

## Task 4: Úvodní stránka — karusel, počítadla, záložky Autem/Letecky

**Soubory:** Upravit: `site/index.html`, `site/css/web.css`

**Krok 1: karusel.** V `site/index.html` najít SSR markup `q-carousel` (třída `top-carousel`). Nahradit ho:

```html
<section class="top-carousel js-carousel" data-interval="2800" aria-roledescription="carousel" aria-label="Fotografie apartmánu">
  <div class="slide" style="background-image: url(&quot;img/carusel-sunset-apartment-01.jpg&quot;)">…obsah CarouselContent ze SSR…</div>
  … snímky 02–04 stejně …
  <button class="carousel-arrow" data-prev aria-label="Předchozí">&#8249;</button>
  <button class="carousel-arrow" data-next aria-label="Další">&#8250;</button>
  <div class="carousel-dots"><button data-dot="0" aria-label="Snímek 1"></button>…<button data-dot="3" aria-label="Snímek 4"></button></div>
</section>
```

V SSR je vykreslený jen aktivní snímek. Obrázky a texty snímků 2–4 vzít z `src/pages/Index.vue:75-93` a `src/components/CarouselContent.vue`. Obrázky karuselu zkopírovat ze `src/assets/carusel-sunset-apartment-0N.jpg` do `site/img/`, pokud je převod nestáhl.

CSS: `.top-carousel` výška 500 px (`Index.vue:72`), `.slide` absolutně přes sebe s `opacity 0` a `transition: opacity .6s`, `.slide.active` s `opacity 1`. Je to jednodušší náhrada efektu `jump-left` z Quasaru. Text snímku se vysouvá (`q-slide-transition` 1500 ms) → `.slide.active .carousel-content { animation: vysun 1.5s }`.

**Krok 2: počítadla.** Každý `animated-number` (`Index.vue:146-158`: 920 km, 780, 50, 13) nahradit `<span class="js-count" data-to="920" data-time="1200">920</span>`. Výchozí text je cílové číslo, takže bez JS se zobrazí správná hodnota.

**Krok 3: záložky Autem/Letecky.** SSR markup `q-tabs` + `q-tab-panels` nahradit:

```html
<div class="js-tabs">
  <div role="tablist">
    <button role="tab" id="tab-autem" aria-controls="panel-autem" aria-selected="true">Autem</button>
    <button role="tab" id="tab-letecky" aria-controls="panel-letecky" aria-selected="false">Letecky</button>
  </div>
  <div role="tabpanel" id="panel-autem" aria-labelledby="tab-autem">…</div>
  <div role="tabpanel" id="panel-letecky" aria-labelledby="tab-letecky" hidden>…</div>
</div>
```

Texty panelů vzít ze SSR HTML. Panel, který SSR nevykreslil, vzít z `src/pages/Index.vue:110-140`. Odkazy „Nákup letenek >“ apod. zachovat. **Text „BOLT“ musí zůstat** (kontrola to hlídá).

**Krok 4:** Obecnou `meta description` („Sunset Apartment - pobyt u moře“, stejná na všech stránkách) nahradit popisem stránky, např. `Apartmán Sunset v Povljaně na ostrově Pag – ubytování u moře, …`. Text navrhne prováděcí session z úvodního odstavce stránky a uživatel ho schválí. Doplnit `alt` obrázkům, které ho nemají (kontrola je vypíše).

**Krok 5:** `python tools/kontrola.py`. U `index.html` nesmí zůstat chyba.

**Krok 6 (mutační ověření kontroly):** dočasně přejmenovat `site/img/carusel-sunset-apartment-02.jpg` a spustit kontrolu → musí hlásit `míří na neexistující`. Pak soubor vrátit a kontrolu spustit znovu → bez chyby u `index.html`.

**Krok 7:** V prohlížeči ověřit, že:
- karusel se sám posouvá po ~2,8 s, šipky a tečky fungují,
- na 400 px funguje swipe (DevTools touch emulace),
- počítadla počítají při najetí,
- záložky přepínají.

**Krok 8:** Commit `git commit -am "Úvodní stránka: karusel, počítadla, záložky"`

---

## Task 5: Stránka O apartmánu

**Soubory:** Upravit: `site/about/index.html`

**Krok 1:** Projít SSR markup. Interaktivní jsou jen záložky v `PageSectionDoubleCard` a přesměrování `AboutPage.vue:85` na `jidelna-sql.altisima.cz`, pozůstatek šablony jiného webu. Záložky převést stejně jako v Tasku 4, krok 3. Odkaz na jídelnu odstranit (kontrola hlídá `jidelna-sql`).

**Krok 2:** Loga Netflix/YouTube jsou inline SVG nebo lokální soubory z commitu `38b2ac2`. Ověřit, že se převedla a vypadají stejně jako na `.reference/about-1280.png`. **Neupravovat je** — úprava je hotová.

**Krok 3:** Nahradit obecnou `meta description` popisem stránky, doplnit `alt` 4 obrázkům (po Tasku 3 zbývají jen ty mimo hlavičku). Kontrola → bez chyb u `about/index.html`.

**Krok 4:** Commit `git commit -am "Stránka O apartmánu"`

---

## Task 6: Fotogalerie se záložkami a lightboxem

**Soubory:** Vytvořit: `tools/galerie_z_vue.py`. Upravit: `site/photo/index.html`, `site/css/web.css`. Kopírovat: 51 fotek do `site/statics/galerie/`

**Krok 1:** Napsat `tools/galerie_z_vue.py`. Ze `src/pages/Public/PhotoPage.vue` vytáhne 4 pole, zkopíruje fotky a vypíše HTML záložek:

```python
"""Vygeneruje HTML galerie z polí v PhotoPage.vue a zkopíruje fotky do site/.

Spuštění:  python tools/galerie_z_vue.py > galerie.html   (výpis vložit do site/photo/index.html)
"""
import html
import re
import shutil
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")  # jinak Windows při přesměrování do souboru zapíše cp1250
KOREN = Path(__file__).resolve().parent.parent
VUE = (KOREN / "src/pages/Public/PhotoPage.vue").read_text(encoding="utf-8")
ZALOZKY = [("poschodi", "První patro"), ("podkrovi", "Podkroví"), ("okoli", "Okolí apartmánu"), ("ostrov", "Ostrov Pag")]
POLOZKA = re.compile(r"src: '(statics/galerie/[^']+)', alt: '([^']*)'")

print('<div class="js-tabs gallery-tabs">')
print('  <div role="tablist" aria-orientation="vertical">')
for i, (klic, nazev) in enumerate(ZALOZKY):
    vybrano = "true" if i == 0 else "false"
    print(f'    <button role="tab" id="tab-{klic}" aria-controls="panel-{klic}" aria-selected="{vybrano}">{nazev}</button>')
print("  </div>")
celkem = 0
for i, (klic, nazev) in enumerate(ZALOZKY):
    blok = re.search(klic + r": \[(.*?)\]", VUE, re.S).group(1)
    skryto = "" if i == 0 else " hidden"
    print(f'  <div role="tabpanel" id="panel-{klic}" aria-labelledby="tab-{klic}" class="js-gallery"{skryto}>')
    for src, alt in POLOZKA.findall(blok):
        cil = KOREN / "site" / src
        cil.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(KOREN / "src" / src, cil)
        a = html.escape(alt)
        print(f'    <a href="../{src}"><img src="../{src}" alt="{a}" loading="lazy" class="gek-screenshots"></a>')
        celkem += 1
    print("  </div>")
print("</div>")
print(f"<!-- celkem {celkem} fotek -->")
```

**Krok 2:** Spustit, výpis uložit do scratchpadu a ověřit poslední řádek `<!-- celkem 51 fotek -->`. Zkontrolovat, že `site/statics/galerie/` má 51 souborů (plus případně soubory, které stáhl převod).

**Krok 3:** V `site/photo/index.html` nahradit SSR markup `q-tabs` + `q-tab-panels` výpisem (bez řádku s komentářem). Odstranit přesměrování na `jidelna-sql` (`PhotoPage.vue:117`).

**Krok 4:** `site/css/web.css`:
- `.gallery-tabs` jako dva sloupce (svislé záložky vlevo, mřížka fotek vpravo), pod 600 px pod sebou,
- náhledy `.gek-screenshots` stejné velikosti jako na `.reference/photo-1280.png` (`object-fit: cover`),
- `.lightbox` přes celou obrazovku (`position: fixed; inset: 0; background: rgba(0,0,0,.9)`), obrázek `max-width: 95vw; max-height: 90vh`, tlačítka bílá,
- `body.lightbox-open { overflow: hidden }`,
- písmo záložek `RedHatDisplay-bld` 23 px (`PhotoPage.vue:158`).

Náhledy jsou plné fotky jako dnes (`thumbnail: null`). `loading="lazy"` je načte až při zobrazení. Zmenšené náhledy jsou mimo rozsah (YAGNI) a dají se doplnit později.

**Krok 5:** Nahradit obecnou `meta description` popisem stránky. Kontrola → bez chyb u `photo/index.html` (tedy i 51 fotek).

**Krok 6:** V prohlížeči ověřit:
- 4 záložky přepínají,
- klik na fotku otevře lightbox,
- šipky, klávesy ←/→ a Esc fungují, ve smyčce (po poslední fotce první),
- swipe na 400 px,
- klik mimo fotku zavře.

**Krok 7:** Commit

```
git add tools/galerie_z_vue.py site/
git commit -m "Fotogalerie: záložky a lightbox bez Vue"
```

---

## Task 7: Kontakt, 404, favicon, robots, sitemap

**Soubory:** Upravit: `site/contact/index.html`. Vytvořit: `site/404.html`, `site/robots.txt`, `site/sitemap.xml`

**Krok 1: kontakt.** SSR obsahuje větve `$q.platform.is.desktop` / `is.mobile` (`ContactPage.vue:79-134`). SSR vykreslil jen jednu z nich. Obě převést na jeden markup, který se přizpůsobí přes CSS media query. Telefon jako text a k němu odkaz `tel:` (na mobilu přímé volání). Nahradit obecnou `meta description` popisem stránky, doplnit `alt` 3 obrázkům.

**Krok 2: `site/404.html`.** Samostatná stránka s vloženým CSS, nadpis „Stránka nenalezena“ a odkaz „Zpět na úvod“ s `href="/"`. Výjimka z relativních cest, protože GitHub Pages ji servíruje na libovolné adrese. Nadpis a barvy podle `src/pages/Error404.vue`.

**Krok 3: `site/robots.txt`:**

```
User-agent: *
Allow: /
Sitemap: https://sunset-apartment.com/sitemap.xml
```

**Krok 4: `site/sitemap.xml`:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://sunset-apartment.com/</loc></url>
  <url><loc>https://sunset-apartment.com/about/</loc></url>
  <url><loc>https://sunset-apartment.com/photo/</loc></url>
  <url><loc>https://sunset-apartment.com/contact/</loc></url>
</urlset>
```

**Krok 5:** Favicony převod stáhl (`statics/icons/…`). Ověřit, že `<link rel=icon>` na podstránkách mají prefix `../` (kontrola by jinak hlásila neexistující soubor).

**Krok 6:** `python tools/kontrola.py`. Očekávané: **`OK: 0 chyb`**, velikost webu ~18 MB (nanečisto po převodu a galerii vyšlo 17,6 MB).

**Krok 7:** Commit `git add site/ && git commit -m "Kontakt, 404, robots, sitemap"`

---

## Task 8: Úklid markupu a odstranění Quasar stacku z repa

**Soubory:** Smazat: Quasar zdroje. Upravit: `README.md`, `.gitignore`

**Krok 1:** V `site/**/*.html` vyhledat zbytky SSR, které už nic nedělají:
- `<!--[-->`, `<!--]-->` a `data-server-rendered`,
- atributy `tabindex="-1"` u prvků, které už nejsou ovládací,
- prázdné `div`y po odstraněných widgetech.

`data-v-xxxx` atributy **NECHAT**: scoped CSS v `app.css` se na ně váže. Ověřit kontrolou a vizuálně.

**Krok 1b:** Commitnout úklid markupu a **teprve pak** označit poslední stav s Quasarem tagem: `git tag quasar-posledni`.

**Krok 2:** Smazat z pracovní kopie a z gitu Quasar projekt:

```
git rm -r -q src src-pwa src-ssr lib scripts quasar.conf.js quasar.extensions.json package.json yarn.lock babel.config.js jsconfig.json .eslintrc.js .eslintignore .postcssrc.js .stylintrc .editorconfig BUILD-FIX.md install.log ads app-icon.png app-splashscreen.png .ijfw "Upravy Webu Sunset.txt"
```

Netrackované `node_modules/`, `dist/`, `.quasar/` a `.vscode/` smazat ručně až po ověření, že `site/` je kompletní (kontrola OK). Dřív ne: převod a galerie z nich čerpají. Složku `podminky/` (podmínky ochrany osobních údajů) **zachovat**, pokud na ni web odkazuje (grep `podminky` v `site/`). Jinak ji přesunout do `site/podminky/` jen s PDF; `.odt` a `~lock` soubor smazat.

**Krok 3:** Zjednodušit `.gitignore` na: `tools/.venv/`, `.reference/`, `*.stackdump`, `.npmrc`.

**Krok 4:** Přepsat `README.md`:

```markdown
# Sunset Apartment — web

Statický web https://sunset-apartment.com (GitHub Pages). Bez buildu, bez Node.

- `site/` — celý web; co je tady, to je online (po pushi do `master` nasadí `.github/workflows/pages.yml`)
- `tools/kontrola.py` — kontrola odkazů, obrázků a obsahu; spustit před každým pushem: `python tools/kontrola.py`
- `docs/plans/` — plány

## Úpravy
- Text: upravit přímo v `site/<stránka>/index.html`.
- Nová fotka do galerie: soubor do `site/statics/galerie/`, v `site/photo/index.html` do správného panelu přidat
  `<a href="../statics/galerie/X.jpg"><img src="../statics/galerie/X.jpg" alt="Popis" loading="lazy" class="gek-screenshots"></a>`
  a v `tools/kontrola.py` zvýšit `FOTEK_V_GALERII`.
- Náhled lokálně: `python -m http.server -d site 8000` → http://localhost:8000

Původní Quasar projekt je v historii gitu (poslední commit před převodem je označený tagem `quasar-posledni`).
```

**Krok 5:** `python tools/kontrola.py` → OK. Commit `git commit -m "Odstranění Quasar projektu, web je jen v site/"`

---

## Task 9: Vizuální porovnání s živým webem

**Krok 1:** `python -m http.server -d site 8000`. Nasnímat 4 stránky na 1280 a 400 px stejně jako v Tasku 0. Porovnat se snímky v `.reference/` vedle sebe.

**Krok 2:** Rozdíly sepsat. Přijatelné jsou:
- prolínání karuselu místo `jump-left`,
- drobné posuny řádkování, které způsobilo `prettify` (mezery uvnitř inline prvků).

Nepřijatelné je chybějící obsah, rozbitá mřížka nebo jiné písmo. Mezery z `prettify` opravit ručně spojením řádků v daném místě. Detail písma ověřovat zvětšeným výřezem, ne zmenšeným celostránkovým snímkem.

**Krok 3:** Opravit, kontrola OK, commit `git commit -am "Vizuální doladění podle živého webu"`. Server ukončit.

---

## Task 10: Workflow pro GitHub Pages

**Soubory:** Vytvořit: `.github/workflows/pages.yml`

**Krok 1:**

```yaml
name: Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - name: Kontrola webu
        run: python3 tools/kontrola.py
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site
      - id: deployment
        uses: actions/deploy-pages@v4
```

Workflow nic nebuildí: spustí kontrolu (Python je na runneru předinstalovaný) a nahraje `site/`. Akce GitHubu běží interně na Node, to je ale infrastruktura GitHubu, ne závislost webu.

**Krok 2:** Commit, zatím **nepushovat**. Push proběhne až po vyčištění historie (Task 11), aby se na GitHub nedostala nová větev starých commitů.

```
git add .github/workflows/pages.yml
git commit -m "Nasazení na GitHub Pages"
```

---

## Task 11: Vyčištění historie a zveřejnění repa

**Předpoklad:** rozhodnuto „Otevřené“ bod 1 (e-maily, souhlas Jardy). **Nevratné na GitHubu** — force push přepíše všechny hashe.

**Ověřeno nanečisto 2026-10-12** na klonu tehdejšího `master` (166 commitů) ve scratchpadu. Seznamy níže daly:
- 125 commitů (prázdné filter-repo vynechá), pack 101,6 → 88,6 MiB,
- 0 výskytů citlivých řetězců, 0 cizích cest,
- v HEAD ubylo jen `lib/` (55), `.ijfw/`, `ads`, `install.log`, `Upravy Webu Sunset.txt`, `src/boot/sentry.js`, zámek `.odt` a nepoužívaný `src/assets/dorsys-ornament.svg` (CSS webu ho neobsahuje).

Při ostrém běhu budou čísla jiná, protože přibudou commity z Tasků 0–10.

**Co v historii je a proč pryč** (soupis všech 182 cest, které jsou jen v historii, ne v HEAD):
- `lib/`: sdílený kód ENT/Altisimy (`altisima-central-server`).
- **Snímky obrazovky komerčního systému jídelen** v `src/statics/galerie/` (`JídelnaSQL`, `internetové objednávky` včetně `4_maily.png`, objednávkový a výdejní terminál, `zolik`). Můžou obsahovat data skutečných zákazníků. Šablona je zdědila z webů Altisimy.
- Celé weby jiných klientů ze šablony (`src/dorsys.cz/`, `src/gekon.cz/`, `src/jidelnasql.cz/`) a jejich loga a fotky v `src/assets/` a `src/statics/`.
- `Jenkinsfile` a `install.log`: cesty a služby na serveru. `src/boot/sentry.js`: DSN interní instance GlitchTip. `src/postForm.js` a `src/getRestServerUrl.js`: backend zrušeného formuláře.
- `Upravy Webu Sunset.txt`: soukromá korespondence s Vaškem.
- Zůstává: `src/statics/galerie/int-obj/` (fotky apartmánu), komponenty `Jidelna*.vue` (Sunset je používá, jen se tak jmenují) a veřejné zmínky o Altisimě (název firmy, sociální sítě, odkaz na `jidelna-sql.altisima.cz`). Ty nic neprozrazují.

**Krok 1: záloha.** Mimo pracovní kopii:

```
git clone --mirror https://github.com/lukas-jarda-projects/Sunset-web-w.git C:/work/archive/Sunset-web-w-pred-cistenim.git
git -C C:/work/projects/Sunset-apartment.com bundle create C:/work/archive/Sunset-web-w-lokalni.bundle --all
```

Ověřit `git -C C:/work/archive/Sunset-web-w-pred-cistenim.git log --oneline | wc -l` ≥ 166. Bundle je potřeba, protože commity z Tasků 0–10 ještě nejsou na GitHubu.

**Krok 2: nástroj.** `python -m pip install --user git-filter-repo`, ověřit `python -m git_filter_repo --version` (nanečisto: `a40bce548d2c`).

**Krok 3: seznam cest** `cesty.txt` (ve scratchpadu):

```
lib/
Jenkinsfile
install.log
.ijfw/
ads
asd
ble.txt
Upravy Webu Sunset.txt
podminky/.~lock.UniverzalniPodminkyOchranyOsobnichUdaju.odt#
src/boot/sentry.js
src/getRestServerUrl.js
src/postForm.js
src/dorsys.cz/
src/gekon.cz/
src/jidelnasql.cz/
src/statics/gekon/
src/statics/jidelnasql/
src/pages/IndexJidelna.vue
src/components/JidelnaGalleryInternet.vue
regex:^src/statics/galerie/(internetové objednávky|JídelnaSQL|jid-sql|objednávkový terminál|obj-ter|výdejní terminál|vyd-ter|zolik)/
regex:^src/assets/(1-gek-|background-doors-|background-gekon-|carusel-jidelnasql-|dorsys-|logo-(altisima|dorsys|gekon|jidelnasql)|gekon-|Jidelna-icon|ornamenty-gekon|lzice-vidlicka|reseni-|00[1-4]-)
```

Před ostrým během znovu projít soupis cest, které jsou jen v historii: `git log --all --format= --name-only | sort -u` porovnat (`comm -23`) s `git ls-files | sort`. Zkontrolovat, jestli od 2026-10-12 nic nepřibylo.

**Krok 4: náhrady v textu** `nahrady.txt`:

```
example.invalid==>example.invalid
example.invalid==>example.invalid
example.invalid==>example.invalid
qwanap@gmail.com==>NOVY-EMAIL-JARDY
qwanap@gmail.com==>NOVY-EMAIL-JARDY
regex:/srv/www-[a-z-]+==>/srv/www
regex:-([pP]) 22==>-\1 22
```

E-maily Jardy jsou i v **obsahu** souborů (`"author"` v `package.json`), ne jen v hlavičkách commitů. Proto je potřeba mailmap i náhrada textu. Nanečisto to první verze bez náhrady nechytila.

**Krok 5: autoři** `mailmap.txt` (hodnoty podle „Otevřené“ bod 1):

```
Jaroslav Povolný <NOVY-EMAIL-JARDY> <qwanap@gmail.com>
Jaroslav Povolný <NOVY-EMAIL-JARDY> <qwanap@gmail.com>
```

(a případně `lukas-wana <lukas-wana@users.noreply.github.com> <qwanap@gmail.com>`)

**Krok 6: spustit na čerstvém klonu.** Dvě pasti, obě ověřené nanečisto:
- klon z lokální cesty musí mít `--no-local`, jinak ho filter-repo odmítne jako „not a fresh clone“;
- globální `~/.gitconfig` obsahuje víceřádkové aliasy (`alias.i`), na kterých filter-repo spadne (`ValueError: dictionary update sequence element #55`). Proto se spouští s prázdnou globální konfigurací.

```
git clone --no-local C:/work/projects/Sunset-apartment.com C:/work/projects/Sunset-cisteni
cd C:/work/projects/Sunset-cisteni
: > <scratchpad>/prazdny.gitconfig
GIT_CONFIG_GLOBAL=<scratchpad>/prazdny.gitconfig python -m git_filter_repo --invert-paths --paths-from-file <scratchpad>/cesty.txt --replace-text <scratchpad>/nahrady.txt --mailmap <scratchpad>/mailmap.txt
```

Očekávané: `Completely finished after … seconds.`

**Krok 7: ověření** (každý příkaz zvlášť; `grep -c` při 0 nálezech vrací exit 1, nespojovat přes `&&`):

```
git log --all -p --no-color | grep -c -E "example\.invalid|example\.invalid|glitchtip\.|/srv/www-|22|qwanap@|qwanap@"
git log --all --format= --name-only | sort -u | grep -i -E "^lib/|Jenkinsfile|gek|dorsys|zolik|terminál|objednávky|jid-sql|JídelnaSQL|reseni-|doors|install\.log|Upravy Webu|sentry\.js|postForm|getRestServer"
python tools/kontrola.py
```

Očekávané:
- 1. příkaz: `0`.
- 2. příkaz nevypíše nic. Kontrola, že vzor funguje: na původní historii nanečisto našel 130 cest.
- 3. příkaz: `OK: 0 chyb`, protože `site/` filtr nesmí zasáhnout.

**Krok 8: force push.** filter-repo odstranil remote `origin`, nastavit ho znovu:

```
git remote add origin https://github.com/lukas-jarda-projects/Sunset-web-w.git
git push --force origin master
git push --force --tags origin
```

**Krok 9: přepnout pracovní kopii** na vyčištěné repo. Starou složku přejmenovat na `Sunset-apartment.com-stare`, `Sunset-cisteni` na `Sunset-apartment.com`. Netrackované složky (`.reference/`, `tools/.venv/`) přenést ručně. Starou kopii smazat až po Tasku 13.

**Krok 10: zveřejnit.**

```
gh repo edit lukas-jarda-projects/Sunset-web-w --visibility public --accept-visibility-change-consequences
```

Pak v Settings → Pages → Source zvolit **GitHub Actions**. Spustit workflow (`gh workflow run Pages`) a ověřit náhled na `https://lukas-jarda-projects.github.io/Sunset-web-w/`: všechny 4 stránky, galerie, menu na mobilu.

GitHub může mít staré commity ještě nějakou dobu v cache podle hashe. Úplné odstranění řeší podpora GitHubu („remove cached views“). Při 0 forcích a soukromém repu do této chvíle to riziko je malé.

---

## Task 12: Ověření domény v organizaci (ochrana proti převzetí)

**Krok 1:** GitHub → organizace `lukas-jarda-projects` → Settings → Pages → **Add a domain** → `sunset-apartment.com`. GitHub vypíše TXT záznam `_github-pages-challenge-lukas-jarda-projects.sunset-apartment.com` s hodnotou.

**Krok 2:** U Váš Hosting přidat ten TXT záznam. Ověřit:

```
nslookup -type=TXT _github-pages-challenge-lukas-jarda-projects.sunset-apartment.com 8.8.8.8
```

Pak na GitHubu **Verify**.

Proč: bez ověření by doménu mohl na svůj Pages web navázat kdokoli, kdyby ji repo přestalo používat.

---

## Task 13: Převod domény

**Předpoklad:** náhled na `github.io` funguje (Task 11, krok 10), přístup do DNS u Váš Hosting („Otevřené“ bod 2).

**Krok 1 (den předem):** snížit TTL záznamů `@` A a `www` na 300 s (výchozí TTL zóny je 3600 podle SOA; skutečné TTL záznamů ověřit v administraci). Rollback i převod se pak projeví do 5 minut.

**Krok 2: DNS u Váš Hosting** (MX a SPF beze změny):

| záznam | typ | hodnota |
|---|---|---|
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `@` | AAAA | `2606:50c0:8000::153` |
| `@` | AAAA | `2606:50c0:8001::153` |
| `@` | AAAA | `2606:50c0:8002::153` |
| `@` | AAAA | `2606:50c0:8003::153` |
| `www` | CNAME | `lukas-jarda-projects.github.io.` |

Starý A `185.175.84.157` smazat. IP adresy ověřit v aktuální dokumentaci GitHubu („Managing a custom domain for your GitHub Pages site“), než se zadají.

**Krok 3:** Repo → Settings → Pages → Custom domain: `sunset-apartment.com` → Save. S Actions workflow se soubor `CNAME` nepoužívá, doména je jen v nastavení.

**Krok 4:** Počkat, až GitHub vydá certifikát (Let's Encrypt, obvykle minuty, max. ~1 h). Pak zapnout **Enforce HTTPS**. V mezidobí může HTTPS hlásit chybu certifikátu. Proto převod dělat ve chvíli, kdy na webu nezáleží na každé minutě.

**Krok 5: ověření** (výsledky zapsat do plánu):

```
nslookup sunset-apartment.com 8.8.8.8          # 4× 185.199.10x.153
curl -sI https://sunset-apartment.com/          # 200, server: GitHub.com
curl -sI https://www.sunset-apartment.com/      # 301 na https://sunset-apartment.com/
curl -sI https://sunset-apartment.com/about     # 301 na /about/ (stará adresa bez lomítka funguje)
curl -sI http://sunset-apartment.com/           # 301 na https
curl -sI https://sunset-apartment.com/neexistuje   # 404 s vlastní stránkou
```

**Krok 6:** Google Search Console (pokud je doména přidaná): odeslat `sitemap.xml`. V GA ověřit, že po opravě `id=` přicházejí návštěvy (Realtime).

**Rollback:** vrátit A záznam na `185.175.84.157`, smazat AAAA a `www` vrátit na alias apexu. Starý server zatím běží (Task 14), takže web je zpět do 5 minut.

---

## Task 14: Vypnutí starého serveru (za ~týden)

**Krok 1:** Po týdnu bez problémů požádat správce serveru Altisimy („Otevřené“ bod 3), aby zastavil a zakázal `sunset-apartment.com.service` a smazal `/srv/www-quasar-webs/sunset-apartment.com`.

**Krok 2:** Vrátit TTL na 3600. Smazat `C:/work/projects/Sunset-apartment.com-stare`. Zálohy v `C:/work/archive/` ponechat.

**Krok 3:** Plán označit jako dokončený a v `Stav` uvést hash posledního commitu a datum převodu.

---

## Předávka

```
Pokračuj v projektu C:\work\projects\Sunset-apartment.com podle plánu docs/plans/2026-10-12-staticky-web-github-pages.md.
Skills: superpowers:executing-plans (plán má tasky s kontrolními body), superpowers:verification-before-completion (kontrola tools/kontrola.py musí skončit OK: 0 chyb, mutační ověření v Tasku 4).

Stav: plán napsán 2026-10-12, provádění nezačalo. Začni Taskem 0.
Před Taskem 11 se zeptej uživatele na bod 1 sekce „Otevřené“ (e-maily v historii, souhlas Jardy).
Před Taskem 13 se zeptej na bod 2 (přístup do DNS u Váš Hosting).
Textové úpravy (Bolt, odstranění sekcí) a loga Netflix/YouTube jsou HOTOVÉ, nic z toho znovu neupravuj.
Force push (Task 11, krok 8) je nevratný: nejdřív obě zálohy z kroku 1 a ověření z kroku 7.
```

# Statický web na GitHub Pages — implementační plán

> **Pro Claude:** POVINNÝ SUB-SKILL: při provádění použij `superpowers:executing-plans` (krok po kroku s kontrolními body).

**Cíl:** Web sunset-apartment.com poběží jako čisté HTML + CSS + malý vanilla JS na GitHub Pages — bez Node na serveru, bez buildu, upravitelný přímo v HTML.

**Architektura:** Kostra stránek vznikne jednorázovým převodem SSR výstupu **aktuálního `master`**, spuštěného lokálně naposledy přes Node (je to hotové HTML s třídami Quasaru). Živý web to být nemůže, protože běží ze staršího buildu. Zkompilované CSS Quasaru zůstane jako jeden soubor. Dynamické widgety Quasaru (karusel, záložky, mobilní menu, galerie s lightboxem, počítadla) se nahradí vlastním markupem a `site/js/web.js`. Výsledek leží v `site/`, nasazuje ho GitHub Actions workflow, který soubory jen nahraje (žádný build). Repo se před zveřejněním vyčistí od cizího kódu a interních údajů (`git filter-repo`) a pak se na Pages převede doména.

**Technologie:** HTML, CSS, vanilla JS (ES2017, bez knihoven). Pomocné nástroje jen v Pythonu 3: `tools/kontrola.py` je čistá stdlib, převodní skript potřebuje `beautifulsoup4` v lokálním venv. Node se použije jen jednou, v Tasku 0 na build SSR z `master` jako zdroj převodu. Web ani nástroje ho nepotřebují.

**Stav:** Plán napsán a zkontrolován 2026-10-12. Provádění začalo týž den:
- ~~Task 0~~ hotový (`35d5835`): `.gitignore`, venv s `beautifulsoup4` 4.15.0, referenční snímky v `.reference/` (8 souborů, 1280 a 400 px z místního SSR). Build SSR z `master` je v `dist/ssr/`, starý `dist/` z 11. 8. v `C:/work/archive/Sunset-dist-2026-08-11/`.
- ~~Task 1~~ hotový (`feed25e`), ~~Task 2~~ hotový (`6457fcc`): 31× staženo, kontrola přesně 10 očekávaných chyb. Pak oprava `<base>` (`5e6a6f1`, Pozor 4 v Tasku 2).
- ~~Task 3~~ (`37ea2a7`), ~~Task 4~~ (`27d6ca5`), ~~Task 5~~ (`05fdb8f`), ~~Task 6~~ (`7cf6195`), ~~Task 7~~ (`09e7961`), popisy stránek schválené uživatelem (commit níž). Odchylky od plánu jsou u každého tasku v odstavci „Provedeno 2026-10-12“.
- `tools/kontrola.py` končí **`OK: 0 chyb, 210 odkazů, web 18.7 MB`**. Navíc proti původnímu plánu hlídá `<base>` a stejnou `meta description` na víc stránkách (obojí ověřeno mutačně).
- ~~Task 8~~ hotový (`0090d78` úklid markupu + tag `quasar-posledni`, smazání Quasar projektu v commitu níž). Repo obsahuje jen `site/`, `tools/`, `docs/`, README a `.gitignore`.
- ~~Task 9~~ hotový (commit „Vizuální doladění podle SSR z master“): opravena chybějící mezera v seznamu míst na Kontaktu. Ověření na skutečném telefonu se přesunulo do Tasku 11, krok 10.
- ~~Task 10~~ hotový (`a637b53`): workflow, kontrola na runneru Ubuntu prošla, deploy čeká na zapnutí Pages.
- Task 11: kroky 1–10 hotové 2026-10-12 večer (výsledky tam). Repo na GitHubu bylo smazáno a znovu založeno z vyčištěné historie, protože GitHub po force pushi vydával staré commity podle hashe. Repo je veřejné a náhled běží na `https://lukas-jarda-projects.github.io/Sunset-web-w/`. **Zbývá: ověření na skutečném telefonu** (menu, swipe karuselu, swipe v lightboxu), pak Task 12.
- Mimo plán, na přání uživatele 2026-10-12 v noci: animace menu a galerie (commit „Animace menu a galerie“, podrobnosti v sekci „Úprava: animace menu a galerie“ před Taskem 12). Uživatel hlásí, že swipe na mobilu funguje.

Místní SSR už spustit nejde: `node_modules/` a `dist/` jsou od Tasku 8 smazané. Task 9 porovnává s `.reference/`. Kdyby bylo SSR někdy potřeba, je třeba checkout tagu `quasar-posledni` a nový build.

**Poznatky z provádění (2026-10-12):**
- Port 8000 je na tomto stroji obsazený (odpovídá 200). Náhled běžel na 8772: `python -m http.server -d site 8772`.
- Snímky: headless Chrome (`--headless=new --screenshot`). Mobil se snímkuje přes `<iframe width="400">` v okně širokém 600 px, protože `--window-size=400` vykreslí stránku asi na 500 px. Argument `index=/` přepíše Git Bash na cestu Windows (převod cest MSYS), takže Chrome dostane špatnou adresu. Spouštět s `MSYS_NO_PATHCONV=1`.
- Headless nečeká na načtení fotek `q-img` (ani s `--virtual-time-budget`, ani s `--timeout`) a `.reference/photo-*.png` zachytil spinnery. Galerii jsem proto měřil v Chrome přes `getBoundingClientRect`.
- V Chrome přes rozšíření nešly snímky obrazovky („renderer frozen“) a `resize_window` nezměnil `innerWidth`. Mobil se proto testoval v iframe 400 px na stejném originu. V tabu na pozadí se CSS přechody zpožďují a `requestAnimationFrame` neběží.
- Porovnání se SSR v Chrome dělej v iframe pevné šířky na obou originech (SSR na 3123, statická verze na 8772), protože okno rozšíření mění šířku.
- Každý běh headless snímků potřebuje čerstvý `--user-data-dir`. Se sdíleným profilem Chrome vrací HTML z cache a porovnání „před a po“ vyjde falešně shodné (zjištěno v Tasku 8).

Nanečisto ve scratchpadu (mimo repo) ověřeno:
- `kontrola.py`, `prevod_z_ssr.py` (proti místnímu SSR z `master`) a `galerie_z_vue.py` proběhnou s výstupem popsaným v Tasku 2,
- kontrola chytí smazanou fotku i chybějící obrázek v `srcset`,
- úvodní stránka po převodu (se sloučenými CSS chunky a třídami `gt-*`) vypadá na 1280 px stejně jako SSR z `master`: písma, nadpisy, karty dopravy ve 3 sloupcích (snímek headless Chromem; hlavička a karusel se řeší až v Tascích 3–4),
- čištění historie se vstupy z `C:/work/archive/sunset-cisteni-historie/` dá 0 citlivých řetězců a 0 cizích cest.

`web.js` a `pages.yml` jsou ověřené **jen syntakticky** (`node --check`, `yaml.safe_load`), v prohlížeči a na GitHubu zatím neběžely.

---

## Výchozí stav (ověřeno 2026-10-12)

- Živý web: Quasar 1 SSR (Express) na `185.175.84.157`, služba `sunset-apartment.com.service` na serveru Altisimy. **Běží ze staršího buildu než `master`:** loga Netflix/YouTube na O apartmánu načítá z `api.iconify.design`, ačkoli `master` je má lokálně (`c81504b`, `38b2ac2`, nenasazeno). Texty všech 4 stránek jsou na živém webu a v `master` shodné slovo od slova (ověřeno 2026-10-12 porovnáním vykreslených stránek). Router běží v SSR režimu history, adresy jsou `/`, `/about`, `/photo`, `/contact`.
- Web za běhu nevolá žádné API. Formulář je pryč (commit `5b42f20`). `axios`, `socketio`, `vuelidate` a `vue-print-nb` jsou mrtvé závislosti, Sentry je vypnutý (`quasar.conf.js`, boot `'sentry'` zakomentován). i18n obsahuje jen ukázkový soubor a přepínač jazyků se nevykresluje.
- **Textové úpravy od Vaška jsou HOTOVÉ** (Bolt místo Uberu, „Užitečné informace“ a „Volné termíny“ odstraněny; sekce jsou v Pugu zakomentované `//-`). Hotová je i **úprava log Netflix/YouTube v sekci O apartmánu** (`38b2ac2`, `c81504b`). Převod je jen převezme, nic se znovu neupravuje.
- Na živém webu je `meta description` na všech 4 stránkách stejná a obecná („Sunset Apartment - pobyt u moře“), stránka má `<html lang=en-us>` a 15 obrázků nemá `alt`: 2× logo Sunset v hlavičce na každé stránce, na O apartmánu navíc 4 vložená SVG loga streamovacích služeb (`data:image/svg`), na Kontaktu 3 obrázky (`kontakt-apartman`, `mapa-z-letadla`, `map-with-poi`). Platí i pro `master`. Ověřeno nanečisto spuštěným převodem a kontrolou z tohoto plánu. V `src/index.template.html:7` je `gtag/js?id==G-5Y4HJPKVK0` (dvě `=`), a jestli GA vůbec měří, neověřeno.
- Interaktivní prvky:
  - `Index.vue:70` karusel (4 snímky, autoplay 2800 ms, šipky, tečky, swipe, nekonečný),
  - `Index.vue:146-158` 4× `animated-number` (1200 ms, restart při návratu do pohledu),
  - přepínače podle šířky okna nebo zařízení: `Index.vue:107` a `AboutPage.vue:104` (`$q.screen`), `CarouselContent.vue:6` (`is-small` pod 1024 px), `ContactPage.vue:79-134` (`$q.platform`: desktop/mobil se liší jen obrázky `kontakt-apartman.jpg` / `-xs.jpg` a `mapa-z-letadla.jpg` / `-xs.jpg`). Záložky Autem/Letecky na úvodní stránce NEJSOU. Jsou to tři karty Autem / Vlakem / Letecky ve 3 sloupcích.
  - `App.vue:13`: kořen `#q-app` dostává třídy `gt-xs`…`gt-lg` podle šířky a CSS komponent na ně navazuje rozvržení. Řeší to vložený skript z převodu (Task 2, „Pozor 2“).
  - `Layout.vue:19` horní záložky menu + `Layout.vue:38` mobilní drawer,
  - `PhotoPage.vue:139` svislé záložky (4 galerie: 21 + 5 + 17 + 8 = 51 fotek) + `TinyBox.vue` (lightbox, swipe, smyčka).
- Galerie v SSR HTML nejsou: vykresluje je až JS. Zdrojem fotek je pole `poschodi/podkrovi/okoli/ostrov` v `src/pages/Public/PhotoPage.vue`. Všech 51 souborů existuje v `src/statics/galerie/`.
- Repo `lukas-jarda-projects/Sunset-web-w`: soukromé, organizace na plánu **free**, jediná větev `master`, 0 forků, 166 commitů, ~104 MB. Autoři: lukas-wana (noreply), `qwanap@gmail.com`, Jaroslav Povolný (2 osobní e-maily), „OpenClaw Ad Radar“.
- Prověřena celá historie: hesla ani tokeny v ní nejsou (`.npmrc` nikdy necommitnut, Jenkinsfile bez přístupů, `password: secret` jsou jen testovací data v `lib/fs`). V historii ale jsou věci, které se zveřejnit nesmí: sdílený kód `lib/`, celé weby jiných klientů ze šablony Altisimy a snímky obrazovky systému jídelen s možnými daty zákazníků. Soupis a postup jsou v Tasku 11 (ověřeno nanečisto).
- DNS: NS i MX u **Váš Hosting** (`ns.vas-hosting.cz/.eu/.com`), A `185.175.84.157`, `www` je alias na apex, SPF `v=spf1 a mx ?all`. **Pošta na doméně neběží** (potvrdil uživatel) → MX a SPF se nechají beze změny.

## Rozhodnutí

| rozhodnutí | důvod |
|---|---|
| Varianta B (čisté HTML), ne Quasar build v CI | úpravy bez buildu; SEO stejné jako dnes (každá stránka je hotové HTML) |
| Kostra ze SSR HTML aktuálního `master` (lokálně), ne ze živého webu ani ručním přepisem z Pugu | vzhled sedí 1:1 a obsahuje všechny hotové úpravy; živý web nemá lokální loga (první verze plánu to přehlédla a úpravu log by tiše vrátila) |
| Zkompilované CSS Quasaru se ponechá celé (225 KB) | utility třídy (`row`, `col-*`, `q-mt-*`) fungují bez Vue; ořez CSS je volitelný až po spuštění |
| Relativní odkazy všude kromě `404.html` | náhled na `lukas-jarda-projects.github.io/Sunset-web-w/` běží v podsložce; absolutní `/css/…` by tam nefungovalo |
| Nasazení přes Actions (`upload-pages-artifact`), web v `site/` | v rootu repa zůstanou plány a nástroje a nevystaví se jako web; Jekyll se nespouští |
| Stávající repo zveřejnit **po vyčištění historie** | rozhodnutí uživatele 2026-10-12 (varianta „stávající repo, historii vyčistit“) |
| Pošta: MX a SPF beze změny | pošta neběží; záznamy nevadí a jejich mazání nikdo nechtěl |

## Rozhodnuto uživatelem 2026-10-12 (dřív „Otevřené“)

1. **E-maily Jardy v historii** (jeho dva osobní) se v Tasku 11 přepíšou na **`qwanap@gmail.com`**. Jméno „Jaroslav Povolný“ u jeho commitů zůstane, mění se jen adresa. Vlastní `qwanap@gmail.com` zůstává beze změny.
2. **Přístup do DNS u Váš Hosting má uživatel** (Task 12, 13).
3. **Starý server** vypne **Robert (šéf Altisimy)**. Uživatel mu to řekne, až bude převod hotový (Task 14).

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

**Krok 3: místní SSR z `master`** (jediné použití Node).

**Build a přesun starého `dist/` jsou HOTOVÉ** (2026-10-12):
- `mv dist …`, pak `node scripts/quasar-legacy.js build --mode ssr` (~3 min, `Build succeeded`),
- starý build z 11. 8. leží v `C:/work/archive/Sunset-dist-2026-08-11/`.

**`mv` neopakovat**, přejmenoval by nový build. Build opakovat jen tehdy, když se mezitím změnil `src/`.

Zbývá spustit server (z kořene projektu, moduly bere z `node_modules/`; na pozadí, poběží do Tasku 8):

```
PORT=3123 node dist/ssr/index.js
```

Očekávané: `Server listening at port 3123`. Ověřit `curl -s http://localhost:3123/about | grep -o "data:image/svg" | wc -l` = 4 (lokální loga; ověřeno 2026-10-12). Pozor, `grep -c` počítá řádky a zhuštěné HTML jich má jen pár, vrátil by 1. Na živém webu jsou místo log odkazy na iconify.

**Krok 3b:** Uložit referenční snímky z **místního SSR** (`http://localhost:3123/`, `/about`, `/photo`, `/contact`) na 1280 px a 400 px do `.reference/`. Ten se necommituje. Snímky živého webu se nehodí, protože mají stará loga.

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
        self.bez_alt, self.fotek, self.base = 0, 0, False
        self._v_title, self._v_nav = False, 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "base":
            self.base = True
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
        for cast in (a.get("srcset") or "").split(","):
            if cast.strip():
                self.odkazy.append((tag, cast.split()[0]))
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
    chyby, menu, pocet_odkazu, popisy = [], {}, 0, {}
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
        elif not je_404 and s.description in popisy:
            chyby.append(f"{rel}: stejná meta description jako {popisy[s.description]}")
        elif not je_404:
            popisy[s.description] = rel
        if s.base:
            chyby.append(f"{rel}: <base> mění význam relativních odkazů, odstranit")
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

## Task 2: Převod SSR výstupu z `master` na kostru `site/`

**Soubory:** Vytvořit: `tools/prevod_z_ssr.py`, vygeneruje `site/**`

Skript (jednorázový, commitne se kvůli dohledatelnosti původu) udělá tohle:
- stáhne 4 stránky a CSS z místního SSR (`http://localhost:3123`, Task 0 krok 3), ne ze živého webu,
- odstraní Vue bundly (`/js/*.js`), skript s `__INITIAL_STATE__` a preload/prefetch odkazy,
- stáhne všechny lokální soubory, na které HTML a CSS odkazují (z názvu odstraní 8znakový hash),
- přepíše odkazy na relativní,
- nastaví `lang="cs"`, opraví `id==` v GA,
- HTML zformátuje (`prettify`), aby šlo upravovat ručně.

**Krok 1:** Napsat `tools/prevod_z_ssr.py`:

```python
"""Jednorázový převod SSR webu na statické soubory v site/.

Spuštění:  tools/.venv/Scripts/python tools/prevod_z_ssr.py [zdroj]
Zdroj je místní SSR z master (Task 0, krok 3), výchozí http://localhost:3123.
Přepíše HTML v site/, stažené soubory přeskočí, pokud už existují.
"""
import posixpath
import re
import sys
from pathlib import Path
from urllib.parse import quote, unquote
from urllib.request import urlopen

from bs4 import BeautifulSoup

ZDROJ = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3123"
KOREN = Path(__file__).resolve().parent.parent
SITE = KOREN / "site"
# Scoped CSS komponent leží v chuncích, které načítá jen JS (SSR HTML na ně neodkazuje).
CHUNKY = KOREN / "dist/ssr/www/css"
STRANKY = {"/": "index.html", "/about": "about/index.html", "/photo": "photo/index.html", "/contact": "contact/index.html"}
HASH = re.compile(r"\.[0-9a-f]{8}(\.\w+)$")
# Jako App.vue: kořen #q-app dostane třídy gt-xs/gt-sm/gt-md/gt-lg podle šířky (hranice Quasaru).
# CSS komponent na ně navazuje rozvržení (např. karty dopravy ve 3 sloupcích jen s .gt-xs).
TRIDY_SIRKY = ("(function(){var a=document.getElementById('q-app'),w=window.innerWidth;"
               "[['xs',600],['sm',1024],['md',1440],['lg',1920]].forEach(function(b)"
               "{a.classList.toggle('gt-'+b[0],w>=b[1])})})()")
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


def spoj_chunky():
    """Všechny CSS chunky kromě app.*.css spojí do css/komponenty.css (chunk-common první)."""
    chunky = sorted((p for p in CHUNKY.glob("*.css") if not p.name.startswith("app.")),
                    key=lambda p: (not p.name.startswith("chunk-common"), p.name))
    assert chunky, f"v {CHUNKY} nejsou CSS chunky, nejdřív build (Task 0 krok 3)"
    cil = SITE / "css" / "komponenty.css"
    cil.parent.mkdir(parents=True, exist_ok=True)
    cil.write_text("\n".join(f"/* {p.name} */\n" + p.read_text(encoding="utf-8") for p in chunky),
                   encoding="utf-8", newline="\n")
    print("chunky", ", ".join(p.name for p in chunky))


def main():
    SITE.mkdir(exist_ok=True)
    spoj_chunky()
    for cesta, soubor in STRANKY.items():
        prefix = "../" * soubor.count("/")
        with urlopen(ZDROJ + cesta) as r:
            soup = BeautifulSoup(r.read().decode("utf-8"), "html.parser")
        soup.html["lang"] = "cs"
        # SSR dává <base href="/">; s relativními odkazy by v podsložce (náhled Pages) vše rozbil
        for b in soup.find_all("base"):
            b.decompose()
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
        koren = soup.find(id="q-app")
        del koren["data-server-rendered"]
        skript = soup.new_tag("script")
        skript.string = TRIDY_SIRKY
        koren.insert(0, skript)
        app_css = soup.find("link", rel="stylesheet")
        app_css.insert_after(soup.new_tag("link", rel="stylesheet", href=prefix + "css/komponenty.css"))
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

Pozor 1: SSR HTML odkazuje jen na `app.css`. **Scoped styly komponent** (např. 77px nadpisy karuselu z `CarouselContent.vue`) jsou v CSS chuncích (`chunk-common.*.css`, `4.*.css`–`8.*.css`), které za běhu načítá až Vue JS. Bez nich by statický web přišel o vzhled komponent a kontrola by to nechytila, protože jde o chybějící styl, ne o rozbitý odkaz. Proto `spoj_chunky()` spojí chunky z lokálního buildu do `css/komponenty.css` a ten se připojí za `app.css`. První verze plánu to neměla, chytilo to čtení buildu v kontrole plánu.

Pozor 2: `App.vue:13` dává kořeni `#q-app` třídy `gt-xs`, `gt-sm`, `gt-md`, `gt-lg` podle šířky okna. CSS komponent na ně navazuje rozvržení (např. `.gt-xs .page-section-card`: karty Autem / Vlakem / Letecky ve 3 sloupcích). Server šířku nezná, takže SSR je vykreslí jako na mobilu. Převod proto vloží hned za `<div id="q-app">` krátký skript, který třídy nastaví před vykreslením zbytku stránky, a `web.js` je přepočítá při změně velikosti okna (Task 3). Chytilo to až vizuální porovnání v kontrole plánu: karty byly pod sebou.

Pozor 3: zkompilované CSS Quasaru odkazuje na písma **relativně** (`url(../fonts/RedHatText-Regular.e828eaa6.woff)`), ne absolutně. Proto má CSS soubor vlastní převod `prevod_css_souboru`, který cestu nejdřív vztáhne ke kořeni webu. První verze plánu to neměla a písma se nestáhla; chytila to až kontrola.

Pozor 4: SSR dává do `<head>` `<base href="/">` a převod z něj udělal `<base href="../">`. Na kořeni domény to vycházelo náhodou správně, ale v náhledu pod `/Sunset-web-w/` by se všechny odkazy podstránek přepočítaly od `/` a rozbily. Převod proto `<base>` odstraní a kontrola ho hlásí jako chybu. Chytilo to až čtení HTML při Tasku 3 (2026-10-12), nanečisto ověření v podsložce neproběhlo.

**Krok 2:** Spustit:

```
tools/.venv/Scripts/python tools/prevod_z_ssr.py
```

Očekávané (nanečisto 2026-10-12): řádek `chunky chunk-common…, 4…, …`, 31× `stazeno …` (1 CSS, 5 písem, 19 obrázků v `img/`, 6 souborů ve `statics/`), 4× `stranka …` a `css app.css`, `css komponenty.css`. Z karuselu se stáhne jen první snímek, protože ostatní SSR nevykreslí (doplní Task 4).

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
git commit -m "Kostra statického webu ze SSR výstupu master"
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

  // Třídy gt-* na #q-app podle šířky okna (jako App.vue; první nastavení dělá vložený skript ve stránce)
  var koren = document.getElementById('q-app')
  window.addEventListener('resize', function () {
    var w = window.innerWidth
    ;[['xs', 600], ['sm', 1024], ['md', 1440], ['lg', 1920]].forEach(function (b) {
      koren.classList.toggle('gt-' + b[0], w >= b[1])
    })
  })

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

**Krok 4:** `python tools/kontrola.py`. Očekávané: zmizí chyby menu a `bez alt` u log. Zůstanou ostatní obrázky bez alt, galerie a 404.

**Krok 5:** Ruční ověření v prohlížeči: spustit `python -m http.server -d site 8000` (volnost portu ověřit jako v Tasku 9, krok 1) a projít `http://localhost:8000/` na 1280 a 400 px. Menu musí odkazovat na všechny 4 stránky, na 400 px se otevírat tlačítkem a zavírat Esc. Server pak ukončit.

**Krok 6:** Commit `git add site/ && git commit -m "Hlavička, mobilní menu a web.js"`

**Provedeno 2026-10-12:** hlavička přestavěna skriptem nad 4 stránkami (desktopové záložky Quasaru → `<nav id="menu">`, drawer → `div.menu-backdrop`, tlačítko „zavřít“ v panelu). Navíc oprava, kterou plán neměl: SSR dává `q-page-container` natvrdo `padding-top:98px`, Quasar ho za běhu přepočítá na výšku hlavičky (80 px). Bez opravy byl obsah o 18 px níž než v referenci (změřeno na snímku O apartmánu). Ve 4 stránkách přepsáno na `80px`, Kontakt je pak na 1280 px pixelově shodný s referencí a na 400 px se liší jen vyhlazením písma v tlačítku Menu. Menu na 400 px ověřeno v iframe (otevření, Esc, pozadí, „zavřít“, 4 odkazy) a snímkem.

---

## Task 4: Úvodní stránka — karusel, počítadla, responzivita

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

**Krok 3: responzivní přepínače.** Autem / Vlakem / Letecky **nejsou záložky** (první verze plánu to tvrdila chybně). Jsou to tři karty `page-section-card` a SSR je vykreslil všechny. Do 3 sloupců je řadí třída `gt-xs` na `#q-app` (Task 2, „Pozor 2“), ne tento krok. Text „BOLT“ musí zůstat, kontrola ho hlídá. Na stránce jsou dva přepínače podle šířky okna. **SSR je vykreslil v mobilní podobě** (server šířku nezná; ověřeno v HTML z `master`). Převést je na CSS media query:
- `Index.vue:107`: má `justify-center` jen od 600 px (`$q.screen.gt.xs`). V SSR je `class="flex q-gutter-sm"`, tedy bez něj. Prvku přidat třídu `doprava-tlacitka` a do `web.css` napsat `@media (min-width: 600px) { .doprava-tlacitka { justify-content: center } }`.
- `CarouselContent.vue:6`: pod 1024 px (`$q.screen.lt.md`) má obsah snímku třídu `is-small`. V SSR ji má vždy (`class="text-center is-small"`). Třídu z HTML odebrat a pravidla `.is-small` z `site/css/komponenty.css` (původně `chunk-common`, scoped s `data-v-…`) zkopírovat do `web.css` pod `@media (max-width: 1023px)` se stejným selektorem bez `.is-small`.

**Krok 4:** Obecnou `meta description` („Sunset Apartment - pobyt u moře“, stejná na všech stránkách) nahradit popisem stránky, např. `Apartmán Sunset v Povljaně na ostrově Pag – ubytování u moře, …`. Text navrhne prováděcí session z úvodního odstavce stránky a uživatel ho schválí. Doplnit `alt` obrázkům, které ho nemají (kontrola je vypíše).

~~Krok 4~~ **hotový 2026-10-12 pro všechny 4 stránky najednou**: uživatel schválil texty Úvod, O apartmánu, Fotogalerie a Kontakt beze změny. Kontrola nově hlásí stejný popis na víc stránkách. Mutačně ověřeno: před zápisem hlásila 3 chyby, po zápisu 0.

**Krok 5:** `python tools/kontrola.py`. U `index.html` nesmí zůstat chyba.

**Krok 6 (mutační ověření kontroly):** dočasně přejmenovat `site/img/carusel-sunset-apartment-02.jpg` a spustit kontrolu → musí hlásit `míří na neexistující`. Pak soubor vrátit a kontrolu spustit znovu → bez chyby u `index.html`.

**Krok 7:** V prohlížeči ověřit, že:
- karusel se sám posouvá po ~2,8 s, šipky a tečky fungují,
- na 400 px funguje swipe (DevTools touch emulace),
- počítadla počítají při najetí,
- na 400 px jsou tlačítka dopravy zarovnaná vlevo a text karuselu je menší (stejně jako na `.reference/index-400.png`).

**Krok 8:** Commit `git commit -am "Úvodní stránka: karusel, počítadla, responzivita"`

---

## Task 5: Stránka O apartmánu

**Soubory:** Upravit: `site/about/index.html`

**Krok 1:** Stránka nemá žádný interaktivní prvek. `PageSectionDoubleCard` se na žádné stránce nevykresluje, jen importuje. Metoda `login()` v `AboutPage.vue:84-86` (přesměrování na `jidelna-sql.altisima.cz`, pozůstatek šablony) se nikde nevolá a v SSR HTML není. Kontrola `jidelna-sql` v HTML nenašla (ověřeno nanečisto). Jediný přepínač podle šířky je `AboutPage.vue:104`: `q-gutter-lg` jen od 600 px (`!$q.screen.lt.sm`). SSR ho vykreslil v mobilní podobě (`class="flex justify-center"`, bez `q-gutter-lg`). Prvku přidat třídu `loga-sluzeb` a do `web.css` pod `@media (min-width: 600px)` zkopírovat pravidla `.q-gutter-lg` z `app.css` (záporný margin rodiče, padding potomků) pro `.loga-sluzeb`.

**Krok 2:** Loga streamovacích služeb jsou v SSR z `master` vložená jako 4× `<img src="data:image/svg+xml;base64,…">` (webpack je vložil z `src/assets/NetflixLogo.svg` atd., commit `38b2ac2`). Ověřit, že vypadají stejně jako na `.reference/about-1280.png`. **Neupravovat je**, úprava je hotová, jen jim doplnit `alt` (název služby podle odkazu kolem).

**Krok 3:** Nahradit obecnou `meta description` popisem stránky. Kontrola → bez chyb u `about/index.html`.

**Krok 4:** Commit `git commit -am "Stránka O apartmánu"`

**Provedeno 2026-10-12, dvě odchylky od plánu:**
- Přepínač `AboutPage.vue:104` neobaluje loga služeb, ale **karty místností** (Kuchyň, Obývací místnost, Ložnice…). Třída se proto jmenuje `karty-mistnosti`, ne `loga-sluzeb`.
- `prettify` v převodu vložil do `<a>` kolem log služeb mezery a zalomení. Mezi logy se pak kreslily podtržené mezery a loga se posunula (rozdíl na snímku 1280 px). 4 odkazy jsou teď spojené na jeden řádek bez mezer. Stejná past hrozí u každého řádkového prvku, který `prettify` rozloží na víc řádků. Na ostatních stránkách se zatím neprojevila: Úvod i Kontakt jsou s referencí shodné.

Výsledek: O apartmánu je na 1280 i 400 px pixelově shodná s referencí (na 400 px porovnáno od y = 60, protože hlavička se liší vyhlazením písma v tlačítku Menu).

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
        print(f'    <a href="../{src}" class="gallery-item"><img src="../{src}" alt="{a}" loading="lazy" class="gek-screenshots">'
              f'<span class="gallery-caption" aria-hidden="true">{a}</span></a>')
        celkem += 1
    print("  </div>")
print("</div>")
print(f"<!-- celkem {celkem} fotek -->")
```

**Krok 2:** Spustit, výpis uložit do scratchpadu a ověřit poslední řádek `<!-- celkem 51 fotek -->`. Zkontrolovat, že `site/statics/galerie/` má 51 souborů (plus případně soubory, které stáhl převod).

**Krok 3:** V `site/photo/index.html` nahradit SSR markup `q-tabs` + `q-tab-panels` výpisem (bez řádku s komentářem). Metoda `login()` s přesměrováním na `jidelna-sql` (`PhotoPage.vue:116-118`) je mrtvý kód, nikde se nevolá a v SSR HTML není (0 výskytů), takže v HTML není co odstraňovat.

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

**Provedeno 2026-10-12, odchylky od plánu:**
- Rozvržení podle skutečného SSR, ne podle kroku 4: záložky jsou **pod sebou nad mřížkou** přes celou šířku sekce (1100 px), ne ve dvou sloupcích. Aktivní záložka má barvu accent `#ffad14` a 2px pruh vpravo. Rozměry byly naměřené v SSR v okně 1252 px (`getBoundingClientRect`). Statická verze má stejné pozice prvních 8 náhledů, záložek i nadpisu na pixel.
- Referenční snímek `.reference/photo-*.png` zachytil fotky ještě při načítání (spinnery `q-img`), na vzhled galerie se nedá použít. Headless Chrome na načtení fotek nečeká ani s `--virtual-time-budget`, ani s `--timeout`, proto se měřilo v Chrome.
- Generátor vypisuje i popisek náhledu (`span.gallery-caption`, jako `.absolute-bottom` v `JidelnaGallery.vue`). Kód v kroku 1 je srovnaný s `tools/galerie_z_vue.py`.
- Lightbox nemá popisek pod fotkou, který měl `TinyBox.vue` (`gallery-text-alt`). Doplnit ho jde později, pokud bude chybět.
- Stejný artefakt 98 px jako v Tasku 3: `main` má `min-height:calc(100vh - 98px)`, opraveno na `80px` ve 4 stránkách.

Chování ověřeno v Chrome: přepínání záložek, otevření, šipky, ←/→, smyčka v obou směrech, swipe, Esc, klik mimo fotku.

---

## Task 7: Kontakt, 404, favicon, robots, sitemap

**Soubory:** Upravit: `site/contact/index.html`. Vytvořit: `site/404.html`, `site/robots.txt`, `site/sitemap.xml`

**Krok 1: kontakt.** Větve `$q.platform.is.desktop` / `is.mobile` (`ContactPage.vue:79-134`) se liší jen obrázky a SSR vykreslil desktopové. Převést je na `<picture>`:

```html
<picture>
  <source media="(max-width: 599px)" srcset="../img/kontakt-apartman-xs.jpg">
  <img src="../img/kontakt-apartman.jpg" alt="Apartmán Sunset" height="300">
</picture>
```

Totéž pro `mapa-z-letadla.jpg` / `mapa-z-letadla-xs.jpg`. Mapa `map-with-poi.png` je v obou větvích stejná, liší se jen šířkou (desktop `height=420`, mobil `width=100%`), takže stačí `@media (max-width: 599px) { … width: 100%; height: auto }`. Soubory `-xs.jpg` převod nestáhl (SSR je nevykreslil), proto je zkopírovat ze `src/assets/` do `site/img/`. Quasar rozlišoval podle zařízení, ne podle šířky. Hranice 600 px je vědomá náhrada. Telefon ani formulář na stránce nejsou, nic dalšího se nepřidává. Nahradit obecnou `meta description` popisem stránky, doplnit `alt` 3 obrázkům.

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

**Provedeno 2026-10-12:** kontrola **`OK: 0 chyb, 210 odkazů, web 18.7 MB`**. Popisy stránek (`meta description`) doplněné hned potom, viz Task 4 krok 4.
- `404.html` má `sad.svg` vložené přímo v HTML: absolutní `/img/…` by v náhledu pod `/Sunset-web-w/` nenašlo obrázek. `python -m http.server` vlastní 404 stránky neservíruje, takže se ověřovala přímo na `/404.html`.
- ~~Na referenčním snímku 1280 px je text seznamu míst (1 apartmán, 2 pláž…) o ~10 px víc vpravo než ve statické verzi. V reálném Chrome jsou ale SSR i statická verze při šířce 1280 px shodné: řádek `left 100, width 1135`, text `left 203` (měřeno v iframe 1280 px na obou originech). Rozdíl tedy vzniká jen v headless snímku SSR. Na 400 px je ve statické verzi číslo těsně u textu: zkontrolovat na skutečném telefonu v Tasku 9.~~ **Závěr byl chybný, opraveno v Tasku 9.** Rozdíl byl skutečný: zdroj má `.text &nbsp; apartmán` a převod (`prettify`, ořez mezer přes `str.strip()`, který bere i U+00A0) úvodní `&nbsp;` u všech 9 položek odstranil. Měření `left 203` mířilo na `div`, ne na první znak textu, proto rozdíl neukázalo.

---

## Task 8: Úklid markupu a odstranění Quasar stacku z repa

**Soubory:** Smazat: Quasar zdroje. Upravit: `README.md`, `.gitignore`

**Krok 1:** V `site/**/*.html` vyhledat zbytky SSR, které už nic nedělají:
- atributy `tabindex="-1"` u prvků, které už nejsou ovládací,
- prázdné `div`y po odstraněných widgetech.

`data-server-rendered` odstranil už převod. Atributy `data-v-xxxx` **NECHAT**: scoped CSS v `komponenty.css` se na ně váže. Stejně tak třídy `q-*` a kořen `<div id="q-app">` se vloženým skriptem tříd `gt-*`. Ověřit kontrolou a vizuálně.

**Krok 1b:** Commitnout úklid markupu a **teprve pak** označit poslední stav s Quasarem tagem: `git tag quasar-posledni`.

**Krok 2:** Smazat z pracovní kopie a z gitu Quasar projekt:

```
git rm -r -q src src-pwa src-ssr lib scripts podminky quasar.conf.js quasar.extensions.json package.json yarn.lock babel.config.js jsconfig.json .eslintrc.js .eslintignore .postcssrc.js .stylintrc .editorconfig BUILD-FIX.md install.log ads app-icon.png app-splashscreen.png .ijfw "Upravy Webu Sunset.txt"
```

Nejdřív ukončit místní SSR server z Tasku 0 (port 3123). Netrackované `node_modules/`, `dist/`, `.quasar/` a `.vscode/` smazat ručně až po ověření, že `site/` je kompletní (kontrola OK). Dřív ne: převod a galerie z nich čerpají. Složku `podminky/` (podmínky ochrany osobních údajů z doby formuláře) smazat taky: žádná stránka živého webu na ni neodkazuje (ověřeno 2026-10-12, 0 výskytů `podminky` ve 4 stránkách). V historii zůstane. Před smazáním to znovu ověřit grepem `podminky` v `site/`.

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
  `<a href="../statics/galerie/X.jpg" class="gallery-item"><img src="../statics/galerie/X.jpg" alt="Popis" loading="lazy" class="gek-screenshots"><span class="gallery-caption" aria-hidden="true">Popis</span></a>`
  a v `tools/kontrola.py` zvýšit `FOTEK_V_GALERII`.
- Náhled lokálně: `python -m http.server -d site 8000` → http://localhost:8000 (když je port 8000 obsazený, zvol jiný)

Původní Quasar projekt je v historii gitu (poslední commit před převodem je označený tagem `quasar-posledni`).
```

**Krok 5:** `python tools/kontrola.py` → OK. Commit `git commit -m "Odstranění Quasar projektu, web je jen v site/"`

**Provedeno 2026-10-12 (krok 1):** `tabindex="-1"` byl jen na kořeni `q-layout` (4 stránky), odstraněn. `tabindex="0"` zůstal na tlačítkách Menu a šipkách karuselu (jsou ovládací). Prázdné divy `q-tab__indicator` (podtržení aktivní záložky), `menu-backdrop` (JS menu) a `q-layout__shadow` (stín hlavičky) mají funkci, zůstaly. **Prázdné obalové sekce NEJSOU mrtvé** a zůstaly: `page-section` s prázdným `row q-mt-xl` na O apartmánu, Kontaktu a Galerii a prázdná `page-section` před karuselem dávají horní odsazení obsahu. Po jejich odstranění se obsah posunul nahoru: na O apartmánu na 1280 px zhruba o 46 px (odečteno ze zmenšeného snímku). Na Kontaktu, Galerii a úvodní stránce na 1280 px a na O apartmánu, Kontaktu a Galerii na 400 px se snímky lišily od hlavičky dolů, velikost posunu tam měřená nebyla. Úvodní stránka na 400 px zůstala beze změny. Po samotném odstranění `tabindex` jsou snímky všech 4 stránek na 1280 i 400 px shodné se stavem před úpravou, až na šum snímání. Šum je měřený dvěma běhy stejného obsahu: písmo v iframe galerie na 400 px, počítadla na úvodní stránce.
- **Past snímkování:** headless Chrome se sdíleným `--user-data-dir` vrací HTML z cache (`http.server` posílá `Last-Modified`, prohlížeč si odvodí čerstvost). Snímky „po úpravě“ pak ukazují starý stav a porovnání vyjde falešně shodné. Každý běh snímků proto potřebuje vlastní čerstvý profil.

**Provedeno 2026-10-12 (kroky 1b–5):** úklid markupu commitnut (`0090d78`) a označen tagem `quasar-posledni`. `git rm` podle kroku 2 prošel beze změny příkazu, v gitu zůstalo `.gitignore docs README.md site tools`. Před smazáním netrackovaných složek: `podminky` v `site/` = 0, kontrola OK. Smazány `node_modules/` (585 MB), `dist/` (31 MB), `.quasar/` a `.vscode/` (jen zástupný `settings.json` pluginu CodeGPT). Kontrola po smazání znovu OK. Odchylky od plánu:
- `tools/prevod_z_ssr.py` a `tools/galerie_z_vue.py` zůstaly v repu jako záznam převodu. Čtou z `dist/` a `src/`, takže bez checkoutu tagu `quasar-posledni` už nejdou spustit. README to u nich uvádí jednou odrážkou navíc.
- V Tasku 11 opraven příkaz soupisu cest jen v historii: srovnává se s tagem, ne s HEAD (viz tam).

---

## Task 9: Vizuální porovnání se SSR z master

**Krok 1:** Nejdřív ověřit, že port je volný: `curl -m 2 -s -o /dev/null -w "%{http_code}" http://localhost:8000/` musí skončit chybou spojení (`000`). Na tomto stroji je 8000 obsazený (2026-10-12), proto použij např. 8772. Vždy s `-m`: bez časového limitu `curl` na port, kde něco naslouchá a neodpovídá, visí donekonečna (stalo se v kontrole plánu na portu 8771). Pak `python -m http.server -d site 8000` na pozadí. Nasnímat 4 stránky na 1280 a 400 px stejně jako v Tasku 0. Porovnat se snímky v `.reference/` vedle sebe.

**Krok 2:** Rozdíly sepsat. Přijatelné jsou:
- prolínání karuselu místo `jump-left`,
- drobné posuny řádkování, které způsobilo `prettify` (mezery uvnitř inline prvků).

Nepřijatelné je chybějící obsah, rozbitá mřížka nebo jiné písmo. Mezery z `prettify` opravit ručně spojením řádků v daném místě. Detail písma ověřovat zvětšeným výřezem, ne zmenšeným celostránkovým snímkem.

**Krok 3:** Opravit, kontrola OK, commit `git commit -am "Vizuální doladění podle SSR z master"`. Server ukončit.

**Provedeno 2026-10-12:** snímky 4 stránek na 1280 a 400 px porovnány s `.reference/` po pixelech (práh 24 z 255, v překryvu výšek). Každý běh snímků měl čerstvý profil Chrome, viz past v Tasku 8.
- **Nalezeno a opraveno:** na Kontaktu chyběla `&nbsp;` mezi číslem a názvem místa (9 položek, převod ji ořízl, viz Task 7). Doplněno `&nbsp; ` před text. Kontakt na 1280 px je pak **pixelově shodný** s referencí (předtím 0,3 % rozdílných pixelů), na 400 px je mezera stejná jako v referenci. Totéž ořezání postihlo ve zdroji ještě koncovou `&nbsp;` za „Zajímavosti v okolí našeho apartmánu:“ na úvodní stránce. Stojí ale před `<br>`, takže je neviditelná, a zůstala neopravená. Jiné okrajové `&nbsp;` zdroj nemá (`git grep "&nbsp;" quasar-posledni -- src/pages src/components src/layouts`), vnitřní (`S&nbsp;přímým`, GPS, patička) převod zachoval.
- O apartmánu: shodná na 1280 i 400 px (0,0 %).
- Úvodní stránka 1280 px (19 %): jen jiný snímek karuselu a počítadla uprostřed animace. Levá šipka karuselu na referenci chybí jen zdánlivě: zdroj má `infinite`, takže v Quasaru existuje, a na referenci splývá se světlým pískem v obrázku. Na 400 px shodná až na počítadla.
- Galerie (29 % a 42 %): reference zachytila místo fotek spinnery (známé z Tasku 0), rozvržení sedí (3 sloupce na 1280, 1 na 400, popisky). Ve snímku galerie na 400 px občas chybí nadpis, záložky a ikona menu. Je to časování snímku, ne chyba stránky: s `--virtual-time-budget=12000` se písma vykreslí, a ve dvou bězích stejného obsahu se snímek liší stejně.
- Kontakt 400 px (30 %): rozdíl tvoří jen obrázky. Reference je ze SSR s desktopovým user-agentem, takže má desktopové obrázky ořezané na 400 px. Statická verze má pod 600 px záměrně mobilní varianty `-xs` (Task 7, krok 1).
- **Zbývá:** ověření na skutečném telefonu (menu, swipe karuselu a galerie). Nejjednodušší je to udělat, až bude web na veřejné adrese, na náhledu `lukas-jarda-projects.github.io/Sunset-web-w/` v Tasku 11, krok 10. Seznam míst na Kontaktu už telefon nepotřebuje, mezeru opravila změna výše.

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

**Krok 2:** Commit. Push je v pořádku, repo je do Tasku 11 soukromé a commity z Tasků 0–10 vyčištění historie stejně přepíše. Workflow ale do zapnutí Pages (Task 11, krok 10) selže na kroku ~~`deploy-pages`~~ `configure-pages` (`Get Pages site failed … Not Found`). To se očekává a není to chyba.

```
git add .github/workflows/pages.yml
git commit -m "Nasazení na GitHub Pages"
```

**Provedeno 2026-10-12:** `pages.yml` beze změny proti plánu, commit `a637b53`, pushnuto. Běh `38287832071`: checkout a **„Kontrola webu“ na Ubuntu prošly** (`OK: 0 chyb, 210 odkazů, web 18.7 MB`), `configure-pages` selhal na nezapnutých Pages (očekávané), zbytek přeskočen. Před pushem ověřeno, že Linux nebude mít problém s velikostí písmen: všech 203 odkazů na soubory webu v HTML a CSS (relativních i od kořene, bez externích a `data:`) sedí přesně na názvy na disku a názvy v gitu sedí s diskem 97/97. Repo má `core.ignorecase=true`, takže tyhle rozdíly by Windows neukázal. Každý další push do zapnutí Pages spustí workflow, který selže stejně (všechny běhy po `a637b53` jsou `failure`, viz `gh run list`). GitHub o nich může posílat e-maily.

---

## Task 11: Vyčištění historie a zveřejnění repa

**Předpoklad:** e-maily rozhodnuty (sekce „Rozhodnuto“, bod 1). **Nevratné na GitHubu** — force push přepíše všechny hashe.

**Ověřeno nanečisto 2026-10-12** na klonu tehdejšího `master` (168 commitů, včetně dvou commitů s plánem: `762968f` a `f40cae9`) ve scratchpadu. Soubory z archivu daly:
- 127 commitů (prázdné filter-repo vynechá), pack ~101,6 → 88,6 MiB,
- `overeni.sh`: 0 citlivých řetězců (předtím 125) a 0 cizích cest (předtím 130),
- současná verze plánu prošla filtrem beze změny (`cmp`),
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

Ověřit `git -C C:/work/archive/Sunset-web-w-pred-cistenim.git log --oneline | wc -l` ≥ 166. Bundle je pojistka pro lokální commity, které ještě nemusí být na GitHubu.

**Krok 2: nástroj.** `python -m pip install --user git-filter-repo`, ověřit `python -m git_filter_repo --version` (nanečisto: `a40bce548d2c`).

**Kroky 3–5: vstupy čištění leží MIMO repo** v `C:/work/archive/sunset-cisteni-historie/` (`cesty.txt`, `nahrady.txt`, `mailmap.txt`, `overeni.sh`, `README.md`). Samy obsahují řetězce, které se z historie odstraňují. Kdyby byly v plánu, zveřejnil by je plán sám a ověření by našlo samo sebe. První verze plánu je v repu měla (commit `762968f`). Proto `nahrady.txt` obsahuje i jejich escapované tvary, aby zmizely i z té verze plánu v historii.
- `cesty.txt`: `lib/`, `Jenkinsfile`, `install.log`, `.ijfw/`, drobné odpadní soubory, `Upravy Webu Sunset.txt`, `src/boot/sentry.js`, backend zrušeného formuláře, weby jiných klientů (`src/dorsys.cz/`, `src/gekon.cz/`, `src/jidelnasql.cz/`) a regexy na snímky systému jídelen v galerii a cizí loga a fotky v `src/assets/`.
- `nahrady.txt`: interní hostitelé a cesty serveru, port SSH a e-maily Jardy (→ `qwanap@gmail.com`).
- `mailmap.txt`: autoři commitů Jardy → `Jaroslav Povolný <qwanap@gmail.com>`.

Před ostrým během znovu projít soupis cest, které jsou jen v historii: `git -c core.quotepath=off log --all --format= --name-only | grep -v '^$' | sort -u` porovnat (`comm -23`) s `git -c core.quotepath=off ls-tree -r --name-only quasar-posledni | sort`. **Ne s `git ls-files`:** po Tasku 8 je celý Quasar projekt jen v historii a srovnání s HEAD dá 442 cest místo 182. Proti tagu vyšlo po Tasku 8 přesně 182 (změřeno 2026-10-12), tedy nic nového. Zkontrolovat, jestli od té doby nic nepřibylo. Nové soubory s citlivým obsahem doplnit do souborů v archivu, ne do plánu.

**Krok 6: spustit na čerstvém klonu.** Dvě pasti, obě ověřené nanečisto:
- klon z lokální cesty musí mít `--no-local`, jinak ho filter-repo odmítne jako „not a fresh clone“;
- globální `~/.gitconfig` obsahuje víceřádkové aliasy (`alias.i`), na kterých filter-repo spadne (`ValueError: dictionary update sequence element #55`). Proto se spouští s prázdnou globální konfigurací.

```
A=C:/work/archive/sunset-cisteni-historie
git clone --no-local C:/work/projects/Sunset-apartment.com C:/work/projects/Sunset-cisteni
cd C:/work/projects/Sunset-cisteni
: > "$A/prazdny.gitconfig"
GIT_CONFIG_GLOBAL="$A/prazdny.gitconfig" python -m git_filter_repo --invert-paths --paths-from-file "$A/cesty.txt" --replace-text "$A/nahrady.txt" --mailmap "$A/mailmap.txt"
```

Očekávané: `Completely finished after … seconds.`

**Krok 7: ověření.**

```
sh C:/work/archive/sunset-cisteni-historie/overeni.sh
python tools/kontrola.py
```

Očekávané: `overeni.sh` vypíše dvakrát `0` a kontrola `OK: 0 chyb`, protože filtr nesmí zasáhnout `site/`. Kontrola, že vzory fungují: na původní historii našel vzor cest nanečisto 130 cest.

**Provedeno 2026-10-12 (kroky 1–7, ostrý běh):**
- Krok 1: mirror `C:/work/archive/Sunset-web-w-pred-cistenim.git` má 185 commitů a master je v něm `aca86c0` s tagem `quasar-posledni`. Bundle `C:/work/archive/Sunset-web-w-lokalni.bundle` prošel `git bundle verify`, obsahuje master a tag.
- Krok 2: `git_filter_repo` `a40bce548d2c`. Soupis cest jen v historii proti tagu dal 182, tedy nic nového (viz kroky 3–5).
- Krok 6: klon `C:/work/projects/Sunset-cisteni` z `aca86c0`, filter-repo skončil exit 0 `Completely finished after 2.74 seconds.`
- Krok 7: `overeni.sh` **0 a 0**, kontrola `OK: 0 chyb, 210 odkazů, web 18.7 MB`. Výsledek: 144 commitů, pack 89,32 MiB, tag `quasar-posledni` přepsán s sebou. Strom HEAD je shodný s originálem (`125dc1b` v obou), takže filtr aktuální soubory nezměnil. Autoři: Jaroslav Povolný, Lukas a LukasWana s `qwanap@gmail.com`, `lukas-wana` (noreply), `OpenClaw Ad Radar`.
- **Krok 8 uživatel odsouhlasil 2026-10-12 večer** (provede se v další session).
- **Před krokem 8 kroky 6–7 zopakovat:** `Sunset-cisteni` smazat a vyčistit znovu z aktuálního `master`. Commity, které vznikly po `aca86c0` (tento zápis a předávka), v něm totiž nejsou a force push by je zahodil. Po opakování musí znovu vyjít 0 a 0, kontrola OK a shodný strom HEAD.

**Provedeno 2026-10-12 večer (kroky 6–9 znovu a ostře):**
- Kroky 6–7 zopakovány na čerstvém klonu `45017f9`: filter-repo exit 0, `overeni.sh` 0 a 0, kontrola OK, strom HEAD `76c9676` shodný. 148 commitů, pack 89,33 MiB. Nová záloha `C:/work/archive/Sunset-web-w-lokalni-45017f9.bundle` (verify OK), protože mirror a první bundle končí na `aca86c0`.
- Krok 8: force push spustil uživatel přes `!` (auto režim ho blokuje jako „Git Destructive“). `master` `45017f9` → `3ca9b62`, tag `quasar-posledni` `0090d78` → `2b22dba`.
- **Nález po force pushi:** GitHub dál vydával staré commity podle hashe (`gh api repos/…/commits/aca86c0` vrátil commit). Jejich hashe byly vidět v seznamu běhů Actions, takže po zveřejnění by šla otevřít celá stará historie. Navíc repo mělo aktivní **webhook na interní Jenkins Altisimy** (push a PR, poslední odpověď 500).
- **Rozhodnutí uživatele:** repo smazat a založit znovu, webhook tím zmizí. Uživatel přidal tokenu scope `delete_repo` (`gh auth refresh -s delete_repo`) a smazal repo (`gh repo delete`). Pak `gh repo create lukas-jarda-projects/Sunset-web-w --private --disable-wiki` a push `master` + tagu. Ověřeno: staré hashe vrací „No commit found“, `3ca9b62` existuje, 0 webhooků. `jasir` je admin organizace, takže ho nebylo potřeba přidávat. Ztratila se jen historie běhů Actions (samé `failure`) a datum založení repa (2021).
- Krok 9: složku `Sunset-apartment.com` nešlo přejmenovat, protože je pracovním adresářem běžící session („Device or resource busy“). Místo přejmenování se proto prohodily adresáře `.git`. Pracovní stromy byly shodné. Výsledek: `Sunset-apartment.com` = vyčištěné repo s `.reference/` a `tools/.venv/`, `Sunset-apartment.com-stare` = staré repo s **odebraným remote**, aby se stará historie nedala omylem pushnout zpět.

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

Pak v Settings → Pages → Source zvolit **GitHub Actions**. Spustit workflow (`gh workflow run Pages`) a ověřit náhled na `https://lukas-jarda-projects.github.io/Sunset-web-w/`: všechny 4 stránky, galerie, menu na mobilu. **Na skutečném telefonu** (zbylo z Tasku 9): menu, swipe karuselu a swipe v lightboxu galerie.

~~GitHub může mít staré commity ještě nějakou dobu v cache podle hashe. Úplné odstranění řeší podpora GitHubu („remove cached views“). Při 0 forcích a soukromém repu do této chvíle to riziko je malé.~~ Vyřešeno smazáním a novým založením repa (viz „Provedeno“ u kroku 8).

**Provedeno 2026-10-12 večer (krok 10):** zveřejnění spustil uživatel přes `!` (auto režim ho blokuje jako „Create Public Surface“). Pages zapnuté přes API: `gh api -X POST repos/lukas-jarda-projects/Sunset-web-w/pages -f build_type=workflow`, takže zdroj je GitHub Actions. Běh `38299222731` (`workflow_dispatch` na `162b7f0`) prošel všemi kroky včetně kontroly webu a `deploy-pages`. Náhled: `/`, `/about/`, `/contact/` a `/photo/` vrací 200, `/neexistuje` vrací 404 s vlastní stránkou („Stránka nenalezena – Sunset Apartment“). Skript ve scratchpadu prošel `href`, `src` a `srcset` ve všech stránkách náhledu: 84 interních odkazů, 0 chybných. Odkazy v CSS (`url()`) kontroluje jen `tools/kontrola.py` lokálně a na runneru. Workflow hlásí jen varování: Node 20 v akcích je zastaralý a od 19. 10. 2026 se `ubuntu-latest` přepne na Ubuntu 26. Nic z toho zatím nevadí. **Na skutečném telefonu zatím neověřeno.**

---

## Úprava: animace menu a galerie (2026-10-12 noc, na přání uživatele)

Uživatel chtěl, aby oranžové zvýraznění v menu přejíždělo z položky na položku. Po schválení prvního kroku chtěl podobné animace i v galerii.

- **Hlavní menu** (`site/css/web.css`): stránky jsou samostatná HTML, proto se použily View Transitions mezi dokumenty (`@view-transition { navigation: auto; types: stranka }`). Aktivní `.q-tab__indicator` má `view-transition-name: nav-indikator` a prohlížeč ho přesune na novou položku (0,35 s). Zbytek stránky se přepne okamžitě (`::view-transition-group(root)` bez animace, jen u typu `stranka`). Platí jen od 1024 px: na mobilu je menu po načtení zavřené a proužek by odjel mimo obraz. Podpora: Chrome a Edge od 126, Safari 18.2. Firefox přepne stránku bez animace.
- **Záložky galerie** (`web.js`, sekce Záložky): u svislého `tablist` vznikne `span.tab-indikator`, který se posouvá na vybranou záložku. Původní `box-shadow` zvýraznění zůstává, když JS neběží.
- **Fotky v mřížce:** objeví se postupně (vyjedou o 16 px a zesílí, s odstupem 60 ms, nejvýš 8 kroků), jakmile vjedou do pohledu. Po přepnutí záložky znovu. Skryté jsou jen přes třídu `js-odhal`, kterou přidává JS, takže bez JS je galerie vidět celá.
- **Detail (lightbox):** fotka přeletí z náhledu do lightboxu a při zavření zpět, i po přelistování na jinou fotku. Náhled mimo obraz se před zavřením posune do pohledu. Velká fotka se před přechodem dekóduje (nejdéle 1,5 s). Během přechodu má `html` třídu `vt-lokal`, která vypne jméno proužku hlavního menu, jinak by proužek vyskočil nad tmavé pozadí.
- **Listování:** stará fotka odjede o 48 px proti směru kroku a nová přijede (Web Animations). Funguje pro šipky, klávesy i swipe. Sousední fotky se přednačítají.
- Všechno se vypíná při `prefers-reduced-motion: reduce`.

**Ověřeno 2026-10-12:** headless Chrome 154 přes CDP, skript `vt_test.mjs` ve scratchpadu, na šířkách 1400 a 400 px. Přechod z úvodní stránky do galerie má typ `stranka` a jedinou skupinu `nav-indikator` (na 400 px přechod není, jak má být). Ukazatel záložek je za 150 ms v polovině cesty a pak skončí na `translateY(96px)`. Fotky přepnuté záložky jsou za 150 ms napůl průhledné a za 1 s všechny viditelné, na 400 px 11 ze 17. Otevření i zavření (i po přelistování přes začátek na poslední fotku) má skupinu `foto`. Listování za 80 ms ukazuje `opacity 0,73` a posun −13 px, smyčka přes začátek funguje. Po zavření nezůstalo žádné `view-transition-name` ani třída `vt-lokal`, chyby v konzoli 0. `tools/kontrola.py` = OK. Nasazeno commitem `facb4c1` (běh `38309950974` prošel) a týž test na živém náhledu `https://lukas-jarda-projects.github.io/Sunset-web-w/` na 1400 px dal stejné výsledky.
- **Neplatný pokus:** v okně Chrome přes rozšíření se přechody netestují, protože okno bylo na pozadí. Skrytý dokument přechod zruší („Document hidden“) a zmrazí i animace. Testovat jen headless (stránka je tam viditelná), nebo s oknem v popředí.
- **Past cache:** `location.reload()` v Chrome 154 načetl `web.js` znovu z cache (`deliveryType: cache`). Pomohl `fetch(url, {cache: 'reload'})` a pak reload, v CDP `Network.setCacheDisabled`. Pages posílá `max-age=600`, takže návštěvníci dostanou novou verzi nejpozději do 10 minut.

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

**Předpoklad:** náhled na `github.io` funguje (Task 11, krok 10), přístup do DNS u Váš Hosting má uživatel.

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

**Krok 1:** Po týdnu bez problémů řekne uživatel Robertovi (šéf Altisimy), aby zastavil a zakázal `sunset-apartment.com.service` a smazal složku webu na serveru (cesta je v historii v `package.json`, skript `deploy:prod`). Navíc ať smaže job webu v Jenkinsu Altisimy: webhook z GitHubu zmizel se smazáním repa 2026-10-12, ale job na jejich straně nejspíš zůstal.

**Krok 2:** Vrátit TTL na 3600. Smazat `C:/work/projects/Sunset-apartment.com-stare`. Zálohy v `C:/work/archive/` ponechat.

**Krok 3:** Plán označit jako dokončený a v `Stav` uvést hash posledního commitu a datum převodu.

---

## Předávka

```
Pokračuj v projektu C:\work\projects\Sunset-apartment.com podle plánu docs/plans/2026-10-12-staticky-web-github-pages.md (převod Quasar SSR webu na statické HTML na GitHub Pages, varianta B).
Skills: superpowers:executing-plans (plán má tasky s kontrolními body), superpowers:verification-before-completion (ověření DNS a curl v Tasku 13 mají přesné očekávané výstupy).

Stav (2026-10-12 večer): Tasky 0–11 hotové, z Tasku 11 chybí jen test na telefonu. Repo lukas-jarda-projects/Sunset-web-w je VEŘEJNÉ s vyčištěnou historií. Na GitHubu bylo smazáno a založeno znovu, protože po force pushi GitHub dál vydával staré commity podle hashe (podrobnosti u Tasku 11, „Provedeno“ u kroku 8). Pages běží z GitHub Actions, náhled je https://lukas-jarda-projects.github.io/Sunset-web-w/ (4 stránky 200, 404 vlastní, 84 interních odkazů bez chyby). python tools/kontrola.py = „OK: 0 chyb, 210 odkazů, web 18.7 MB“.
Navíc na přání uživatele hotové animace menu a galerie (sekce „Úprava: animace menu a galerie“ před Taskem 12), nasazené na Pages.
Pracovní kopie C:\work\projects\Sunset-apartment.com je vyčištěné repo. Staré repo je v C:\work\projects\Sunset-apartment.com-stare BEZ remote (aby se stará historie nedala pushnout zpět), smazat až v Tasku 14. Zálohy staré historie: C:/work/archive/Sunset-web-w-pred-cistenim.git (mirror do aca86c0) a C:/work/archive/Sunset-web-w-lokalni-45017f9.bundle.

Další kroky:
1. Uživatel 2026-10-12 hlásil „swipe na mobilu funguje“ (bez upřesnění, jestli karusel, lightbox, nebo obojí). Doptej se na menu, karusel a lightbox včetně nových animací galerie a výsledek zapiš do Tasku 11, krok 10.
2. Task 12: přidání domény v organizaci dělá uživatel v UI GitHubu, TXT záznam u Váš Hosting taky on. Ty ověříš nslookupem podle plánu.
3. Task 13 (přepnutí DNS): předem se zeptej, kdy to uživateli vyhovuje (HTTPS může do hodiny hlásit chybu certifikátu). IP adresy GitHubu ověř v aktuální dokumentaci.

Pozor:
- Auto režim blokuje force push, mazání repa i změnu viditelnosti. Takové příkazy dávej uživateli k spuštění přes ! a vždy na JEDEN řádek (zalomený příkaz se rozpadne).
- Token gh má od této session scope delete_repo. Uživatel ho VĚDOMĚ ponechal: stejný postup (vyčištění historie a nové založení repa) čeká projekt chatavpekle.cz. Neodebírat a nepřipomínat; odebrat (gh auth refresh -h github.com -r delete_repo) až po dokončení chatavpekle.cz.
- Do plánu ani commitů nepiš interní hostitele Altisimy. Vzory jsou v C:/work/archive/sunset-cisteni-historie/overeni.sh (mimo repo). Před commitem plánu je projdi grepem.
- Rozhodnuto uživatelem: DNS u Váš Hosting spravuje uživatel. Starý server a job v Jenkinsu Altisimy vypne Robert, uživatel mu to řekne (Task 14).
- Snímky headless Chromem: čerstvý --user-data-dir pro každý běh, mobil přes iframe 400 px, MSYS_NO_PATHCONV=1. Port 8000 je obsazený, náhled jde na 8772.
```

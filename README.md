# Sunset Apartment — web

Statický web https://sunset-apartment.com (GitHub Pages). Bez buildu, bez Node.

- `site/` — celý web; co je tady, to je online (po pushi do `master` nasadí `.github/workflows/pages.yml`)
- `tools/kontrola.py` — kontrola odkazů, obrázků a obsahu; spustit před každým pushem: `python tools/kontrola.py`
- `tools/prevod_z_ssr.py`, `tools/galerie_z_vue.py` — jednorázový převod z Quasaru, ze kterého `site/` vznikl; potřebují Quasar projekt z tagu `quasar-posledni`, dnes se nespouštějí
- `docs/plans/` — plány

## Úpravy
- Text: upravit přímo v `site/<stránka>/index.html`.
- Nová fotka do galerie: soubor do `site/statics/galerie/`, v `site/photo/index.html` do správného panelu přidat
  `<a href="../statics/galerie/X.jpg" class="gallery-item"><img src="../statics/galerie/X.jpg" alt="Popis" loading="lazy" class="gek-screenshots"><span class="gallery-caption" aria-hidden="true">Popis</span></a>`
  a v `tools/kontrola.py` zvýšit `FOTEK_V_GALERII`.
- Náhled lokálně: `python -m http.server -d site 8000` → http://localhost:8000 (když je port 8000 obsazený, zvol jiný)

Původní Quasar projekt je v historii gitu (poslední commit před převodem je označený tagem `quasar-posledni`).

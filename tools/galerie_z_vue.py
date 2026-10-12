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

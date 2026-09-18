# Build Fix - Node Sass Compatibility Issue

## Problém

Build webových stranek selhával s chybou:

```
Node Sass does not yet support your current environment: Windows 64-bit with Unsupported runtime (137)
```

**Příčina:** Starý `node-sass` v4.14.1 nepodporuje Node.js 22 (runtime 137).

## Řešení

### 1. Instalace Dart Sass

Do `package.json` přidány dependencies:

```json
"devDependencies": {
  "sass": "^1.32.13",
  "sass-loader": "^10.1.1"
}
```

### 2. Override transitive dependency

Do `package.json` přidán `resolutions` blok pro přepsání `node-sass` z `@quasar/app`:

```json
"resolutions": {
  "@quasar/app/node-sass": "npm:sass@^1.32.13"
}
```

### 3. Odstranění problematického pluginu

`@quasar/quasar-ui-qmediaplayer` má SASS syntax error s Dart Sass. Odstraněn z:

**package.json:**
- `dependencies`: `@quasar/quasar-ui-qmediaplayer`
- `devDependencies`: `@quasar/quasar-app-extension-qmediaplayer`

**quasar.extensions.json:**
- Odstraněn záznam `"@quasar/qmediaplayer": {}`

### 4. Čistá instalace

```bash
rm -r node_modules
yarn install --ignore-optional
```

## Výsledek

Build nyní proběhne úspěšně:

```bash
yarn build:ssr
```

Výstup: `dist/ssr`

## Čas buildu

~185 sekund (SSR mode)

## Poznámky

- Dart Sass je oficiální náhrada za node-sass
- Node Sass je deprecated a není udržován
- Warningy při buildu (deprecation) jsou očekávané pro starší Quasar v1

---

# Dev Fix - OpenSSL 3 vs. webpack 4 (MD4)

## Problém

`quasar dev` (alias `qdev`) i `quasar build` na novém Node (zde v24) padají na:

```
Error: error:0308010C:digital envelope routines::unsupported
```

**Příčina:** Quasar 1 stojí na webpacku 4, který hashuje přes MD4. OpenSSL 3 (Node 17+)
MD4 zakázal, takže hashování skončí chybou. Netýká se to jen výstupních názvů souborů —
MD4 volají i loadery (babel-loader, vue-loader), proto `cfg.output.hashFunction = "sha256"`
v `quasar.conf.js` **problém nevyřeší** (ověřeno: build projde, ale zůstane 10 chyb z loaderů).

## Řešení

`scripts/quasar-legacy.js` spouští Quasar CLI s `NODE_OPTIONS=--openssl-legacy-provider`,
napojeno v `package.json`:

```bash
yarn dev        # SPA dev server (http://localhost:8081)
yarn dev:ssr    # dev server v SSR režimu, jak běží produkce
```

**Proč legacy provider, a ne náhrada hashovacího algoritmu:** patch `crypto.createHash`
nebo `output.hashFunction` sice chybu odstraní, ale změní hashe v názvech chunků — build
pak přestane být bajtově shodný s tím, co běží v produkci. Legacy provider MD4 zachová.

Alias `qdev` volá `yarn quasar dev` napřímo, takže wrapper obejde. Buď používej `yarn dev`,
nebo si alias uprav na:

```bash
alias qdev="NODE_OPTIONS=--openssl-legacy-provider yarn quasar dev"
```

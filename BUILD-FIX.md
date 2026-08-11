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

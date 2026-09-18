/**
 * Spousti Quasar CLI s --openssl-legacy-provider.
 *
 * Proc: Quasar 1 stoji na webpacku 4, ktery hashuje pres MD4. OpenSSL 3 (Node 17+)
 * MD4 zakazal, takze `quasar dev` i `quasar build` na novem Node padnou na
 * "error:0308010C:digital envelope routines::unsupported".
 *
 * Proc zrovna takto: nahradit MD4 jinym algoritmem (cfg.output.hashFunction nebo
 * patch crypto.createHash) sice chybu odstrani, ale zmeni hashe v nazvech chunku,
 * takze vysledny build prestane byt bajtove shodny s tim, co bezi v produkci.
 * Legacy provider MD4 zachova, a tim i identicky vystup.
 *
 * Pouziti: node scripts/quasar-legacy.js dev
 *          node scripts/quasar-legacy.js build --mode ssr
 */
const { spawn } = require('child_process')
const path = require('path')

const quasarBin = path.join(__dirname, '..', 'node_modules', '@quasar', 'app', 'bin', 'quasar')
const nodeOptions = [process.env.NODE_OPTIONS, '--openssl-legacy-provider']
  .filter(Boolean)
  .join(' ')

const child = spawn(process.execPath, [quasarBin, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: nodeOptions }
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code === null ? 1 : code)
})

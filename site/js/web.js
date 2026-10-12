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

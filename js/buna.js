(function () {
  'use strict';
  var d = document, H = d.documentElement;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var plata = function (n) { return n == null ? null : '$' + Number(n).toLocaleString('es-AR'); };
  var celu = matchMedia('(max-width: 767px)');
  var granoSvg = function (cls) { return '<svg class="' + cls + '" viewBox="580 334 280 418" aria-hidden="true"><path d="' + window.GRANO_D + '" fill="currentColor" fill-rule="evenodd"/></svg>'; };
  var toastEl = $('[data-toast]'), tt;
  var toast = function (m) { toastEl.textContent = m; toastEl.classList.add('ve'); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove('ve'); }, 2600); };

  var heroEl = $('[data-hero]');
  $$('.hA-titulo .ml>span').forEach(function (s, i) { s.style.setProperty('--d', i); });
  $$('.hA-acciones>*').forEach(function (s, i) { s.style.setProperty('--d', i + 2); });

  /* ---------------- intro: el grano se estampa y viaja al ventanal ---------------- */
  function arrancarHero() { heroEl.classList.add('entra'); setTimeout(function () { heroEl.classList.add('abierta'); }, 250); }
  (function intro() {
    var el = $('#intro');
    if (!H.classList.contains('con-intro')) { el && el.remove(); arrancarHero(); return; }
    $$('.intro-letras span').forEach(function (s, i) { s.style.setProperty('--i', i); });
    var foto = $('.hA-fachada');
    var salon = $('[data-ventana] img');
    var lista = function (im) { return new Promise(function (r) { var dec = function () { (im.decode ? im.decode() : Promise.resolve()).then(r, r); }; if (im.complete) dec(); else { im.onload = dec; im.onerror = r; } }); };
    var esperas = [d.fonts ? d.fonts.ready : null, lista(foto), lista(salon)];
    Promise.race([Promise.all(esperas), new Promise(function (r) { setTimeout(r, 1600); })]).then(function () {
      el.classList.add('va');
      setTimeout(volar, celu.matches ? 1050 : 1250);
    });
    function volar() {
      var g = $('.intro-grano', el), dest = $('[data-intro-target]', heroEl);
      var a = g.getBoundingClientRect(), b = dest.getBoundingClientRect();
      var v = g.cloneNode(true); v.classList.add('intro-volador'); v.classList.remove('intro-grano');
      v.style.cssText = 'left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px;opacity:1';
      d.body.appendChild(v); g.style.visibility = 'hidden';
      el.classList.add('sale'); H.classList.add('vuela'); H.classList.remove('con-intro');
      setTimeout(function () { H.classList.remove('vuela'); }, 680);
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        v.style.transform = 'translate(' + (b.left - a.left) + 'px,' + (b.top - a.top) + 'px) scale(' + (b.width / a.width) + ',' + (b.height / a.height) + ')';
        v.style.color = '#fff';
      }); });
      setTimeout(arrancarHero, 380);
      setTimeout(function () { v.remove(); el.remove(); }, 900);
    }
  })();

  /* ---------------- hero: la página entra por la ventana ---------------- */
  (function () {
    var esc_ = $('[data-escena]'), ven = $('[data-ventana]'), top = $('.hA-top'), acc = $('.hA-acciones'), tk = $('.hA-takeaway');
    var raf = 0, grande = false, base = null, fach = $('.hA-fachada'), reja = $('.hA-reja'), grn = $('.hA-grano');


    var medir = function () {
      esc_.style.transform = '';
      var eb = esc_.getBoundingClientRect(), vb = ven.getBoundingClientRect(), sy = scrollY;
      var fy = .4; // la llegada encuadra el mostrador, no la mesa de adelante
      base = { ox: vb.left + vb.width / 2 - eb.left, oy: vb.top + vb.height * fy - eb.top,
        k: Math.max(innerWidth / vb.width, innerHeight / vb.height) * 1.3,
        cx: innerWidth / 2 - (vb.left + vb.width / 2), cy: innerHeight / 2 - (vb.top + vb.height * fy + sy - heroEl.offsetTop) };
      esc_.style.setProperty('--ox', base.ox + 'px'); esc_.style.setProperty('--oy', base.oy + 'px');
    };
    var pintar = function () {
      raf = 0;
      if (!grande && scrollY > 10) { grande = true; var vi = $('img', ven); vi.sizes = '100vw'; vi.srcset = vi.dataset.grande; }
      var total = heroEl.offsetHeight - innerHeight;
      var p = Math.min(1, Math.max(0, (scrollY - heroEl.offsetTop) / total));
      if (!base) medir();
      var e = p * p * (3 - 2 * p);
      esc_.style.transform = p > 0 ? 'translate(' + (base.cx * e) + 'px,' + (base.cy * e) + 'px) scale(' + (1 + (base.k - 1) * e * e) + ')' : '';
      var fd = Math.max(0, Math.min(1, 1 - (e - .72) / .2));
      fach.style.opacity = fd; reja.style.opacity = fd; grn.style.opacity = heroEl.classList.contains('entra') ? fd : '';
      var f = Math.max(0, 1 - p * 3);
      top.style.opacity = acc.style.opacity = f;
      acc.style.visibility = f < .05 ? 'hidden' : '';
      tk.style.opacity = heroEl.classList.contains('abierta') ? f : '';
      top.style.transform = 'translateY(' + (-40 * (1 - f)) + 'px)';
    };
    addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(pintar); }, { passive: true });
    var ancho = innerWidth;
    addEventListener('resize', function () { if (innerWidth === ancho) return; ancho = innerWidth; base = null; pintar(); });
  })();

  /* ---------------- navegación: aparece pasando el hero ---------------- */
  var navLinks = $$('.nav-granos a');
  var secciones = ['tarjeta', 'carta', 'grano', 'barrio', 'locales'];
  var navOn = function () {
    var fin = heroEl.offsetTop + heroEl.offsetHeight - innerHeight * .6;
    d.body.classList.toggle('nav-on', scrollY > fin);
    var cur = 'inicio';
    secciones.forEach(function (id) { var s = d.getElementById(id); if (s && s.getBoundingClientRect().top < innerHeight * .5) cur = id; });
    navLinks.forEach(function (a) { a.classList.toggle('activo', a.getAttribute('href') === '#' + cur); });
  };
  addEventListener('scroll', navOn, { passive: true }); navOn();

  /* ---------------- entradas: se estampan ---------------- */
  $('[data-tarjeta]').classList.add('sellable');
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }); }, { threshold: .18 });
  var observar = function (r) { $$('.sellable:not(.visto)', r).forEach(function (s) { io.observe(s); }); };
  observar();

  /* la píldora del panel se esconde en el celu mientras el hero o la tarjeta están en pantalla */
  var vis = {};
  var ioP = new IntersectionObserver(function (es) { es.forEach(function (e) { vis[e.target.id || 'hero'] = e.isIntersecting; }); H.classList.toggle('pill-oculta', celu.matches && (vis.hero || vis.tarjeta)); }, { threshold: .05 });
  ioP.observe(heroEl); ioP.observe($('#tarjeta'));

  /* ---------------- datos de la carta (se completan con el kit) ---------------- */
  var PROD = {};
  var precioTxt = function (p) { return p && p.precio != null ? plata(p.precio) : 'A confirmar'; };
  var foto = function (p, chica) { return p && (chica ? (p.miniatura || p.foto) : p.foto); };

  /* ---------------- WOW: la tarjeta de sellos ---------------- */
  var SELLOS = ['espresso', 'doppio', 'cortado', 'magic', 'flat-white', 'latte', 'capuccino', 'lagrima', 'flat-white-frio'];
  var NOMBRES = { 'espresso': 'Espresso', 'doppio': 'Doppio', 'cortado': 'Cortado', 'magic': 'Magic', 'flat-white': 'Flat white', 'latte': 'Latte', 'capuccino': 'Capuccino', 'lagrima': 'Lágrima', 'flat-white-frio': 'Flat white frío' };
  var FOTOS = { 'espresso': 'p-espresso', 'doppio': 'p-doppio', 'cortado': 'p-cortado', 'magic': 'p-magic', 'flat-white': 'p-flatwhite', 'latte': 'p-latte', 'capuccino': 'p-capuccino', 'lagrima': 'p-lagrima', 'flat-white-frio': 'p-frio' };
  var grilla = $('[data-grilla]'), ficha = $('[data-ficha]'), cuenta = $('[data-cuenta]'), premio = $('[data-premio]');
  var sellados = {}, elegido = null;
  SELLOS.forEach(function (id, i) {
    var b = d.createElement('button');
    b.type = 'button'; b.className = 'slot' + (i === 0 ? ' invita' : ''); b.setAttribute('role', 'listitem');
    b.setAttribute('aria-label', 'Sellar ' + NOMBRES[id]); b.dataset.id = id;
    b.innerHTML = '<img src="img/p/' + FOTOS[id] + '-240.webp" alt="" width="240" height="240" loading="lazy" decoding="async">' + granoSvg('s-grano') + '<span class="s-nom">' + NOMBRES[id] + '</span>';
    grilla.appendChild(b);
  });
  var cup = d.createElement('div');
  cup.className = 'slot slot-premio'; cup.setAttribute('role', 'listitem'); cup.setAttribute('aria-label', 'Décimo sello: café gratis');
  cup.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 24h34v14a13 13 0 0 1-13 13h-8A13 13 0 0 1 12 38z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M46 28h4a6 6 0 0 1 0 12h-5" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 10c-3 4 3 6 0 10M30 8c-3 4 3 6 0 10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg><span class="s-nom">¡Café gratis!</span>';
  grilla.appendChild(cup);
  grilla.appendChild(premio);
  var pintarFicha = function () {
    if (!elegido) return;
    var p = PROD[elegido] || {};
    $('[data-f-img]').src = 'img/p/' + FOTOS[elegido] + '-600.webp'; $('[data-f-img]').alt = NOMBRES[elegido];
    $('[data-f-nombre]').textContent = p.nombre || NOMBRES[elegido];
    $('[data-f-desc]').textContent = p.descripcion || '';
    var pr = $('[data-f-precio]'); pr.textContent = precioTxt(p); pr.classList.toggle('conf', !p.precio);
  };
  grilla.addEventListener('click', function (e) {
    var b = e.target.closest('.slot[data-id]'); if (!b) return;
    var sug = $('.t-ficha-sug'); sug && sug.remove();
    $$('.slot', grilla).forEach(function (s) { s.classList.remove('elegido', 'invita'); });
    b.classList.add('elegido');
    if (!sellados[b.dataset.id]) { sellados[b.dataset.id] = 1; b.classList.add('sellado'); }
    var n = Object.keys(sellados).length; cuenta.textContent = n;
    elegido = b.dataset.id; pintarFicha();
    ficha.classList.add('llena'); ficha.classList.remove('cambia'); void ficha.offsetWidth; ficha.classList.add('cambia');
    if (n === SELLOS.length) { cup.classList.add('lleno'); setTimeout(function () { premio.hidden = false; }, 650); }
  });
  // de entrada la ficha ya muestra un café sugerido (sin sellar)
  elegido = 'flat-white'; pintarFicha(); ficha.classList.add('llena');
  $('.t-info', ficha).insertAdjacentHTML('afterbegin', '<span class="t-ficha-sug">el de la casa</span>');
  $('[data-reiniciar]').addEventListener('click', function () {
    sellados = {}; cuenta.textContent = 0; premio.hidden = true; cup.classList.remove('lleno');
    $$('.slot', grilla).forEach(function (s) { s.classList.remove('sellado', 'elegido'); });
  });
  $('[data-sumar]').addEventListener('click', function (e) {
    if (!elegido) return;
    if (window.KIT && KIT.carrito) KIT.carrito.agregar(elegido, 1, { origen: e.currentTarget });
    toast((PROD[elegido] ? PROD[elegido].nombre : NOMBRES[elegido]) + ' sumado a tu pedido');
  });

  /* ---------------- LA VIDRIERA ---------------- */
  // el punto (tiene foto) viaja pegado a la última palabra: nunca queda solo en un renglón
  var nombreConPunto = function (p) {
    var n = esc(p.nombre); if (!p.foto) return n;
    var k = n.lastIndexOf(' ');
    return n.slice(0, k + 1) + '<span style="white-space:nowrap">' + n.slice(k + 1) + '<i class="punto" aria-hidden="true"></i></span>';
  };
  var HOJAS = [
    [['cafeteria'], ['bolleria'], ['frios', 'combos', 'bebidas']],
    [['dulces', 'sintacc'], ['budines'], ['salados']]
  ];
  var BAJADAS = { cafeteria: 'A temperatura barista', bolleria: 'Recién horneada', frios: 'Para el calor', combos: 'Para empezar el día', dulces: 'Del mostrador', budines: 'Para acompañar el café', salados: 'Prensados y ciabattas', sintacc: 'Aptos celíacos', bebidas: 'Sin y con alcohol' };
  var PLATO = { cafeteria: 'p-flatwhite', bolleria: 'p-croissant', frios: 'p-frio', combos: 'p-combo', dulces: 'p-chocotorta', budines: 'p-alfajor', salados: 'p-ciabatta', sintacc: 'p-brownie', bebidas: 'p-gintonic' };
  var CHIPS = [{ id: 'cafeteria' }, { id: 'bolleria' }, { id: 'dulces' }, { id: 'budines' }, { id: 'salados' }, { id: 'otros', nombre: 'Fríos, combos y más', cats: ['frios', 'combos', 'bebidas', 'sintacc'] }];
  var hojaAct = 0, chipAct = 'cafeteria';
  var qty = function (id) { return '<span data-kit-qty="' + esc(id) + '"></span>'; };
  var item = function (p) {
    var conPrecio = p.precio != null;
    return '<li class="it' + (p.disponible === false ? ' off' : '') + '"' + (p.foto ? ' data-foto="' + esc(p.miniatura || p.foto) + '"' : '') + '>' +
      '<div class="it-txt"' + (p.descripcion ? ' data-desc="' + esc(p.descripcion) + '"' : '') + '><span class="it-n">' + nombreConPunto(p) + '</span></div>' +
      '<span class="it-p' + (conPrecio ? '' : ' conf') + '">' + (conPrecio ? plata(p.precio) : 'a confirmar') + '</span>' +
      (p.disponible === false ? '<span class="it-p conf">sin stock</span>' : qty(p.id)) + '</li>';
  };
  var bloque = function (cat, prods, sub) {
    var it = prods.filter(function (p) { return p.categoria === cat.id; });
    if (!it.length) return '';
    return '<div class="' + (sub ? 'col-sub' : '') + '"><div class="col-cab">' + (sub ? '' : '<div class="plato"><img src="img/p/' + PLATO[cat.id] + '-240.webp" data-def="img/p/' + PLATO[cat.id] + '-240.webp" alt="" width="240" height="240" loading="lazy"></div>') +
      '<div class="col-tit"><h3>' + esc(cat.nombre) + '</h3><small data-def="' + esc(BAJADAS[cat.id] || '') + '">' + esc(BAJADAS[cat.id] || '') + '</small></div></div><ul class="items">' + it.map(item).join('') + '</ul></div>';
  };
  var pintarVidriera = function (cats, prods) {
    var catDe = function (id) { return cats.filter(function (c) { return c.id === id; })[0]; };
    var hojas = $('[data-hojas]');
    hojas.innerHTML = HOJAS.map(function (cols, i) {
      return '<div class="hoja' + (i === hojaAct ? ' on' : '') + '" role="tabpanel" aria-hidden="' + (i !== hojaAct) + '">' + cols.map(function (ids) {
        return '<div class="estante-col">' + ids.map(function (id, j) { var c = catDe(id); return c ? bloque(c, prods, j > 0) : ''; }).join('') + '</div>';
      }).join('') + '</div>';
    }).join('');
    $$('.hoja', hojas).forEach(function (h, i) { h.inert = i !== hojaAct; });
    var tiene = function (id) { return catDe(id) && prods.some(function (p) { return p.categoria === id; }); };
    var chips = CHIPS.map(function (c) { return { id: c.id, nombre: c.nombre || (catDe(c.id) || {}).nombre, cats: (c.cats || [c.id]).filter(tiene) }; }).filter(function (c) { return c.cats.length; });
    if (!chips.some(function (c) { return c.id === chipAct; })) chipAct = chips[0].id;
    $('[data-chips]').innerHTML = chips.map(function (c) { return '<button role="tab" class="chip' + (c.id === chipAct ? ' on' : '') + '" aria-selected="' + (c.id === chipAct) + '" data-c="' + c.id + '">' + esc(c.nombre) + '</button>'; }).join('');
    var celuEl = $('[data-celu]');
    celuEl.innerHTML = chips.map(function (c) { return '<div class="pila' + (c.id === chipAct ? ' on' : '') + '" data-c="' + c.id + '"><div class="estante-col">' + c.cats.map(function (id, j) { return bloque(catDe(id), prods, j > 0); }).join('') + '</div></div>'; }).join('');
    $$('.pila', celuEl).forEach(function (p) { p.inert = !p.classList.contains('on'); });
    igualarHojas();
  };
  // las dos hojas de desktop miden lo mismo: cambiar de hoja no empuja nada
  var anchoFijado = 0;
  var igualarHojas = function () {
    var v = $('[data-hojas]'); if (!v || !v.offsetParent) return;
    v.style.minHeight = '';
    var h = Math.max.apply(null, $$('.hoja', v).map(function (x) { return x.offsetHeight; }));
    v.style.minHeight = Math.ceil(h) + 'px'; anchoFijado = innerWidth;
  };
  var fijarAlto = igualarHojas;
  addEventListener('resize', function () { if (innerWidth !== anchoFijado) igualarHojas(); });
  if (d.fonts) d.fonts.ready.then(function () { igualarHojas(); });
  $$('.vid-tab').forEach(function (b) {
    b.addEventListener('click', function () {
      hojaAct = +b.dataset.h;
      $$('.vid-tab').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
      $$('[data-hojas] .hoja').forEach(function (h, i) { var on = i === hojaAct; h.classList.toggle('on', on); h.classList.toggle('cambia', on); h.setAttribute('aria-hidden', !on); h.inert = !on; });
    });
  });
  $('[data-chips]').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return; chipAct = b.dataset.c;
    $$('[data-chips] .chip').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
    $$('[data-celu] .pila').forEach(function (p) { var on = p.dataset.c === chipAct; p.classList.toggle('on', on); p.classList.toggle('cambia', on); p.inert = !on; });
    var fila = $('[data-chips]'); fila.scrollTo({ left: b.offsetLeft - (fila.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' });
    var r = fila.getBoundingClientRect(); if (r.top < 0) scrollTo({ top: scrollY + r.top - 16, behavior: 'smooth' });
  });
  // pasar el mouse por un plato con foto la muestra en el plato de su estante
  var rafF = 0;
  $('[data-hojas]').addEventListener('pointerover', function (e) {
    if (e.pointerType !== 'mouse') return;
    var li = e.target.closest('.it'); var col = e.target.closest('.estante-col'); if (!col) return;
    var img = $('.plato img', col); if (!img) return;
    var sm = $('.col-tit small', col), tx = li && $('.it-txt', li);
    if (sm) sm.textContent = tx && tx.dataset.desc ? tx.dataset.desc : sm.dataset.def;
    var src = li && li.dataset.foto ? li.dataset.foto : img.dataset.def;
    if (img.getAttribute('src') === src) return;
    cancelAnimationFrame(rafF);
    rafF = requestAnimationFrame(function () { img.src = src; img.classList.remove('cambia'); void img.offsetWidth; img.classList.add('cambia'); });
  });

  // al sacar el mouse de un estante, vuelve su encabezado y su foto de siempre
  $('[data-hojas]').addEventListener('pointerout', function (e) {
    var col = e.target.closest('.estante-col'); if (!col || (e.relatedTarget && col.contains(e.relatedTarget))) return;
    $$('.col-tit small', col).forEach(function (sm) { if (sm.dataset.def != null) sm.textContent = sm.dataset.def; });
    var img = $('.plato img', col); if (img && img.getAttribute('src') !== img.dataset.def) { cancelAnimationFrame(rafF); img.src = img.dataset.def; img.classList.remove('cambia'); void img.offsetWidth; img.classList.add('cambia'); }
  });
  // los chips del celu arrancan desde el primero, con su margen
  var filaChips = $('[data-chips]'); if (filaChips) { filaChips.scrollLeft = 0; addEventListener('load', function () { filaChips.scrollLeft = 0; }); }

  /* ---------------- CAFÉ EN GRANO ---------------- */
  var MOL = {};
  var pintarGrano = function (prods) {
    var bolsas = prods.filter(function (p) { return p.categoria === 'grano'; });
    var lata = prods.filter(function (p) { return p.id === 'cafe-lata'; })[0];
    var gr = function (n) { var s = ''; for (var i = 1; i <= 3; i++) s += granoSvg(i <= n ? 'on' : ''); return s; };
    var html = bolsas.map(function (p) {
      var mol = (p.opciones || [])[0], sel = MOL[p.id] || (mol ? mol.valores[0].id : '');
      return '<article class="bolsa sellable"><figure class="bolsa-foto"><img src="' + esc(p.miniatura || p.foto) + '" srcset="' + esc(p.miniatura) + ' 300w, ' + esc(p.foto) + ' 600w" sizes="(min-width: 900px) 280px, 78vw" alt="Bolsa de café ' + esc(p.nombre) + '" width="300" height="476" loading="lazy"></figure>' +
        '<div class="bolsa-info"><h3>' + esc(p.nombre) + '</h3><p class="notas">' + esc(p.descripcion || '') + '</p>' +
        '<dl class="ficha-bolsa"><dt>Región</dt><dd>' + esc(p.region || '') + '</dd><dt>Altura</dt><dd>' + esc(p.altura || '') + '</dd><dt>Varietal</dt><dd>' + esc(p.varietal || '') + '</dd><dt>Proceso</dt><dd>' + esc(p.proceso || '') + '</dd></dl>' +
        '<p class="intens">Intensidad ' + gr(p.intensidad || 0) + '</p>' +
        (mol ? '<div class="moliendas" role="radiogroup" aria-label="Molienda de ' + esc(p.nombre) + '">' + mol.valores.slice(0, 4).map(function (v) { return '<button type="button" role="radio" class="mol' + (v.id === sel ? ' on' : '') + '" aria-checked="' + (v.id === sel) + '" data-p="' + p.id + '" data-v="' + v.id + '">' + esc(v.nombre) + '</button>'; }).join('') + '</div>' : '') +
        '<div class="bolsa-pie"><span class="p">' + (p.precio != null ? '<b>' + plata(p.precio) + '</b>' : 'Precio a confirmar') + '</span><button type="button" class="btn-sumar" data-bolsa="' + p.id + '">Encargar</button></div></div></article>';
    }).join('');
    if (lata) html += '<article class="bolsa sellable"><figure class="bolsa-foto"><img src="img/p/g-lata-300.webp" alt="Café frío en lata de Buna" width="300" height="336" loading="lazy" style="object-position:50% 40%"></figure>' +
      '<div class="bolsa-info"><h3>' + esc(lata.nombre) + '</h3><p class="notas">' + esc(lata.descripcion || '') + '</p>' +
      '<div class="moliendas" role="radiogroup" aria-label="Sabor">' + (lata.opciones[0].valores.map(function (v, i) { var sel = (MOL['cafe-lata'] || 'latte') === v.id; return '<button type="button" role="radio" class="mol' + (sel ? ' on' : '') + '" aria-checked="' + sel + '" data-p="cafe-lata" data-v="' + v.id + '">' + esc(v.nombre) + '</button>'; }).join('')) + '</div>' +
      '<div class="bolsa-pie"><span class="p">' + (lata.precio != null ? '<b>' + plata(lata.precio) + '</b>' : 'Precio a confirmar') + '</span><button type="button" class="btn-sumar" data-bolsa="cafe-lata">Sumar</button></div></div></article>';
    $('[data-estante]').innerHTML = html;
    observar($('[data-estante]'));
  };
  $('[data-estante]').addEventListener('click', function (e) {
    var m = e.target.closest('.mol');
    if (m) {
      MOL[m.dataset.p] = m.dataset.v;
      $$('.mol[data-p="' + m.dataset.p + '"]').forEach(function (x) { var on = x === m; x.classList.toggle('on', on); x.setAttribute('aria-checked', on); });
      return;
    }
    var b = e.target.closest('[data-bolsa]'); if (!b || !window.KIT) return;
    var id = b.dataset.bolsa, p = PROD[id], g = p && p.opciones && p.opciones[0];
    var opc = {}; if (g) opc[g.id] = MOL[id] || g.valores[0].id;
    KIT.carrito.agregar(id, 1, { origen: b, opc: opc });
    toast(p.nombre + ' sumado a tu pedido');
  });

  var GRANO = [];
  document.addEventListener('kit:carta', function (e) {
    if (!e.detail || !e.detail.el) return;
    var prods = e.detail.productos || [];
    prods.forEach(function (p) { PROD[p.id] = p; });
    if (e.detail.el.id === 'grano-datos') { GRANO = prods; pintarGrano(GRANO.concat(PROD['cafe-lata'] ? [PROD['cafe-lata']] : [])); return; }
    if (e.detail.el.id !== 'carta-datos') return;
    var cats = e.detail.visibles || e.detail.categorias || [];
    pintarVidriera(cats, prods);
    if (GRANO.length) pintarGrano(GRANO.concat(PROD['cafe-lata'] ? [PROD['cafe-lata']] : []));
    pintarFicha();
    observar();
    if (window.KIT && KIT.carrito) { KIT.carrito.sync(d); requestAnimationFrame(function () { KIT.carrito.sync(d); fijarAlto(); }); }
  });

  /* ---------------- contador del pedido ---------------- */
  var contar = function () {
    var n = ((window.KIT && KIT.carrito && KIT.carrito.lineas) || []).reduce(function (a, l) { return a + (l.cant || 0); }, 0);
    $$('[data-n]').forEach(function (b) { b.textContent = n; });
  };
  d.addEventListener('kit:carrito', contar);

  /* ---------------- los dos Buna ---------------- */
  var SEDES = { urquiza: { ll: [-34.57943, -58.49059], n: 'Villa Urquiza' }, martinez: { ll: [-34.48819, -58.50027], n: 'Martínez' } };
  var estados = function () {
    if (!window.KIT) return;
    var suc = (KIT.config && KIT.config.sucursales) || [];
    suc.forEach(function (s) {
      var el = $('[data-sede="' + s.id + '"] [data-estado]'); if (!el) return;
      var st = KIT.abierto(s.horarios);
      el.textContent = st.abierto ? 'Abierto ahora · cierra a las ' + st.cierra + ' hs' : (st.abre ? 'Cerrado · abre a las ' + st.abre + ' hs' : 'Cerrado por hoy');
      el.classList.toggle('abierto', !!st.abierto);
    });
  };
  $$('[data-ir-carta]').forEach(function (b) {
    b.addEventListener('click', function () {
      var s = b.dataset.kitSucursal; if (window.KIT && KIT.carrito) KIT.carrito.setSucursal(s);
      toast('Retirás en ' + SEDES[s].n + '. Elegí lo tuyo en la vidriera.');
      $('#carta').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  var mapaListo = false;
  var mapa = function () {
    if (mapaListo || !window.L) return; mapaListo = true;
    var el = $('[data-mapa]');
    var m = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true, dragging: !L.Browser.mobile, tap: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 18, subdomains: 'abcd', attribution: '© OpenStreetMap · © CARTO' }).addTo(m);
    var icono = L.divIcon({ className: 'pin', html: '<svg viewBox="0 0 46 62" aria-hidden="true"><path d="M23 61C23 61 3 36 3 22a20 20 0 0 1 40 0c0 14-20 39-20 39z" fill="#2E6A5D"/><g transform="translate(13.5 8) scale(.068)" fill="#EEEDE9"><path transform="translate(-586 -340)" d="' + window.GRANO_D + '" fill-rule="evenodd"/></g></svg>', iconSize: [46, 62] });
    var b = [];
    Object.keys(SEDES).forEach(function (k) {
      var s = SEDES[k]; b.push(s.ll);
      L.marker(s.ll, { icon: icono, title: 'Buna ' + s.n, keyboard: false }).addTo(m).bindTooltip('Buna ' + s.n, { permanent: true, direction: 'top', offset: [0, -60], className: 'pin-et' });
    });
    var encuadrar = function () { m.invalidateSize(); m.fitBounds(b, { paddingTopLeft: [40, 110], paddingBottomRight: [40, 40] }); };
    encuadrar(); setTimeout(encuadrar, 400);
    $$('[data-ver]').forEach(function (bt) { bt.addEventListener('click', function () { var s = SEDES[bt.dataset.ver]; el.scrollIntoView({ behavior: 'smooth', block: 'center' }); m.flyTo(s.ll, 16, { duration: 1.2 }); }); });
  };
  var ioM = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { var t = setInterval(function () { if (window.L) { clearInterval(t); mapa(); } }, 120); ioM.disconnect(); } }, { rootMargin: '300px' });
  ioM.observe($('[data-mapa]'));

  /* ---------------- popup de la feria ---------------- */
  var pop = $('[data-feria]'), ultimo = null, scrollGuardado = 0;
  var abrirPop = function () {
    ultimo = d.activeElement; pop.hidden = false; H.classList.add('pop-abierto');
    scrollGuardado = scrollY; d.body.style.position = 'fixed'; d.body.style.top = -scrollGuardado + 'px'; d.body.style.width = '100%';
    setTimeout(function () { var i = $('input', pop); i && i.focus(); }, 60);
  };
  var cerrarPop = function () {
    pop.hidden = true; H.classList.remove('pop-abierto');
    d.body.style.position = ''; d.body.style.top = ''; d.body.style.width = ''; scrollTo(0, scrollGuardado);
    ultimo && ultimo.focus && ultimo.focus();
  };
  $('[data-abrir-feria]').addEventListener('click', abrirPop);
  $('[data-cerrar]', pop).addEventListener('click', cerrarPop);
  pop.addEventListener('click', function (e) { if (e.target === pop) cerrarPop(); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) cerrarPop(); });
  $('[data-form-feria]').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.currentTarget, ok = f.nombre.value.trim() && f.emp.value.trim() && f.tel.value.trim();
    $('[data-error]', pop).hidden = !!ok; if (!ok) return;
    try { var l = JSON.parse(localStorage.getItem('buna-feria') || '[]'); l.push({ nombre: f.nombre.value, emp: f.emp.value, rubro: f.rubro.value, ig: f.ig.value, tel: f.tel.value, fecha: new Date().toISOString() }); localStorage.setItem('buna-feria', JSON.stringify(l)); } catch (_) {}
    f.hidden = true; $('[data-ok]', pop).hidden = false;
  });

  addEventListener('buna:kit', function () { contar(); estados(); setInterval(estados, 60000); if (window.KIT && KIT.carrito) KIT.carrito.sync(d); });
})();

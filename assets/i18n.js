/* ============== IDIOMAS (PT · ES · EN) ==============
   Cada idioma tem seus próprios endereços: /…  (PT), /es/…  e /en/…
   As páginas já chegam traduzidas (geradas por ferramentas/gerar-paginas.mjs a partir de fonte/);
   o idioma da página é o do <html lang>. Este script cuida do que é montado por JavaScript
   (vitrine, páginas de projeto, avaliações, controles) e do seletor PT · ES · EN.

   Marcação no HTML:
     data-i18n="chave"                texto simples (textContent)
     data-i18n="chave" data-i18n-rico  texto com destaque: [[gradiente]] e **negrito**
     data-i18n-attr="attr:chave;..."  atributos (aria-label, alt, title, placeholder, content…)
     data-i18n-wa="chave"             link do WhatsApp: troca só o texto da mensagem
     data-idioma="pt|es|en"           botões do seletor: abrem a mesma página no outro idioma
   Links internos no formato antigo (index.html, vitrine.html, modelos.html, projetos/<slug>.html)
   viram o endereço limpo do idioma atual. Nenhuma tradução é inserida como HTML. */
(function () {
  'use strict';

  var IDIOMAS = ['pt', 'es', 'en'];
  var ATRIBUTO_LANG = { pt: 'pt-BR', es: 'es', en: 'en' };
  var TEXTOS = window.I18N_TEXTOS || {};
  var ouvintes = [];

  function valido(l) { return IDIOMAS.indexOf(l) >= 0 ? l : null; }
  var atual = valido(String(document.documentElement.lang || '').slice(0, 2).toLowerCase()) || 'pt';

  // ---------- Textos ----------
  function t(chave, vars) {
    var v = (TEXTOS[atual] || {})[chave];
    if (v == null) v = (TEXTOS.pt || {})[chave];
    if (v == null) { if (window.console) console.warn('i18n: chave sem texto', chave); v = chave; }
    if (vars) v = v.replace(/\{(\w+)\}/g, function (_, n) { return vars[n] != null ? vars[n] : ''; });
    return v;
  }
  // Campo de dados com versões por idioma: { pt: '…', es: '…', en: '…' } ou texto único.
  function tx(valor) {
    if (valor == null) return '';
    if (typeof valor !== 'object') return String(valor);
    return valor[atual] != null ? valor[atual] : (valor.pt != null ? valor.pt : '');
  }

  // [[x]] → <span class="gradient">x</span>; **x** → <strong>x</strong>; o resto é texto.
  function preencherRico(el, texto) {
    while (el.firstChild) el.removeChild(el.firstChild);
    var re = /\[\[(.+?)\]\]|\*\*(.+?)\*\*/g, i = 0, m;
    while ((m = re.exec(texto))) {
      if (m.index > i) el.appendChild(document.createTextNode(texto.slice(i, m.index)));
      var n = document.createElement(m[1] != null ? 'span' : 'strong');
      if (m[1] != null) n.className = 'gradient';
      n.textContent = m[1] != null ? m[1] : m[2];
      el.appendChild(n);
      i = re.lastIndex;
    }
    if (i < texto.length) el.appendChild(document.createTextNode(texto.slice(i)));
  }

  // ---------- Endereços ----------
  function prefixo(l) { return l === 'pt' ? '/' : '/' + l + '/'; }

  // Link interno no formato antigo → endereço limpo no idioma atual. O resto não muda.
  function url(href) {
    if (!href || /^(https?:|mailto:|tel:|#|javascript:|data:)/i.test(href)) return href;
    var hash = '', q = '', i = href.indexOf('#');
    if (i >= 0) { hash = href.slice(i); href = href.slice(0, i); }
    i = href.indexOf('?');
    if (i >= 0) { q = href.slice(i + 1); href = href.slice(0, i); }
    var p = href.replace(/^(\.\.\/|\.\/|\/)+/, ''), m, logico;
    if (p === 'index.html') logico = '';
    else if (p === 'vitrine.html') logico = 'vitrine/';
    else if (p === 'modelos.html') logico = 'modelos/';
    else if ((m = /^projetos\/([\w-]+)\.html$/.exec(p))) logico = 'projetos/' + m[1] + '/';
    else return href + (q ? '?' + q : '') + hash;
    var params = new URLSearchParams(q);
    params.delete('lang');
    var s = params.toString();
    return prefixo(atual) + logico + (s ? '?' + s : '') + hash;
  }

  // Seção visível no momento (para abrir o outro idioma no mesmo ponto da página).
  function secaoAtual() {
    if (location.hash) return location.hash;
    if (window.scrollY < 80) return '';
    var achada = '', linha = window.innerHeight * 0.3;
    [].forEach.call(document.querySelectorAll('main section[id], footer[id]'), function (s) {
      if (s.getBoundingClientRect().top <= linha) achada = '#' + s.id;
    });
    return achada;
  }

  // Mesma página em outro idioma: /projetos/tacobons/ → /es/projetos/tacobons/
  function equivalente(l) {
    var caminho = location.pathname.replace(/^\/(es|en)(?=\/|$)/, '').replace(/index\.html$/, '');
    if (caminho.charAt(0) !== '/') caminho = '/' + caminho;
    var params = new URLSearchParams(location.search);
    params.delete('lang');
    var s = params.toString();
    return prefixo(l) + caminho.slice(1) + (s ? '?' + s : '') + secaoAtual();
  }

  // ---------- Aplicação (conteúdo montado por JavaScript) ----------
  function original(el) { return el.__i18nOriginal || (el.__i18nOriginal = {}); }

  function aplicar(raiz) {
    raiz = raiz || document;
    var lista = function (sel) {
      var itens = [].slice.call(raiz.querySelectorAll(sel));
      if (raiz !== document && raiz.matches && raiz.matches(sel)) itens.unshift(raiz);
      return itens;
    };

    if (atual !== 'pt') {
      lista('[data-i18n]').forEach(function (el) {
        var v = t(el.getAttribute('data-i18n'));
        if (el.hasAttribute('data-i18n-rico')) preencherRico(el, v); else el.textContent = v;
      });

      lista('[data-i18n-attr]').forEach(function (el) {
        el.getAttribute('data-i18n-attr').split(';').forEach(function (par) {
          var p = par.split(':'), attr = (p[0] || '').trim(), chave = (p[1] || '').trim();
          if (attr && chave) el.setAttribute(attr, t(chave));
        });
      });

      lista('[data-i18n-wa]').forEach(function (el) {
        var o = original(el);
        if (!o.wa) o.wa = el.getAttribute('href');
        var base = o.wa.split('?')[0];
        el.setAttribute('href', base + '?text=' + encodeURIComponent(t(el.getAttribute('data-i18n-wa'))));
      });
    }

    lista('a[href]').forEach(function (a) {
      var novo = url(a.getAttribute('href'));
      if (novo !== a.getAttribute('href')) a.setAttribute('href', novo);
    });

    [].forEach.call(document.querySelectorAll('[data-idioma]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-idioma') === atual));
    });
  }

  function mudar(l) {
    l = valido(l);
    if (!l || l === atual) return;
    location.href = equivalente(l);
  }

  // ---------- Início ----------
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-idioma]');
    if (b) { ev.preventDefault(); mudar(b.getAttribute('data-idioma')); }
  });

  document.documentElement.lang = ATRIBUTO_LANG[atual];
  aplicar(document);

  window.I18N = {
    get idioma() { return atual; },
    t: t,
    tx: tx,
    url: url,
    equivalente: equivalente,
    aplicar: aplicar,
    mudar: mudar,
    // O idioma muda abrindo outro endereço; mantido para os scripts que se registram aqui.
    aoMudar: function (fn) { ouvintes.push(fn); }
  };
})();

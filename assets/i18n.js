/* ============== IDIOMAS (PT · ES · EN) ==============
   Português é o texto escrito no HTML (e continua legível se este script falhar).
   ES e EN vêm de assets/i18n-textos.js.

   Prioridade: ?lang= na URL  >  escolha salva no navegador  >  português.
   Exceção: ao usar Voltar/Avançar do navegador, vale a última escolha salva
   (evita que um endereço antigo com ?lang= desfaça a escolha feita depois).

   Marcação no HTML:
     data-i18n="chave"                texto simples (textContent)
     data-i18n="chave" data-i18n-rico  texto com destaque: [[gradiente]] e **negrito**
     data-i18n-attr="attr:chave;..."  atributos (aria-label, alt, title, placeholder, content…)
     data-i18n-wa="chave"             link do WhatsApp: troca só o texto da mensagem
     data-idioma="pt|es|en"           botões do seletor
   Links internos para páginas .html recebem ?lang= automaticamente.
   Nenhuma tradução é inserida como HTML. */
(function () {
  'use strict';

  var IDIOMAS = ['pt', 'es', 'en'];
  var ATRIBUTO_LANG = { pt: 'pt-BR', es: 'es', en: 'en' };
  var CHAVE_SALVA = 'angelicadigital-idioma';
  var TEXTOS = window.I18N_TEXTOS || {};
  var ouvintes = [];

  function valido(l) { return IDIOMAS.indexOf(l) >= 0 ? l : null; }
  function lerSalvo() { try { return valido(localStorage.getItem(CHAVE_SALVA)); } catch (e) { return null; } }
  function salvar(l) { try { localStorage.setItem(CHAVE_SALVA, l); } catch (e) { /* navegador sem armazenamento */ } }
  function daUrl() { try { return valido(new URLSearchParams(location.search).get('lang')); } catch (e) { return null; } }
  function voltouPeloHistorico() {
    try { var n = performance.getEntriesByType('navigation')[0]; return !!n && n.type === 'back_forward'; } catch (e) { return false; }
  }
  function resolver() {
    var url = daUrl(), salvo = lerSalvo();
    if (url && !(voltouPeloHistorico() && salvo)) return url;
    return salvo || 'pt';
  }

  var atual = resolver();

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

  // ---------- Links internos ----------
  function url(href) {
    if (!href || /^(https?:|mailto:|tel:|#|javascript:|data:)/i.test(href)) return href;
    var hash = '', q = '', i = href.indexOf('#');
    if (i >= 0) { hash = href.slice(i); href = href.slice(0, i); }
    i = href.indexOf('?');
    if (i >= 0) { q = href.slice(i + 1); href = href.slice(0, i); }
    if (!/\.html$/i.test(href)) return href + (q ? '?' + q : '') + hash;
    var p = new URLSearchParams(q);
    if (atual === 'pt') p.delete('lang'); else p.set('lang', atual);
    var s = p.toString();
    return href + (s ? '?' + s : '') + hash;
  }

  // ---------- Aplicação no documento ----------
  function original(el) { return el.__i18nOriginal || (el.__i18nOriginal = {}); }

  function aplicar(raiz) {
    raiz = raiz || document;
    var lista = function (sel) {
      var itens = [].slice.call(raiz.querySelectorAll(sel));
      if (raiz !== document && raiz.matches && raiz.matches(sel)) itens.unshift(raiz);
      return itens;
    };

    lista('[data-i18n]').forEach(function (el) {
      var o = original(el);
      if (!o.nos) o.nos = [].map.call(el.childNodes, function (n) { return n.cloneNode(true); });
      if (atual === 'pt') {
        while (el.firstChild) el.removeChild(el.firstChild);
        o.nos.forEach(function (n) { el.appendChild(n.cloneNode(true)); });
      } else {
        var v = t(el.getAttribute('data-i18n'));
        if (el.hasAttribute('data-i18n-rico')) preencherRico(el, v); else el.textContent = v;
      }
    });

    lista('[data-i18n-attr]').forEach(function (el) {
      var o = original(el);
      el.getAttribute('data-i18n-attr').split(';').forEach(function (par) {
        var p = par.split(':'), attr = (p[0] || '').trim(), chave = (p[1] || '').trim();
        if (!attr || !chave) return;
        if (!(('@' + attr) in o)) o['@' + attr] = el.getAttribute(attr);
        el.setAttribute(attr, atual === 'pt' && o['@' + attr] != null ? o['@' + attr] : t(chave));
      });
    });

    lista('[data-i18n-wa]').forEach(function (el) {
      var o = original(el);
      if (!o.wa) o.wa = el.getAttribute('href');
      if (atual === 'pt') { el.setAttribute('href', o.wa); return; }
      var base = o.wa.split('?')[0];
      el.setAttribute('href', base + '?text=' + encodeURIComponent(t(el.getAttribute('data-i18n-wa'))));
    });

    lista('a[href]').forEach(function (a) {
      var o = original(a);
      if (!o.href) o.href = a.getAttribute('href');
      var novo = url(o.href);
      if (novo !== a.getAttribute('href')) a.setAttribute('href', novo);
    });

    document.documentElement.lang = ATRIBUTO_LANG[atual];
    [].forEach.call(document.querySelectorAll('[data-idioma]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-idioma') === atual));
    });
  }

  function atualizarEndereco() {
    try {
      var p = new URLSearchParams(location.search);
      if (atual === 'pt') p.delete('lang'); else p.set('lang', atual);
      var s = p.toString();
      history.replaceState(history.state, '', location.pathname + (s ? '?' + s : '') + location.hash);
    } catch (e) { /* sem history API */ }
  }

  function mudar(l, opcoes) {
    l = valido(l);
    if (!l) return;
    if (!(opcoes && opcoes.semSalvar)) salvar(l);
    if (l === atual) { aplicar(document); atualizarEndereco(); return; }
    atual = l;
    aplicar(document);
    atualizarEndereco();
    ouvintes.forEach(function (fn) { try { fn(atual); } catch (e) { if (window.console) console.error(e); } });
  }

  // ---------- Início ----------
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-idioma]');
    if (b) { ev.preventDefault(); mudar(b.getAttribute('data-idioma')); }
  });

  // Página restaurada do cache de Voltar/Avançar: reaplica a última escolha salva.
  window.addEventListener('pageshow', function (ev) {
    var salvo = lerSalvo();
    if (ev.persisted && salvo && salvo !== atual) mudar(salvo, { semSalvar: true });
  });

  aplicar(document);
  // Voltou pelo histórico com um ?lang= antigo: o endereço passa a refletir a escolha salva.
  if (daUrl() && daUrl() !== atual) atualizarEndereco();
  document.documentElement.classList.remove('i18n-pendente');

  window.I18N = {
    get idioma() { return atual; },
    t: t,
    tx: tx,
    url: url,
    aplicar: aplicar,
    mudar: mudar,
    aoMudar: function (fn) { ouvintes.push(fn); }
  };
})();

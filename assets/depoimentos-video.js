/* ============== DEPOIMENTOS EM VÍDEO ==============
   Coloque aqui SOMENTE depoimentos reais, com autorização por escrito do cliente.
   Lista vazia = a área de vídeos não aparece na página e nada é baixado.

   Formato de cada item:
   {
     cliente: 'Nome autorizado',
     negocio: 'Nome do negócio',
     servico: 'Site',                       // ou 'Perfil da Empresa no Google', 'Site e Perfil…', etc.
     resumo:  'Resumo curto, em texto, do que o cliente disse no vídeo.',
     capa:    'assets/videos/cliente-capa.webp', // quadro do próprio vídeo (obrigatório)
     video:   'assets/videos/cliente.mp4',       // MP4 H.264 + AAC: funciona em qualquer celular
     // youtube: 'ID_DO_VIDEO',                  // alternativa a "video" (vídeo não listado no YouTube)
     legendas: 'assets/videos/cliente.vtt',      // opcional, recomendado
     vertical: true                              // opcional: vídeo gravado em pé (9:16)
   }

   Idiomas: "servico" e "resumo" podem ser texto único ou { pt, es, en }; o nome do cliente
   e o negócio não se traduzem. Rótulos da interface vêm de window.I18N.

   O primeiro item fica em destaque; os demais viram miniaturas. Clicar numa miniatura
   leva aquele vídeo para o destaque. Nenhum vídeo toca sozinho: só depois do clique.
*/
var DEPOIMENTOS_VIDEO = [];

(function () {
  'use strict';

  var area = document.getElementById('depoimentos-video');
  if (!area) return;
  var destaque = area.querySelector('.depo-videos__destaque');
  var miniaturas = area.querySelector('.depo-videos__miniaturas');
  var lista = [];
  var atual = 0;
  var I = window.I18N || {
    t: function (k, v) {
      var s = ((window.I18N_TEXTOS || {}).pt || {})[k] || k;
      return v ? s.replace(/\{(\w+)\}/g, function (_, n) { return v[n] != null ? v[n] : ''; }) : s;
    },
    tx: function (v) { return v && typeof v === 'object' ? v.pt : v; },
    aoMudar: function () {}
  };

  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto != null) e.textContent = texto;
    return e;
  }

  function valido(d) {
    return d && d.cliente && d.negocio && d.servico && d.resumo && d.capa && (d.video || d.youtube);
  }

  // Troca a capa pelo player, só depois do clique.
  function tocar(d, moldura) {
    moldura.textContent = '';
    if (d.youtube) {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(d.youtube) + '?autoplay=1&rel=0&playsinline=1';
      f.title = I.t('video.player', { nome: d.cliente });
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      moldura.appendChild(f);
      return;
    }
    var v = document.createElement('video');
    v.controls = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.preload = 'auto';
    v.poster = d.capa;
    v.src = d.video;
    v.setAttribute('aria-label', I.t('video.player', { nome: d.cliente }));
    if (d.legendas) {
      var t = document.createElement('track');
      t.kind = 'captions'; t.srclang = 'pt'; t.label = I.t('video.legendas'); t.src = d.legendas;
      v.appendChild(t);
    }
    moldura.appendChild(v);
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* o usuário pode tocar pelos controles */ });
  }

  function montarDestaque(i) {
    var d = lista[i];
    destaque.textContent = '';

    var moldura = el('div', 'depo-videos__player' + (d.vertical ? ' depo-videos__player--vertical' : ''));
    var capa = el('button', 'depo-videos__capa');
    capa.type = 'button';
    capa.setAttribute('aria-label', I.t('video.assistir', { nome: d.cliente, negocio: d.negocio }));
    var img = el('img');
    img.src = d.capa; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
    capa.appendChild(img);
    var play = el('span', 'depo-videos__play');
    play.setAttribute('aria-hidden', 'true');
    play.innerHTML = '<i class="fa-solid fa-play"></i>';
    capa.appendChild(play);
    capa.addEventListener('click', function () { tocar(d, moldura); });
    moldura.appendChild(capa);

    var info = el('div', 'depo-videos__info');
    info.appendChild(el('span', 'depo-videos__servico', I.tx(d.servico)));
    info.appendChild(el('strong', 'depo-videos__cliente', d.cliente));
    info.appendChild(el('span', 'depo-videos__negocio', d.negocio));
    var resumo = el('p', 'depo-videos__resumo');
    resumo.appendChild(el('span', 'depo-videos__resumo-rotulo', I.t('video.resumo')));
    resumo.appendChild(document.createTextNode(I.tx(d.resumo)));
    info.appendChild(resumo);

    destaque.appendChild(moldura);
    destaque.appendChild(info);
  }

  function montarMiniaturas() {
    miniaturas.textContent = '';
    if (lista.length < 2) { miniaturas.hidden = true; return; }
    miniaturas.hidden = false;
    lista.forEach(function (d, i) {
      var li = el('li');
      var b = el('button', 'depo-videos__mini');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(i === atual));
      b.setAttribute('aria-label', I.t('video.mostrar', { nome: d.cliente, negocio: d.negocio }));
      var img = el('img');
      img.src = d.capa; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
      b.appendChild(img);
      var txt = el('span', 'depo-videos__mini-texto');
      txt.appendChild(el('strong', null, d.cliente));
      txt.appendChild(el('span', null, I.tx(d.servico)));
      b.appendChild(txt);
      b.addEventListener('click', function () {
        if (i === atual) return;
        atual = i;
        montarDestaque(i);            // remove o player anterior, que para de tocar
        montarMiniaturas();
        destaque.scrollIntoView({ block: 'nearest' });
      });
      li.appendChild(b);
      miniaturas.appendChild(li);
    });
  }

  function montar(itens) {
    lista = (itens || []).filter(valido);
    atual = 0;
    if (!lista.length) { area.hidden = true; return; }
    area.hidden = false;
    montarDestaque(0);
    montarMiniaturas();
  }

  // Exposto para testes locais; a página usa apenas a lista acima.
  window.DepoimentosVideo = { montar: montar };
  montar(DEPOIMENTOS_VIDEO);
  // Troca de idioma: remonta só se houver vídeos (o player em reprodução é recriado).
  I.aoMudar(function () { if (lista.length) { montarDestaque(atual); montarMiniaturas(); } });
})();

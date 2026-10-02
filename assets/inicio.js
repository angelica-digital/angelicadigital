/* ============== INÍCIO — COMPORTAMENTO ==============
   Linha do tempo das animações (todas desativadas com prefers-reduced-motion):

   Ao carregar a página
     0,00 s  rótulo "Criação de sites · Perfil…" sobe e aparece (0,75 s)
     0,09 s  título
     0,20 s  texto de apoio
     0,29 s  linha de idiomas
     0,37 s  botões "Ver projetos" / "Falar sobre meu negócio"
     0,52 s  navegador com o site da Tacobons entra da direita (0,95 s)
     0,78 s  imagem do Perfil no Google (inteira, sem rolagem) sobe da esquerda, abaixo do site (0,9 s)
     0,92 s  celular sobe por baixo (0,9 s)
     1,15 s  legenda do projeto (Tacobons, entregas, "Ver projeto")
     1,30 s  etiqueta "Site"
     1,60 s  um reflexo de luz atravessa a tela do navegador uma única vez (1,3 s)
     1,70 s  imagem do Perfil passa a flutuar devagar (±6 px, ciclo de 6 s);
             só roda enquanto o palco está visível na tela

   Durante a rolagem
     - Computador (> 760 px): as três camadas do palco se deslocam em velocidades diferentes
       (até ~36 px), criando profundidade. No celular fica desligado.
     - Ao chegar à entrada da vitrine: a linha de luz se estende a partir do centro (1,2 s),
       depois rótulo, título, texto e botão sobem em sequência, e as três cartas se abrem em leque.
*/
(function () {
  'use strict';

  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)');
  var computador = window.matchMedia('(min-width: 761px)');

  // ---------- Menu do celular ----------
  var botao = document.querySelector('.menu-botao');
  var menu = document.getElementById('menu-principal');
  if (botao && menu) {
    var fechar = function () {
      menu.classList.remove('aberto');
      botao.setAttribute('aria-expanded', 'false');
      botao.querySelector('i').className = 'fa-solid fa-bars';
    };
    botao.addEventListener('click', function () {
      var abrir = !menu.classList.contains('aberto');
      menu.classList.toggle('aberto', abrir);
      botao.setAttribute('aria-expanded', String(abrir));
      botao.querySelector('i').className = abrir ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fechar(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) { fechar(); botao.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('aberto') && !e.target.closest('.cabecalho')) fechar();
    });
    computador.addEventListener('change', fechar);
  }

  // ---------- Revelar ao rolar ----------
  var itens = document.querySelectorAll('.revela');
  if (reduzir.matches || !('IntersectionObserver' in window)) {
    itens.forEach(function (el) { el.classList.add('visivel'); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
    itens.forEach(function (el) { obs.observe(el); });
  }


  // ---------- Seção 3: controles dos três celulares (Criação de sites) ----------
  // Computador: os três ficam visíveis e só o destaque muda. Celular (faixa com rolagem):
  // as setas levam a faixa até o aparelho; deslizar também atualiza o ativo.
  // Automático começa desligado; troca a cada 5 s e fica suspenso com o mouse ou o foco no painel,
  // com a seção fora da tela ou a aba em segundo plano. Nunca move a rolagem vertical da página.
  (function () {
    var painel = document.querySelector('.sites-cel');
    if (!painel) return;
    var lista = painel.querySelector('.sites-cel__lista');
    var itens = [].slice.call(lista.querySelectorAll('.site-cel'));
    var bAnt = painel.querySelector('[data-cel="anterior"]');
    var bPlay = painel.querySelector('[data-cel="play"]');
    var bProx = painel.querySelector('[data-cel="proximo"]');
    var chave = painel.querySelector('[data-cel="auto"]');
    var aviso = painel.querySelector('.sites-cel__aviso');
    var T = function (k, v) { return window.I18N ? window.I18N.t(k, v) : k; };
    var INTERVALO = 5000;
    var ativo = 1;                 // Meraki começa em destaque
    var tocando = false;           // reprodução ligada (pode estar suspensa)
    var sobre = false, focado = false, visivel = false;
    var relogio = null, porCodigo = false, fimRolagem = null;

    var faixa = function () { return lista.scrollWidth > lista.clientWidth + 2; };

    function marcar(i, anunciar) {
      ativo = (i + itens.length) % itens.length;
      itens.forEach(function (li, k) {
        li.classList.toggle('ativo', k === ativo);
        var a = li.querySelector('a');
        if (k === ativo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      if (anunciar) {
        aviso.textContent = T('serv.cel.status', { nome: itens[ativo].querySelector('.site-cel__nome').textContent, n: ativo + 1, total: itens.length });
      }
    }

    function levarFaixa(i) {
      if (!faixa()) return;
      porCodigo = true;
      clearTimeout(fimRolagem);
      fimRolagem = setTimeout(function () { porCodigo = false; }, 900);
      var alvo = itens[i].offsetLeft - parseFloat(getComputedStyle(lista).scrollPaddingLeft || 0) - lista.offsetLeft;
      lista.scrollTo({ left: Math.max(0, alvo), behavior: reduzir.matches ? 'auto' : 'smooth' });
    }

    function ir(i, anunciar) { marcar(i, anunciar); levarFaixa(ativo); }

    function rotulos() {
      var k = tocando ? 'serv.cel.pausar' : 'serv.cel.reproduzir';
      bPlay.setAttribute('aria-label', T(k));
      bPlay.querySelector('i').className = tocando ? 'fa-solid fa-pause' : 'fa-solid fa-play';
      bPlay.setAttribute('aria-pressed', String(tocando));
    }

    function podeRodar() { return tocando && chave.checked && !sobre && !focado && visivel && !document.hidden && !reduzir.matches; }
    function agendar() {
      clearInterval(relogio); relogio = null;
      if (podeRodar()) relogio = setInterval(function () { ir(ativo + 1, false); }, INTERVALO);
    }
    function tocar(sim) { tocando = sim; rotulos(); agendar(); }
    function pausarPorInteracao() { if (tocando) tocar(false); }

    bAnt.addEventListener('click', function () { pausarPorInteracao(); ir(ativo - 1, true); });
    bProx.addEventListener('click', function () { pausarPorInteracao(); ir(ativo + 1, true); });
    bPlay.addEventListener('click', function () {
      if (reduzir.matches) return;
      if (!chave.checked) chave.checked = true;   // reproduzir liga o automático
      tocar(!tocando);
    });
    chave.addEventListener('change', function () { tocar(chave.checked); });

    // Deslizar a faixa: atualiza o ativo e pausa a reprodução (só quando foi a pessoa que deslizou).
    var espera = null;
    lista.addEventListener('scroll', function () {
      if (!faixa()) return;
      clearTimeout(espera);
      espera = setTimeout(function () {
        var base = lista.scrollLeft + parseFloat(getComputedStyle(lista).scrollPaddingLeft || 0);
        var melhor = 0, dist = Infinity;
        itens.forEach(function (li, k) {
          var d = Math.abs(li.offsetLeft - lista.offsetLeft - base);
          if (d < dist) { dist = d; melhor = k; }
        });
        if (!porCodigo) { pausarPorInteracao(); marcar(melhor, false); }
      }, 120);
    }, { passive: true });

    // Ao deslizar, não abrir o link do aparelho sem querer.
    var inicioX = 0, arrastou = false;
    lista.addEventListener('pointerdown', function (e) { inicioX = e.clientX; arrastou = false; });
    lista.addEventListener('pointermove', function (e) { if (Math.abs(e.clientX - inicioX) > 10) arrastou = true; });
    lista.addEventListener('click', function (e) { if (arrastou) { e.preventDefault(); arrastou = false; } }, true);

    painel.addEventListener('mouseenter', function () { sobre = true; agendar(); });
    painel.addEventListener('mouseleave', function () { sobre = false; agendar(); });
    painel.addEventListener('focusin', function () { focado = true; agendar(); });
    painel.addEventListener('focusout', function (e) { if (!painel.contains(e.relatedTarget)) { focado = false; agendar(); } });
    document.addEventListener('visibilitychange', agendar);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visivel = en[0].isIntersecting; agendar(); }, { threshold: 0.35 }).observe(painel);
    } else { visivel = true; }

    // Movimento reduzido: automático fica desligado e indisponível; setas mudam sem animação.
    function aplicarReduzido() {
      var r = reduzir.matches;
      chave.disabled = r;
      if (r) { chave.checked = false; tocar(false); bPlay.setAttribute('aria-disabled', 'true'); }
      else bPlay.removeAttribute('aria-disabled');
    }
    reduzir.addEventListener('change', aplicarReduzido);

    if (window.I18N) window.I18N.aoMudar(rotulos);
    marcar(ativo, false);
    rotulos();
    aplicarReduzido();
    // No celular a faixa começa no primeiro aparelho; o ativo acompanha o que está à vista.
    if (faixa()) marcar(0, false);
  })();

  // ---------- Portfólio: destaque por toque nos três cartões do leque ----------
  // Mesmo visual do hover do computador enquanto o dedo está no cartão. Não bloqueia a rolagem
  // (ouvintes passivos, sem preventDefault) nem atrasa a navegação: o link abre com um toque.
  (function () {
    var trio = document.querySelector('.trio');
    if (!trio) return;
    var ativo = null, x0 = 0, y0 = 0;
    function limpar() { if (ativo) { ativo.classList.remove('tocando'); ativo = null; } }
    trio.addEventListener('touchstart', function (e) {
      var item = e.target.closest('.trio__item');
      if (!item || e.touches.length > 1) { limpar(); return; }
      limpar();
      ativo = item; ativo.classList.add('tocando');
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    trio.addEventListener('touchmove', function (e) {
      if (!ativo) return;
      var t = e.touches[0];
      if (Math.abs(t.clientX - x0) > 10 || Math.abs(t.clientY - y0) > 10) limpar();  // virou rolagem
    }, { passive: true });
    trio.addEventListener('touchend', limpar, { passive: true });
    trio.addEventListener('touchcancel', limpar, { passive: true });
    window.addEventListener('scroll', limpar, { passive: true });
    window.addEventListener('pageshow', limpar);   // volta pelo histórico (cache de página)
    window.addEventListener('pagehide', limpar);
  })();

  // ---------- Palco: pausa fora da tela e profundidade na rolagem ----------
  var palco = document.querySelector('.palco');
  if (!palco) return;

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      palco.classList.toggle('em-cena', entradas[0].isIntersecting);
    }).observe(palco);
  } else {
    palco.classList.add('em-cena');
  }

  var camadas = palco.querySelectorAll('.camada[data-profundidade]');
  var agendado = false;

  function aplicar() {
    agendado = false;
    var ativo = computador.matches && !reduzir.matches;
    var r = palco.getBoundingClientRect();
    var altura = window.innerHeight || 1;
    // -1 quando o palco está abaixo do centro da tela, +1 quando está acima
    var p = Math.max(-1, Math.min(1, (altura / 2 - (r.top + r.height / 2)) / altura));
    camadas.forEach(function (c) {
      var d = ativo ? Number(c.dataset.profundidade) * 2 * p : 0;
      c.style.transform = d ? 'translate3d(0,' + d.toFixed(1) + 'px,0)' : '';
    });
  }
  function agendar() {
    if (!agendado) { agendado = true; window.requestAnimationFrame(aplicar); }
  }
  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', agendar);
  reduzir.addEventListener('change', agendar);
  aplicar();
})();

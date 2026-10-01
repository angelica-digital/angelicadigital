/* ============== INÍCIO (TESTE) — COMPORTAMENTO ==============
   Linha do tempo das animações (todas desativadas com prefers-reduced-motion):

   Ao carregar a página
     0,00 s  rótulo "Criação de sites · Perfil…" sobe e aparece (0,75 s)
     0,09 s  título
     0,20 s  texto de apoio
     0,29 s  linha de idiomas
     0,37 s  botões "Ver projetos" / "Falar sobre meu negócio"
     0,52 s  navegador com o site da Tacobons entra da direita (0,95 s)
     0,78 s  cartão do Perfil no Google sobe da esquerda (0,9 s)
     0,92 s  celular sobe por baixo (0,9 s)
     1,15 s  legenda do projeto (Tacobons, entregas, "Ver projeto")
     1,30 s  etiqueta "Site";  1,45 s  etiqueta "Perfil da Empresa no Google"
     1,60 s  um reflexo de luz atravessa a tela do navegador uma única vez (1,3 s)
     2,40 s  o cartão do Perfil passa a descer e subir devagar (ciclo de 16 s, com pausas);
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

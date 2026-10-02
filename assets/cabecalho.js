/* ============== CABEÇALHO — MENU DO CELULAR (todas as páginas) ==============
   Abre e fecha o Menu (toque, clique ou teclado), atualiza aria-expanded e o ícone.
   Fecha ao escolher um link, com Esc (o foco volta ao botão), ao tocar fora do cabeçalho
   e ao passar para a largura de computador. Estilos: assets/cabecalho.css. */
(function () {
  'use strict';

  var computador = window.matchMedia('(min-width: 761px)');
  var botao = document.querySelector('.menu-botao');
  var menu = document.getElementById('menu-principal');
  if (!botao || !menu) return;

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
})();

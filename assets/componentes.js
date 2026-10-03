/* ============== PORTFÓLIO — COMPONENTES ==============
   Monta a vitrine e as páginas de projeto a partir de window.PORTFOLIO_PROJETOS
   e a página Modelos de sites a partir de window.MODELOS_SITES (assets/modelos.js).
   Cada página informa em <body data-base="..."> o caminho até a raiz do site.
   Textos de interface: window.I18N (assets/i18n.js). Todo dado é escapado antes de entrar no HTML. */

(function () {
  'use strict';

  const PROJETOS = window.PORTFOLIO_PROJETOS || [];
  const BASE = document.body.dataset.base || '';
  const I = window.I18N || {
    idioma: 'pt',
    t: (k) => k,
    tx: (v) => (v && typeof v === 'object' ? v.pt : v || ''),
    url: (h) => h,
    aplicar: () => {},
    aoMudar: () => {}
  };
  const t = (k, v) => I.t(k, v);
  const tx = (v) => I.tx(v);

  // Uma única linha de categorias, por serviço realizado. Vem do campo "servico" de cada entrega:
  // um projeto entra em todas as categorias que realmente recebeu, sempre com um cartão só.
  // (Real × demonstrativo continua identificado no selo de cada cartão.)
  const entregou = (p, s) => (p.entregas || []).some((e) => e.servico === s);
  const FILTROS = [
    { id: 'todos', rotulo: 'filtro.todos', aceita: () => true },
    { id: 'sites', rotulo: 'filtro.sites', aceita: (p) => entregou(p, 'site') },
    { id: 'perfil', rotulo: 'filtro.perfil', aceita: (p) => entregou(p, 'perfil') },
    { id: 'nfc', rotulo: 'filtro.nfc', aceita: (p) => entregou(p, 'nfc') }
  ];

  // Ícone do serviço principal, usado quando o projeto ainda não tem foto nem logo.
  const ICONE_SERVICO = { nfc: 'fa-solid fa-mobile-screen-button', perfil: 'fa-brands fa-google', site: 'fa-solid fa-globe' };

  function esc(valor) {
    return String(valor).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  // Textos do projeto no idioma atual (os demonstrativos vêm do dicionário).
  const nome = (p) => (p.tipo === 'demo' ? t('demo.nome', { n: p.numero }) : p.nome);
  const categoria = (p) => (p.tipo === 'demo' ? t('demo.categoria') : tx(p.categoria));
  const resumo = (p) => (p.tipo === 'demo' ? t('demo.resumo') : tx(p.resumo));
  const interno = (caminho) => esc(I.url(BASE + caminho));

  // Texto pesquisável em PT, ES e EN: a busca continua valendo depois de trocar de idioma.
  function textoBusca(p) {
    const D = window.I18N_TEXTOS || {};
    const partes = [p.nome || ''];
    ['pt', 'es', 'en'].forEach((l) => {
      const d = D[l] || {};
      if (p.tipo === 'demo') {
        partes.push(String(d['demo.nome'] || '').replace('{n}', p.numero), d['demo.categoria'] || '');
      } else if (p.categoria && typeof p.categoria === 'object') {
        partes.push(p.categoria[l] || '');
      }
    });
    partes.push(nome(p), categoria(p));
    return partes.join(' ').toLowerCase();
  }

  function linkExterno(url, conteudo, classe) {
    return `<a href="${esc(url)}" target="_blank" rel="noopener" class="${classe}">${conteudo}</a>`;
  }

  // ---------- Cartão de projeto ----------
  function midiaCartao(p) {
    // Foto (registro de entrega): preenche o cartão; o enquadramento mantém as plaquinhas à vista.
    if (p.foto) {
      return `<img class="midia-foto" src="${esc(BASE + p.foto.src)}" alt="${esc(tx(p.foto.alt))}" width="${p.foto.largura}" height="${p.foto.altura}" style="object-position:${esc(p.foto.enquadramento || '50% 50%')}" loading="lazy">`;
    }
    if (p.logo) {
      return `<img src="${esc(BASE + p.logo)}" alt="${esc(t('card.logoAlt', { nome: p.nome }))}" width="500" height="500" loading="lazy">`;
    }
    if (p.tipo === 'real') {
      // Sem foto nem logo ainda: bloco neutro com os ícones dos serviços e o nome (não simula uma foto).
      const icones = [...new Set((p.entregas || []).map((e) => ICONE_SERVICO[e.servico]).filter(Boolean))];
      return `<div class="midia-servico" aria-hidden="true">
          <span class="midia-servico__icones">${icones.map((i) => `<i class="${i}"></i>`).join('')}</span>
          <strong>${esc(p.nome)}</strong>
        </div>`;
    }
    return `<div class="placeholder" aria-hidden="true"><span>DEMO</span><strong>${esc(p.numero || '')}</strong></div>`;
  }

  function acoesCartao(p) {
    if (p.tipo === 'demo') {
      return `<span class="btn" aria-disabled="true"><i class="fa-solid fa-flask"></i> ${esc(t('card.apenasDemo'))}</span>`;
    }
    let html = '';
    if (p.pagina) {
      html += `<a href="${interno(p.pagina)}" class="btn btn-primary"><i class="fa-solid fa-eye"></i> ${esc(t('card.verProjeto'))}</a>`;
    }
    if (p.site) {
      html += linkExterno(p.site, `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${esc(t('card.visitar'))}`, 'btn btn-outline');
    }
    return html;
  }

  function cartao(p) {
    // Só os cartões demonstrativos levam selo; projetos de clientes (tipo 'real') não exibem selo.
    const badge = p.tipo === 'demo' ? `<i class="fa-solid fa-flask"></i> ${esc(t('selo.demo'))}` : '';
    // Uma etiqueta por tipo de entrega (ex.: dois perfis no Google viram uma etiqueta só).
    // No cartão o perfil usa o nome curto "Perfil no Google"; a página mantém o nome completo.
    const etiqueta = (e) => (e.servico === 'perfil' ? t('etiqueta.perfil') : tx(e.titulo));
    const tags = [...new Set((p.entregas || []).map(etiqueta))].map((t) => `<li>${esc(t)}</li>`).join('');

    return `
      <article class="pcard pcard--${p.tipo === 'demo' ? 'demo' : 'real'}">
        ${badge ? `<span class="pcard__badge">${badge}</span>` : ''}
        <div class="pcard__media">${midiaCartao(p)}</div>
        <div class="pcard__body">
          <span class="pcard__cat">${esc(categoria(p))}</span>
          <h3 class="pcard__title">${esc(nome(p))}</h3>
          <p class="pcard__desc">${esc(resumo(p))}</p>
          ${tags ? `<ul class="tag-list" aria-label="${esc(t('card.entregas'))}">${tags}</ul>` : ''}
          <div class="pcard__actions">${acoesCartao(p)}</div>
        </div>
      </article>`;
  }

  // ---------- Vitrine ----------
  function renderVitrine(raiz) {
    const params = new URLSearchParams(location.search);
    const estado = {
      filtro: FILTROS.some((f) => f.id === params.get('filtro')) ? params.get('filtro') : 'todos',
      busca: params.get('busca') || ''
    };

    raiz.innerHTML = `
      <div class="vitrine-controls">
        <div class="filter-bar" role="group" aria-label="${esc(t('filtro.grupo'))}">
          ${FILTROS.map((f) => `
            <button type="button" class="filter-btn" data-filtro="${f.id}">
              ${esc(t(f.rotulo))}<span class="count">(${PROJETOS.filter(f.aceita).length})</span>
            </button>`).join('')}
        </div>
        <label class="search">
          <span class="visually-hidden">${esc(t('busca.rotulo'))}</span>
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <input type="search" placeholder="${esc(t('busca.placeholder'))}" autocomplete="off">
        </label>
      </div>
      <p class="vitrine-status" aria-live="polite"></p>
      <div class="project-grid"></div>`;

    const grade = raiz.querySelector('.project-grid');
    const status = raiz.querySelector('.vitrine-status');
    const campoBusca = raiz.querySelector('input[type="search"]');
    const botoes = raiz.querySelectorAll('.filter-btn');
    campoBusca.value = estado.busca;

    function atualizarUrl() {
      const q = new URLSearchParams();
      if (estado.filtro !== 'todos') q.set('filtro', estado.filtro);
      if (estado.busca) q.set('busca', estado.busca);
      const qs = q.toString();
      history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : ''));
    }

    function desenhar() {
      const filtro = FILTROS.find((f) => f.id === estado.filtro);
      const termo = estado.busca.trim().toLowerCase();
      const lista = PROJETOS.filter(filtro.aceita).filter((p) =>
        !termo || textoBusca(p).includes(termo)
      );

      botoes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtro === estado.filtro)));
      status.textContent = t('vitrine.status', { n: lista.length, total: PROJETOS.length });
      grade.innerHTML = lista.length
        ? lista.map(cartao).join('')
        : `<div class="vitrine-empty">${esc(t('vitrine.vazio'))}</div>`;
      atualizarUrl();
    }

    botoes.forEach((b) => b.addEventListener('click', () => {
      estado.filtro = b.dataset.filtro;
      desenhar();
    }));
    campoBusca.addEventListener('input', () => {
      estado.busca = campoBusca.value;
      desenhar();
    });

    desenhar();
  }

  // ---------- Modelos de sites ----------
  // Dados em assets/modelos.js (window.MODELOS_SITES), separados dos projetos de clientes.
  // Só entram modelos completos: com demonstração publicada e imagem de computador.
  function modeloValido(m) {
    const ok = !!(m && m.slug && m.nome && m.nicho && m.nicho.id && /^https?:\/\//.test(m.demonstracao || '') &&
      m.imagens && m.imagens.computador && m.imagens.computador.src);
    if (!ok && window.console) console.warn('Modelo de site incompleto (não exibido):', m && m.slug);
    return ok;
  }

  function imagemModelo(img, classe) {
    const medidas = img.largura && img.altura ? ` width="${img.largura}" height="${img.altura}"` : '';
    return `<img class="${classe}" src="${esc(BASE + img.src)}" alt="${esc(tx(img.alt))}"${medidas} loading="lazy" decoding="async">`;
  }

  function cartaoModelo(m) {
    const nomeModelo = tx(m.nome);
    const quero = WHATSAPP + '?text=' + encodeURIComponent(t('wa.modelo', { nome: nomeModelo }));
    const itens = (m.personalizavel || []).map((i) => `<li>${esc(tx(i))}</li>`).join('');
    return `
      <article class="pcard mcard">
        <div class="pcard__media mcard__media">
          ${imagemModelo(m.imagens.computador, 'mcard__pc')}
          ${m.imagens.celular ? imagemModelo(m.imagens.celular, 'mcard__cel') : ''}
        </div>
        <div class="pcard__body">
          <span class="pcard__cat">${esc(tx(m.nicho))}</span>
          <h3 class="pcard__title">${esc(nomeModelo)}</h3>
          <span class="mcard__tipo"><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> ${esc(t('mod.tipo'))}</span>
          ${m.descricao ? `<p class="pcard__desc">${esc(tx(m.descricao))}</p>` : ''}
          ${itens ? `<p class="mcard__rotulo">${esc(t('mod.personalizavel'))}</p><ul class="tag-list">${itens}</ul>` : ''}
          <div class="pcard__actions">
            ${linkExterno(m.demonstracao, `<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> ${esc(t('mod.verDemo'))}`, 'btn btn-primary')}
            ${linkExterno(quero, `<i class="fa-brands fa-whatsapp" aria-hidden="true"></i> ${esc(t('mod.quero'))}`, 'btn btn-outline')}
          </div>
        </div>
      </article>`;
  }

  function renderModelos(raiz, lista) {
    const modelos = (lista || window.MODELOS_SITES || []).filter(modeloValido);
    const vazio = raiz.querySelector('[data-modelos-vazio]');
    let area = raiz.querySelector('[data-modelos-lista]');
    if (!modelos.length) {               // nenhum modelo pronto: só o convite para conversar
      if (vazio) vazio.hidden = false;
      if (area) area.remove();
      return;
    }
    if (vazio) vazio.hidden = true;
    if (!area) {
      area = document.createElement('div');
      area.setAttribute('data-modelos-lista', '');
      raiz.appendChild(area);
    }

    // Filtros por nicho só com modelos de pelo menos dois nichos.
    const nichos = [...new Map(modelos.map((m) => [m.nicho.id, m.nicho])).values()];
    const pedido = new URLSearchParams(location.search).get('nicho');
    let filtro = nichos.some((n) => n.id === pedido) ? pedido : 'todos';
    const conta = (id) => modelos.filter((m) => id === 'todos' || m.nicho.id === id).length;
    area.innerHTML = `
      ${nichos.length > 1 ? `
        <div class="filter-bar modelos__filtros" role="group" aria-label="${esc(t('mod.filtroGrupo'))}">
          ${[{ id: 'todos' }, ...nichos].map((n) => `
            <button type="button" class="filter-btn" data-nicho="${esc(n.id)}">
              ${esc(n.id === 'todos' ? t('filtro.todos') : tx(n))}<span class="count">(${conta(n.id)})</span>
            </button>`).join('')}
        </div>` : ''}
      <div class="project-grid modelos__grade"></div>`;

    const grade = area.querySelector('.modelos__grade');
    const botoes = area.querySelectorAll('[data-nicho]');
    function desenhar() {
      botoes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.nicho === filtro)));
      grade.innerHTML = modelos.filter((m) => filtro === 'todos' || m.nicho.id === filtro).map(cartaoModelo).join('');
      const q = new URLSearchParams(location.search);
      if (filtro === 'todos') q.delete('nicho'); else q.set('nicho', filtro);
      const s = q.toString();
      history.replaceState(history.state, '', location.pathname + (s ? '?' + s : '') + location.hash);
    }
    botoes.forEach((b) => b.addEventListener('click', () => { filtro = b.dataset.nicho; desenhar(); }));
    desenhar();
  }

  // ---------- Página de projeto ----------
  // nome: nome acessível do link de ampliação (ex.: "Ampliar imagem do site no computador")
  function captura(img, nome, classe) {
    return `
      <a href="${esc(BASE + img.src)}" target="_blank" rel="noopener" class="${classe}__tela"
         aria-label="${esc(nome)}">
        <img src="${esc(BASE + img.src)}" alt="${esc(tx(img.alt))}" width="${img.largura}" height="${img.altura}" loading="lazy" decoding="async">
      </a>`;
  }

  function capturasSite(c) {
    return `
      <div class="screens">
        <figure class="screen screen--desktop">
          <div class="browser">
            <div class="browser__bar" aria-hidden="true">
              <span class="browser__dots"><i></i><i></i><i></i></span>
              <span class="browser__url"><i class="fa-solid fa-lock"></i> ${esc(c.endereco)}</span>
            </div>
            ${captura(c.desktop, t('proj.ampliarPc'), 'browser')}
          </div>
          <figcaption><i class="fa-solid fa-desktop" aria-hidden="true"></i> ${esc(t('proj.figPc'))}</figcaption>
        </figure>
        <figure class="screen screen--celular">
          <div class="phone">${captura(c.celular, t('proj.ampliarCel'), 'phone')}</div>
          <figcaption><i class="fa-solid fa-mobile-screen" aria-hidden="true"></i> ${esc(t('proj.figCel'))}</figcaption>
        </figure>
      </div>`;
  }

  // Imagem em moldura de altura limitada; rola na vertical só se for mais alta que a moldura.
  // Não é link: a interação com o perfil real acontece pelo botão da entrega.
  function imagemEmMoldura(img, acao) {
    return `
      <div class="screens image-stage">
        <div class="image-frame" style="--largura:${img.largura}px" tabindex="0" role="region" aria-label="${esc(t('proj.imagemPerfil'))}">
          <img src="${esc(BASE + img.src)}" alt="${esc(tx(img.alt))}" width="${img.largura}" height="${img.altura}" draggable="false" decoding="async">
        </div>
        ${acao ? `<div class="image-stage__acao">${acao}</div>` : ''}
      </div>`;
  }

  // Entrega em destaque (largura total), com capturas do site ou imagem.
  function entregaDestaque(e) {
    const botao = e.link
      ? linkExterno(e.link.url, `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${esc(e.link.botao ? tx(e.link.botao) : t('card.abrir', { rotulo: tx(e.link.rotulo) }))}`, 'btn btn-primary')
      : '';
    const abaixo = e.link && e.link.posicao === 'abaixo';
    return `
      <article class="deliverable deliverable--wide${e.par ? ' deliverable--par' : ''}">
        <div class="deliverable__head">
          <div class="deliverable__icon"><i class="${esc(e.icone)}" aria-hidden="true"></i></div>
          <div>
            <h3>${esc(tx(e.tituloDetalhe || e.titulo))}</h3>
            ${e.descricao ? `<p>${esc(tx(e.descricao))}</p>` : ''}
          </div>
          ${abaixo ? '' : botao}
        </div>
        ${e.capturas ? capturasSite(e.capturas) : imagemEmMoldura(e.imagem, abaixo ? botao : '')}
      </article>`;
  }

  function entrega(e) {
    if (e.capturas || e.imagem) return entregaDestaque(e);
    let link = '';
    if (e.link && e.link.botao) {
      link = linkExterno(e.link.url, `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${esc(tx(e.link.botao))}`, 'btn btn-primary');
    } else if (e.link) {
      link = linkExterno(e.link.url, `${esc(tx(e.link.rotulo))} <i class="fa-solid fa-arrow-up-right-from-square"></i>`, 'btn-acao');
    }
    return `
      <article class="deliverable">
        <div class="deliverable__icon"><i class="${esc(e.icone)}" aria-hidden="true"></i></div>
        <h3>${esc(tx(e.tituloDetalhe || e.titulo))}</h3>
        ${e.descricao ? `<p>${esc(tx(e.descricao))}</p>` : ''}
        ${e.itens ? `<ul class="deliverable__itens">${e.itens.map((i) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i> ${esc(tx(i))}</li>`).join('')}</ul>` : ''}
        ${link}
      </article>`;
  }

  // Página: foto inteira (sem corte), clicável para ampliar em nova aba.
  // Sem legendas de data, de "captura" ou de "clique para ampliar": o nome acessível fica no aria-label.
  function midiaProjeto(p) {
    if (!p.foto) return `<div class="project-hero__media">${midiaCartao(p)}</div>`;
    return `
      <figure class="project-hero__figura">
        <a class="project-hero__media project-hero__media--foto" href="${esc(BASE + p.foto.src)}" target="_blank" rel="noopener"
           aria-label="${esc(t('proj.ampliarFoto'))}">
          <img src="${esc(BASE + p.foto.src)}" alt="${esc(tx(p.foto.alt))}" width="${p.foto.largura}" height="${p.foto.altura}" decoding="async">
        </a>
      </figure>`;
  }

  // Etiquetas de serviço no topo da página (só nos projetos que pedem: "selos: true").
  function selosProjeto(p) {
    if (!p.selos) return '';
    const etiquetas = [...new Set((p.entregas || []).map((e) => tx(e.titulo)))];
    return `
      <div class="project-hero__selos">
        ${etiquetas.map((e) => `<span class="selo-servico">${esc(e)}</span>`).join('')}
      </div>`;
  }

  // Contato para pedir uma plaquinha NFC (contato e regra de disponibilidade da página inicial).
  const WHATSAPP = 'https://wa.me/5511953285680';
  function contatoNfc(p) {
    if (!p.contatoNfc) return '';
    const href = WHATSAPP + '?text=' + encodeURIComponent(t('wa.projNfc', { nome: p.nome }));
    return `
      <section class="project-section" aria-labelledby="contato-nfc-titulo">
        <div class="project-cta">
          <div>
            <h2 id="contato-nfc-titulo">${esc(t('proj.nfc.titulo'))}</h2>
            <p class="project-cta__selo"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${esc(t('proj.nfc.disp'))}</p>
          </div>
          ${linkExterno(href, `<i class="fa-brands fa-whatsapp" aria-hidden="true"></i> ${esc(t('proj.nfc.btn'))}`, 'btn btn-primary btn-lg')}
        </div>
      </section>`;
  }

  function renderProjeto(raiz, slug) {
    const p = PROJETOS.find((item) => item.slug === slug && item.tipo === 'real');
    const vitrine = interno('vitrine.html');

    if (!p) {
      raiz.innerHTML = `
        <div class="container not-found">
          <h1>${esc(t('proj.naoEncontrado'))}</h1>
          <p>${esc(t('proj.naoEncontradoTexto', { slug: slug }))}</p>
          <a href="${vitrine}" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i> ${esc(t('proj.voltar'))}</a>
        </div>`;
      return;
    }

    document.title = t('proj.titulo', { nome: p.nome });

    raiz.innerHTML = `
      <div class="container">
        <nav class="breadcrumb" aria-label="${esc(t('proj.voceEsta'))}">
          <ol>
            <li><a href="${vitrine}">${esc(t('proj.vitrine'))}</a></li>
            <li aria-current="page">${esc(p.nome)}</li>
          </ol>
        </nav>

        <section class="project-hero">
          ${midiaProjeto(p)}
          <div>
            ${selosProjeto(p)}
            <span class="section-tag">${esc(categoria(p))}</span>
            <h1>${esc(p.nome)}</h1>
            <p class="lead">${esc(resumo(p))}</p>
            <div class="project-hero__actions">
              ${p.site ? linkExterno(p.site, `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${esc(t('card.visitar'))}`, 'btn btn-primary') : ''}
              <a href="${vitrine}" class="btn btn-outline"><i class="fa-solid fa-arrow-left"></i> ${esc(t('proj.voltar'))}</a>
            </div>
            ${p.negocio ? linkExterno(p.negocio, `<i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${esc(t('proj.conhecerNegocio'))} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>`, 'btn-acao project-hero__negocio') : ''}
          </div>
        </section>

        <section class="project-section" aria-labelledby="entregas-titulo">
          <h2 id="entregas-titulo">${esc(t('proj.entregas'))}</h2>
          <div class="deliverables">${(p.entregas || []).map(entrega).join('')}</div>
        </section>
        ${contatoNfc(p)}
      </div>`;
  }

  // ---------- Inicialização ----------
  const raizVitrine = document.getElementById('vitrine');
  if (raizVitrine) renderVitrine(raizVitrine);

  const raizProjeto = document.getElementById('projeto');
  if (raizProjeto) renderProjeto(raizProjeto, raizProjeto.dataset.slug);

  const raizModelos = document.getElementById('modelos');
  if (raizModelos) renderModelos(raizModelos);

  // Troca de idioma: redesenha com os textos novos (filtro e busca continuam no endereço).
  I.aoMudar(() => {
    if (raizVitrine) renderVitrine(raizVitrine);
    if (raizProjeto) renderProjeto(raizProjeto, raizProjeto.dataset.slug);
  });

  window.Portfolio = { cartao, renderVitrine, renderProjeto, cartaoModelo, renderModelos };
})();

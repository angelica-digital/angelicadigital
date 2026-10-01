/* ============== AVALIAÇÕES — formulário e lista ==============
   Usa a API REST do Supabase (PostgREST) com a chave pública do navegador.
   As regras de segurança ficam no banco; este arquivo só melhora a experiência:
   - envio: sempre gravado como "pendente" pelo banco (o status nem é enviado);
   - lista: pede apenas avaliações com status "aprovada";
   - todo texto vindo do banco é inserido com textContent (nunca como HTML).
   Idiomas: rótulos, mensagens e o nome exibido do serviço vêm de window.I18N.
   Nome e comentário do cliente ficam como foram escritos; o valor enviado em "servico"
   é sempre o exigido pelo banco (em português).
*/
(function () {
  'use strict';

  var cfg = window.AVALIACOES_CONFIG || {};
  var URL_BASE = (cfg.supabaseUrl || '').replace(/\/+$/, '');
  var CHAVE = cfg.chavePublica || '';
  // https obrigatório; http só é aceito para localhost (testes locais).
  var configurado = /^(https:\/\/[^/]+|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/.test(URL_BASE) && CHAVE.length > 20;
  var TABELA = 'avaliacoes_site';
  var SERVICOS = ['Site', 'Perfil da Empresa no Google', 'Site e Perfil da Empresa no Google', 'Plaquinha NFC'];

  var secao = document.getElementById('avaliacoes');
  if (!secao) return;

  var I = window.I18N || {
    idioma: 'pt',
    t: function (k, v) {
      var s = ((window.I18N_TEXTOS || {}).pt || {})[k] || k;
      return v ? s.replace(/\{(\w+)\}/g, function (_, n) { return v[n] != null ? v[n] : ''; }) : s;
    },
    aoMudar: function () {}
  };
  // Nome do serviço para exibir no idioma atual; o valor do banco não muda.
  function nomeServico(valor) {
    var chave = 'servico.' + valor;
    var texto = I.t(chave);
    return texto === chave ? String(valor || '') : texto;
  }

  function cabecalhos(extra) {
    var h = { apikey: CHAVE };
    // Chaves antigas ("anon", formato JWT) também vão no Authorization; as novas "sb_publishable_…" não.
    if (/^eyJ/.test(CHAVE)) h.Authorization = 'Bearer ' + CHAVE;
    for (var k in extra) h[k] = extra[k];
    return h;
  }

  // ---------------- Lista de avaliações aprovadas ----------------
  var lista = secao.querySelector('.depoimentos__lista');
  var vazio = secao.querySelector('.depoimentos__vazio');

  function estrelas(n) {
    var s = '';
    for (var i = 1; i <= 5; i++) s += i <= n ? '★' : '☆';
    return s;
  }

  var ultimas = null;
  function mostrarAvaliacoes(itens) {
    ultimas = itens;
    lista.textContent = '';
    itens.forEach(function (a) {
      var nota = Math.max(1, Math.min(5, parseInt(a.nota, 10) || 0));
      var li = document.createElement('li');
      li.className = 'depoimento';

      var n = document.createElement('p');
      n.className = 'depoimento__nota';
      n.setAttribute('role', 'img');
      n.setAttribute('aria-label', I.t('av.notaAria', { n: nota }));
      n.textContent = estrelas(nota);

      var q = document.createElement('blockquote');
      var p = document.createElement('p');
      p.textContent = String(a.comentario || '');
      q.appendChild(p);

      var autor = document.createElement('p');
      autor.className = 'depoimento__autor';
      var nome = document.createElement('strong');
      nome.textContent = String(a.nome_publico || '');
      autor.appendChild(nome);
      autor.appendChild(document.createTextNode(' · ' + nomeServico(a.servico)));

      li.appendChild(n);
      li.appendChild(q);
      li.appendChild(autor);
      lista.appendChild(li);
    });
    var tem = itens.length > 0;
    lista.hidden = !tem;
    vazio.hidden = tem;
  }

  function carregarAvaliacoes() {
    if (!configurado || !window.fetch) return;
    var url = URL_BASE + '/rest/v1/' + TABELA +
      '?select=nome_publico,servico,nota,comentario,criado_em' +
      '&status=eq.aprovada&order=criado_em.desc&limit=24';
    fetch(url, { headers: cabecalhos({ Accept: 'application/json' }) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (dados) { if (Array.isArray(dados)) mostrarAvaliacoes(dados); })
      .catch(function () { /* mantém o estado inicial; não mostra erro técnico ao público */ });
  }

  // Busca só quando a seção se aproxima da tela, para não pesar no carregamento inicial.
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { obs.disconnect(); carregarAvaliacoes(); }
    }, { rootMargin: '600px 0px' });
    obs.observe(secao);
  } else {
    carregarAvaliacoes();
  }

  // ---------------- Formulário ----------------
  var form = document.getElementById('form-avaliacao');
  if (!form) return;
  var campos = form.querySelector('[data-campos]');
  var status = form.querySelector('[data-status]');
  var botao = form.querySelector('.avaliar__enviar');
  var rotuloBotao = form.querySelector('[data-rotulo-botao]');
  var sucesso = secao.querySelector('[data-sucesso]');
  var conta = form.querySelector('[data-conta]');
  var inicio = Date.now();

  if (!configurado) {
    campos.disabled = true;
    form.querySelector('[data-aviso-config]').hidden = false;
    form.classList.add('avaliar--inativo');
  }

  form.comentario.addEventListener('input', function () {
    conta.textContent = form.comentario.value.length;
  });

  var errosAtuais = {};
  var statusAtual = null;
  var estaEnviando = false;

  function mostrarStatus(chave, vars) {
    statusAtual = chave ? { chave: chave, vars: vars } : null;
    status.className = 'avaliar__status';
    status.textContent = chave ? I.t(chave, vars) : '';
    if (chave) status.classList.add('avaliar__status--erro');
  }

  function erro(campo, chave) {
    if (chave) errosAtuais[campo] = chave; else delete errosAtuais[campo];
    var msg = chave ? I.t(chave) : '';
    var alvo = form.querySelector('[data-erro-para="' + campo + '"]');
    if (alvo) alvo.textContent = msg || '';
    var el = campo === 'nota' ? form.querySelector('.estrelas') : form.elements[campo];
    if (el && el.setAttribute) {
      if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    }
  }

  function validar() {
    var dados = {
      nome_publico: form.nome_publico.value.trim(),
      servico: form.servico.value,
      nota: parseInt((form.querySelector('input[name="nota"]:checked') || {}).value, 10),
      comentario: form.comentario.value.trim(),
      autoriza_publicacao: form.autoriza_publicacao.checked
    };
    var ok = true, primeiro = null;
    function falha(campo, msg, el) { erro(campo, msg); ok = false; if (!primeiro) primeiro = el; }
    ['nome_publico', 'servico', 'nota', 'comentario', 'autoriza_publicacao'].forEach(function (c) { erro(c, ''); });

    if (dados.nome_publico.length < 2) falha('nome_publico', 'av.erro.nome', form.nome_publico);
    if (SERVICOS.indexOf(dados.servico) < 0) falha('servico', 'av.erro.servico', form.servico);
    if (!(dados.nota >= 1 && dados.nota <= 5)) falha('nota', 'av.erro.nota', form.querySelector('#av-n5'));
    if (dados.comentario.length < 10) falha('comentario', 'av.erro.comentarioMin', form.comentario);
    if (dados.comentario.length > 600) falha('comentario', 'av.erro.comentarioMax', form.comentario);
    if (!dados.autoriza_publicacao) falha('autoriza_publicacao', 'av.erro.autoriza', form.autoriza_publicacao);

    if (primeiro) primeiro.focus();
    return ok ? dados : null;
  }

  function enviando(sim) {
    estaEnviando = sim;
    botao.disabled = sim;
    form.setAttribute('aria-busy', String(sim));
    rotuloBotao.textContent = I.t(sim ? 'av.enviando' : 'av.enviar');
  }
  rotuloBotao.textContent = I.t('av.enviar');

  // Converte a resposta de erro do banco numa chave de mensagem (o texto do banco nunca é exibido).
  function chaveDeErro(corpo) {
    var t = (corpo && (corpo.message || '')) + ' ' + (corpo && (corpo.hint || ''));
    if (/limite_envios/.test(t)) return 'av.erro.limite';
    if (/limite_pendentes/.test(t)) return 'av.erro.fila';
    if (/envio_repetido/.test(t)) return 'av.erro.repetido';
    if (corpo && corpo.code === '23514') return 'av.erro.campos';
    return 'av.erro.http';
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    mostrarStatus(null);
    if (!configurado) return;

    var dados = validar();
    if (!dados) { mostrarStatus('av.erro.confira'); return; }

    // Proteções simples contra robôs (complementam os limites do banco).
    if (form.site.value) return;                       // campo-armadilha preenchido
    if (Date.now() - inicio < 4000) {                  // enviado rápido demais
      mostrarStatus('av.erro.rapido');
      return;
    }

    enviando(true);
    fetch(URL_BASE + '/rest/v1/' + TABELA, {
      method: 'POST',
      headers: cabecalhos({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify(dados)
    })
      .then(function (r) {
        if (r.status === 201 || r.status === 204) {
          form.hidden = true;
          sucesso.hidden = false;
          sucesso.focus();
          return;
        }
        return r.json().catch(function () { return null; }).then(function (corpo) {
          throw { corpo: corpo, status: r.status };
        });
      })
      .catch(function (e) {
        enviando(false);
        if (e && e.status) mostrarStatus(chaveDeErro(e.corpo), { codigo: e.status });
        else mostrarStatus('av.erro.conexao');
      });
  });

  // Troca de idioma: retraduz lista, mensagens visíveis e botão (o que o visitante digitou fica).
  I.aoMudar(function () {
    if (ultimas) mostrarAvaliacoes(ultimas);
    Object.keys(errosAtuais).forEach(function (c) { erro(c, errosAtuais[c]); });
    if (statusAtual) mostrarStatus(statusAtual.chave, statusAtual.vars);
    rotuloBotao.textContent = I.t(estaEnviando ? 'av.enviando' : 'av.enviar');
  });
})();

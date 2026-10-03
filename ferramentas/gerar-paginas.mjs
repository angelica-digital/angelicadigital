/* ============== GERADOR DAS PÁGINAS (PT · ES · EN) ==============
   Uso (na raiz do repositório):   node ferramentas/gerar-paginas.mjs

   Fonte única:
     fonte/inicio.html, fonte/vitrine.html, fonte/modelos.html,
     fonte/projeto.html                                          modelos em português
     assets/i18n-textos.js                                       textos em ES e EN
     assets/projetos.js                                          projetos (slug, nome)

   Gera (não edite à mão — rode o gerador de novo):
     index.html, vitrine/index.html, modelos/index.html,
     projetos/<slug>/index.html                                                PT
     es/…, en/…                                                                 ES e EN
     vitrine.html, projetos/<slug>.html     endereços antigos → encaminham para os novos
     sitemap.xml, robots.txt, vercel.json   (vercel.json: redirecionamentos 308 dos endereços antigos)

   Nos modelos, links internos usam os nomes antigos (index.html, vitrine.html,
   projetos/<slug>.html) e arquivos a partir da raiz (assets/…); o gerador troca
   pelos endereços limpos de cada idioma. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.angelicadigital.com';
const IDIOMAS = ['pt', 'es', 'en'];
const LANG = { pt: 'pt-BR', es: 'es', en: 'en' };
const PREFIXO = { pt: '/', es: '/es/', en: '/en/' };

const ler = (f) => readFileSync(join(RAIZ, f), 'utf8').replace(/\r\n/g, '\n');
function gravar(f, conteudo) {
  const caminho = join(RAIZ, f);
  mkdirSync(dirname(caminho), { recursive: true });
  writeFileSync(caminho, conteudo);
  gravados.push(f);
}
const gravados = [];
const avisos = [];

// ---------- Dados ----------
const janela = {};
vm.runInNewContext(ler('assets/i18n-textos.js') + '\n' + ler('assets/projetos.js'), { window: janela });
const TEXTOS = janela.I18N_TEXTOS;
const PROJETOS = (janela.PORTFOLIO_PROJETOS || []).filter((p) => p.tipo === 'real' && p.pagina);
// Chave da descrição de cada projeto (meta.<chave>.desc) no dicionário.
const CHAVE_META = { 'recanto-das-aguas': 'recanto' };

function t(l, chave, vars) {
  let v = (TEXTOS[l] || {})[chave];
  if (v == null && l !== 'pt') avisos.push(`[${l}] chave sem texto: ${chave}`);
  if (v == null) v = (TEXTOS.pt || {})[chave];
  if (v == null) { avisos.push(`[${l}] chave inexistente: ${chave}`); v = chave; }
  if (vars) v = v.replace(/\{(\w+)\}/g, (_, n) => (vars[n] != null ? vars[n] : ''));
  return v;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const escTexto = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
// [[x]] → <span class="gradient">x</span>; **x** → <strong>x</strong> (mesma regra de assets/i18n.js)
const rico = (s) => escTexto(s).replace(/\[\[(.+?)\]\]/g, '<span class="gradient">$1</span>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

// ---------- Endereços ----------
// caminho lógico ('' | 'vitrine/' | 'projetos/<slug>/') → endereço do idioma
const endereco = (l, logico) => PREFIXO[l] + logico;
function logicoDe(href) {
  const p = href.replace(/^(\.\.\/|\.\/|\/)+/, '');
  if (p === '' || p === 'index.html') return '';
  if (p === 'vitrine.html') return 'vitrine/';
  if (p === 'modelos.html') return 'modelos/';
  const m = /^projetos\/([\w-]+)\.html$/.exec(p);
  return m ? `projetos/${m[1]}/` : null;
}
function trocarLink(l, valor) {
  if (!valor || /^(https?:|mailto:|tel:|#|javascript:|data:|\{\{)/i.test(valor)) return valor;
  let resto = '', i = valor.search(/[?#]/);
  if (i >= 0) { resto = valor.slice(i); valor = valor.slice(0, i); }
  const logico = logicoDe(valor);
  if (logico != null) return endereco(l, logico) + resto;
  return '/' + valor.replace(/^(\.\.\/|\.\/|\/)+/, '') + resto;   // arquivos (assets/…, logos)
}

// ---------- Tradução estática do HTML ----------
// Acha o fim do elemento que começa em "ini" (contando aninhamento da mesma tag).
function fimDoElemento(html, ini, tag) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = html.indexOf('>', ini) + 1;
  let nivel = 1, m;
  while ((m = re.exec(html))) {
    if (m[1]) { if (--nivel === 0) return { conteudo: html.indexOf('>', ini) + 1, fecha: m.index }; }
    else if (!m[0].endsWith('/>')) nivel++;
  }
  throw new Error(`<${tag}> sem fechamento perto de: ${html.slice(ini, ini + 80)}`);
}
const atributo = (tag, nome) => { const m = new RegExp(`\\s${nome}="([^"]*)"`).exec(tag); return m ? m[1] : null; };
const definirAtributo = (tag, nome, valor) => {
  const re = new RegExp(`(\\s${nome}=")[^"]*(")`);
  return re.test(tag) ? tag.replace(re, `$1${esc(valor).replace(/\$/g, '$$$$')}$2`) : tag.replace(/(\/?>)$/, ` ${nome}="${esc(valor)}"$1`);
};
const desesc = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function traduzir(html, l) {
  // percorre as tags de abertura; troca atributos e conteúdo conforme as marcações data-i18n*
  let saida = '', pos = 0;
  const reTag = /<([a-zA-Z][\w-]*)\b[^>]*>/g;
  let m;
  while ((m = reTag.exec(html))) {
    let tag = m[0];
    const nome = m[1].toLowerCase();
    if (nome === 'script' || nome === 'style') {           // não mexe no conteúdo de scripts/estilos
      const fim = html.indexOf(`</${nome}>`, reTag.lastIndex);
      saida += html.slice(pos, m.index) + trocarLinksTag(tag, l) + html.slice(reTag.lastIndex, fim);
      pos = fim; reTag.lastIndex = fim; continue;
    }
    if (l !== 'pt') {
      const attr = atributo(tag, 'data-i18n-attr');
      if (attr) desesc(attr).split(';').forEach((par) => {
        const [a, k] = par.split(':').map((x) => (x || '').trim());
        if (a && k) tag = definirAtributo(tag, a, t(l, k));
      });
      const wa = atributo(tag, 'data-i18n-wa');
      if (wa) {
        const base = desesc(atributo(tag, 'href')).split('?')[0];
        tag = definirAtributo(tag, 'href', base + '?text=' + encodeURIComponent(t(l, desesc(wa))));
      }
    }
    tag = trocarLinksTag(tag, l);
    const chave = atributo(tag, 'data-i18n');
    if (chave != null && l !== 'pt') {
      const { conteudo, fecha } = fimDoElemento(html, m.index, nome);
      const texto = t(l, desesc(chave));
      saida += html.slice(pos, m.index) + tag + (/\sdata-i18n-rico\b/.test(tag) ? rico(texto) : escTexto(texto));
      pos = fecha; reTag.lastIndex = fecha; continue;
    }
    saida += html.slice(pos, m.index) + tag;
    pos = reTag.lastIndex;
  }
  return saida + html.slice(pos);
}
function trocarLinksTag(tag, l) {
  return tag.replace(/(\s(?:href|src)=")([^"]*)(")/g, (_, a, v, b) => {
    const novo = trocarLink(l, desesc(v));
    return a + (novo === desesc(v) ? v : novo.replace(/&/g, '&amp;')) + b;
  });
}

// ---------- Cabeçalho comum (canonical, hreflang, ?lang= antigo) ----------
// Endereços antigos com ?lang=xx abrem a mesma página no idioma pedido; sem ciclo:
// a página de destino já está no idioma e só retira o parâmetro do endereço.
const SCRIPT_LANG = `<script>(function(){try{var q=new URLSearchParams(location.search),l=q.get('lang');if(!l)return;q.delete('lang');var s=q.toString();s=(s?'?'+s:'')+location.hash;var a=document.documentElement.lang.slice(0,2),p=location.pathname.replace(/^\\/(es|en)(?=\\/|$)/,'').replace(/index\\.html$/,'')||'/';if(/^(pt|es|en)$/.test(l)&&l!==a)location.replace((l==='pt'?'':'/'+l)+p+s);else history.replaceState(history.state,'',location.pathname+s);}catch(e){}})();</script>`;
function cabeca(l, logico) {
  const links = [`<link rel="canonical" href="${SITE}${endereco(l, logico)}">`];
  IDIOMAS.forEach((o) => links.push(`<link rel="alternate" hreflang="${LANG[o]}" href="${SITE}${endereco(o, logico)}">`));
  links.push(`<link rel="alternate" hreflang="x-default" href="${SITE}${endereco('pt', logico)}">`);
  return links.join('\n') + '\n' + SCRIPT_LANG;
}

const AVISO = (fonte) => `<!-- Página gerada a partir de ${fonte} por ferramentas/gerar-paginas.mjs. Não edite este arquivo. -->\n`;
function pagina(fonte, l, logico, preencher) {
  // comentários que começam com "<!-- Modelo" valem só no arquivo-fonte
  let html = ler(fonte).replace(/<!-- Modelo[\s\S]*?-->\n/g, '');
  if (preencher) html = preencher(html);
  if (!html.includes('<!-- gerar:cabeca -->')) throw new Error(`${fonte}: falta <!-- gerar:cabeca -->`);
  html = traduzir(html, l)
    .replace('<html lang="pt-BR"', `<html lang="${LANG[l]}"`)
    .replace('<!-- gerar:cabeca -->', cabeca(l, logico))
    .replace('<!DOCTYPE html>\n', '<!DOCTYPE html>\n' + AVISO(fonte));
  const sobra = /\{\{\w+\}\}/.exec(html);
  if (sobra) throw new Error(`${fonte} [${l}]: marcador não preenchido ${sobra[0]}`);
  return html;
}

// ---------- Geração ----------
const destino = (l, logico) => (PREFIXO[l] + logico).replace(/^\//, '') + 'index.html';
const publicas = [];
for (const l of IDIOMAS) {
  gravar(destino(l, ''), pagina('fonte/inicio.html', l, ''));
  gravar(destino(l, 'vitrine/'), pagina('fonte/vitrine.html', l, 'vitrine/'));
  gravar(destino(l, 'modelos/'), pagina('fonte/modelos.html', l, 'modelos/'));
  for (const p of PROJETOS) {
    const logico = `projetos/${p.slug}/`;
    gravar(destino(l, logico), pagina('fonte/projeto.html', l, logico, (html) => html
      .replace(/\{\{slug\}\}/g, esc(p.slug))
      .replace('{{titulo}}', esc(t(l, 'proj.titulo', { nome: p.nome })))
      .replace('{{descricao}}', esc(t(l, `meta.${CHAVE_META[p.slug] || p.slug}.desc`)))));
  }
}
publicas.push('', 'vitrine/', 'modelos/', ...PROJETOS.map((p) => `projetos/${p.slug}/`));

// Endereços antigos (.html) → novos. Na Vercel quem responde é o vercel.json (308);
// estes arquivos ficam como reserva (servidor local, outra hospedagem).
function encaminhar(logico) {
  const novo = endereco('pt', logico);
  return `<!DOCTYPE html>
<!-- Endereço antigo: encaminha para ${novo} (gerado por ferramentas/gerar-paginas.mjs). Não edite este arquivo. -->
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex">
<link rel="canonical" href="${SITE}${novo}">
<script>(function(){var q=new URLSearchParams(location.search),l=q.get('lang');q.delete('lang');var s=q.toString();location.replace((/^(es|en)$/.test(l)?'/'+l:'')+${JSON.stringify(novo)}+(s?'?'+s:'')+location.hash);})();</script>
<meta http-equiv="refresh" content="0; url=${novo}">
<title>Angélica Digital</title>
</head>
<body><p><a href="${novo}">${SITE}${novo}</a></p></body>
</html>
`;
}
gravar('vitrine.html', encaminhar('vitrine/'));
PROJETOS.forEach((p) => gravar(`projetos/${p.slug}.html`, encaminhar(`projetos/${p.slug}/`)));

// sitemap.xml com as versões equivalentes de cada página
const urls = publicas.flatMap((logico) => IDIOMAS.map((l) => `  <url>
    <loc>${SITE}${endereco(l, logico)}</loc>
${IDIOMAS.map((o) => `    <xhtml:link rel="alternate" hreflang="${LANG[o]}" href="${SITE}${endereco(o, logico)}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${endereco('pt', logico)}"/>
  </url>`));
gravar('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`);
gravar('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

// vercel.json: redirecionamentos permanentes dos endereços antigos (com e sem ?lang=)
const redirecionamentos = [];
const antigo = (fonte, logico) => {
  ['es', 'en'].forEach((l) => redirecionamentos.push({ source: fonte, has: [{ type: 'query', key: 'lang', value: l }], destination: endereco(l, logico), permanent: true }));
};
antigo('/', ''); antigo('/index.html', '');
antigo('/vitrine.html', 'vitrine/');
redirecionamentos.push({ source: '/vitrine.html', destination: '/vitrine/', permanent: true });
PROJETOS.forEach((p) => {
  antigo(`/projetos/${p.slug}.html`, `projetos/${p.slug}/`);
  redirecionamentos.push({ source: `/projetos/${p.slug}.html`, destination: `/projetos/${p.slug}/`, permanent: true });
});
gravar('vercel.json', JSON.stringify({ trailingSlash: true, redirects: redirecionamentos }, null, 2) + '\n');

console.log(`${gravados.length} arquivos gerados:`);
console.log('  ' + gravados.join('\n  '));
if (avisos.length) { console.log('\nAVISOS:\n  ' + [...new Set(avisos)].join('\n  ')); process.exitCode = 1; }

/* ============== PORTFÓLIO — DADOS DOS PROJETOS ==============
   Fonte única da vitrine e das páginas de projeto.

   Para adicionar um projeto real:
     1. Acrescente um objeto na lista PROJETOS_REAIS (use o modelo da Tacobons).
     2. Acrescente meta.<slug>.desc (pt, es, en) em assets/i18n-textos.js.
     3. Rode  node ferramentas/gerar-paginas.mjs  (cria /projetos/<slug>/ em PT, ES e EN
        a partir de fonte/projeto.html). Em "pagina" use projetos/<slug>.html: os links
        viram o endereço limpo do idioma (/es/projetos/<slug>/ etc.).

   Textos traduzíveis usam { pt, es, en }. Nomes de clientes, marcas e URLs não se traduzem.
   Caminhos de "logo" e "pagina" são relativos à raiz do site.
   Inclua somente informações confirmadas pelo cliente.
   Imagens sem legendas explicativas: não informe data de captura, não chame a imagem de
   "captura de tela", "site real" ou "site demonstrativo" e não escreva "clique para ampliar"
   (a ampliação continua funcionando; o nome acessível fica nos textos alternativos). */

(function () {
  'use strict';

  const PROJETOS_REAIS = [
    {
      slug: 'tacobons',
      tipo: 'real',
      nome: 'Tacobons',
      categoria: { pt: 'Gastronomia Mexicana', es: 'Gastronomía mexicana', en: 'Mexican food' },
      resumo: {
        pt: 'Site e Perfil da Empresa no Google.',
        es: 'Sitio web y Perfil de Empresa en Google.',
        en: 'Website and Google Business Profile.'
      },
      logo: 'logotacobons.png',
      site: 'https://www.tacobons.com/',
      pagina: 'projetos/tacobons.html',
      entregas: [
        {
          titulo: { pt: 'Site', es: 'Sitio web', en: 'Website' },
          icone: 'fa-solid fa-globe',
          servico: 'site',
          descricao: {
            pt: 'Site da Tacobons, publicado e acessível no endereço oficial.',
            es: 'Sitio web de Tacobons, publicado y disponible en su dirección oficial.',
            en: 'The Tacobons website, published and live at its official address.'
          },
          link: { rotulo: 'www.tacobons.com', url: 'https://www.tacobons.com/' },
          capturas: {
            endereco: 'www.tacobons.com',
            desktop: {
              src: 'assets/img/tacobons/site-desktop.webp', largura: 2160, altura: 1350,
              alt: {
                pt: 'Página inicial de tacobons.com no computador: menu superior, logo, título “La Verdadera Comida Mexicana Llegó a La Tebaida”, botões Ver Menú Digital e Pedir por WhatsApp e foto com pedido de tacos.',
                es: 'Página de inicio de tacobons.com en computadora: menú superior, logotipo, título “La Verdadera Comida Mexicana Llegó a La Tebaida”, botones Ver Menú Digital y Pedir por WhatsApp y foto de un pedido de tacos.',
                en: 'tacobons.com home page on desktop: top menu, logo, headline “La Verdadera Comida Mexicana Llegó a La Tebaida”, “Ver Menú Digital” and “Pedir por WhatsApp” buttons, and a photo of a taco order.'
              }
            },
            celular: {
              src: 'assets/img/tacobons/site-celular.webp', largura: 780, altura: 1688,
              alt: {
                pt: 'Página inicial de tacobons.com no celular: botão Pedir Domicilio, logo, título “La Verdadera Comida Mexicana Llegó a La Tebaida” e botões Ver Menú Digital e Pedir por WhatsApp.',
                es: 'Página de inicio de tacobons.com en celular: botón Pedir Domicilio, logotipo, título “La Verdadera Comida Mexicana Llegó a La Tebaida” y botones Ver Menú Digital y Pedir por WhatsApp.',
                en: 'tacobons.com home page on mobile: “Pedir Domicilio” button, logo, headline “La Verdadera Comida Mexicana Llegó a La Tebaida”, and “Ver Menú Digital” and “Pedir por WhatsApp” buttons.'
              }
            }
          }
        },
        {
          titulo: { pt: 'Perfil da Empresa no Google', es: 'Perfil de Empresa en Google', en: 'Google Business Profile' },
          tituloDetalhe: { pt: 'Perfil da Tacobons no Google', es: 'Perfil de Tacobons en Google', en: 'Tacobons on Google' },
          icone: 'fa-brands fa-google',
          servico: 'perfil',
          link: {
            rotulo: { pt: 'perfil no Google', es: 'perfil en Google', en: 'Google profile' },
            botao: { pt: 'Abrir perfil atualizado no Google', es: 'Abrir el perfil actualizado en Google', en: 'Open the current profile on Google' },
            posicao: 'abaixo',
            url: 'https://share.google/tIp0h9W0QuCsERcus'
          },
          imagem: {
            src: 'assets/img/tacobons/perfil-google.png', largura: 363, altura: 559,
            alt: {
              pt: 'Perfil da Tacobons no Google: Tacobons, Restaurante mexicano. Botões Site, Rotas, Avaliar, Salvar, Compartilhar, Ligar e Menu; Pedir e retirar e Pedir delivery. Opções de serviço: Mesas externas, Opções veganas. Endereço: esquina (frente a Discoteca Nocturna, Carrera 10 con Calle 11, La Tebaida, Quindío, Colômbia. Telefone: +57 314 5705287. Menu: tacobons.com.',
              es: 'Perfil de Tacobons en Google: Tacobons, restaurante mexicano. Botones Sitio web, Cómo llegar, Opinar, Guardar, Compartir, Llamar y Menú; Pedir para recoger y Pedir a domicilio. Opciones de servicio: mesas al aire libre, opciones veganas. Dirección: esquina (frente a Discoteca Nocturna), Carrera 10 con Calle 11, La Tebaida, Quindío, Colombia. Teléfono: +57 314 5705287. Menú: tacobons.com.',
              en: 'Tacobons on Google: Tacobons, Mexican restaurant. Buttons: Website, Directions, Review, Save, Share, Call and Menu; Pickup and Delivery. Service options: outdoor seating, vegan options. Address: corner (across from Discoteca Nocturna), Carrera 10 con Calle 11, La Tebaida, Quindío, Colombia. Phone: +57 314 5705287. Menu: tacobons.com.'
            }
          }
        }
      ]
    },

    // ---------- Bavel Piercing ----------
    // Verificado em 30/09/2026: loja em bavelpiercing.com na plataforma Tiendanube (envios para toda a Colômbia).
    // Perfis enviados pela Angélica e identificados pelo Google: "Bavel piercing I sede centro" e "Bavel Piercing I Sede Norte".
    // Imagens dos dois perfis enviadas em 01/10/2026 (nome visível conferido em cada uma); as duas sedes ficam em Armenia, Quindío.
    // A extensão exata do trabalho na loja ainda não foi detalhada: o texto só diz o que é verificável.
    {
      slug: 'bavel',
      tipo: 'real',
      nome: 'Bavel Piercing',
      categoria: { pt: 'Estúdio de piercing · Colômbia', es: 'Estudio de piercing · Colombia', en: 'Piercing studio · Colombia' },
      resumo: {
        pt: 'Loja online e Perfis da Empresa no Google de duas sedes.',
        es: 'Tienda en línea y Perfiles de Empresa en Google de dos sedes.',
        en: 'Online store and Google Business Profiles for two locations.'
      },
      logo: 'logobavelpiercing.png',
      site: 'https://bavelpiercing.com/',
      pagina: 'projetos/bavel.html',
      entregas: [
        {
          titulo: { pt: 'Loja online', es: 'Tienda en línea', en: 'Online store' },
          icone: 'fa-solid fa-bag-shopping',
          servico: 'site',
          descricao: {
            pt: 'Loja online da Bavel Piercing em bavelpiercing.com, montada na plataforma Tiendanube.',
            es: 'Tienda en línea de Bavel Piercing en bavelpiercing.com, montada en la plataforma Tiendanube.',
            en: 'The Bavel Piercing online store at bavelpiercing.com, built on the Tiendanube platform.'
          },
          link: { rotulo: 'bavelpiercing.com', url: 'https://bavelpiercing.com/' },
          capturas: {
            endereco: 'bavelpiercing.com',
            desktop: {
              src: 'assets/img/bavel/site-desktop.webp', largura: 2160, altura: 1350,
              alt: {
                pt: 'Página inicial de bavelpiercing.com no computador: busca, logo, menu de categorias (Oreja, Nariz, Boca e outras) e banner de desconto de 10% na primeira compra com joias de piercing.',
                es: 'Página de inicio de bavelpiercing.com en computadora: buscador, logotipo, menú de categorías (Oreja, Nariz, Boca y otras) y banner de 10% de descuento en la primera compra con joyas de piercing.',
                en: 'bavelpiercing.com home page on desktop: search bar, logo, category menu (Oreja, Nariz, Boca and more) and a banner offering 10% off the first purchase, showing piercing jewelry.'
              }
            },
            celular: {
              src: 'assets/img/bavel/site-celular.webp', largura: 780, altura: 1472,
              alt: {
                pt: 'Página inicial de bavelpiercing.com no celular: banner “Nueva colección” e a seção “Los favoritos de Bavel” com produtos e preços.',
                es: 'Página de inicio de bavelpiercing.com en celular: banner “Nueva colección” y la sección “Los favoritos de Bavel” con productos y precios.',
                en: 'bavelpiercing.com home page on mobile: “Nueva colección” banner and the “Los favoritos de Bavel” section with products and prices.'
              }
            }
          }
        },
        {
          titulo: { pt: 'Perfil da Empresa no Google', es: 'Perfil de Empresa en Google', en: 'Google Business Profile' },
          tituloDetalhe: { pt: 'Perfil no Google · Sede Centro', es: 'Perfil en Google · Sede Centro', en: 'Google profile · Sede Centro' },
          icone: 'fa-brands fa-google',
          servico: 'perfil',
          par: true,
          link: {
            rotulo: { pt: 'perfil no Google', es: 'perfil en Google', en: 'Google profile' },
            botao: { pt: 'Abrir perfil atualizado no Google', es: 'Abrir el perfil actualizado en Google', en: 'Open the current profile on Google' },
            posicao: 'abaixo',
            url: 'https://share.google/6atx1poLEHZreaf5K'
          },
          imagem: {
            src: 'assets/img/bavel/perfil-centro.png', largura: 495, altura: 694,
            alt: {
              pt: 'Perfil da Bavel Piercing Sede Centro no Google: Bavel piercing I sede centro, Estúdio de tatuagem e colocação de piercing em Armênia, Colômbia. Fotos da loja, do mapa e da rua. Botões Site, Rotas, Avaliar, Salvar, Compartilhar e Ligar. Endereço: Carrera 17 & Calle 19, Armenia, Quindío, Colômbia. Telefone: +57 313 6718113.',
              es: 'Perfil de Bavel Piercing Sede Centro en Google: Bavel piercing I sede centro, estudio de tatuajes y perforaciones en Armenia, Colombia. Fotos de la tienda, del mapa y de la calle. Botones Sitio web, Cómo llegar, Opinar, Guardar, Compartir y Llamar. Dirección: Carrera 17 & Calle 19, Armenia, Quindío, Colombia. Teléfono: +57 313 6718113.',
              en: 'Bavel Piercing Sede Centro on Google: Bavel piercing I sede centro, tattoo and piercing studio in Armenia, Colombia. Photos of the shop, the map and the street. Buttons: Website, Directions, Review, Save, Share and Call. Address: Carrera 17 & Calle 19, Armenia, Quindío, Colombia. Phone: +57 313 6718113.'
            }
          }
        },
        {
          titulo: { pt: 'Perfil da Empresa no Google', es: 'Perfil de Empresa en Google', en: 'Google Business Profile' },
          tituloDetalhe: { pt: 'Perfil no Google · Sede Norte', es: 'Perfil en Google · Sede Norte', en: 'Google profile · Sede Norte' },
          icone: 'fa-brands fa-google',
          servico: 'perfil',
          par: true,
          link: {
            rotulo: { pt: 'perfil no Google', es: 'perfil en Google', en: 'Google profile' },
            botao: { pt: 'Abrir perfil atualizado no Google', es: 'Abrir el perfil actualizado en Google', en: 'Open the current profile on Google' },
            posicao: 'abaixo',
            url: 'https://share.google/itz33m24ippMFPlg1'
          },
          imagem: {
            src: 'assets/img/bavel/perfil-norte.png', largura: 425, altura: 743,
            alt: {
              pt: 'Perfil da Bavel Piercing Sede Norte no Google: Bavel Piercing I Sede Norte, Serviço de colocação de piercing em Armênia, Colômbia. Fotos do prédio e do mapa. Botões Site, Rotas, Avaliar, Salvar, Compartilhar e Ligar. Endereço: Mall primavera life, 630001, Cra. 13 #16N-79 piso 6 local 613, Armenia, Quindío, Colômbia. Telefone: +57 302 1007680.',
              es: 'Perfil de Bavel Piercing Sede Norte en Google: Bavel Piercing I Sede Norte, servicio de perforaciones en Armenia, Colombia. Fotos del edificio y del mapa. Botones Sitio web, Cómo llegar, Opinar, Guardar, Compartir y Llamar. Dirección: Mall primavera life, 630001, Cra. 13 #16N-79 piso 6 local 613, Armenia, Quindío, Colombia. Teléfono: +57 302 1007680.',
              en: 'Bavel Piercing Sede Norte on Google: Bavel Piercing I Sede Norte, piercing service in Armenia, Colombia. Photos of the building and a map. Buttons: Website, Directions, Review, Save, Share and Call. Address: Mall primavera life, 630001, Cra. 13 #16N-79 piso 6 local 613, Armenia, Quindío, Colombia. Phone: +57 302 1007680.'
            }
          }
        }
      ]
    },

    // ---------- Meraki ----------
    // Projeto real: em 01/10/2026 a Angélica confirmou que o site e a configuração do Perfil da Empresa
    // no Google são trabalhos reais dela. Endereço oficial do site: www.merakiexperiences.online.
    // Perfil: link enviado pela Angélica (share.google/9y7JMePD9dfFeqCTU), aberto pelo Google como "Meraki Salento".
    // Imagem do perfil enviada pela Angélica em 01/10/2026 (nome visível: "Meraki Salento").
    {
      slug: 'meraki',
      tipo: 'real',
      nome: 'Meraki',
      categoria: { pt: 'Gastronomia e experiências · Salento, Colômbia', es: 'Gastronomía y experiencias · Salento, Colombia', en: 'Food & experiences · Salento, Colombia' },
      resumo: {
        pt: 'Site e Perfil da Empresa no Google.',
        es: 'Sitio web y Perfil de Empresa en Google.',
        en: 'Website and Google Business Profile.'
      },
      logo: 'logomeraki.png',
      site: 'https://www.merakiexperiences.online/',
      pagina: 'projetos/meraki.html',
      entregas: [
        {
          titulo: { pt: 'Site', es: 'Sitio web', en: 'Website' },
          icone: 'fa-solid fa-globe',
          servico: 'site',
          descricao: {
            pt: 'Site da Meraki criado pela Angélica Digital, publicado em merakiexperiences.online.',
            es: 'Sitio web de Meraki creado por Angélica Digital, publicado en merakiexperiences.online.',
            en: 'The Meraki website built by Angélica Digital, published at merakiexperiences.online.'
          },
          link: { rotulo: 'merakiexperiences.online', url: 'https://www.merakiexperiences.online/' },
          capturas: {
            endereco: 'merakiexperiences.online',
            desktop: {
              src: 'assets/img/meraki/site-desktop.webp', largura: 2160, altura: 1350,
              alt: {
                pt: 'Página inicial de merakiexperiences.online no computador: logo Meraki, título “Local & Cosmo Experiences”, botões Ver Menú & Experiencias e Abrir en Google Maps, filtros e cartões de experiências.',
                es: 'Página de inicio de merakiexperiences.online en computadora: logotipo de Meraki, título “Local & Cosmo Experiences”, botones Ver Menú & Experiencias y Abrir en Google Maps, filtros y tarjetas de experiencias.',
                en: 'merakiexperiences.online home page on desktop: Meraki logo, headline “Local & Cosmo Experiences”, “Ver Menú & Experiencias” and “Abrir en Google Maps” buttons, filters and experience cards.'
              }
            },
            celular: {
              src: 'assets/img/meraki/site-celular.webp', largura: 780, altura: 1688,
              alt: {
                pt: 'Página inicial de merakiexperiences.online no celular: logo, título “Local & Cosmo Experiences” e botões Ver Menú & Experiencias e Abrir en Google Maps.',
                es: 'Página de inicio de merakiexperiences.online en celular: logotipo, título “Local & Cosmo Experiences” y botones Ver Menú & Experiencias y Abrir en Google Maps.',
                en: 'merakiexperiences.online home page on mobile: logo, headline “Local & Cosmo Experiences”, and “Ver Menú & Experiencias” and “Abrir en Google Maps” buttons.'
              }
            }
          }
        },
        {
          titulo: { pt: 'Perfil da Empresa no Google', es: 'Perfil de Empresa en Google', en: 'Google Business Profile' },
          tituloDetalhe: { pt: 'Perfil da Meraki no Google', es: 'Perfil de Meraki en Google', en: 'Meraki on Google' },
          icone: 'fa-brands fa-google',
          servico: 'perfil',
          link: {
            rotulo: { pt: 'perfil no Google', es: 'perfil en Google', en: 'Google profile' },
            botao: { pt: 'Abrir perfil atualizado no Google', es: 'Abrir el perfil actualizado en Google', en: 'Open the current profile on Google' },
            posicao: 'abaixo',
            url: 'https://share.google/9y7JMePD9dfFeqCTU'
          },
          imagem: {
            src: 'assets/img/meraki/perfil-google.png', largura: 473, altura: 706,
            alt: {
              pt: 'Perfil da Meraki no Google: Meraki Salento, Restaurante especializado em gastronomia. Fotos do salão e dos pratos. Botões Pedir on-line, Site, Rotas, Salvar, Compartilhar e Ligar. Necessidade de fazer reserva, Mesas externas, Opções vegetarianas. Endereço: Cra. 3 #5-56, Salento, Quindío, Colômbia.',
              es: 'Perfil de Meraki en Google: Meraki Salento, restaurante especializado en gastronomía. Fotos del salón y de los platos. Botones Pedir en línea, Sitio web, Cómo llegar, Guardar, Compartir y Llamar. Requiere reserva, mesas al aire libre, opciones vegetarianas. Dirección: Cra. 3 #5-56, Salento, Quindío, Colombia.',
              en: 'Meraki on Google: Meraki Salento, restaurant specializing in gastronomy. Photos of the dining room and dishes. Buttons: Order online, Website, Directions, Save, Share and Call. Reservations required, outdoor seating, vegetarian options. Address: Cra. 3 #5-56, Salento, Quindío, Colombia.'
            }
          }
        }
      ]
    },

    // ---------- Recanto das Águas WS ----------
    // Projeto real: a Angélica forneceu somente as plaquinhas NFC (o cliente já tinha site e Perfil no Google,
    // que não são trabalhos dela). Link do negócio enviado pela Angélica; verificado em 01/10/2026: abre no
    // Google Maps "Recanto das Águas WS - Disk Água Mineral - Distribuidora", R. Agamenon Magalhães, 432,
    // Vila Santa Edwiges, São Paulo - SP. É a página do negócio, não um link direto de avaliação.
    // Serviço realizado: somente plaquinhas NFC (categoria "Plaquinhas NFC"; nunca "Perfil no Google").
    // "foto": registro da entrega (cliente segurando as plaquinhas). Ainda não recebida: até lá o cartão e a
    // página mostram o bloco neutro com o ícone do serviço no lugar da imagem.
    {
      slug: 'recanto-das-aguas',
      tipo: 'real',
      nome: 'Recanto das Águas WS',
      categoria: { pt: 'Distribuidora de água mineral · São Paulo, SP', es: 'Distribuidora de agua mineral · São Paulo, Brasil', en: 'Mineral water distributor · São Paulo, Brazil' },
      resumo: {
        pt: 'Entrega de plaquinhas NFC para facilitar o acesso dos clientes à avaliação do negócio no Google.',
        es: 'Entrega de placas NFC para facilitar que los clientes lleguen a la reseña del negocio en Google.',
        en: 'Delivery of NFC tap signs that make it easier for customers to reach the business’s Google review.'
      },
      // { src, largura, altura, enquadramento (object-position do cartão), alt: { pt, es, en } }
      foto: null,
      negocio: 'https://maps.app.goo.gl/ekjUH21nCyXaUEqC6?g_st=aw',
      pagina: 'projetos/recanto-das-aguas.html',
      selos: true,
      contatoNfc: true,
      entregas: [
        {
          titulo: { pt: 'Plaquinha NFC', es: 'Placa NFC', en: 'NFC tap sign' },
          icone: 'fa-solid fa-mobile-screen-button',
          servico: 'nfc',
          descricao: {
            pt: 'Plaquinhas para o balcão que levam o cliente à avaliação do negócio no Google.',
            es: 'Placas para el mostrador que llevan al cliente a la reseña del negocio en Google.',
            en: 'Counter signs that take customers to the business’s Google review.'
          },
          itens: [
            { pt: 'Tamanho: 12 × 10 cm', es: 'Tamaño: 12 × 10 cm', en: 'Size: 12 × 10 cm' },
            { pt: 'NFC: o cliente aproxima o celular da plaquinha', es: 'NFC: el cliente acerca el celular a la placa', en: 'NFC: customers tap their phone on the sign' },
            { pt: 'QR Code: o cliente aponta a câmera do celular', es: 'Código QR: el cliente apunta la cámara del celular', en: 'QR code: customers point their phone camera at it' }
          ]
        }
      ]
    },

    // ---------- Minimercado Utilidades & Variedades ----------
    // Serviços confirmados pela Angélica em 01/10/2026: configuração do Perfil da Empresa no Google e venda da
    // plaquinha NFC. Nenhum site. Link do perfil enviado por ela; verificado em 01/10/2026: o Google abre
    // "Minimercado Utilidades & Variedades". Plaquinha NFC só é vendida no Brasil, por isso "Brasil" na categoria.
    // Ainda não recebidos: a imagem real do perfil no Google e o material da plaquinha entregue. As fotos do
    // estabelecimento em Downloads (minimercado*.png) não foram indicadas para o portfólio e não são usadas.
    {
      slug: 'minimercado',
      tipo: 'real',
      nome: 'Minimercado Utilidades & Variedades',
      categoria: { pt: 'Minimercado · Brasil', es: 'Minimercado · Brasil', en: 'Mini market · Brazil' },
      resumo: {
        pt: 'Configuração do Perfil da Empresa no Google e entrega de plaquinha NFC.',
        es: 'Configuración del Perfil de Empresa en Google y entrega de placa NFC.',
        en: 'Google Business Profile setup and an NFC tap sign delivered.'
      },
      foto: null,
      pagina: 'projetos/minimercado.html',
      selos: true,
      contatoNfc: true,
      entregas: [
        {
          titulo: { pt: 'Perfil da Empresa no Google', es: 'Perfil de Empresa en Google', en: 'Google Business Profile' },
          tituloDetalhe: { pt: 'Perfil do Minimercado no Google', es: 'Perfil del Minimercado en Google', en: 'Minimercado on Google' },
          icone: 'fa-brands fa-google',
          servico: 'perfil',
          descricao: {
            pt: 'Perfil público “Minimercado Utilidades & Variedades” no Google.',
            es: 'Perfil público “Minimercado Utilidades & Variedades” en Google.',
            en: 'Public Google profile “Minimercado Utilidades & Variedades”.'
          },
          link: { botao: { pt: 'Abrir perfil atualizado no Google', es: 'Abrir el perfil actualizado en Google', en: 'Open the current profile on Google' }, url: 'https://share.google/ZlyC1C2W73U49noDy' }
        },
        {
          titulo: { pt: 'Plaquinha NFC', es: 'Placa NFC', en: 'NFC tap sign' },
          icone: 'fa-solid fa-mobile-screen-button',
          servico: 'nfc',
          descricao: {
            pt: 'Plaquinha NFC fornecida para o negócio.',
            es: 'Placa NFC suministrada al negocio.',
            en: 'NFC tap sign supplied to the business.'
          }
        }
      ]
    }
  ];

  window.PORTFOLIO_PROJETOS = PROJETOS_REAIS;
})();

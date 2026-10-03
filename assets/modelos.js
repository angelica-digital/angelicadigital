/* ============== MODELOS DE SITES — DADOS ==============
   Fonte da página /modelos/ (PT), /es/modelos/ e /en/modelos/.
   Separado dos projetos de clientes (assets/projetos.js): modelos nunca entram na vitrine.

   Para cadastrar um modelo, acrescente um objeto na lista MODELOS_SITES abaixo:

   {
     slug: 'restaurante-sabor',                 // identificador único (letras minúsculas e hífens)
     nome: 'Sabor',                             // nome do modelo (texto ou { pt, es, en })
     nicho: {                                   // tipo de negócio; "id" agrupa os filtros por nicho
       id: 'restaurantes',
       pt: 'Restaurantes', es: 'Restaurantes', en: 'Restaurants'
     },
     descricao: {                               // descrição breve do modelo
       pt: '…', es: '…', en: '…'
     },
     demonstracao: 'https://…',                 // OBRIGATÓRIO: endereço da demonstração funcional
     imagens: {                                 // imagens de apresentação (caminhos a partir da raiz do site)
       computador: {                            // OBRIGATÓRIA
         src: 'assets/img/modelos/restaurante-sabor/computador.webp', largura: 1600, altura: 1000,
         alt: { pt: '…', es: '…', en: '…' }
       },
       celular: {                               // opcional: aparece sobre a imagem do computador
         src: 'assets/img/modelos/restaurante-sabor/celular.webp', largura: 780, altura: 1688,
         alt: { pt: '…', es: '…', en: '…' }
       }
     },
     personalizavel: [                          // itens que podem ser adaptados para cada empresa
       { pt: 'Cores e logotipo', es: 'Colores y logotipo', en: 'Colors and logo' }
     ]
   }

   Um modelo sem "demonstracao" ou sem "imagens.computador" não é exibido (nada de cartão
   sem destino). Com a lista vazia, a página mostra o convite para conversar.
   Os filtros por nicho aparecem sozinhos quando houver modelos de pelo menos dois nichos.
   Cadastre somente modelos com demonstração publicada e funcionando.
   Sem legendas nas imagens: nada de data de captura, "captura de tela", "site real"/"site
   demonstrativo" ou "clique para ampliar". A identificação "Modelo para personalizar" já vem no cartão. */
window.MODELOS_SITES = [
  {
    slug: 'clinica-aurora',
    nome: 'Clínica Aurora',
    nicho: { id: 'clinica-odontologica', pt: 'Clínica odontológica', es: 'Clínica dental', en: 'Dental clinic' },
    descricao: {
      pt: 'Site de uma página para clínicas odontológicas: tratamentos, apresentação da clínica, etapas do atendimento, dúvidas frequentes e pedido de avaliação pelo WhatsApp.',
      es: 'Sitio web de una página para clínicas dentales: tratamientos, presentación de la clínica, etapas de la atención, preguntas frecuentes y solicitud de evaluación por WhatsApp.',
      en: 'One-page website for dental clinics: treatments, clinic overview, how visits work, FAQ and assessment requests through WhatsApp.'
    },
    demonstracao: 'https://modelo-clinica-odontologica-smoky.vercel.app/',
    imagens: {
      computador: {
        src: 'assets/img/modelos/clinica-aurora/computador.webp', largura: 1280, altura: 800,
        alt: { pt: 'Página inicial do modelo Clínica Aurora no computador', es: 'Página de inicio de la plantilla Clínica Aurora en la computadora', en: 'Clínica Aurora template home page on desktop' }
      },
      celular: {
        src: 'assets/img/modelos/clinica-aurora/celular.webp', largura: 780, altura: 1688,
        alt: { pt: 'Página inicial do modelo Clínica Aurora no celular', es: 'Página de inicio de la plantilla Clínica Aurora en el celular', en: 'Clínica Aurora template home page on mobile' }
      }
    },
    personalizavel: [
      { pt: 'Nome, logotipo e cores', es: 'Nombre, logotipo y colores', en: 'Name, logo and colors' },
      { pt: 'Tratamentos e textos', es: 'Tratamientos y textos', en: 'Treatments and copy' },
      { pt: 'Fotos da clínica e da equipe', es: 'Fotos de la clínica y del equipo', en: 'Clinic and team photos' },
      { pt: 'WhatsApp, endereço e horários', es: 'WhatsApp, dirección y horarios', en: 'WhatsApp, address and hours' }
    ]
  },
  {
    slug: 'doce-abraco',
    nome: 'Doce Abraço',
    nicho: { id: 'doceria', pt: 'Doceria e confeitaria', es: 'Dulcería y repostería', en: 'Bakery and sweets' },
    descricao: {
      pt: 'Site para docerias: produtos por categoria, lista de pedido enviada pelo WhatsApp ou link para o cardápio online, consulta de encomendas para festas e galeria de fotos.',
      es: 'Sitio web para dulcerías: productos por categoría, lista de pedido enviada por WhatsApp o enlace al menú en línea, consulta de encargos para fiestas y galería de fotos.',
      en: 'Website for sweets shops: products by category, an order list sent through WhatsApp or a link to the online menu, party order requests and a photo gallery.'
    },
    demonstracao: 'https://modelo-doceria-nu.vercel.app/',
    imagens: {
      computador: {
        src: 'assets/img/modelos/doce-abraco/computador.webp', largura: 1280, altura: 800,
        alt: { pt: 'Página inicial do modelo Doce Abraço no computador', es: 'Página de inicio de la plantilla Doce Abraço en la computadora', en: 'Doce Abraço template home page on desktop' }
      },
      celular: {
        src: 'assets/img/modelos/doce-abraco/celular.webp', largura: 780, altura: 1688,
        alt: { pt: 'Página inicial do modelo Doce Abraço no celular', es: 'Página de inicio de la plantilla Doce Abraço en el celular', en: 'Doce Abraço template home page on mobile' }
      }
    },
    personalizavel: [
      { pt: 'Nome, logotipo e cores', es: 'Nombre, logotipo y colores', en: 'Name, logo and colors' },
      { pt: 'Produtos, categorias e preços', es: 'Productos, categorías y precios', en: 'Products, categories and prices' },
      { pt: 'Fotos dos doces', es: 'Fotos de los dulces', en: 'Product photos' },
      { pt: 'Pedido pelo WhatsApp ou cardápio online', es: 'Pedido por WhatsApp o menú en línea', en: 'WhatsApp orders or online menu' },
      { pt: 'Contato, endereço e horários', es: 'Contacto, dirección y horarios', en: 'Contact, address and hours' }
    ]
  }
];

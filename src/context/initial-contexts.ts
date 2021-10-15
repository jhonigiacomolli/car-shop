import { TYPE_ConfigProps, TYPE_Image, TYPE_InfoProduct, TYPE_Job_Image_Type, TYPE_Packages } from "./context-types"

const HostsPackages:TYPE_Packages[] = [
  {
    recommended: false,
    title: 'Básico',
    icon: '/assets/icone-basico.png',
    itens: [
      {
        text: 'Até 5 contas de e-mail',
        available: true
      },
      {
        text: '4 Gigabytes de espaço de aramazenamento',
        available: true
      },
      {
        text: '4 Gigabytes de tráfego de dados',
        available: true
      },
      {
        text: 'E-commerce',
        available: false,
      },
    ],
    price: 49.90,
    infoLink: '/plano-hospedagem-basico',
    buyLink: '',
  },
  {
    recommended: true,
    title: 'Ouro',
    icon: '/assets/icone-ouro.png',
    itens: [
      {
        text: 'Até 10 contas de e-mail',
        available: true
      },
      {
        text: '6 Gigabytes de espaço de aramazenamento',
        available: true
      },
      {
        text: '6 Gigabytes de tráfego de dados',
        available: true
      },
      {
        text: 'E-commerce',
        available: true,
      },
    ],
    price: 79.90,
    infoLink: '/plano-hospedagem-ouro',
    buyLink: '',
  },
  {
    recommended: false,
    title: 'Diamante',
    icon: '/assets/icone-diamante.png',
    itens: [
      {
        text: 'Sem limites de contas de e-mail',
        available: true
      },
      {
        text: '10 Gigabytes de espaço de aramazenamento',
        available: true
      },
      {
        text: '10 Gigabytes de tráfego de dados',
        available: true
      },
      {
        text: 'E-commerce',
        available: true,
      },
    ],
    price: 99.90,
    infoLink: '/plano-hospedagem-diamante',
    buyLink: '',
  }
]
const WebDevProdcuts:TYPE_InfoProduct[] = [
  {
    sectionTitle: 'INSTITUCIONAL',
    backgroundImage: '/assets/bg-site-institucional.png',
    image: '/assets/img-site-institucional.png',
    title: 'Quer aproximar sua empresa',
    subtitle: 'Do cliente de uma maneira fácil',
    description: '<p> Nós temos a solução para seu problema, uma plataforma onde você possa demonstrar a capacidade da sua empresa, seus produtos ou serviços, permitir que o cliente compartilhe dos seus ideais.<br>Permita que qualquer pessoa que esteja te procurando possa lhe encontrar através dos principais canais de comunicação com e-mail, redes sociais, telefone, whatsapp e muitas outras</p>',
    resources: [
      {
        icon: '/assets/ico-responsivo.png',
        title: 'Layout Responsivo',
        description: '<p>As informações do seu site se ajustam automaticamente a qualquer tamanho de tela melhorando a experiência do usuário</p>'
      },
      {
        icon: '/assets/ico-estatisticas.png',
        title: 'Estatísticas',
        description: '<p>Monitore os acessos efetuados ao seu site, saiba por quais páginas e com que frequência os usuários navegam pelo seu site.</p>'
      },
      {
        icon: '/assets/ico-gerenciamento.png',
        title: '100% Online',
        description: '<p>Gerencie todo o conteúdo do seu site de forma fácil e 100% online, podendo ser acessado de qualquer local apenas com conectividade a internet</p>'
      },
      {
        icon: '/assets/ico-layouts.png',
        title: 'Layouts Modernos',
        description: '<p>Os layouts fornecidos estão sempre atualizados e otimizados para as ferramentas e recursos mais recentes e esteticamente elegantes</p>'
      },
      {
        icon: '/assets/ico-otimizado.png',
        title: 'Experiência Otimizada',
        description: '<p>As ferramentas do site são desenvolvidas com objetivo de proporcionar a melhor experiência para o usuário que navega pelo seu site</p>'
      },
      {
        icon: '/assets/ico-chat.png',
        title: 'Chat',
        description: '<p>Plataforma de chat online integrado a plataforma do seu site, para que seu cliente possa interagir diretamente com sua empresa de forma online</p>'
      },
      {
        icon: '/assets/ico-busca.png',
        title: 'Mecanismo de Busca',
        description: '<p>Mecanismo de busca para facilitar o usuário a encontrar o que desejar em seu site no menor tempo possível</p>'
      },      
      {
        icon: '/assets/ico-painel-administrativo.png',
        title: 'Painel Administrativo',
        description: '<p>Painel administrativo personalizado e estruturado para realizar a manutenção do seu site de forma intuitiva</p>'
      },            
      {
        icon: '/assets/ico-compartilhamento.png',
        title: 'Compartilhamento Social',
        description: '<p>Todo o conteúdo produzido em seu site pode ser compartilhado através de mídias sociais ou canais de comunicação</p>'
      },           
      {
        icon: '/assets/ico-formulario-email.png',
        title: 'Contato via e-mail',
        description: '<p>Mensagens podem ser enviadas pelo seu site para o seu e-mail de forma fácil, intuitiva e rápida</p>'
      },           
      {
        icon: '/assets/ico-mensageiros.png',
        title: 'Mensageiros',
        description: '<p>Comunicação com seus usuários através dos principais mensageiros globais como WhatsApp e Messenger</p>'
      },           
      {
        icon: '/assets/ico-layout-segmentado.png',
        title: 'Layouts Segmentados',
        description: '<p>Layouts desenvolvidos para ramos específicos de negócios, com ferramentas para facilitar o uso</p>'
      },         
      {
        icon: '/assets/ico-redes-sociais.png',
        title: 'Integração com Redes Sociais',
        description: '<p>Ferramenta para integração com o seu perfil profissional ou da sua empresa em redes sociais com Facebook e Instagram</p>'
      },        
      {
        icon: '/assets/ico-seguranca.png',
        title: 'Certificado de Segurança',
        description: '<p>Todos os projetos são desenvolvidos com certificado de segurança SSL para proteção dos dados de usuários</p>'
      },
    ],
    buyLink: '',
    infoLink: '/site-institucional',
    contactLink: '',
    price: 1800,
  },
  {
    sectionTitle: 'LOJA VIRTUAL',
    backgroundImage: '/assets/bg-site-ecommerce.png',    
    image: '/assets/img-site-ecommerce.png',
    title: 'Deseja expandir os horizontes da sua Loja',
    subtitle: 'a Internet é ferramenta mais Rápida!',
    description: '<p>Não perca tempo e traga a sua loja para o mundo virtual. <br> Para este passo crucial nós temos o produto perfeito para você, uma plataforma integrada com os principais métodos de pagamento do mercado, gerenciamento de estoque e transações completamente online, integração com Mercado Livre, fácil manutenção de produtos, notificações por e-mail e muito mais</p>',
    resources: [             
      {
        icon: '/assets/ico-seguranca.png',
        title: 'Certificado de Segurança',
        description: '<p>A comunicação entre o navegador utilizado pelo cliente e o servidor que hospeda o seu site em criptografada visando proteger os dados.</p>'
      },
      {
        icon: '/assets/ico-controle-estoque.png',
        title: 'Gerenciamento de estoque',
        description: '<p>Gerencie o estoque da sua loja virtual de forma fácil e rápido, seja notificado via e-mail quando o estoque do produto atingir o limiar de estoque baixo </p>'
      },
      {
        icon: '/assets/ico-integracoes.png',
        title: 'Integrações',
        description: '<p>Conecte sua loja virtual a outras plataformas como Correios, Facebook, Mercado Livre para facilitar a experiência do usuário </p>'
      },
      {
        icon: '/assets/ico-metricas.png',
        title: 'Métricas',
        description: '<p>Monitore a performance dos seus produtos e elabore a melhor estratégia para suas vendas online </p>'
      },
      {
        icon: '/assets/ico-area-cliente.png',
        title: 'Área do Cliente',
        description: '<p>Seu cliente pode monitorar seus pedidos e suas informações através de um painel exclusivo e de fácil acesso.</p>'
      },
      {
        icon: '/assets/ico-chat.png',
        title: 'Chat',
        description: '<p>Plataforma de chat online integrado a plataforma do seu site, para que seu cliente possa interagir diretamente com sua empresa de forma online </p>'
      },
      {
        icon: '/assets/ico-responsivo.png',
        title: 'Layout Responsivo',
        description: '<p>As informações do seu site se ajustam automaticamente a qualquer tamanho de tela melhorando a experiência do usuário </p>'
      },
      {
        icon: '/assets/ico-estatisticas.png',
        title: 'Estatísticas',
        description: '<p>Monitore os acessos efetuados ao seu site, saiba por quais páginas e com que frequência os usuários navegam pelo seu site.</p>'
      },
      {
        icon: '/assets/ico-gerenciamento.png',
        title: '100% Online',
        description: '<p>Gerencie todo o conteúdo do seu site de forma fácil e 100% online, podendo ser acessado de qualquer local apenas com conectividade a internet</p>'
      },
      {
        icon: '/assets/ico-layouts.png',
        title: 'Layouts Modernos',
        description: '<p>Os layouts fornecidos estão sempre atualizados e otimizados para as ferramentas e recursos mais recentes e esteticamente elegantes</p>'
      },
      {
        icon: '/assets/ico-otimizado.png',
        title: 'Experiência Otimizada',
        description: '<p>As ferramentas do site são desenvolvidas com objetivo de proporcionar a melhor experiência para o usuário que navega pelo seu site</p>'
      },
      {
        icon: '/assets/ico-busca.png',
        title: 'Mecanismo de Busca',
        description: '<p>Mecanismo de busca para facilitar o usuário a encontrar o que desejar em seu site no menor tempo possível</p>'
      },      
      {
        icon: '/assets/ico-painel-administrativo.png',
        title: 'Painel Administrativo',
        description: '<p>Painel administrativo personalizado e estruturado para realizar a manutenção do seu site de forma intuitiva</p>'
      },            
      {
        icon: '/assets/ico-compartilhamento.png',
        title: 'Compartilhamento Social',
        description: '<p>Todo o conteúdo produzido em seu site pode ser compartilhado através de mídias sociais ou canais de comunicação</p>'
      },           
      {
        icon: '/assets/ico-formulario-email.png',
        title: 'Contato via e-mail',
        description: '<p>Mensagens podem ser enviadas pelo seu site para o seu e-mail de forma fácil, intuitiva e rápida</p>'
      },           
      {
        icon: '/assets/ico-mensageiros.png',
        title: 'Mensageiros',
        description: '<p>Comunicação com seus usuários através dos principais mensageiros globais como WhatsApp e Messenger</p>'
      },             
      {
        icon: '/assets/ico-redes-sociais.png',
        title: 'Integração com Redes Sociais',
        description: '<p>Ferramenta para integração com o seu perfil profissional ou da sua empresa em redes sociais com Facebook e Instagram</p>'
      }, 
    ],
    buyLink: '',
    infoLink: '/plataforma-ecommerce',
    contactLink: '',
    price: 2000,
  },
]
const Testemonials: TYPE_Image[] = [
  {id: 0, url:'https://database.microsite.net.br/wp-content/uploads/2021/10/Exitojus-T.png'},
  {id: 1, url:'https://database.microsite.net.br/wp-content/uploads/2021/10/Biscuit-da-Bina-T.png'},
  {id: 2, url: 'https://database.microsite.net.br/wp-content/uploads/2021/10/Piubello-T.png'},
  {id: 3, url: 'https://database.microsite.net.br/wp-content/uploads/2021/10/Lussani-T.png'},
]
const SocialMediaProducts:TYPE_InfoProduct[] = [
  {
    sectionTitle: 'BÁSICO',
    backgroundImage: '/assets/bg-midias-basico.png',
    image: '/assets/img-midia-basico.png',
    title: '6 PUBLICAÇÕES POR PERÍODO',
    subtitle: 'R$ 45,00 EM ANÚNCIOS',
    description: '<p>NO FACEBOOK E INSTAGRAM</p>',
    resources: [
      {
        icon: '',
        title: '6 publicações',
        description: ''
      },
      {
        icon: '',
        title: 'Cronograma para paeríodo de 30 dias',
        description: ''
      },
      {
        icon: '',
        title: 'fidelidade de 6 meses',
        description: ''
      },
      {
        icon: '',
        title: 'Relatório analítico de resultados',
        description: ''
      }
    ],
    price: 399.90,
    buyLink: '',
    infoLink: '/pacote-midias-basico',
    contactLink: '',
  },
  {
    sectionTitle: 'OURO',
    backgroundImage: '/assets/bg-midias-ouro.png',
    image: '/assets/img-midia-ouro.png',
    title: '10 PUBLICAÇÕES POR PERÍODO',
    subtitle: 'R$ 90,00 EM ANÚNCIOS',
    description: '<p>NO FACEBOOK E INSTAGRAM</p>',
    resources: [
      {
        icon: '',
        title: '10 publicações',
        description: ''
      },
      {
        icon: '',
        title: 'Cronograma para paeríodo de 30 dias',
        description: ''
      },
      {
        icon: '',
        title: 'fidelidade de 6 meses',
        description: ''
      },
      {
        icon: '',
        title: 'Relatório analítico de resultados',
        description: ''
      }
    ],
    price: 599.90,
    buyLink: '',
    infoLink: '/pacote-midias-ouro',
    contactLink: '',
  },
  {
    sectionTitle: 'DIAMANTE',
    backgroundImage: '/assets/bg-midias-diamante.png',
    image: '/assets/img-midia-diamante.png',
    title: '15 PUBLICAÇÕES POR PERÍODO',
    subtitle: 'R$ 150,00 EM ANÚNCIOS',
    description: '<p>NO FACEBOOK E INSTAGRAM</p>',
    resources: [
      {
        icon: '',
        title: '15 publicações',
        description: ''
      },
      {
        icon: '',
        title: 'Cronograma para paeríodo de 30 dias',
        description: ''
      },
      {
        icon: '',
        title: 'fidelidade de 6 meses',
        description: ''
      },
      {
        icon: '',
        title: 'Relatório analítico de resultados',
        description: ''
      }
    ],
    price: 799.90,
    buyLink: '',
    infoLink: '/pacote-midias-diamante',
    contactLink: '',
  },
]
const carTaxonomies = {
    assembler: [],
    condition: [],
    transmission: [],
    fuel: [],
    motor: [],
    ports: [],
    endPlate: [],
    year: [],
    color: [],
    optional: [],
    direction: [],
}
const jobsTaxonomies = {
  sector: [],
  type: [],
  remunerationType: [],
  careerLevel: [],
  expirience: [],
  gender: [],
  prerequisites: [],
}
const configProps: TYPE_ConfigProps = {
    id: 0,
    siteTitle: '',
    siteDescription: '',
    companyFixedPhone: '',
    companyMobilePhone: '',
    companyEmailAddress: '',
    structure: [],
    favIcon: '',
    revalidate: 0,
    header: {
        logo: '',
        topBarLeft: '',
        topBarRight: '',
        headScripts: '',
    },
    slideShow: {
        config: {
        isSlideShow: true,
        width: 0,
        height: 0,
        displayNav: true,
        displayTitle: true,
        displaySubTitle: true,
        displayDescription: true,
        displayButton: true,
        duration: 0,
        },
        slides: []
    },
    aboutUs: {
        imageURL: '',
        title: '',
        text: '',
    },
    jobs: {
      displayTitle: false,
      displayDescription: false,
      displaySector: false,
      displayType: false,
      displaySkills: false,
      displayCareerLevel: false,
      displayGender: false,
      displayPrerequisites: false,
      displayRemunerationType: false,
      displayRemuneration: false,
      displayImage: false,
      remunerationLabel: "",
      jobImageType: 'default' as TYPE_Job_Image_Type,
      jobImageDefault: ""
    },
    cars: {
        config: {
          carsPerPage: 0,
          displayFilters: true,
          displayFilterCondition: true,
          displayFilterAssembler: true,
          displayFilterTransmission: true,
          displayFilterFuel: true,
          displayFilterMotor: true,
          displayFilterPorts: true,
          displayFilterDirection: true,
          displayFilterEndPlate: true,
          displayFilterYear: true,
          displayFilterColor: true,
          homeFilter1: '',
          homeFilter2: '',
          homeFilter3: '',
          homeFilter4: '',
        },
        latestCars: {
          numberOfCars: 0
        },
        carPage: {
          dataSectionTitle: '',
          optionsSectionTitle: '',
          descriptionSectionTitle: '',
        }
      },
      blog: {
        config: {
          postsPerPage: 0,
        },
        latestPosts: {
          sectionTitle: '',
          numberOfPosts: 0,
          buttonLabel: '',
          buttonLink: '',
        }
      },
    portfolio: {
      latestPortfolios: {
        itemsPerPage: 0,
      }
    },
    footer: {
        addressTitle:'',
        addressText:'',
        phoneTitle:'',
        phoneText:'',
        scheduleTitle:'',
        scheduleText:'',
    },
    copyright: {
        message: '',
    },
    socials: [],
    lgpd: {
        cookieEnabled: true,
        cookieRegister: true,
        cookieExpireTime: '',
        cookieMessage: '',
    },
    privacePolicity: {
        content: '',
        downloadLink: '',
        lastModified: '',
    }
}
const emptyTaxonomy = {
  id: 0,
  name: '',
  slug: '',
} 

export { carTaxonomies, jobsTaxonomies, configProps, emptyTaxonomy, HostsPackages, WebDevProdcuts, Testemonials, SocialMediaProducts }
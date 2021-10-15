import { ReactElement } from "react"
import { Article, Bag, BuildingConstruction, Config, Folder, Home2, IconBox, Jobs, Logout, Slides, SupportIcon, User2, Vehicle2 } from "../components/icons"
import Dashboard from "../components/admin/dashboard/dashboard"
import Access from '../components/admin/dashboard/access'
import Devices from '../components/admin/dashboard/devices'
import Navigators from '../components/admin/dashboard/navigators'
import OperationalSystem from '../components/admin/dashboard/operationalSystem'
import AllPosts from '../components/admin/blog/all-posts'
import Post from '../components/admin/blog/post'
import Categories from '../components/admin/blog/categories'
import Tags from '../components/admin/blog/tags'
import AllCars from '../components/admin/cars/all-cars'
import Car from '../components/admin/cars/car'
import Condition from '../components/admin/cars/condition'
import Assembler from '../components/admin/cars/assembler'
import Transmission from '../components/admin/cars/transmission'
import Motor from '../components/admin/cars/motor'
import Fuel from '../components/admin/cars/fuel'
import Ports from '../components/admin/cars/ports'
import Direction from '../components/admin/cars/direction'
import EndPlate from '../components/admin/cars/end-plate'
import Color from '../components/admin/cars/color'
import AllSlides from '../components/admin/slides/all-slides'
import Slide from '../components/admin/slides/slide'
import Company from '../components/admin/config/company'
import Socials from '../components/admin/config/socials'
import Footer from '../components/admin/config/footer'
import Optional from '../components/admin/cars/optional'
import Year from '../components/admin/cars/year'
import Header from '../components/admin/config/header'
import BlogConfig from '../components/admin/blog/blog-config'
import CarConfig from '../components/admin/cars/car-config'
import SlideConfig from '../components/admin/slides/slide-config'
import AllUsers from '../components/admin/user/all-users'
import UserPage from '../components/admin/user/user'
import Structure from "../components/admin/config/structure"
import LGPD from "../components/admin/config/lgpd"
import AllInfoBoxes from "../components/admin/info-boxes/all-boxes"
import InfoBox from "../components/admin/info-boxes/info-box"
import AllBRanches from "../components/admin/branches/all-branches"
import Branch from "../components/admin/branches/branch"
import AllJobs from "../components/admin/jobs/all-jobs"
import Job from "../components/admin/jobs/job"
import Sector from "../components/admin/jobs/sector"
import Type from "../components/admin/jobs/type"
import RemunerationType from "../components/admin/jobs/remuneration-type"
import CareerLevel from "../components/admin/jobs/carerr-level"
import Expirience from "../components/admin/jobs/expirience"
import Gender from "../components/admin/jobs/gender"
import Prerequisistes from "../components/admin/jobs/prerequisites"
import JobsConfig from "../components/admin/jobs/jobs-config"
import AllPortfolios from "../components/admin/portfolio/all-portfolios"
import Portfolio from "../components/admin/portfolio/portfolio"
import PortfolioConfig from "../components/admin/portfolio/portfolio-config"
import AllTickets from "../components/admin/tickets/all-tickets"
import Ticket from "../components/admin/tickets/ticket"

type Capability = {
    administrator: boolean
    editor: boolean
    contributor: boolean
}
export type TYPE_AdminPanelSubOption = {
    id: string
    display: boolean
    capability: Capability
    visible: boolean
    active: boolean
    title: string
    component: ReactElement
}
export type TYPE_AdminPanelOption = {
    id: string
    display: boolean
    capability: Capability
    icon: ReactElement
    title: string
    subitens?: TYPE_AdminPanelSubOption[]
}

const api = 'https://database.microsite.net.br/ms-api/v1'
const token = 'https://database.microsite.net.br/ms-api/jwt-auth/v1/token'
const token_validation = 'https://database.microsite.net.br/ms-api/jwt-auth/v1/token/validate'
const administration = 'https://database.microsite.net.br/ms-api/v1'
const support_api = `${administration}/tickets`


const AdminPanelOption: TYPE_AdminPanelOption[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: false,
        },
        icon: <Home2 color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>,
        subitens: [
            {
                id: 'home',
                display: true,
                visible: true,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Inicio',
                component: <Dashboard />,
            }, 
            {
                id: 'access',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Acessos',
                component: <Access />,
            }, 
            {
                id: 'devices',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Dispositivos',
                component: <Devices />,
            }, 
            {
                id: 'browsers',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Navegadores',
                component: <Navigators />,
            }, 
            {
                id: 'operationa-systems',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Sistema Operacional',
                component: <OperationalSystem />,
            }, 
        ]
    },
    {
        id: 'articles',
        title: 'Artigos',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: true,
        },
        icon: <Article color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>,   
        subitens: [
            {
                id: 'all-articles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Todos os Artigos',
                component: <AllPosts />,
            }, 
            {
                id: 'new-article',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Novo Artigo',
                component: <Post />,
            }, 
            {
                id: 'category-articles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Categorias',
                component: <Categories />,
            }, 
            {
                id: 'tags-articles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Tags',
                component: <Tags />,
            }, 
            {
                id: 'config-articles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Configurações',
                component: <BlogConfig />,
            },
        ]
    },
    {
        id: 'portfolios',
        title: 'Portfólios',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: false,
        },
        icon: <Folder color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>,   
        subitens: [
            {
                id: 'all-portfolios',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Todos os Portólios',
                component: <AllPortfolios />,
            }, 
            {
                id: 'new-portfolios',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Novo Portfólio',
                component: <Portfolio />,
            }, 
            {
                id: 'config-portfolios',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Configurações',
                component: <PortfolioConfig />,
            }, 
        ]
    },
    {
        id: 'info-boxes',
        title: 'Box de Informação',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: true,
        },
        icon: <IconBox color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>,   
        subitens: [
            {
                id: 'all-info-boxes',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Todos os Info Boxes',
                component: <AllInfoBoxes />,
            }, 
            {
                id: 'new-info-boxes',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Novo Info Box',
                component: <InfoBox />,
            }, 
        ]
    },
    {
        id: 'slides',
        title: 'Slides',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: true,
        },
        icon: <Slides color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>,
        subitens: [
            {
                id: 'all-slides',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Todos os Slides',
                component: <AllSlides />,
            }, 
            {
                id: 'new-slides',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Novo Slide',
                component: <Slide />,
            }, 
            {
                id: 'configuration-slides',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Configurações',
                component: <SlideConfig />,
            },
        ]
    },
    {
        id: 'jobs',
        title: 'Vagas de Emprego',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: true,
        },
        icon: <Bag color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>,
        subitens: [
            {
                id: 'all-jobs',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Todos as Vagas',
                component: <AllJobs />,
            }, 
            {
                id: 'new-jobs',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Nova Vaga',
                component: <Job />,
            },
            {
                id: 'sector-jobs',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Setores',
                component: <Sector />,
            },  
            {
                id: 'type-jobs',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Tipos de Vagas',
                component: <Type />,
            },
            {
                id: 'remuneration-type-jobs',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Tipos de Remuneração',
                component: <RemunerationType />,
            },
            {
                id: 'career-level-jobs',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Níveis de Carreira',
                component: <CareerLevel />,
            },
            {
                id: 'expirience-jobs',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Experiência',
                component: <Expirience />,
            },
            {
                id: 'gender-jobs',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Gêneros',
                component: <Gender />,
            },
            {
                id: 'prerequisites-jobs',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Pré Requisitos',
                component: <Prerequisistes />,
            },
            {
                id: 'configuration-jobs',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Configurações',
                component: <JobsConfig />,
            },
        ]
    },
    {
        id: 'vehicles',
        title: 'Veículo',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: true,
        },
        icon: <Vehicle2 color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>,
        subitens: [
            {
                id: 'all-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Todos os Veículos',
                component: <AllCars />,
            }, 
            {
                id: 'new-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Novo Veículos',
                component: <Car />,
            }, 
            {
                id: 'condition-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Condição',
                component: <Condition />,
            }, 
            {
                id: 'assembler-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Montadora',
                component: <Assembler />,
            }, 
            {
                id: 'transmission-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Transmissão',
                component: <Transmission />,
            }, 
            {
                id: 'fuel-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Combustivel',
                component: <Fuel />,
            }, 
            {
                id: 'motor-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Motorização',
                component: <Motor />,
            }, 
            {
                id: 'ports-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Portas',
                component: <Ports />,
            }, 
            {
                id: 'direction-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Direção',
                component: <Direction />,
            }, 
            {
                id: 'end-plate-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Final da Placa',
                component: <EndPlate />,
            }, 
            {
                id: 'color-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Cor',
                component: <Color />,
            }, 
            {
                id: 'year-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Ano',
                component: <Year />,
            }, 
            {
                id: 'optionals-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Opcionais',
                component: <Optional />,
            }, 
            {
                id: 'configuration-vehicles',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Configurações',
                component: <CarConfig />,
            },
        ]
    },
    {
        id: 'branches',
        title: 'Filiais',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: true,
        },
        icon: <BuildingConstruction color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>,   
        subitens: [
            {
                id: 'all-branches',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Todos as Filiais',
                component: <AllBRanches />,
            }, 
            {
                id: 'new-branches',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Nova Filial',
                component: <Branch />,
            }, 
        ]
    },
    {
        id: 'configuration',
        title: 'Configurações',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: false,
        },
        icon: <Config color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>,
        subitens: [
            {
                id: 'general-configuration',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Geral',
                component: <Company />,
            }, 
            {
                id: 'structure-configuration',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Estrutura',
                component: <Structure />,
            },
            {
                id: 'socials-configuration',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Redes Sociais',
                component: <Socials />,
            }, 
            {
                id: 'header-configuration',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Cabeçalho',
                component: <Header />,
            },
            {
                id: 'footer-configuration',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Rodapé',
                component: <Footer />,
            },
            {
                id: 'lgdp-configuration',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'LGPD',
                component: <LGPD />,
            },
        ]
    },
    {
        id: 'users',
        title: 'Usuários',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: true,
        },
        icon: <User2 color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>,
        subitens: [
            {
                id: 'all-users',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Todos os Usuários',
                component: <AllUsers />,
            }, 
            {
                id: 'new-users',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: false,
                },
                active:  false,
                title: 'Novo Usuário',
                component: <UserPage />,
            },
        ]
    },
    {
        id: 'tickets',
        title: 'Suporte',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: false,
        },
        icon: <SupportIcon color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>,   
        subitens: [
            {
                id: 'all-tickets',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Todos os chamados',
                component: <AllTickets />,
            }, 
            {
                id: 'new-tickets',
                display: true,
                visible: false,
                capability: {
                    administrator: true,
                    editor: true,
                    contributor: true,
                },
                active:  false,
                title: 'Abrir chamado',
                component: <Ticket />,
            }, 
        ]
    },
    {
        id: 'logout',
        title: 'Sair',
        display:  true,
        capability: {
            administrator: true,
            editor: true,
            contributor: true,
        },
        icon: <Logout color1={'var(--menu-icon-color1)'} color2={'var(--menu-icon-color2)'}/>
    },
]

export const infoBoxesIcons: {[key: string]: ReactElement}[] = [
    {icon: <p></p>},
]

export { api, token, token_validation, administration, support_api, AdminPanelOption }
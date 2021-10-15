const { default: axios } = require('axios')
const api = 'https://www.database.microsite.net.br/ms-api/v1'

function CreateNewDataBase() {
    CreateDefaultConfig()
    // CreateDefaultEmailToken()
    // CreateDefaultAssembler()
    // CreateDefaultColors()
    // CreateDefaultCondition()
    // CreateDefaultDirection()
    // CreateDefaultEndPlate()
    // CreateDefaultFuel()
    // CreateDefaultMotor()
    // CreateDefaultOptionals()
    // CreateDefaultPorts()
    // CreateDefaultTransmission()
    // CreateDefaultYear()
}

function CreateDefaultEmailToken() {
    axios({
        method: 'POST',
        url: `${api}/user`,
        data: {
            name: 'Login Token',
            email: 'token@microsite.net.br',
            username: 'login-token',
            capability: 'contributor',
            password: 'microsite2021'
        }
    }).then(resp => console.log(resp.data))
}

function CreateDefaultConfig() {
    axios({
        method: 'POST',
        url: `${api}/config/create`,
        data: {
            'type': 'general',
            'siteTitle': 'Microsite Automóveis',
            'siteDescription': 'Portal de anúncios e comércio de veículos online',
            'companyFixedPhone': '49 99181 7890',
            'companyMobilePhone': '49 99181 7890',
            'companyEmailAddress': 'comercial@microsite.net.br',
            'structure': [],
            'aboutUsTitle': 'Sobre nós',
            'aboutUsText': '',
            'aboutUsImage': '',
            'revalidate': 1,
            'footerAddressTitle': 'Endereço',
            'footerAddressText': '<p>Rua Getulio Vargas, 777, Centro, Concórdia/SC</p>',
            'footerPhoneTitle': 'Telefone',
            'footerPhoneText': '<p>49 99181 7890</p>',
            'footerScheduleTitle': 'Horários de Atendimento',
            'footerScheduleText': '<p>Segunda à Sexta: 08:00 – 12:00 | 13:30 – 18:00&nbsp;</p>\r\n<p>Sábado: 08:00 – 12:00&nbsp;</p>\r\n<p>Domingo: Fechado</p>',
            'copyright': '<p>© 2020 <a href=\"https://www.microsite.net.br\" target=\"_blank\">Microsite Agência Digital</a> Todos os direitos reservados.</p>',
            'topBarLeft': '<p><a href=\"#\">E</a>ntre em contato e solicite um orçamento</p>',
            'topBarRight': '<p>08:00 - 12:00 | 13:30 -18:00</p>',
            'headScripts': '',
            'lgpd': 'true',
            'lgpdRegister': 'false',
            'lgpdExpire': 1,
            'lgpdMessage': '<p>Este site utiliza cookies para proporcionar a melhor experiência para você usuário. Ao aceitar ou ao continuar navegando pelo site entendemos que você concorda com a utilização de todos os cookies</p>',
            'privacePolicityContent': '',
            'privacePolicityDocLink': '',
            'privacePolicityLastModified': '',
            'facebook': '',
            'instagram': '',
            'linkedin': '',
            'skype': '',
            'telegram': '',
            'twitter': '',
            'whatsapp': '',
            'youtube': '',
            'blogPostsPerPage': 10,
            'latestPostsTitle': 'Blog',
            'latestPostsQnt': 3,
            'latestPostsButtonLabel': 'Todas as Matérias',
            'latestPostsButtonLink': '/blog',
            "displayTitle": "",
            "displayDescription": "",
            "displaySector": "",
            "displayType": "",
            "displaySkills": "",
            "displayCareerLevel": "",
            "displayGender": "",
            "displayPrerequisites": "",
            "displayRemunerationType": "",
            "displayRemuneration": "",
            "displayImage": "",
            "remunerationLabel": "",
            "jobImageType": "default",
            "jobImageDefault": "",
            'carsPerPage': 10,
            'displayFilters': "true",
            'displayFilterCondition': "true",
            'displayFilterAssembler': "true",
            'displayFilterTransmission': "true",
            'displayFilterFuel': "true",
            'displayFilterMotor': "true",
            'displayFilterPorts': "true",
            'displayFilterDirection': "true",
            'displayFilterEndPlate': "true",
            'displayFilterYear': "true",
            'displayFilterColor': "true",
            'homeFilter1': 'condition',
            'homeFilter2': 'assembler',
            'homeFilter3': 'transmission',
            'homeFilter4': 'fuel',
            'numberOfCars': 8,
            'dataSectionTitle': 'Dados do Veículo',
            'optionsSectionTitle': 'Itens Opcionais',
            'descriptionSectionTitle': 'Diferenciais do Veículo',
            'isSlideShow': 'true',
            'slideshowWidth': '1920',
            'slideshowHeigth': '900',
            'slideshowDisplayNav': "true",
            'slideshowDisplayTitle': "true",
            'slideshowDisplaySubtitle': "true",
            'slideshowDisplayDescription': "true",
            'slideshowDisplayButton': "true",
            'slideshowDuration': '5000',
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}

function CreateDefaultCondition() {
    axios({
        method: 'POST',
        url: `${api}/car/default-values`,
        data: {
            'field': 'condition',
            'matrix': [
                'Novo',
                'Seminovo',
            ]
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}

function CreateDefaultAssembler() {
    axios({
        method: 'POST',
        url: `${api}/car/default-values`,
        data: {
            'field': 'assembler',
            'matrix': [
                'Audi',
                'BMW',
                'Chery',
                'Citroën',
                'Fiat',
                'Ford',
                'GM | Chevrolet',
                'Honda',
                'Hyundai',
                'Jeep',
                'Land Rover',
                'Mercedes-Benz',
                'Mitsubishi',
                'Nissan',
                'Peugeot',
                'Kia',
                'Renault',
                'Toyota',
                'Volkswagen',
                'Volvo',
            ]
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}

function CreateDefaultTransmission() {
    axios({
        method: 'POST',
        url: `${api}/car/default-values`,
        data: {
            'field': 'transmission',
            'matrix': [
                'Automática',
                'Automatizada',
                'CVT',
                'Manual',
                'Semiautomática | Sequencial',
            ]
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}

function CreateDefaultFuel() {
    axios({
        method: 'POST',
        url: `${api}/car/default-values`,
        data: {
            'field': 'fuel',
            'matrix': [
                'Diesel',
                'Etanol',
                'Flex',
                'Gasolina',
                'GNV',
                'Elétrico'
            ]
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}

function CreateDefaultMotor() {
    axios({
        method: 'POST',
        url: `${api}/car/default-values`,
        data: {
            'field': 'motor',
            'matrix': [
                '1.0',
                '1.0 Turbo',
                '1.3',
                '1.3 Turbo',
                '1.4',
                '1.4 Turbo',
                '1.5',
                '1.6',
                '1.6 Turbo',
                '1.8',
                '1.8 Turbo',
                '2.0',
                '3.0 Turbo',
                '2.2',
                '2.3',
                '2.4',
                '2.5',
                '2.8',
                '3.0',
            ]
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}

function CreateDefaultPorts() {
    axios({
        method: 'POST',
        url: `${api}/car/default-values`,
        data: {
            'field': 'ports',
            'matrix': [
                '2 Portas',
                '4 Portas',
            ]
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}

function CreateDefaultDirection() {
    axios({
        method: 'POST',
        url: `${api}/car/default-values`,
        data: {
            'field': 'direction',
            'matrix': [
                'Mecânica',
                'Elétrica',
                'Eletro-hidráulica',
                'Hidráulica',
            ]
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}

function CreateDefaultColors() {
    axios({
        method: 'POST',
        url: `${api}/car/default-values`,
        data: {
            'field': 'color',
            'matrix': [
                'Amarelo',
                'Azul',
                'Bege',
                'Branco',
                'Cinza',
                'Grafite',
                'Marrom',
                'Prata',
                'Preto',
                'Roxo',
                'Verde',
                'Vermelho',
            ]
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}

function CreateDefaultEndPlate() {
    axios({
        method: 'POST',
        url: `${api}/car/default-values`,
        data: {
            'field': 'endPlate',
            'matrix': ['0',1,2,3,4,5,6,7,8,9]
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}

function CreateDefaultYear() {
    axios({
        method: 'POST',
        url: `${api}/car/default-values`,
        data: {
            'field': 'year',
            'matrix': [2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2001,200,1999,1998,1997,1996,1995,1994,1993,1992,1990,1989,1988,1987,1986,1985,1984,1983,1982,1981,1980]
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}

function CreateDefaultOptionals() {
    axios({
        method: 'POST',
        url: `${api}/car/default-values`,
        data: {
            'field': 'optional',
            'matrix': [
                'Airbag',
                'Alarme',
                'Ár Quente',
                'Ár-condicionado',
                'Bancos com Regulagem de Altura',
                'Bancos em Couro',
                'Bluetooth',
                'Câmera de Ré',
                'Central Multimidia',
                'Comandos de Som no Volante',
                'Computador de Bordo',
                'Controle de Estabilidade',
                'Controle de Tração',
                'Desembacador Traseiro',
                'Faróis de Neblina',
                'Freios ABS',
                'GPS',
                'Limpador Traseiro',
                'Piloto Automático',
                'Retrovisores Elétricos',
                'Rodas de Liga Leve',
                'Sensor de Estacionamento',
                'Som com CD Player',
                'Som com Entrada USB',
                'Teto Solar',
                'Trio Elétrico',
                'Travas Elétricas',
                'Tração 4x4',
                'Único Dono',
                'Volante Escamoteável',

            ]
        }
    }).then(resp => { console.log(resp.data) }).catch(error => {})
}


CreateNewDataBase()
import Axios from 'axios'
import { api } from '../api/api'

export const RegisterAccess = async () => {
    //Define qual o browser utilizado
    const agent = navigator.userAgent
    let browser
    if (agent.includes('Firefox')) {
        browser = 'Mozilla Firefox'
    }
    else if (agent.includes('Chrome') && !agent.includes('OPR') && !agent.includes('Edg')) {
        browser = "Google Chrome"
    }
    else if (agent.includes('OPR')) {
        browser = "Opera"
    }
    else if (agent.includes('Safari') && !agent.includes('Chrome')) {
        browser = "Safari"
    }
    else if (agent.includes('Edg')){
        browser = "Microsoft Edge"
    }
    else {
        browser = "Outro"
    }

    //Busca o IP do usuário
    const ip = await Axios('https://api.ipify.org')
    
    //Define o dispositivo utilizado pelo usuário
    let device
    if (window.innerWidth <= 767) {
        device = 'Mobile'
    }
    if (window.innerWidth > 767 && window.innerWidth <= 1024) {
        device = 'Tablet'
    }
    if (window.innerWidth > 1024) {
        device = 'Desktop'
    }
    
    //Define o sistema operacional utilizado pelo usuário
    let os
    window.navigator.userAgent.indexOf("Windows NT 10.0")!== -1 ? os = "Windows 10" : ""
    window.navigator.userAgent.indexOf("Windows NT 6.2") !== -1 ? os = "Windows 8" : ""
    window.navigator.userAgent.indexOf("Windows NT 6.1") !== -1 ? os = "Windows 7" : ""
    window.navigator.userAgent.indexOf("Windows NT 6.0") !== -1 ? os = "Windows Vista" : ""
    window.navigator.userAgent.indexOf("Windows NT 5.1") !== -1 ? os = "Windows XP" : ""
    window.navigator.userAgent.indexOf("Windows NT 5.0") !== -1 ? os = "Windows 2000" : ""
    window.navigator.userAgent.indexOf("Mac")            !== -1 ? os = "Mac/iOS" : ""
    window.navigator.userAgent.indexOf("X11")            !== -1 ? os = "UNIX" : ""
    window.navigator.userAgent.indexOf("Linux")          !== -1 ? os = "Linux" : ""

    //Grava no banco de dados os dados de acesso
    if(browser && ip && os && device && !document.URL.includes('localhost:')) {
        Axios({
            method: 'POST',
            url: `${api}/access`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                'browser': browser,
                'ip': ip.data,
                'device': device,
                'os': os,
                'locale': window.navigator.language.split('-')[1],
                'language': window.navigator.language,
                'url': document.URL,
                'date': new Date().toLocaleDateString('pt-BR'),
                'time': new Date().toLocaleTimeString('pt-BR'),
                'userAgent': window.navigator.userAgent
            }
        }).then(resp => '').catch((error) => console.log(error))
    }
}


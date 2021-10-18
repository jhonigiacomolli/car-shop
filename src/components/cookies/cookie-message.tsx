import axios from 'axios'
import { useEffect, useState } from 'react'
import ptBR from 'date-fns/locale/pt-BR'
import Styles from './cookie-message.module.css'
import { useConfig } from 'context'
import { addDays, format } from 'date-fns'
import { api } from 'api/api'
import PrimaryButton from 'components/buttons/primary-button'

const CookieMessage = () => {
    const { config } = useConfig()
    const [LGPDContentment, setLGPDContentment] = useState(false)
    const [ip, setIp] = useState('')
    
    useEffect(() => {
        setLGPDContentment(document.cookie === 'cookie_message_accepted=true')
        axios.get<string>('https://api.ipify.org').then(resp => setIp(resp.data))
    }, [])

    useEffect(() => {
        if(LGPDContentment || !config.lgpd.cookieEnabled) {
          const script = document.getElementsByTagName('head')
          script[0].insertAdjacentHTML('beforeend',config.header.headScripts)
        }
    }, [LGPDContentment, config])    

    function acceptCookie() {
        document.cookie = `cookie_message_accepted=${true};expires=${addDays(new Date(), Number((config && config.lgpd.cookieExpireTime) ? config.lgpd.cookieExpireTime : 1))}; SameSite=Strict; Secure`
        config && config.lgpd.cookieRegister && registerContentment()
        setLGPDContentment(true)
    }

    function registerContentment() {
        try {
            axios.post(`${api}/lgpd`, {
                data: {
                    'ip': ip,
                    'date': format(new Date(), 'dd/MM/yyyy HH:mm:ss', {locale: ptBR} ),
                    'page': document.URL,
                    'userAgent': navigator.userAgent
                }
            })
        }catch {
            
        }
    }

    return (
        <>
            {!LGPDContentment && <div className={Styles.container}>
                <div className={Styles.content}>
                    <div dangerouslySetInnerHTML={{__html: (config && config.lgpd && config.lgpd.cookieMessage) ? config.lgpd.cookieMessage : ''}} />
                    <div className={Styles.actionContainer}>
                        <PrimaryButton className={Styles.buttonDetach} onClick={() => acceptCookie()} >Aceitar</PrimaryButton>
                        <PrimaryButton className={Styles.button} link={'/privace-policity'} >Politica de Privacidade</PrimaryButton>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default CookieMessage

import { Whatsapp } from 'components/icons'
import { useConfig } from 'context'
import { useEffect, useState } from 'react'
import Styles from './whatsapp-chat.module.css'

const WhatsAppChat = () => {
    const { config, position } = useConfig()
    const [number, setNumber] = useState('')

    useEffect(() => {
        const phone = config.companyMobilePhone ? config.companyMobilePhone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '').replace(' ', '') : ''
        setNumber(phone)
    }, [config])

    return (
        <a 
            className={`${Styles.chat} ${(position === 0 || !position) ? Styles.init : Styles.noInit}`} 
            href={config ? `https://wa.me/55${number}` : '#'} 
            target={'_blank'} 
            rel={'noopener noreferrer'}
        >
                <Whatsapp />
        </a>
    )
}

export default WhatsAppChat

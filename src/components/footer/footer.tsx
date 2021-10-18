import React from 'react'
import Image from 'next/image'
import { useConfig } from 'context'
import { Phone, Pointer, UserMail, Whatsapp } from 'components/icons'
import ContactForm from 'components/contact-form/contact-form'
import Styles from './footer.module.css'

type FooterProps = {
    id: string
}
const Footer = ({ id }: FooterProps) => {
    const { config, windowWidth } = useConfig()
    const addressText = config.footer ? config.footer.addressText : ''
 
    return (
        <footer id={id} className={Styles.footer}>
            <div className={Styles.content}>
                <div className={Styles.iconBoxes}>
                    <div>
                        {config.header.logo && <Image src={config.header.logo} alt="logo" width="230" height="100" objectFit="contain" />}
                        <span>
                            <Pointer />
                            <div dangerouslySetInnerHTML={{ __html: addressText }} />
                        </span>            
                        <span>
                            <UserMail />
                            <div dangerouslySetInnerHTML={{ __html: config.companyEmailAddress }} />
                        </span>
                        <span>
                            <Phone />
                            <p>{config.companyFixedPhone}</p>
                        </span>
                        <span>
                            <Whatsapp />
                            <p>{config.companyMobilePhone}</p>
                        </span>
                    </div>
                    {windowWidth > 767 && <Image src="/assets/img-footer.png" alt="footer image" width="350" height="350" objectFit="contain" />}
                </div>
                <div className={Styles.contactForm}>
                    <ContactForm />
                </div>
            </div>
        </footer>
    )
}

export default Footer;
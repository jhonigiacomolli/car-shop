import React from 'react'
import { useConfig } from 'context'
import { Facebook, Instagram, LinkedIn, Skype, Telegram, Twitter, Whatsapp, YouTube } from 'components/icons'
import Animations from 'animations/animations.module.css'
import Styles from './socials.module.css'

type SocialsProps = {
    size: 'big' | 'small'
    title: string
}
const Socials = ({ size, title }: SocialsProps) => {
    const { config } = useConfig()
    
    function renderSocials() {
        if(config.socials) {
            return (
                config.socials.map((social, index) => {
                    if(social.link !== '') {
                        
                    let icon
                    switch (social.class) {
                        case 'facebook':
                            icon = <Facebook className={`${size === 'big' ? Styles.big : Styles.small} ${Styles.socials}  ${Animations.pulse}`} />
                            break
                        case 'instagram':
                            icon = <Instagram  className={`${size === 'big' ? Styles.big : Styles.small} ${Styles.socials}  ${Animations.pulse}`}  />
                            break
                        case 'linkedin':
                            icon = <LinkedIn  className={`${size === 'big' ? Styles.big : Styles.small} ${Styles.socials}  ${Animations.pulse}`}  />
                            break
                        case 'skype':
                            icon = <Skype  className={`${size === 'big' ? Styles.big : Styles.small} ${Styles.socials}  ${Animations.pulse}`}  />
                            break
                        case 'telegram':
                            icon = <Telegram  className={`${size === 'big' ? Styles.big : Styles.small} ${Styles.socials}  ${Animations.pulse}`}  />
                            break
                        case 'twitter':
                            icon = <Twitter  className={`${size === 'big' ? Styles.big : Styles.small} ${Styles.socials}  ${Animations.pulse}`}  />
                            break
                        case 'whatsapp':
                            icon = <Whatsapp  className={`${size === 'big' ? Styles.big : Styles.small} ${Styles.socials}  ${Animations.pulse}`}  />
                            break
                        case 'youtube':
                            icon = <YouTube  className={`${size === 'big' ? Styles.big : Styles.small} ${Styles.socials}  ${Animations.pulse}`}  />
                            break
                        default:
                            icon = ''
                    }

                    return <a key={index} href={social.link} target="_blank"  rel={'noopener noreferrer'}>{icon}</a>
                    }
                })
            )
        }

    }

    return (
        <div className={Styles.container}>
            {title && <h2 className={Styles.title}>{title}</h2>}
            <div className={Styles.socialContainer}>
                {renderSocials()}
            </div>
        </div>
    )
}

export default Socials

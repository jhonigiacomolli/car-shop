import Image from 'next/image'
import { useConfig } from 'context'
import Animation from 'animations/animations.module.css'
import Styles from './about-us.module.css'

const AboutUsImage = () => {
    const {config, windowWidth } = useConfig()

    return (
        <div className={`${Styles.aboutUsImage} ${Animation.revealDown} ${Animation.delay5}`}>
           {((config.aboutUs && config.aboutUs.imageURL) || (config.header && config.header.logo)) ?
                <Image 
                src={config.aboutUs.imageURL ? config.aboutUs.imageURL : config.header.logo} 
                alt={'Imagem Sobre Nós'} 
                width="250" 
                height={windowWidth <= 767 ? "80%" : "100%"} 
                quality={100} 
                objectFit="contain"/>
            : ''
           }
        </div>
    )
}

export default AboutUsImage

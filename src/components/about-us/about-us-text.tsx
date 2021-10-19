import { useConfig } from '../../context'
import Animation from 'animations/animations.module.css'
import DecoratedTitle5 from 'components/titles/decorated-title-5'
import Styles from './about-us.module.css'

const AboutUsText = () => {
    const { config } = useConfig()

    return (
        <div className={Styles.aboutUsText}>
            {config.aboutUs && config.aboutUs.title && <DecoratedTitle5 text={config.aboutUs && config.aboutUs.title} />}
            { config.aboutUs ? <p className={`${Animation.revealUp} ${Animation.delay6}`} dangerouslySetInnerHTML={{ __html: config.aboutUs && config.aboutUs.text}}></p> : ""}
        </div>
    )
}

export default AboutUsText

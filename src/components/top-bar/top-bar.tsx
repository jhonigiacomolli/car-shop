import { Phone } from 'components/icons'
import Socials from 'components/socials/socials'
import { useConfig } from 'context'
import Style from './top-bar.module.css'

const TopBar = () => {
    const { config, windowWidth } = useConfig()
    
    return (
        <div className={Style.topBarContainer}>
            {windowWidth > 767 &&<div className={Style.topBar}>
                {config.header.topBarLeft !== '<p><br></p>' ? (
                    <div className={Style.topBarLeft}>
                        <Phone className={Style.icon}/>
                        <p dangerouslySetInnerHTML={{ __html: config.header.topBarLeft}} ></p>
                    </div>
                ): <div />}
                {config.header.topBarRight !== '<p><br></p>' ? (
                    <div className={Style.topBarRight}> 
                        <p dangerouslySetInnerHTML={{ __html: config.header.topBarRight}} ></p>
                        <Socials aria-label="Redes Sociais" size="small" title=""/>
                    </div> 
                ): <div />}
            </div>}
        </div>
    )
}

export default TopBar

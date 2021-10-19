import { Phone } from 'components/icons'
import Socials from 'components/socials/socials'
import { useConfig } from 'context'
import Style from './top-bar.module.css'

const TopBar = () => {
    const { config, windowWidth } = useConfig()
    
    return (
        <div className={Style.topBarContainer}>
            <div className={Style.topBar}>
                <div className={Style.topBarRight}> 
                    <p dangerouslySetInnerHTML={{ __html: config.header && config.header.topBarRight}} ></p>
                    <Socials title="" size={'small'}/>
                </div> 
            </div>
        </div>
    )
}

export default TopBar

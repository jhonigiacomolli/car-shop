import { ArrowUp } from 'components/icons'
import { useConfig } from 'context'
import Styles from './back-to-top-2.module.css'

const BackToTop2 = () => {
    const { windowWidth, position, setPosition } = useConfig()
    
    function returnToTop() {
        setPosition(0)
        window.scrollTo(0,0)
    }
    
    return (
        <div className={`${Styles.container} ${windowWidth <= 767 && Styles.mobile}`} onClick={() => returnToTop()}>
            <div className={`${Styles.content} ${position === 0 && Styles.hidden}`}>
                <ArrowUp className={Styles.icon} />
            </div>
        </div>
    )
}

export default BackToTop2

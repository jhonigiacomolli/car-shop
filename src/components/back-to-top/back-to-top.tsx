import { ArrowUp } from 'components/icons'
import { useConfig } from 'context'
import Styles from './back-to-top.module.css'

const BackToTop = () => {
    const { windowWidth, position, setPosition } = useConfig()

    function returnToTop() {
        setPosition(0)
        window.scrollTo(0,0)
    }
    
    return (
        <div className={`${Styles.container} ${windowWidth <= 767 && Styles.mobile}`} onClick={() => returnToTop()}>
            <div className={`${Styles.content} ${position === 0 && Styles.hidden}`}>
                <ArrowUp className={Styles.icon} />
                {windowWidth > 767 && <p>{position.toFixed(0) + ' %'}</p>}
            </div>
        </div>
    )
}

export default BackToTop

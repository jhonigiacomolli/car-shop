import { useConfig } from 'context'
import { Clock, Phone, Pointer } from 'components/icons'
import IconBox from 'components/icon-box/icon-box'
import Styles from './footer.module.css'

type FooterProps = {
    id: string
}
const Footer = ({ id }: FooterProps) => {
    const { config, page } = useConfig()
    const addressTitle = config.footer ? config.footer.addressTitle : ''
    const addressText = config.footer ? config.footer.addressText : '' 
    const phoneTitle = config.footer ? config.footer.phoneTitle : ''
    const phoneText = config.footer ? config.footer.phoneText : ''
    const scheduleTitle = config.footer ? config.footer.scheduleTitle : ''
    const scheduleText = config.footer ? config.footer.scheduleText : ''  
 
    return (
        <footer id={id} className={Styles.footer}>
            <div className={Styles.iconBoxes}>
                <IconBox icon={<Pointer />} title={addressTitle} text={addressText} />
                <IconBox icon={<Phone />} title={phoneTitle} text={phoneText} />   
                <IconBox icon={<Clock />} title={scheduleTitle} text={scheduleText} />             
            </div>
        </footer>
    )
}

export default Footer;
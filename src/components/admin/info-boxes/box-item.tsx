import Link from 'next/link'
import { TYPE_InfoBox } from '../../../context/context-types'
import { infoBoxesIcons } from 'api/api'
import Styles from './box-item.module.css'

type UserItemProps = {
    infobox: TYPE_InfoBox
    link?: string
}
const UserItem = ({ infobox, link = '#' }: UserItemProps) => {
    const {
        icon,
        title,
        subtitle,
    } = infobox

    return (
        <Link href={link} passHref>
            <div className={Styles.item}>
                <div className={Styles.image}>
                    {infoBoxesIcons[Number(icon)].icon}
                </div>
                <div className={Styles.title}>
                    <span>Título: <h1>{title}</h1></span>
                    <p>Subtítulo: <span>{subtitle}</span></p>
                </div>
            </div> 
        </Link>
    )
}

export default UserItem

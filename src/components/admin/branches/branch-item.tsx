import { TYPE_Branch } from '../../../context/context-types'
import Link from 'next/link'
import Styles from './branch-item.module.css'

type UserItemProps = {
    branch: TYPE_Branch
    link?: string
}
const BranchItem = ({ branch, link = '#' }: UserItemProps) => {
    const {
        title,
        address,
    } = branch

    return (
        <Link href={link} passHref>
            <div className={Styles.item}>
                <div className={Styles.image}>

                </div>
                <div className={Styles.title}>
                    <span>Título: <h1>{title}</h1></span>
                    <p>Subtítulo: <span>{address}</span></p>
                </div>
            </div> 
        </Link>
    )
}

export default BranchItem

import Image from 'next/image'
import { TYPE_Jobs } from '../../../context/context-types'
import Styles from './job-item.module.css'

type JobItemProps = {
    job: TYPE_Jobs
}

const JobItem = ({ job }: JobItemProps) => {
    const { image, title, sector, type } = job
    return (
        <div className={Styles.item}>
            <div className={Styles.image}>
                {image && <Image src={image} alt={title} width={270} height={170} quality={100} objectFit="cover" layout="responsive"/>}
            </div>
            <div className={Styles.title}>
                <span>Título: <h1>{title}</h1></span>
                <p>Tipo de Vaga: <span>{type}</span></p>
                <p>Setor: <span>{sector}</span></p>
            </div>
        </div>
    )
}

export default JobItem

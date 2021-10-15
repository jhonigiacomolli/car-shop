import Image from 'next/image'
import { TYPE_Portfolio } from 'context/context-types'
import Styles from './portfolio-item.module.css'

type PortfolioItemProps = {
    portfolio: TYPE_Portfolio
}

const PortfolioItem = ({ portfolio }: PortfolioItemProps) => {
    const {cover, title, subtitle, description} = portfolio
    return (
        <div className={Styles.item}>
            <div className={Styles.image}>
                {cover && <Image src={cover} alt={title} width={270} height={170} quality={100} objectFit="cover" layout="responsive"/>}
            </div>
            <div className={Styles.title}>
                <span>Título: <h1>{title}</h1></span>
                <p>SubTitulo: <span>{subtitle}</span></p>
                <div>
                    <span>Breve descrição:</span>
                    <div dangerouslySetInnerHTML={{ __html: description }}/>
                </div>
            </div>
        </div> 
    )
}

export default PortfolioItem

import Image from 'next/image'
import Link from 'next/link'
import Styles from './search-item.module.css'


const SearchItem = ({ image, title, date, link }) => {
    return (
        <Link href={link} passHref>
            <div className={Styles.item}>
                <div className={Styles.image}>
                    <Image src={image} alt={title} width={270} height={170} quality={100} objectFit="cover" layout="responsive"/>
                </div>
                <div className={Styles.title}>
                    <h1>{title}</h1>
                    <p>Criado em: <span>{date}</span></p>
                </div>
            </div> 
        </Link>
    )
}

export default SearchItem

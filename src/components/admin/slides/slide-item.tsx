import Image from 'next/image'
import Link from 'next/link'
import Styles from './slide-item.module.css'

type SlideItemProps = {
    image: string
    title: string
    subtitle: string
    link: string
    description: string
}

const SlideItem = ({ image, title, subtitle, link, description }: SlideItemProps) => {
    return (
        <Link href={link ? link : '#'} passHref>
            <div className={Styles.item}>
                <div className={Styles.image}>
                    {image && <Image src={image} alt={title} width={270} height={170} quality={100} objectFit="cover" layout="responsive"/>}
                </div>
                <div className={Styles.title}>
                    <span>Título: <h1>{title}</h1></span>
                    <p>SubTitulo: <span>{subtitle}</span></p>
                    <p>Breve descrição: <span>{description}</span></p>
                </div>
            </div> 
        </Link>
    )
}

export default SlideItem

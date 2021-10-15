import { TYPE_Posts } from '../../../context/context-types'
import Image from 'next/image'
import Link from 'next/link'
import Styles from './post-item.module.css'

type PostItemProps = {
    article: TYPE_Posts
    link?: string
}
const PostItem = ({ article, link }: PostItemProps) => {
    const { postDate, thumbnail, title, slug } = article
    return (
        <Link href={link ? link : '#'} passHref>
            <div className={Styles.item}>
                <div className={Styles.image}>
                    {thumbnail && <Image src={thumbnail} alt={title} width={270} height={170} quality={100} objectFit="cover" layout="responsive"/>}
                </div>
                <div className={Styles.title}>
                    <h1>{title}</h1>
                    <p>Slug: <span>{slug}</span></p>
                    <p>Data de criação: <span>{postDate}</span></p>
                </div>
            </div> 
        </Link>
    )
}

export default PostItem

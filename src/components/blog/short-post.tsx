import Image from 'next/image'
import Link from 'next/link'
import Styles from './Blog.module.css'
import { Calendar, Comment, User } from 'components/icons'
import { TYPE_Posts } from 'context/context-types'
import { useConfig } from 'context'

type ShortPostProps = {
    post: TYPE_Posts

}
const ShortPost = ({ post }: ShortPostProps) => {
    const { setLoading } = useConfig()
    const { 
        thumbnail,
        slug,
        title,
        postDate,
        authorName,
    } = post

    return (
        <div className={Styles.post}>
            {thumbnail && <Link href={`/blog/${slug}`}>
                <a onClick={() => setLoading(true)}>{thumbnail && <Image className={Styles.link} src={thumbnail} alt={title} width={350} height={181} layout="responsive" quality={100} objectFit="cover"/>}</a>
            </Link>}
            <div onClick={() => setLoading(true)} className={Styles.shortDetails}>
                <Link href={`/blog/${slug}`} >
                    <a className={Styles.postTitle}>{title}</a>
                </Link>
                <div className={Styles.postMeta}>
                    <span className={Styles.iconContainer}>
                        <Calendar />
                        <p>
                            {postDate}
                        </p>
                    </span>
                    <span className={Styles.iconContainer}>
                        <User />
                        <p>
                            {authorName ? authorName : 'Autor Desconhecido'}
                        </p>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ShortPost


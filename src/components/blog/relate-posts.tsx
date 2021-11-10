import React from 'react'
import Link from 'next/link'
import Styles from './blog.module.css'
import Animations from 'animations/Animations.module.css'
import { TYPE_Posts } from 'context/context-types'
import { useConfig } from 'context'

type RealtedPostsProps = {
    blogPosts: TYPE_Posts[]
}
const RelatedPosts = ({ blogPosts }: RealtedPostsProps) => {
    const { setLoading } = useConfig()
    return (
        <div className={Styles.container}>
            <div className={`${Styles.relatedPosts} ${Animations.revealUp}`}>
                {blogPosts && blogPosts.map(post => {
                    return (
                        <Link key={post.id}  href={post.slug ? `/blog/${post.slug}` : '#'} passHref>
                            <p onClick={() => setLoading(true)} className={Styles.relatedItem}>{post.title}</p>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default RelatedPosts

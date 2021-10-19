import React from 'react'
import Styles from './Blog.module.css'
import Animations from '../../animations/Animations.module.css'
import ShortPost from './short-post'
import { TYPE_Posts } from 'context/context-types'

type BlogProps = {
    numberOfPosts: number
    blogPosts: TYPE_Posts[]
}
const Blog = ({ numberOfPosts, blogPosts }: BlogProps) => {
    return (
        <div className={Styles.container}>
            <div className={`${Styles.postContent} ${Animations.revealUp}`}>
                {blogPosts.map((post, index) => {
                    if(index < numberOfPosts)
                    return <ShortPost key={post.id} post={post} />
                })}
            </div>
        </div>
    )
}

export default Blog

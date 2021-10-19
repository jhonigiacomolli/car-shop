import React from 'react'
import Axios from 'axios'
import { api } from '../../api/api'
import Animations from '../../animations/Animations.module.css'
import Head from 'next/head'
import Styles from './tag_post.module.css'
import { useConfig } from '../../context'
import { RegisterAccess } from '../../functions/RegisterAccess'
import ShortPost from '../../components/blog/ShortPost'
import Search from '../../components/search/SearchBar'
import RelatedPosts from '../../components/blog/RelatePosts'

const Tag = ( {post, setLoading} ) => {
    const { setPage, config, windowSize } = useConfig()    

    React.useEffect(() => {
        setLoading(false)
        RegisterAccess()
        setPage('post')
    }, [])

    const renderTagPage = () => {
        return (
            <div className={Styles.contentContainer}>
                <div className={Styles.blog}>
                    <div className={Styles.blogItem}>
                        <div className={Styles.container}>
                            <div className={`${Styles.postContent} ${Animations.revealUp}`}>
                                { post && post.map(post => {
                                    return <ShortPost key={post.id} post={post} />
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${Styles.sidebar} ${windowSize <= 767 && Styles.none}`}>
                    <Search theme={'light'}/>
                    <div className={Styles.relatedPosts}>
                        <h2>ARTICOS RECENTES</h2>
                        <RelatedPosts blogPosts={post}/>
                    </div>
                </div>
            </div>
        )
    } 

    return (
        <React.Fragment >
            <Head>
                <title>{config.siteTitle ? config.siteTitle : 'Microsite Automóveis'}</title>
                <meta name="description" content={config.siteDescription ? config.siteDescription : 'Revenda de automóveis'}/>
                <link rel="icon" href={config.favIcon ? config.favIcon : '/favicon.png'} />
            </Head>
            {renderTagPage()}
        </React.Fragment>
    )
}

export default Tag

//Busca de dados na api
export async function getStaticPaths() {
    const slugs = await Axios(`${api}/blog/tags`).then(resp => resp.data)
    
    return {
        paths : slugs.map(resp => {
                    return {
                        params: {
                            tag_posts: resp.slug,
                        }
                    }
                }),
        fallback: true
    }
}

export async function getStaticProps({params}) { 
    const config = await  Axios(`${api}/config`).then(resp => resp.data)
    const post = await Axios(`${api}/blog?_tag=${params.tag_posts}`).then(resp => resp.data)

    return {
        props: {
            post,
            config
        },
        revalidate: config.revalidate
    }
}
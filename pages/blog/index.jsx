import React from 'react'
import Axios from 'axios'
import Head from 'next/head'
import { useConfig } from '../../context'
import { RegisterAccess } from '../../functions/RegisterAccess'
import Styles from './index.module.css'
import Blog from '../../components/blog/Blog'
import RelatedPosts from '../../components/blog/RelatePosts'
import Search from '../../components/search/SearchBar'
import { api } from '../../api/api'

const BlogPage = ({blog, config, setLoading}) => {
    const postsPerPage = config.blog.config.postsPerPage ? config.blog.config.postsPerPage : 10
    const { setConfig, setPage, windowSize  } = useConfig()
    const [pagination, setPagination] = React.useState(postsPerPage)
    const [wait, setWait] = React.useState(false)

    React.useEffect(() => {
        setLoading(false)
        setPage('blog')
        setConfig(config)
        RegisterAccess()
    },[])

    React.useEffect(() => {
        function infiteScrool () {
            const scrool = window.scrollY
            const height = document.body.offsetHeight - window.innerHeight
            if(scrool > height * 0.25) {
                if(!wait){
                    if(pagination < blog.length) {
                        setPagination(pagination + postsPerPage)
                        setWait(true)
                        setTimeout(() => {
                            setWait(false)
                        }, 1000)
                    }
                }
            }
        }
        window.addEventListener('scrool', infiteScrool)
        window.addEventListener('wheel', infiteScrool)
        
        return () => {
            window.removeEventListener('scrool', infiteScrool)
            window.removeEventListener('wheel', infiteScrool)
        }
    }, [wait])

    return (
        <React.Fragment >
            <Head>
                <title>{config.siteTitle}</title>
                <meta name="description" content={config.siteDescription}/>
                <link rel="icon" href={config.favIcon} />
            </Head>
            <div className={Styles.contentContainer}>
                <div className={Styles.blog}>
                    <div className={Styles.blogItem}>
                        <Blog blogPosts={blog} numberOfPosts={pagination} setLoading={setLoading} />
                    </div>
                </div>
                <div className={`${Styles.sidebar} ${windowSize <= 767 && Styles.none}`}>
                    <Search theme={'light'}/>
                    <div className={Styles.relatedPosts}>
                        <h2>ARTICOS RECENTES</h2>
                        <RelatedPosts blogPosts={blog} setLoading={setLoading} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default BlogPage


export async function getStaticProps() {
    const blog = await Axios(`${api}/blog?_limit=${-1}`).then(resp => resp.data)
    const config = await  Axios(`${api}/config`).then(resp => resp.data)

    return {
        props: {
            blog,
            config
        },
        revalidate: config.revalidate
    }
}
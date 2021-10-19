import React from 'react'
import Styles from '../blog/blog_post.module.css'
import Axios from 'axios'
import { api } from '../../api/api'
import { useConfig } from '../../context'
import { RegisterAccess } from '../../functions/RegisterAccess'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { Calendar, User } from '../../components/icons'
import ShareBox from '../../components/utils/shareBox/ShareBox'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'

const Post = ({post, config, setLoading}) => {
    const { setPage, setConfig } = useConfig()
    const [url, setUrl] = React.useState()
    const [descriptionString, setDescriptionString] = React.useState('')
    const {
        title,
        thumbnail,
        authorName,
        postDate,
        description,
        categories,
        tags
    } = post ? post : ''
    
    React.useEffect(() => {
        setLoading(false)
        RegisterAccess()
        setPage('post')
        setConfig(config)
        document && setUrl(document.URL)
        document && setDescriptionString(document.querySelector('[post-description]').textContent);
    }, [])


    return (
        (config && post) ? <div className={Styles.container}>
            <Breadcrumb setLoading={setLoading}/>
            <div className={Styles.content}>
                <Head>
                    <title>{`${config.siteTitle} | ${title} `}</title>
                    <meta name="description" content={descriptionString}/>            
                    <meta property="og:url"           content={url} />
                    <meta property="og:type"          content={'website'} />
                    <meta property="og:title"         content={title} />
                    <meta property="og:description"   content={descriptionString} />
                    <meta property="og:image"         content={thumbnail} />
                </Head>
                {thumbnail && <Image className={Styles.link} src={thumbnail} alt={title} width={350} height={181} layout="responsive" quality={100} objectFit="cover"/>}
                <div className={Styles.details}>
                    <span className={Styles.postDetails}> 
                        <User className={Styles.icon} />
                        <span> Autor: {authorName}</span>
                    </span>
                    <span className={Styles.postDetails}>
                        <Calendar className={Styles.icon} />
                        <span>{postDate}</span>
                    </span>
                </div>
                <h1 className={Styles.title}>{title}</h1>
                <div post-description={'post'} className={Styles.text} dangerouslySetInnerHTML={{__html: description}} />
                <div className={Styles.share}>
                    <ShareBox sectionTitle={'Compartilhe este artigo com seus amigos(as)'} link={url} title={title} description={descriptionString} />
                </div>
                <div className={Styles.categories}> 
                    <h3>CATEGORIAS</h3>
                        {categories ? categories.map((cat, index, categorias) => {
                            if(categorias.length === 1 || index === (categorias.length -1)) {
                                return (
                                    cat.slug !== 'sem-categoria' && <Link key={index} href={`/category/${cat.slug}`}>
                                        <a className={Styles.categoryLink}>{cat.name}</a> 
                                    </Link>
                                )
                            }else{
                                return (
                                    <Link key={index} href={`/category/${cat.slug}`}>
                                        <a className={Styles.categoryLink}>{`${cat.name},`}</a>            
                                    </Link>
                                )  
                            }
                        }): null}
                </div>
                <div  className={Styles.tags}> 
                    <h3>TAGS</h3>
                        {tags ? tags.map((tag, index, tags) => {
                            if(tags.length === 1 || index === (tags.length -1)) {
                                return (
                                    <Link key={index} href={`/tag/${tag.name}`}>
                                        <a className={Styles.tagLink}>{tag.name}</a>
                                    </Link>
                                ) 
                            }else{
                                return (
                                    <Link key={index} href={`/tag/${tag.name}`}>
                                        <a className={Styles.tagLink}>{`${tag.name},`}</a>
                                    </Link>
                                )
                            }
                        }): ''}
                </div>
            </div>
        </div> : <div></div>
    )
}

export default Post

//Busca de dados na api
export async function getStaticPaths() {
    const slugs = await Axios(`${api}/blog`).then(resp => resp.data)
    
    return {
        paths : slugs.map(resp => {
                    return {
                        params: {
                            blog_post: resp.slug,
                        }
                    }
                }),
        fallback: true
    }
}

export async function getStaticProps({params}) { 
    const post = await Axios(`${api}/post/${params.blog_post}`).then(resp => resp.data)
    const config = await  Axios(`${api}/config`).then(resp => resp.data)
    return {
        props: {
            config,
            post
        },
        revalidate: config.revalidate
    }
}
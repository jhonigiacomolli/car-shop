import axios from 'axios'
import { api } from 'api/api'
import { useConfig } from 'context'
import { TokenContext } from '..'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { TYPE_API_Response, TYPE_ConfigProps } from 'context/context-types'
import AlertBox from 'components/messages/AlertBox'
import MessageBox from 'components/messages/MessageBox'
import PageHeader from '../page-header'
import PrimarySubmit from 'components/buttons/PrimarySubmit'
import Styles from './blog-config.module.css'


const BlogConfig = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [postPerPage, setPostsPerPage] = useState(0)
    const [sectionTitle, setSectionTitle] = useState('')
    const [numberOfPosts, setNumberOfPosts] = useState(0)
    const [buttonLabel, setButtonLabel] = useState('')
    const [buttonLink, setButtonLink] = useState('')
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const {
        config
    } = useConfig()


    useEffect(() => {
        config.blog && setPostsPerPage(config.blog.config.postsPerPage)
        config.blog && setSectionTitle(config.blog.latestPosts.sectionTitle)
        config.blog && setNumberOfPosts(config.blog.latestPosts.numberOfPosts)
        config.blog && setButtonLabel(config.blog.latestPosts.buttonLabel)
        config.blog && setButtonLink(config.blog.latestPosts.buttonLink)
    }, [config])

    async function updateBlogConfig(event: FormEvent) {
        event.preventDefault()

        setLoading(true)
        const formConfig  = new FormData
        formConfig.append('id', config.id.toString())
        formConfig.append('type', 'blog')
        formConfig.append('blogPostsPerPage', postPerPage.toString())
        formConfig.append('latestPostsTitle', sectionTitle)
        formConfig.append('latestPostsQnt', numberOfPosts.toString())
        formConfig.append('latestPostsButtonLabel', buttonLabel)
        formConfig.append('latestPostsButtonLink', buttonLink)

        try {
            const { data } = await axios.post<TYPE_API_Response<TYPE_ConfigProps>>( `${api}/config`, formConfig, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            })
            setLoading(false)
            if(data.status === 200) {
                setSendResponse('Configurações atualizadas com sucesso')
                setSendStatus(data.status)
                config.blog.config.postsPerPage = data.data.blog.config.postsPerPage
                config.blog.latestPosts.sectionTitle = data.data.blog.latestPosts.sectionTitle
                config.blog.latestPosts.numberOfPosts = data.data.blog.latestPosts.numberOfPosts
                config.blog.latestPosts.buttonLabel = data.data.blog.latestPosts.buttonLabel
                config.blog.latestPosts.buttonLink = data.data.blog.latestPosts.buttonLink
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
            }
        }  catch(error: any) {
            setLoading(false)
            setSendStatus(error.status)
            setSendResponse(error.message)
            setTimeout(() => {
                setSendResponse('')
            }, 2000);
        }

            
    }

    return (
        <div className={theme.content}>
            {alertMessage &&<AlertBox type={''} title={''} message={alertMessage} onConfirm={() => setAlertMessage('')}/>}
            {sendResponse && <MessageBox type={sendStatus === 200 ? 'success' : 'error'} title={sendStatus === 200 ? 'Sucesso!!!' : 'Ops... ocorreu um erro!' } message={sendResponse}/>}
            <PageHeader title={'CONFIGURAÇÕES DO BLOG'} description={'Configure as principais caracteristicas do seu blog'} />
            <form className={Styles.data} onSubmit={(e) => updateBlogConfig(e)}>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>BLOG</h2>
                    <h3 className={Styles.title}>
                        <p>Artigos por página</p>
                        <input 
                            type="number" 
                            name="post-per-page" 
                            id="post-per-page" 
                            value={postPerPage} 
                            onChange={(e) => setPostsPerPage(Number(e.target.value))} 
                        />
                    </h3>
                </div>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>ULTIMOS ARTIGOS</h2>
                    <h3 className={Styles.title}>
                        <p>Título da sessão</p>
                        <input 
                            type="text" 
                            name="latest-post-title" 
                            id="latest-post-title" 
                            value={sectionTitle} 
                            onChange={(e) => setSectionTitle(e.target.value)}
                        />
                    </h3>
                    <h3 className={Styles.title}>
                        <p>Numero de artigos</p>
                        <input 
                            type="number" 
                            name="latest-post-number-posts" 
                            id="latest-post-number-posts" 
                            value={numberOfPosts} 
                            onChange={(e) => setNumberOfPosts(Number(e.target.value))} 
                        />
                    </h3>
                    <h3 className={Styles.title}>
                        <p>Texto do botão</p>
                        <input 
                            type="text" 
                            name="latest-post-button-label" 
                            id="latest-post-button-label" 
                            value={buttonLabel} 
                            onChange={(e) => setButtonLabel(e.target.value)} 
                        />
                    </h3>
                    <h3 className={Styles.title}>
                        <p>Link do botão</p>
                        <input 
                            type="text" 
                            name="latest-post-button-link" 
                            id="latest-post-button-link" 
                            value={buttonLink} 
                            onChange={(e) => setButtonLink(e.target.value)} 
                        />
                    </h3>
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={'Atualizar configurações'} />
                </div>
            </form>
        </div>
    )
}

export default BlogConfig
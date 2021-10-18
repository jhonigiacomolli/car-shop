import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { TYPE_API_Response, TYPE_ConfigProps } from 'context/context-types'
import PrimarySubmit from 'components/buttons/primary-submit'
import MessageBox from 'components/messages/message-box'
import PageHeader from '../page-header'
import Styles from './index.module.css'

const SEO = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [keywords, setKeywords] = useState('')
    const [scripts, setScripts] = useState('')
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const {
        config
    } = useConfig()

    useEffect(() => {
        config.header && setScripts(config.header.headScripts)
        config.header && setKeywords(config.header.keywords)
    }, [config])

    async function updateHeader(event: FormEvent) {
        event.preventDefault()
        setLoading(true)
        const formConfig  = new FormData
        formConfig.append('id', config.id.toString())
        formConfig.append('type', 'seo')
        formConfig.append('keywords', keywords)
        formConfig.append('headScripts', scripts)

        try {
            const { data } = await axios.post<TYPE_API_Response<TYPE_ConfigProps>>(`${api}/config`, formConfig, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            })
            setLoading(false)
            if(data.status === 200) {
                setSendResponse(data.message)
                setSendStatus(data.status)
                config.header.headScripts = data.data.header.headScripts
                config.header.keywords = data.data.header.keywords
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
            }
        }catch(error: any) {
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
            {sendResponse && (
                <MessageBox 
                    type={sendStatus === 200 ? 'success' : 'error'} 
                    title={sendStatus === 200 ? 'Sucesso!!!' : 'Ops... ocorreu um erro!' } 
                    message={sendResponse}
                />
            )}
            <PageHeader title={'SEO'} description={'Configure as informações utilizadas para otimização e performance'} />
            <form className={Styles.data} onSubmit={(e) => updateHeader(e)}>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>HEAD Scripts</h2>
                    <p>Insira neste campo tags para monitoramento de resultados e performance como Google Analytics.</p>
                    <textarea 
                        className={Styles.scripts} 
                        value={scripts} 
                        onChange={(e) => setScripts(e.target.value)} 
                    />
                </div>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>Palavras-chave para SEO</h2>
                    <p>Insira neste campo palavras relevantes ao seu negócio ou sua empresa, e que sejam possíveis argumentos de busca utilzados pelos usuarios</p>
                    <textarea 
                        className={Styles.scripts} 
                        value={keywords} 
                        onChange={(e) => setKeywords(e.target.value)} 
                    />
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={'Atualizar configurações'} />
                </div>
            </form>
        </div>
    )
}

export default SEO
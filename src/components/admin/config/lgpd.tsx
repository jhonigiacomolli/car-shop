import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_ConfigProps } from 'context/context-types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import PrimarySubmit from 'components/buttons/PrimarySubmit'
import AlertBox from 'components/messages/AlertBox'
import MessageBox from 'components/messages/MessageBox'
import TextEditor from 'components/text-editor/text-editor'
import PageHeader from '../page-header'
import Styles from './lgpd.module.css'

const LGPD = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [lgpdEnabled, setLgpdEnabled] = useState('true')
    const [lgpdRegister, setLgpdRegister] = useState('true')
    const [lgpdExpire, setLgpdExpire] = useState(0)
    const [lgpdMessage, setLgpdMessage] = useState('')
    const [privacePolicityContent, setPrivacePolicityContent] = useState('')
    const [privacePolicityDoc, setPrivacePolicityDoc] = useState<File>()
    const [privacePolicityDocLink, setPrivacePolicityDocLink] = useState('')
    const [clear, setClear] = useState(false)
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const {
        config
    } = useConfig()

    useEffect(() => {
        config.lgpd && setLgpdEnabled(`${config.lgpd.cookieEnabled}`)
        config.lgpd && setLgpdRegister(`${config.lgpd.cookieRegister}`)
        config.lgpd && setLgpdMessage(config.lgpd.cookieMessage)
        config.lgpd && setLgpdExpire(Number(config.lgpd.cookieExpireTime))
        config.lgpd && setPrivacePolicityContent(config.privacePolicity.content)
        config.lgpd && setPrivacePolicityDocLink(config.privacePolicity.downloadLink)
    }, [config])

    async function updateLGPD(event: FormEvent) {
        event.preventDefault()
        setLoading(true)
        const formConfig  = new FormData
        formConfig.append('id', config.id.toString())
        formConfig.append('type', 'lgpd')
        formConfig.append('lgpd', lgpdEnabled)
        formConfig.append('lgpdRegister', lgpdRegister)
        formConfig.append('lgpdExpire', lgpdExpire.toString())
        formConfig.append('lgpdMessage', lgpdMessage)
        formConfig.append('privacePolicityContent', privacePolicityContent)
        formConfig.append('privacePolicityDocLink', privacePolicityDocLink)
        privacePolicityDoc && formConfig.append('privacePolicityDoc', privacePolicityDoc)
        formConfig.append('privacePolicityLastModified', format(new Date(), 'dd MMMM yyyy', { locale: ptBR }))

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
                config.lgpd.cookieEnabled = data.data.lgpd.cookieEnabled
                config.lgpd.cookieRegister = data.data.lgpd.cookieRegister
                config.lgpd.cookieExpireTime = data.data.lgpd.cookieExpireTime
                config.lgpd.cookieMessage = data.data.lgpd.cookieMessage
                config.privacePolicity.content = data.data.privacePolicity.content
                config.privacePolicity.downloadLink = data.data.privacePolicity.downloadLink
                config.privacePolicity.lastModified = data.data.privacePolicity.lastModified
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

    function handleChangePrivacePolicityDoc(event: ChangeEvent) {{
        const { files } = event.target as HTMLInputElement
        files && setPrivacePolicityDoc(files[0])
    }}

    return (
        <div className={theme.content}>
            {alertMessage && (
                <AlertBox 
                    type={alertType} 
                    title={alertTitle}
                    message={alertMessage} 
                    onConfirm={() => setAlertMessage('')}
                />
            )}
            {sendResponse &&  (
                <MessageBox 
                    type={sendStatus === 200 ? 'success' : 'error'} 
                    title={sendStatus === 200 ? 'Sucesso!!!' : 'Ops... ocorreu um erro!' } 
                    message={sendResponse}
                />
            )}
            <PageHeader title={'LGPD'} description={'Configure o comportamento do seu site quanto a lei geral de proteção de dados'} />
            <form className={Styles.data} onSubmit={(e) => updateLGPD(e)}>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>Exibir mensagem de concentimento para uso de Cookies</h2>
                    <p className={Styles.observation}>
                        <span>NÃO</span>
                        , todos os cookies do site receberão concentimento automaticamente, e nenhuma mensagem será exibida ao usuário
                    </p>
                    <p className={Styles.observation}>
                        <span>SIM</span>
                        , o usuário será questionado sobre seu concentimento para o uso de cookies com o intuito de melhorar a expriência de navegação, e os cookies só serão e-xecutados caso o usuário forneça o cencentimento.
                    </p>
                    <select value={lgpdEnabled} onChange={(e) => setLgpdEnabled(JSON.parse(e.target.value))} >
                        <option value={'true'}>SIM</option>
                        <option value={'false'}>NÃO</option>
                    </select>
                </div>
                {lgpdEnabled && <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>Armazenar dados do concentimento</h2>
                    <select value={lgpdRegister} onChange={(e) => setLgpdRegister(JSON.parse(e.target.value))} >
                        <option value={'true'}>SIM</option>
                        <option value={'false'}>NÃO</option>
                    </select>
                </div>}
                {lgpdEnabled && <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>Tempo de expiração do cookie de concentimento</h2>
                    <p>O valor deve ser inserido em horas</p>
                    <input 
                        type="number" 
                        name="lgpd-expire" 
                        id="lgpd-expire" 
                        value={lgpdExpire} 
                        onChange={(e) => Number(e.target.value) >= 0 && setLgpdExpire(Number(e.target.value))} 
                    />
                </div>}
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>Políticas de Privacidade</h2>
                    <div className={Styles.editorContainer}>
                        <TextEditor setText={setPrivacePolicityContent} clear={clear} content={privacePolicityContent} />
                    </div>
                </div>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>Link Download Políticas de Privacidade</h2>
                    <div className={Styles.fileContainer}>
                        <label htmlFor="privace" className={Styles.fileButton}>
                            Enviar arquivo de Políticas de Privacidade
                        </label>
                        {privacePolicityDoc && <p>
                            Nome do arquivo selecionado: 
                            <span>{privacePolicityDoc.name}</span>
                            <span className={Styles.removeFile} onClick={() => setPrivacePolicityDoc(undefined)} >X</span>
                        </p>}
                        <input 
                            type="file"
                            id={'privace'} 
                            name={'privace'} 
                            accept=".doc, .docx, .pdf" 
                            className={Styles.originalInput} 
                            onChange={handleChangePrivacePolicityDoc} 
                        />
                    </div>
                    <textarea disabled value={privacePolicityDocLink} onChange={(e) => setPrivacePolicityDocLink(e.target.value)} />
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={'Atualizar configurações'} />
                </div>
            </form>
        </div>
    )
}

export default LGPD
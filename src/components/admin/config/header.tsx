import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { TYPE_API_Response, TYPE_ConfigProps } from 'context/context-types'
import PrimarySubmit from 'components/admin/buttons/primary-submit'
import AlertBox from 'components/admin/messages/alert-box'
import MessageBox from 'components/admin/messages/message-box'
import TextEditor from 'components/admin/text-editor/text-editor'
import PageHeader from '../page-header'
import Styles from './header.module.css'

const Header = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [topBarLeft, setTopBarLeft] = useState('')
    const [topBarRight, setTopBarRight] = useState('')
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
        config.header && setTopBarLeft(config.header.topBarLeft)
        config.header && setTopBarRight(config.header.topBarRight)
    }, [config])

    async function updateHeader(event: FormEvent) {
        event.preventDefault()
        setLoading(true)
        const formConfig  = new FormData
        formConfig.append('id', config.id.toString())
        formConfig.append('type', 'header')
        formConfig.append('topBarLeft', topBarLeft)
        formConfig.append('topBarRight', topBarRight)

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
                config.header.topBarLeft = data.data.header.topBarLeft
                config.header.topBarRight = data.data.header.topBarRight
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
            {alertMessage && (
                <AlertBox 
                    type={alertType} 
                    title={alertTitle} 
                    message={alertMessage} 
                    onConfirm={() => setAlertMessage('')}
                />
            )}
            {sendResponse && (
                <MessageBox 
                    type={sendStatus === 200 ? 'success' : 'error'} 
                    title={sendStatus === 200 ? 'Sucesso!!!' : 'Ops... ocorreu um erro!' } 
                    message={sendResponse}
                />
            )}
            <PageHeader title={'CABE??ALHO'} description={'Configure as informa????es do cabe??alho do seu site'} />
            <form className={Styles.data} onSubmit={(e) => updateHeader(e)}>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>Barra superior Esquerda</h2>
                    <div className={Styles.editorContainer}>
                        <TextEditor setText={setTopBarLeft} clear={clear} content={topBarLeft} />
                    </div>  
                </div>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>Barra superior Direita</h2>
                    <div className={Styles.editorContainer}>
                        <TextEditor setText={setTopBarRight} clear={clear} content={topBarRight} />
                    </div>  
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={'Atualizar configura????es'} />
                </div>
            </form>
        </div>
    )
}

export default Header
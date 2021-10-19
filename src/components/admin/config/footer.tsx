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
import Styles from './footer.module.css'

const Footer = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [addressTitle, setAddressTitle] = useState('')
    const [addressText, setAddressText] = useState('')
    const [phoneTitle, setPhoneTitle] = useState('')
    const [phoneText, setPhoneText] = useState('')
    const [serviceTimeTitle, setServiceTimeTitle] = useState('')
    const [serviceTimeText, setServiceTimeText] = useState('')
    const [copyright, setCopyright] = useState('')
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
        config.footer && setAddressTitle(config.footer.addressTitle)
        config.footer && setAddressText(config.footer.addressText)
        config.footer && setPhoneTitle(config.footer.phoneTitle)
        config.footer && setPhoneText(config.footer.phoneText)
        config.footer && setServiceTimeTitle(config.footer.scheduleTitle)
        config.footer && setServiceTimeText(config.footer.scheduleText)
        config.copyright && setCopyright(config.copyright.message)
    }, [config])

    async function updateFooter(event: FormEvent) {
        event.preventDefault()
        setLoading(true)
        const formConfig  = new FormData
        formConfig.append('id', config.id.toString())
        formConfig.append('type', 'footer')
        formConfig.append('footerAddressTitle', addressTitle)
        formConfig.append('footerAddressText', addressText)
        formConfig.append('footerPhoneTitle', phoneTitle)
        formConfig.append('footerPhoneText', phoneText)
        formConfig.append('footerScheduleTitle', serviceTimeTitle)
        formConfig.append('footerScheduleText', serviceTimeText)
        formConfig.append('copyright', copyright)

        try {
            const { data } = await axios.post<TYPE_API_Response<TYPE_ConfigProps>>(`${api}/config`, formConfig, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            })
            setLoading(false)
            if(data.status === 200) {
                console.log(data);
                
                setSendResponse(data.message)
                setSendStatus(data.status)
                config.footer = data.data.footer
                config.copyright = data.data.copyright
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
            <PageHeader title={'RODAPÉ'} description={'Configure as informações do rodapé do seu site'} />
            <form className={Styles.data} onSubmit={(e) => updateFooter(e)}>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>ENDEREÇO</h2>
                    <h3 className={Styles.subtitle}>Título</h3>
                    <input type="text" name="address-title" id="address-title" value={addressTitle} onChange={(e) => setAddressTitle(e.target.value)} />
                    <h3 className={Styles.subtitle}>Texto</h3>
                    <div className={Styles.editorContainer}>
                        <TextEditor setText={setAddressText} clear={clear} content={addressText} />
                    </div>
                </div>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>TELEFONE</h2>
                    <h3 className={Styles.subtitle}>Título</h3>
                    <input type="text" name="phone-title" id="phone-title" value={phoneTitle} onChange={(e) => setPhoneTitle(e.target.value)} />
                    <h3 className={Styles.subtitle}>Texto</h3>
                    <div className={Styles.editorContainer}>
                        <TextEditor setText={setPhoneText} clear={clear} content={phoneText} />
                    </div>
                </div>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>HORÁRIOS DE ATENDIMENTO</h2>
                    <h3 className={Styles.subtitle}>Título</h3>
                    <input type="text" name="time-title" id="time-title" value={serviceTimeTitle} onChange={(e) => setServiceTimeTitle(e.target.value)} />
                    <h3 className={Styles.subtitle}>Texto</h3>
                    <div className={Styles.editorContainer}>
                        <TextEditor setText={setServiceTimeText} clear={clear} content={serviceTimeText} />
                    </div>
                </div>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>Copyright</h2>
                    <div className={Styles.editorContainer}>
                        <TextEditor setText={setCopyright} clear={clear} content={copyright} />
                    </div>
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={'Atualizar configurações'} />
                </div>
            </form>
        </div>
    )
}

export default Footer
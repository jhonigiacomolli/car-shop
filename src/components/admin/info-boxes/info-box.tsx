import axios from 'axios'
import { api, infoBoxesIcons } from 'api/api'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_InfoBox } from 'context/context-types'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { TokenContext } from '..'
import PrimarySubmit from 'components/admin/buttons/primary-submit'
import AlertBox from 'components/admin/messages/alert-box'
import MessageBox from 'components/admin/messages/message-box'
import TextEditor from 'components/admin/text-editor/text-editor'
import PageHeader from '../page-header'
import Styles from './info-box.module.css'

type UserProps = {
    infoBox?: TYPE_InfoBox
}
const InfoBox = ({ infoBox }: UserProps) => {
    const { loginToken, theme, setLoading, user:loggedUser } = useContext(TokenContext)
    const { infoBoxes, setInfoBoxes } = useConfig()
    const [icon, setIcon] = useState<number | null>(null)
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [description, setDescription] = useState('<p><br></p>')
    const [buttonLabel, setButtonLabel] = useState('')
    const [buttonLink, setButtonLink] = useState('')
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')

    useEffect(() => {
        if(infoBox) {
            setIcon(Number(infoBox.icon))
            setTitle(infoBox.title)
            setSubtitle(infoBox.subtitle)
            setDescription(infoBox.description)
            setButtonLabel(infoBox.buttonLabel)
            setButtonLink(infoBox.buttonLink)
        }else {
            clearForm()
        }
        
        return () => {
            clearForm()
        }
    }, [infoBox])

    async function createInfoBox(event: FormEvent) {
        event.preventDefault()
    
        if (title) {
            setLoading(true)
        
            try {
                const axiosdata = {
                    id: infoBox?.id ?? 0,
                    icon,
                    title,
                    subtitle,
                    description,
                    buttonLabel,
                    buttonLink,
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_InfoBox>>(`${api}/info-box`, axiosdata, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setSendStatus(data.status)
                setSendResponse(data.message)
                data.status === 200 && !infoBox && clearForm()
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
                if(data.status === 200 && infoBox){
                    setInfoBoxes(infoBoxes.map(info => info.id === data.data.id ? data.data : info))
                }
                if(data.status === 200 && !infoBox) {
                    setInfoBoxes([data.data, ...infoBoxes])
                }
            }catch(error: any) {
                setLoading(false)
                setSendStatus(error.status)
                setSendResponse(error.message)
                setTimeout(() => {
                    setSendResponse('')
                }, 2000);
            }
        }else {
            setAlertType('warning')
            setAlertTitle('Dados incompletos')
            setAlertMessage('Os campos Titulo e descri????o s??o obirgat??rios, preencha-os e tente novamente')
        }
    }

    function clearForm() {
        setIcon(0)
        setTitle('')
        setSubtitle('')
        setDescription('<p><br></p>')
        setButtonLabel('')
        setButtonLink('')
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
            <PageHeader title={infoBox ? 'ATUALIZAR BOX DE INFORMA????O' : 'NOVO BOX DE INFORMA????O'} description={infoBox ? 'Atualize os dados dos seus boxes de informa????o' : 'Crie novos boxes de informa????o'} />
            <form className={Styles.data} onSubmit={(e) => createInfoBox(e)}>
                <div className={Styles.info}>
                    <h2 className={Styles.title}>
                        <p>T??tulo</p>
                        <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Subt??tulo</p>
                        <input type="text" name="subtitle" id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Descri????o</p>
                        <div className={Styles.editorContainer}>
                            <TextEditor content={description} setText={setDescription} />
                        </div>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Texto do Bot??o</p>
                        <input type="text" name="button-label" id="button-label" value={buttonLabel} onChange={(e) => setButtonLabel(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Link do Bot??o</p>
                        <input type="text" name="button-link" id="button-link" value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} />
                    </h2>
                </div>
                <p>Selecione o icone para seu box de informa????o</p>
                <div className={Styles.title}>
                        <p>
                            {icon !== null && infoBoxesIcons[icon].icon} 
                        </p>
                        <select id="icon" name="icon" value={icon ? icon : 'null'} onChange={(e) =>  setIcon(Number(e.target.value))}>
                            {
                                infoBoxesIcons.map((infoIcon, index) => (
                                    index === 0
                                    ? <option key={index} value={index}>Selecione...</option>
                                    : <option key={index} value={index}>{`Icone ${index}`}</option>
                                ))
                            }
                        </select>
                    </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={infoBox ? 'Atualizar usu??rio' : 'Criar novo usu??rio'} />
                </div>
            </form>
        </div>
    )
}

export default InfoBox


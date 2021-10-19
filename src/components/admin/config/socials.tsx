import axios from 'axios'
import { api } from 'api/api'
import { useConfig } from 'context'
import { TokenContext } from '..'
import { TYPE_API_Response, TYPE_ConfigProps } from 'context/context-types'
import { FormEvent, useContext, useEffect, useState } from 'react'
import PrimarySubmit from 'components/admin/buttons/primary-submit'
import AlertBox from 'components/admin/messages/alert-box'
import MessageBox from 'components/admin/messages/message-box'
import PageHeader from '../page-header'
import Styles from './socials.module.css'

const Socials = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [facebook, setFacebook] = useState('')
    const [instagram, setInstagram] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [skype, setSkype] = useState('')
    const [telegram, setTelegram] = useState('')
    const [twitter, setTwitter] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [youtube, setYoutube] = useState('')
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const {
        config
    } = useConfig()

    useEffect(() => {
        config.socials.map(social => {
            switch(social.class) {
                case 'facebook':
                    setFacebook(social.link)
                    break
                case 'instagram':
                    setInstagram(social.link)
                    break
                case 'linkedin':
                    setLinkedin(social.link)
                    break
                case 'skype':
                    setSkype(social.link)
                    break
                case 'telegram':
                    setTelegram(social.link)
                    break
                case 'twitter':
                    setTwitter(social.link)
                    break
                case 'whatsapp':
                    setWhatsapp(social.link)
                    break
                case 'youtube':
                    setYoutube(social.link)
                default:
                    ''
            }
        })
    }, [config])

    async function updateSocials(event: FormEvent) {
        event.preventDefault()
        setLoading(true)
        const formConfig  = new FormData
        formConfig.append('id', config.id.toString())
        formConfig.append('type', 'social')
        formConfig.append('facebook', facebook)
        formConfig.append('instagram', instagram)
        formConfig.append('linkedin', linkedin)
        formConfig.append('skype', skype)
        formConfig.append('telegram', telegram)
        formConfig.append('twitter', twitter)
        formConfig.append('whatsapp', whatsapp)
        formConfig.append('youtube', youtube)

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
                config.socials = data.data.socials
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
            <PageHeader title={'REDES SOCIAIS'} description={'Configure as redes sociais da sua empresa'} />
            <form className={Styles.data} onSubmit={(e) => updateSocials(e)}>
                <h2 className={Styles.title}>Dados do site</h2>
                <h2 className={Styles.title}>
                    <p>Facebook</p>
                    <input type="text" name="title" id="title" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                </h2>
                <h2 className={Styles.title}>
                    <p>Instagram</p>
                    <input name="site-description" id="site-description" value={instagram} onChange={(e) => setInstagram(e.target.value)}/>
                </h2>
                <h2 className={Styles.title}>
                    <p>Linked-in</p>
                    <input type="text" name="title" id="title" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                </h2>
                <h2 className={Styles.title}>
                    <p>Skype</p>
                    <input type="text" name="title" id="title" value={skype} onChange={(e) => setSkype(e.target.value)} />
                </h2>
                <h2 className={Styles.title}>
                    <p>Telegram</p>
                    <input type="text" name="title" id="title" value={telegram} onChange={(e) => setTelegram(e.target.value)} />
                </h2>
                <h2 className={Styles.title}>
                    <p>Twitter</p>
                    <input type="text" name="title" id="title" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                </h2>
                <h2 className={Styles.title}>
                    <p>WhatsApp</p>
                    <input type="text" name="title" id="title" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                </h2>
                <h2 className={Styles.title}>
                    <p>Youtube</p>
                    <input type="text" name="title" id="title" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
                </h2>
                <div className={Styles.button}>
                    <PrimarySubmit value={'Atualizar configurações'} />
                </div>
            </form>
        </div>
    )
}

export default Socials
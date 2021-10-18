import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { TYPE_API_Response, TYPE_ConfigProps } from 'context/context-types'
import PrimarySubmit from 'components/buttons/primary-submit'
import AlertBox from 'components/messages/alert-box'
import MessageBox from 'components/messages/message-box'
import PageHeader from '../page-header'
import Styles from './slide-config.module.css'

const SlideConfig = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [isSlideShow, setIsSlideShow] = useState('false')
    const [slideWidth, setSlideWidth] = useState(0)
    const [slideHeight, setSlideHeight] = useState(0)
    const [slideDuration, setSlideDuration] = useState(0)
    const [displayNavegation, setDisplayNavegation] = useState('false')
    const [displayTitle, setDisplayTitle] = useState('false')
    const [displaySubtitle, setDisplaySubtitle] = useState('false')
    const [displayDescription, setDisplayDescription] = useState('false')
    const [displayButton, setDisplayButton] = useState('false')
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const {
        config
    } = useConfig()


    useEffect(() => {
        config.slideShow && setIsSlideShow(`${config.slideShow.config.isSlideShow}`)
        config.slideShow && setSlideWidth(config.slideShow.config.width)
        config.slideShow && setSlideHeight(config.slideShow.config.height)
        config.slideShow && setDisplayNavegation(`${config.slideShow.config.displayNav}`)
        config.slideShow && setDisplayTitle(`${config.slideShow.config.displayTitle}`)
        config.slideShow && setDisplaySubtitle(`${config.slideShow.config.displaySubTitle}`)
        config.slideShow && setDisplayDescription(`${config.slideShow.config.displayDescription}`)
        config.slideShow && setDisplayButton(`${config.slideShow.config.displayButton}`)
        config.slideShow && setSlideDuration(config.slideShow.config.duration)
    }, [])

    async function updateSlideConfig(event: FormEvent) {
        event.preventDefault()
        setLoading(true)
        const formConfig  = new FormData
        formConfig.append('id', config.id.toString())
        formConfig.append('type', 'slideShow')
        formConfig.append('isSlideShow', `${isSlideShow}`)
        formConfig.append('slideshowWidth', slideWidth.toString())
        formConfig.append('slideshowHeigth', slideHeight.toString())
        formConfig.append('slideshowDisplayNav', `${displayNavegation}`)
        formConfig.append('slideshowDisplayTitle', `${displayTitle}`)
        formConfig.append('slideshowDisplaySubtitle', `${displaySubtitle}`)
        formConfig.append('slideshowDisplayDescription', `${displayDescription}`)
        formConfig.append('slideshowDisplayButton', `${displayButton}`)
        formConfig.append('slideshowDuration', slideDuration.toString())

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
                config.slideShow.config.isSlideShow = data.data.slideShow.config.isSlideShow
                config.slideShow.config.width = data.data.slideShow.config.width
                config.slideShow.config.height = data.data.slideShow.config.height
                config.slideShow.config.displayNav = data.data.slideShow.config.displayNav
                config.slideShow.config.displayTitle = data.data.slideShow.config.displayTitle
                config.slideShow.config.displaySubTitle = data.data.slideShow.config.displaySubTitle
                config.slideShow.config.displayDescription = data.data.slideShow.config.displayDescription
                config.slideShow.config.displayButton = data.data.slideShow.config.displayButton
                config.slideShow.config.duration = data.data.slideShow.config.duration
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
            <PageHeader 
                search={false} 
                title={'CONFIGURAÇÕES DO SLIDE SHOW'} 
                description={'Configure as principais caracteristicas do seu slide show'} 
            />
            <form className={Styles.data} onSubmit={(e) => updateSlideConfig(e)}>
                <h2 className={Styles.title}>
                    <p>Tipo</p>
                    <select name="slide-type" id="slide-type" value={isSlideShow} onChange={(e) => setIsSlideShow(e.target.value)} >
                        <option value={'true'}>Slide Show</option>
                        <option value={'false'}>Banner Fixo</option>
                    </select>   
                </h2>
                <h2 className={Styles.title}>
                    <p>Largura (px)</p>
                    <input type="text" name="slide-width" id="slide-width" value={slideWidth} onChange={(e) => setSlideWidth(Number(e.target.value))} />
                </h2>
                <h2 className={Styles.title}>
                    <p>Altura (px)</p>
                    <input type="text" name="slide-height" id="slide-height" value={slideHeight} onChange={(e) => setSlideHeight(Number(e.target.value))} />
                </h2>
                <h2 className={Styles.title}>
                    <p>Exibir Navegação</p>
                    <select name="display-navegation" id="display-navegation" value={displayNavegation} onChange={(e) => setDisplayNavegation(e.target.value)} >
                        <option value={'true'}>Sim</option>
                        <option value={'false'}>Não</option>
                    </select>
                </h2>
                <h2 className={Styles.title}>
                    <p>Exibir Título</p>
                    <select name="display-title" id="display-title" value={displayTitle} onChange={(e) => setDisplayTitle(e.target.value)} >
                        <option value={'true'}>Sim</option>
                        <option value={'false'}>Não</option>
                    </select>
                </h2>                <h2 className={Styles.title}>
                    <p>Exibir Subtítulo</p>
                    <select name="display-sub-title" id="display-sub-title" value={displaySubtitle} onChange={(e) => setDisplaySubtitle(e.target.value)} >
                        <option value={'true'}>Sim</option>
                        <option value={'false'}>Não</option>
                    </select>
                </h2>                <h2 className={Styles.title}>
                    <p>Exibir Descrição</p>
                    <select name="display-description" id="display-description" value={displayDescription} onChange={(e) => setDisplayDescription(e.target.value)} >
                        <option value={'true'}>Sim</option>
                        <option value={'false'}>Não</option>
                    </select>
                </h2>                <h2 className={Styles.title}>
                    <p>Exibir Botão</p>
                    <select name="display-button" id="display-button" value={displayButton} onChange={(e) => setDisplayButton(e.target.value)} >
                        <option value={'true'}>Sim</option>
                        <option value={'false'}>Não</option>
                    </select>
                </h2>
                <h2 className={Styles.title}>
                    <p>Duração do slide (Milisegundos)</p>
                    <input type="text" name="slide-duration" id="slide-duration" value={slideDuration} onChange={(e) => setSlideDuration(Number(e.target.value))} />
                </h2>
                <div className={Styles.button}>
                    <PrimarySubmit value={'Atualizar configurações'} />
                </div>
            </form>
        </div>
    )
}

export default SlideConfig
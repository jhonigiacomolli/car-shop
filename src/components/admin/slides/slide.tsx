import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { TYPE_API_Response, TYPE_Slide } from 'context/context-types'
import { PictureAdd } from 'components/icons'
import PrimarySubmit from 'components/buttons/primary-submit'
import AlertBox from 'components/messages/alert-box'
import MessageBox from 'components/messages/message-box'
import PageHeader from '../page-header'
import Styles from './slide.module.css'

type SlideProps = {
    slide?: TYPE_Slide
}

const Slide = ({ slide }: SlideProps) => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const { config } = useConfig()
    const [file, setFile] = useState<File>()
    const [fileThumbnail, setFileThumbnail] = useState('')
    const [title, setTitle] = useState('')
    const [subTitle, setSubTitle] = useState('')
    const [description, setDescription] = useState('')
    const [buttonLabel, setbuttonLabel] = useState('')
    const [buttonLink, setButtonLink] = useState('')
    const [align, setAlign] = useState('')
    const [clear, setClear] = useState(false)
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const {
        displayTitle,
        displaySubTitle,
        displayDescription,
        displayButton
    } = config.slideShow.config

    useEffect(() => {
        previewRender()
    }, [file])

    useEffect(() => {
        if(slide) {
            setTitle(slide.title) 
            setSubTitle(slide.subTitle) 
            setDescription(slide.description) 
            setbuttonLabel(slide.buttonLabel) 
            setButtonLink(slide.buttonLink) 
            setFileThumbnail(slide.backgroundImage) 
            setAlign(slide.align)
        }else {
            setTitle('')
            setSubTitle('')
            setDescription('')
            setbuttonLabel('')
            setButtonLink('')
            setFileThumbnail('')
            setAlign('')
            clearForm()
        }
        
        return () => {
            clearForm()
        }
    }, [slide])
    
    useEffect(() => {
        const img = document.getElementById('preview')
        fileThumbnail && img && img.setAttribute('src', fileThumbnail)
    }, [fileThumbnail] )

    useEffect(() => {
        clear && setFile(undefined)
        clear && removePreview()
        clear && setTitle('')
        clear && setSubTitle('')
        clear && setDescription('')
        clear && setbuttonLabel('')
        clear && setButtonLink('')
    }, [clear])

    function previewRender(){
        if(file) {
            const reader = new FileReader()
            const img = document.getElementById('preview')
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const result = event.target?.result
                result && img?.setAttribute('src', result.toString())
            }
            reader.readAsDataURL(file)
        }
    }
    
    function removePreview() {
        const img = document.getElementById('preview') as HTMLImageElement
        const input = document.getElementById('file') as HTMLInputElement
        img && img.removeAttribute('src') 
        input.value = ''
        setFile(undefined)
        setFileThumbnail('')
    }

    async function createSlide(event:FormEvent) {
        event.preventDefault()
    
        if (file || fileThumbnail) {
            setLoading(true)
            const headers = new FormData
            slide && headers.append('id', slide.id.toString())
            headers.append('title', title)
            headers.append('subTitle', subTitle)
            headers.append('description', description)
            headers.append('buttonLabel', buttonLabel)
            headers.append('buttonLink', buttonLink)
            headers.append('align', align)
            const imgInput = document.getElementById('preview') as HTMLImageElement
            file && imgInput.src !== '' && headers.append('file', file)
            slide && headers.append('thumbnail', slide.backgroundImage)
            slide && headers.append('thumbnailID', slide.backgroundImageID.toString())
            
            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Slide>>(`${api}/slide`, headers, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setSendStatus(data.status)
                setSendResponse(data.message)
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
                if(data.status === 200 && slide){
                    const updatedSlides = config.slideShow.slides.map(slide => slide.id === data.data.id ? slide = data.data : slide)
                    config.slideShow.slides = updatedSlides
                }
                if(data.status === 200 && !slide) {
                    config.slideShow.slides = [data.data, ...config.slideShow.slides]
                    clearForm()
                }
                setFile(undefined)
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
            setAlertMessage('Os campos Título e Conteúdo são obirgatórios, preencha-os e tente novamente')
        }
    }

    function handleChangeFile(event: ChangeEvent) {
        const { files } = event.target as HTMLInputElement
        files && setFile(files[0])
    }

    function clearForm() {
        setClear(true)
        setTimeout(() => {
            setClear(false)
        }, 2000);
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
                title={slide ? 'ATUALIZAR SLIDE' : 'NOVO SLIDE'} 
                description={slide ? 'Atualize as informações do seu slide show' : 'Crie slide shows incríveis para o seu público'} 
            />
            <form className={Styles.data} onSubmit={createSlide}>
                <div className={Styles.coverHeader}>
                    <div className={Styles.coverTitle}>
                        <h2 className={Styles.title}>Imagem de background</h2>
                        <p>Envie uma imagem para definir o background para o seu slide</p>
                    </div>
                    <label className={Styles.personalInputFile} htmlFor="file">
                        <input type="file" id={'file'} name={'file'} accept=".jpeg, .jpg, .png, .bmp, .img" onChange={(e) => handleChangeFile(e)} />
                    </label>
                </div>
                <div className={Styles.previewContainer}>
                    <label htmlFor={'file'} className={Styles.coverPreview}>
                        {(file || fileThumbnail) && <img id="preview" className={Styles.preview} />}
                        {(!file && !fileThumbnail) && <PictureAdd />}
                    </label>
                    {(file || fileThumbnail) && <span className={Styles.removeFile} onClick={() => removePreview() } >X</span>}
                </div>
                <div className={Styles.info}>
                    {displayTitle && <h2 className={Styles.title}>
                        <p>Título</p>
                        <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </h2>}
                    {displaySubTitle && <h2 className={Styles.title}>
                        <p>Subtítulo</p>
                        <input type="text" name="slug" id="slug" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
                    </h2>}
                    {displayDescription && <h2 className={Styles.title}>
                        <p>Descrição</p>
                        <input type="text" name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </h2>}
                    {displayButton && <h2 className={Styles.title}>
                        <p>Texto do botão</p>
                        <input type="text" name="button-text" id="button-text" value={buttonLabel} onChange={(e) => setbuttonLabel(e.target.value)}/>
                    </h2>}
                    {displayButton && <h2 className={Styles.title}>
                        <p>Link do botão</p>
                        <input type="text" name="button-link" id="button-link" value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} />
                    </h2>}
                    <h2 className={Styles.title}>
                        <p>Alinhamento dos Itens</p>
                        <select value={align} onChange={(e) => setAlign(e.target.value)} >
                            <option value="null">Selecione....</option>
                            <option value="left">Esquerda</option>
                            <option value="center">Centro</option>
                            <option value="right">Direita</option>
                        </select>
                    </h2>
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={slide ? 'Atualizar slide' : 'Criar novo slide'} />
                </div>
            </form>
        </div>
    )
}

export default Slide


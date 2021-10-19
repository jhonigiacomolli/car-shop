import { api } from 'api/api'
import axios from 'axios'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { TYPE_API_Response, TYPE_Portfolio } from 'context/context-types'
import { PictureAdd } from 'components/icons'
import PrimarySubmit from 'components/admin/buttons/primary-submit'
import AlertBox from 'components/admin/messages/alert-box'
import MessageBox from 'components/admin/messages/message-box'
import TextEditor from 'components/admin/text-editor/text-editor'
import PageHeader from '../page-header'
import Styles from './portfolio.module.css'

type PortfolioProps = {
    portfolio?: TYPE_Portfolio
}
const Portfolio = ({ portfolio }: PortfolioProps) => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const { portfolios, setPortfolios } = useConfig()
    const [file, setFile] = useState<File>()
    const [fileThumbnail, setFileThumbnail] = useState('')
    const [title, setTitle] = useState('')
    const [subTitle, setSubTitle] = useState('')
    const [description, setDescription] = useState('')
    const [buttonLabel, setbuttonLabel] = useState('')
    const [buttonLink, setButtonLink] = useState('')
    const [clear, setClear] = useState(false)
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')

    useEffect(() => {
        previewRender()
    }, [file])

    useEffect(() => {
        if(portfolio) {
            setTitle(portfolio.title) 
            setSubTitle(portfolio.subtitle) 
            setDescription(portfolio.description) 
            setbuttonLabel(portfolio.buttonLabel) 
            setButtonLink(portfolio.buttonLink) 
            setFileThumbnail(portfolio.cover) 
        }else {
            setTitle('')
            setSubTitle('')
            setDescription('')
            setbuttonLabel('')
            setButtonLink('')
            setFileThumbnail('')
            clearForm()
        }
        
        return () => {
            clearForm()
        }
    }, [portfolio])
    
    useEffect(() => {
        const img = document.getElementById('preview')
        fileThumbnail && img && img.setAttribute('src', fileThumbnail)
    }, [fileThumbnail] )

    useEffect(() => {
        clear && setFile(undefined)
        clear && removePreview()
        clear && setTitle('')
        clear && setSubTitle('')
        clear && setDescription('<p><br></p>')
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

    async function createPortfolio(event:FormEvent) {
        event.preventDefault()
    
        if (file || fileThumbnail) {
            setLoading(true)
            const headers = new FormData
            portfolio && headers.append('id', portfolio.id.toString())
            headers.append('title', title)
            headers.append('subtitle', subTitle)
            headers.append('description', description)
            headers.append('buttonLabel', buttonLabel)
            headers.append('buttonLink', buttonLink)
            headers.append('cover', file ? file : fileThumbnail)

            try {
                const { data }  = await axios.post<TYPE_API_Response<TYPE_Portfolio>>(`${api}/portfolio`, headers, {
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
                if(data.status === 200 && portfolio){
                    setPortfolios(portfolios.map(item => item.id === data.data.id ? data.data : item))
                    setFile(undefined)
                    setFileThumbnail(data.data.cover)
                }
                if(data.status === 200 && !portfolio) {
                    setPortfolios([data.data, ...portfolios])
                    clearForm()
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
                title={portfolio ? 'ATUALIZAR PORTFÓLIO' : 'NOVO PORTFÓLIO'} 
                description={portfolio ? 'Atualize as informações do seu portfolio' : 'Crie portfolioS incríveis'} 
            />
            <form className={Styles.data} onSubmit={createPortfolio}>
                <div className={Styles.coverHeader}>
                    <div className={Styles.coverTitle}>
                        <h2 className={Styles.title}>Imagem de background</h2>
                        <p>Envie uma imagem para definir o background para o seu portfolio</p>
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
                    <h2 className={Styles.title}>
                        <p>Título</p>
                        <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Subtítulo</p>
                        <input type="text" name="slug" id="slug" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
                    </h2>
                    <h2 className={Styles.text}>
                        <p>Descrição</p>
                        <TextEditor content={description} setText={setDescription} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Texto do botão</p>
                        <input type="text" name="button-text" id="button-text" value={buttonLabel} onChange={(e) => setbuttonLabel(e.target.value)}/>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Link do botão</p>
                        <input type="text" name="button-link" id="button-link" value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} />
                    </h2>
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={portfolio ? 'Atualizar portfolio' : 'Criar novo portfolio'} />
                </div>
            </form>
        </div>
    )
}

export default Portfolio


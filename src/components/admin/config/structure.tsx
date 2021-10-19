import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { TYPE_API_Response, TYPE_ConfigProps, TYPE_Image } from 'context/context-types'
import { PictureAdd } from 'components/icons'
import PrimarySubmit from 'components/admin/buttons/primary-submit'
import AlertBox from 'components/admin/messages/alert-box'
import MessageBox from 'components/admin/messages/message-box'
import PageHeader from '../page-header'
import Styles from './structure.module.css'

const Structure = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [galleryFiles, setGalleryFiles] = useState<File[]>([])
    const [galleryFilesThumbnail, setGalleryFilesThumbnail] = useState<TYPE_Image[]>([])
    const [tempGallery, setTempGallery] = useState<FileList>()
    const [tempGalleryThumbnail, setTempGalleryThumbnail] = useState<TYPE_Image[]>([])
    const [deletedGallery, setDeletedGallery] = useState<HTMLDivElement>()
    const [deletedGalleryThumbnail, setDeletedGalleryThumbnail] = useState<HTMLDivElement>()
    const [clear, setClear] = useState(false)
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const galleryContainerRef = useRef<HTMLDivElement>(null)
    const defaultGalleryItem = useRef<HTMLLabelElement>(null)
    const { 
        config, 
    } = useConfig()

    useEffect(() => {
        setGalleryFilesThumbnail(config.structure)
        setTempGalleryThumbnail(config.structure)    
    }, [])
    
    useEffect(() => {
        galleryPreviewRender()
    }, [galleryFiles])
    
    useEffect(() => {
         deletedGallery && removeGalleryItem(deletedGallery)
    }, [deletedGallery])

    useEffect(() => {
        deletedGalleryThumbnail && removeGalleryThumbnailItem(deletedGalleryThumbnail)
    }, [deletedGalleryThumbnail])

    useEffect(() => {
        tempGalleryThumbnail && galleryPreviewThumbnails()
    }, [tempGalleryThumbnail])

    useEffect(() => {
        const container = galleryContainerRef.current
        clear && setGalleryFiles([])
        clear && setGalleryFilesThumbnail([])
        const galleryThumbs = document.querySelectorAll('[gallery-id]')
        container && galleryThumbs.forEach(thumb => container.removeChild(thumb))
    }, [clear])
  
    function galleryPreviewRender() {
        const container = galleryContainerRef.current
        if(tempGallery && container instanceof HTMLDivElement && galleryFiles.length < 20) {            
            for(let i=0; i < tempGallery.length; i++) {
                const reader = new FileReader()
                reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
                    const result = event.target?.result
                    const div = document.createElement('div')
                    div.className = Styles.galleryItemContainer
                    div.setAttribute('gallery-id', tempGallery[i].name)
                    const img = new Image()
                    img.className = Styles.galleryPreview
                    result && img.setAttribute('src', result.toString())
                    const button = document.createElement('span')
                    const value = tempGallery[i].name
                    button.className = Styles.removeGalleryFile
                    button.addEventListener('click', () => setDeletedGallery(div))
                    button.innerHTML = 'X'
                    div.appendChild(img)
                    div.appendChild(button)
                    container.insertBefore(div, defaultGalleryItem.current)
                }, false)
                reader.readAsDataURL(tempGallery[i])
            }
        }
        setTempGallery(undefined)
    }
    
    function galleryPreviewThumbnails() {
        const container = galleryContainerRef.current
        if(container instanceof HTMLDivElement && tempGalleryThumbnail) {
            galleryFilesThumbnail.map(gallery => {
                const div = document.createElement('div')
                div.className = Styles.galleryItemContainer
                div.setAttribute('gallery-id', gallery.url)
                const img = new Image()
                img.className = Styles.galleryPreview
                img.setAttribute('src', gallery.url)
                const button = document.createElement('span')
                button.className = Styles.removeGalleryFile
                button.addEventListener('click', () => setDeletedGalleryThumbnail(div))
                button.innerHTML = 'X'
                div.appendChild(img)
                div.appendChild(button)
                container.insertBefore(div, defaultGalleryItem.current)
            })  
        }
    }
    
    function removeGalleryItem(div: Element) {
        const container = galleryContainerRef.current
        if(div && container instanceof HTMLDivElement ) {
            container.removeChild(div)
            const id = div.getAttribute('gallery-id')
            setGalleryFiles(oldFiles => oldFiles.filter(file => file.name !== id))   
            setDeletedGallery(undefined)
        }
    }

    function removeGalleryThumbnailItem(div: HTMLDivElement) {
        const container = galleryContainerRef.current
        if(div && container instanceof HTMLDivElement) {
            container.removeChild(div)
            const id = div.getAttribute('gallery-id')
            setGalleryFilesThumbnail(galleryFilesThumbnail.filter(file => file.url !== id))   
            setDeletedGalleryThumbnail(undefined)
        }
    }

    async function updateConfig(event: FormEvent) {
        event.preventDefault()
        setLoading(true)
        if((galleryFiles.length + galleryFilesThumbnail.length) <= 5) {
            const headers = new FormData
            headers.append('id', config.id.toString())
            headers.append('type', 'structure')
            galleryFilesThumbnail.map(thumb => headers.append('oldStructure[]', thumb.id.toString()))
            galleryFiles.map((file, index) => headers.append(`structure${index}`, file ))
            
            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_ConfigProps>>(`${api}/config`, headers, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setSendResponse(data.message)
                setSendStatus(data.status)
                config.structure = data.data.structure
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
                setGalleryFiles([])
            }catch(error: any) {
                setLoading(false)
                setSendStatus(error.status)
                setSendResponse(error.message)
                setTimeout(() => {
                    setSendResponse('')
                }, 2000);
            }
        }else {
            setLoading(false)
            setSendStatus(500)
            setSendResponse('Você pode enviar apenas 5 Imagens')
            setTimeout(() => {
                setSendResponse('')
            }, 2000);
        }
    }

    function handleGalleryChange(event: ChangeEvent) {
        const { files } = event.target as HTMLInputElement
        if(files) {
            setGalleryFiles([...galleryFiles, ...Array.from(files)])
            setTempGallery(files)
        }
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
            <PageHeader title="ESTRUTURA" description="Mostre ao cliente como é o visual da sua empresa"/>
            <form className={Styles.data} onSubmit={(e) => updateConfig(e)}>
                <div className={Styles.galleryHeader}>
                    <div className={Styles.galleryTitle}>
                        <h2 className={Styles.title}>Galeria</h2>
                        <p>Envie até 5 imagens da estrutura da sua empresa, para mostrar ao seu cliente qual o ambiente ele irá encontrar ao visita-lo</p>
                    </div>
                    <label className={Styles.personalInputFile} htmlFor="file">
                        <input 
                            type="file" 
                            id={'gallery-files'} 
                            name={'gallery-files'} 
                            multiple={true} 
                            accept=".jpeg, .jpg, .png, .bmp, .img" 
                            onChange={handleGalleryChange} 
                        />
                    </label>
                </div>
                <div ref={galleryContainerRef} className={Styles.galleryContainer}>
                    <label 
                        ref={defaultGalleryItem} 
                        htmlFor={'gallery-files'} 
                        className={`${Styles.galleryPreview} ${Styles.defaultGallery}`}
                    >
                        <PictureAdd />
                    </label>                    
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit 
                        value={'Atualizar Configurações'} 
                    />
                </div>
            </form>
        </div>
    )
}

export default Structure


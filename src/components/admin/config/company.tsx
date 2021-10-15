import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_ConfigProps } from 'context/context-types'
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { PictureAdd } from 'components/icons'
import PrimarySubmit from 'components/buttons/PrimarySubmit'
import AlertBox from 'components/messages/AlertBox'
import MessageBox from 'components/messages/MessageBox'
import TextEditor from 'components/text-editor/text-editor'
import PageHeader from '../page-header'
import Styles from './company.module.css'

const Company = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [fixedPhone, setFixedPhone] = useState('')
    const [mobilePhone, setMobilePhone] = useState('')
    const [email, setEmail] = useState('')
    const [logo, setLogo] = useState<File | string>('')
    const [fav, setFav] = useState<File | string>('')
    const [aboutUsTitle, setAboutUsTitle] = useState('')
    const [aboutUsDescription, setAboutUsDescription] = useState('')
    const [aboutUsImage, setAboutUsImage] = useState<File | string>('')
    const [dataRevalidate, setDataRevalidate] = useState(0)
    const [clear, setClear] = useState(false)
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const { 
        config,
        setConfig, 
    } = useConfig()
    const {
        siteTitle,
        siteDescription,
        companyFixedPhone,
        companyMobilePhone,
        companyEmailAddress,
        favIcon,
        revalidate,
        header,
        aboutUs
    } = config

    useEffect(() => {
        siteTitle && setTitle(siteTitle)
        siteDescription && setDescription(siteDescription)
        companyFixedPhone && setFixedPhone(companyFixedPhone)
        companyMobilePhone && setMobilePhone(companyMobilePhone)
        companyEmailAddress && setEmail(companyEmailAddress)
        header.logo && setLogo(header.logo)
        aboutUs.imageURL && setAboutUsImage(aboutUs.imageURL)
        aboutUs.title && setAboutUsTitle(aboutUs.title)
        aboutUs.text && setAboutUsDescription(aboutUs.text)
        favIcon && setFav(favIcon)
        revalidate && setDataRevalidate(revalidate)
    }, [])


    useEffect(() => {
        if(logo && typeof(logo) === 'string') {
            document.getElementById('logo-preview')?.setAttribute('src', logo)
        }else {
            imagePreviewRender('logo', logo)
        }
    }, [logo])
    
    useEffect(() => {
        if(fav && typeof(fav) === 'string') {
            document.getElementById('fav-preview')?.setAttribute('src', fav)
        }else {
            imagePreviewRender('fav', fav)
        }
    }, [fav])
    
    useEffect(() => {
        if(aboutUsImage && (typeof aboutUsImage === 'string')) {
            document.getElementById('about-us-preview')?.setAttribute('src', aboutUsImage)
        }else {
            imagePreviewRender('about-us', aboutUsImage)
        }
    }, [aboutUsImage])
    

    function imagePreviewRender(local: string, file: File | string){
        if(file && typeof file !== 'string') {
            const reader = new FileReader()
            const img = document.getElementById(`${local}-preview`)
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const result = event.target?.result
                result && img?.setAttribute('src', result?.toString())
            }
            reader.readAsDataURL(file)
        }
    }

    function removeImagePreview(local: string, setFile: () => void) {
        const img = document.getElementById(`${local}-preview`)
        img?.removeAttribute('src')
        setFile()
    }

    async function updateCompany(event: FormEvent) {
        event.preventDefault()
        setLoading(true)
        const formConfig  = new FormData
        formConfig.append('id', config.id.toString())
        formConfig.append('type', 'general')
        formConfig.append('siteTitle', title)
        formConfig.append('siteDescription', description)
        formConfig.append('companyFixedPhone', fixedPhone)
        formConfig.append('companyMobilePhone', mobilePhone)
        formConfig.append('companyEmailAddress', email)
        formConfig.append('logo', logo)
        formConfig.append('favIcon', fav)
        formConfig.append('aboutUsTitle', aboutUsTitle)
        formConfig.append('aboutUsText', aboutUsDescription)
        formConfig.append('aboutUsImage', aboutUsImage)
        formConfig.append('revalidate', dataRevalidate.toString())

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
                config.siteTitle = data.data.siteTitle
                config.siteDescription = data.data.siteDescription
                config.companyFixedPhone = data.data.companyFixedPhone
                config.companyMobilePhone = data.data.companyMobilePhone
                config.companyEmailAddress = data.data.companyEmailAddress
                config.header.logo = data.data.header.logo
                config.favIcon = data.data.favIcon
                config.aboutUs.title = data.data.aboutUs.title
                config.aboutUs.text = data.data.aboutUs.text
                config.aboutUs.imageURL = data.data.aboutUs.imageURL
                config.revalidate = data.data.revalidate
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

    useEffect(() => {
        clear && setTitle('')        
    }, [clear])

    function handleChangeLogo (event: ChangeEvent) {
        const { files } = event.target as HTMLInputElement
        files && setLogo(files[0])
    }

    function handleChangeFav (event: ChangeEvent) {
        const { files } = event.target as HTMLInputElement
        files && setFav(files[0])
    }

    function handleChangeAboutUs (event: ChangeEvent) {
        const { files } = event.target as HTMLInputElement
        files && setAboutUsImage(files[0])
    }

    function clearForm() {
        setAboutUsDescription('<p></p>')  
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
            <PageHeader title="CONFIGURAÇÕES GERAIS" description="Atualize as infromações principais da sua empresa" />
            <form className={Styles.data} onSubmit={(e) => updateCompany(e)}>
                <h2 className={Styles.title}>Dados do site</h2>
                <h2 className={Styles.title}>
                    <p>Título</p>
                    <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </h2>
                <h2 className={Styles.title}>
                    <p>Descrição</p>
                    <textarea name="site-description" id="site-description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </h2>
                <h2 className={Styles.title}>
                    <p>Telefone Fixo</p>
                    <input type="text" name="title" id="title" value={fixedPhone} onChange={(e) => setFixedPhone(e.target.value)} />
                </h2>
                <h2 className={Styles.title}>
                    <p>Telefone Móvel</p>
                    <input type="text" name="title" id="title" value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)} />
                </h2>
                <h2 className={Styles.title}>
                    <p>Email</p>
                    <input type="text" name="title" id="title" value={email} onChange={(e) => setEmail(e.target.value)} />
                </h2>
                <h2 className={Styles.title}>
                    <div>
                        <div className={Styles.coversubtitle}>
                            <p>Logomarca</p>
                        </div>
                        <label className={Styles.personalInputFile} htmlFor="logo">
                            <input type="file" id={'logo'} name={'logo'} accept=".jpeg, .jpg, .png, .bmp, .img" onChange={handleChangeLogo} />
                        </label>
                    </div>
                    <div className={Styles.previewContainer}>
                        <label htmlFor={'logo'} className={Styles.coverPreview}>
                            {logo && <img id={'logo-preview'} className={Styles.preview}></img>}
                            {!logo && <PictureAdd />}
                        </label>
                        {logo && <span className={Styles.removeFile} onClick={() => removeImagePreview('logo', () => setLogo('')) } >X</span>}
                    </div>
                </h2>
                <h2 className={Styles.title}>
                    <div>
                        <div className={Styles.coversubtitle}>
                            <p>Ícone</p>
                        </div>
                        <label className={Styles.personalInputFile} htmlFor="fav">
                            <input type="file" id={'fav'} name={'fav'} accept=".jpeg, .jpg, .png, .bmp, .img" onChange={handleChangeFav} />
                        </label>
                    </div>
                    <div className={Styles.previewContainer}>
                        <label htmlFor={'fav'} className={Styles.coverPreview}>
                            {fav && <img id={'fav-preview'} className={Styles.preview}></img>}
                            {!fav && <PictureAdd />}
                        </label>
                        {fav && <span className={Styles.removeFile} onClick={() => removeImagePreview('fav', () => setFav('')) } >X</span>}
                    </div>
                </h2>
                <h2 className={Styles.title}>Sobre a empresa</h2>
                <div className={Styles.aboutUs}>
                    <h3 className={Styles.subtitle}>Título</h3>
                    <input type="text" name="about-us-title" id="about-us-title" value={aboutUsTitle} onChange={(e) => setAboutUsTitle(e.target.value)} />
                    <h3 className={Styles.subtitle}>Descriçao da Empresa</h3>
                    <div className={Styles.editorContainer}>
                        <TextEditor setText={setAboutUsDescription} clear={clear} content={aboutUsDescription} />
                    </div>
                    <div>
                        <div className={Styles.coversubtitle}>
                            <h3 className={Styles.subtitle}>Imagem</h3>
                            <p>Envie uma imagem para ser exibida na sessão Sobre a Empresa</p>
                            <p className={Styles.observation}>OBS. <i>caso opte por não enviar uma imagem, sua logomarca será exibida no lugar desta imagem</i></p>
                        </div>
                        <label className={Styles.personalInputFile} htmlFor="about-us-image">
                            <input type="file" id={'about-us-image'} name={'about-us-image'} accept=".jpeg, .jpg, .png, .bmp, .img" onChange={handleChangeAboutUs} />
                        </label>
                    </div>
                    <div className={Styles.previewContainer}>
                        <label htmlFor={'about-us-image'} className={Styles.coverPreview}>
                            {aboutUsImage && <img id={'about-us-preview'} className={Styles.preview}></img>}
                            {!aboutUsImage && <PictureAdd />}
                        </label>
                        {aboutUsImage && <span className={Styles.removeFile} onClick={() => removeImagePreview('about-us', () => setAboutUsImage('')) } >X</span>}
                    </div>
                </div>
                <h2 className={Styles.title}>
                    <p>Revalidação de informações</p>
                    <input type="text" name="revalidate" id="revalidate" value={dataRevalidate} onChange={(e) => setDataRevalidate(Number(e.target.value))} />
                </h2>
                <div className={Styles.button}>
                    <PrimarySubmit value={'Atualizar Configurações'} />
                </div>
            </form>
        </div>
    )
}

export default Company


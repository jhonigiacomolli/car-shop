import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { TYPE_API_Response, TYPE_Users } from 'context/context-types'
import { PictureAdd } from 'components/icons'
import PrimarySubmit from 'components/buttons/PrimarySubmit'
import AlertBox from 'components/messages/AlertBox'
import MessageBox from 'components/messages/MessageBox'
import PageHeader from '../page-header'
import Styles from './user.module.css'

type UserProps = {
    user?: TYPE_Users
}

const User = ({ user }: UserProps) => {
    const { loginToken, theme, userTheme, setUserTheme, setLoading, user:loggedUser, setUser } = useContext(TokenContext)
    const { users, setUsers } = useConfig()
    const [picture, setPicture] = useState<File>()
    const [pictureThumbnail, setPictureThumbnail] = useState('')
    const [userName, setUserName] = useState('')
    const [userLogin, setUserLogin] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [userCapability, setUserCapability] = useState('contributor')
    const [userProfileTheme, setUserProfileTheme] = useState('dark')
    const [userProfileThemeUpdated, setUserProfileThemeUpdated] = useState('')
    const [clear, setClear] = useState(false)
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')

    useEffect(() => {
        if(user && loggedUser?.id === user.id) {
            setUserTheme(userProfileTheme)
        }
        return () => {
            !userProfileThemeUpdated && loggedUser ? setUserTheme(loggedUser.theme) : ''
        }
    }, [userProfileTheme])

    useEffect(() => {
        return () => {
            userProfileThemeUpdated ? setUserTheme(userProfileThemeUpdated) : ''
        }
    }, [userProfileThemeUpdated])

    useEffect(() => {
        previewRender()
    }, [picture])

    useEffect(() => {
        if(user) {
            setUserName(user.name)
            setUserLogin(user.username)
            setUserEmail(user.email)
            setPictureThumbnail(user.picture)
            setUserCapability(user.capability)
            setUserProfileTheme(user.theme)
        }else {
            setUserName('')
            setUserLogin('')
            setUserEmail('')
            setPictureThumbnail('')
            setUserCapability('contributor')
            setUserProfileTheme('dark')
            clearForm()
        }
        
        return () => {
            clearForm()
        }
    }, [user])
    
    useEffect(() => {
        const img = document.getElementById('preview')
        pictureThumbnail && img && img.setAttribute('src', pictureThumbnail)
    }, [pictureThumbnail] )

    useEffect(() => {
        clear && setPicture(undefined)
        clear && setPictureThumbnail('')
        clear && removePreview()
        clear && setUserName('')
        clear && setUserLogin('')
        clear && setUserEmail('')
        clear && setUserPassword('')
        clear && setUserCapability('contributor')
    }, [clear])

    function previewRender(){
        if(picture) {
            const reader = new FileReader()
            const img = document.getElementById('preview')
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const result = event.target?.result
                result && img?.setAttribute('src', result.toString())
            }
            reader.readAsDataURL(picture)
        }
    }
    
    function removePreview() {
        const img = document.getElementById('preview')
        img && img.removeAttribute('src') 
        setPicture(undefined)
        setPictureThumbnail('')
    }

    async function createUser(event: FormEvent) {
        event.preventDefault()
    
        if (userEmail || userLogin) {
            setLoading(true)
            const headers = new FormData
            user && headers.append('id', user.id.toString())
            headers.append('name', userName)
            headers.append('username', userLogin)
            headers.append('email', userEmail)
            headers.append('capability', userCapability)
            headers.append('theme', userTheme)
            headers.append('picture', picture ? picture : pictureThumbnail)
            userPassword && headers.append('password', userPassword.trim().toString())
            
            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Users>>(`${api}/user`, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: headers
                })
                setLoading(false)
                setSendResponse(data.message)
                setSendStatus(data.status)
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
                if(data.status === 200 && user){
                    loggedUser?.id === data.data.id && setUser(data.data)
                    loggedUser?.id === data.data.id && setUserProfileThemeUpdated(data.data.theme)
                    const newUser = users.filter(user => user.id !== data.data.id)
                    setUsers(newUser)
                    setUsers([data.data, ...newUser])
                }
                if(data.status === 200 && !user) {
                    setUsers([data.data, ...users])
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
            setAlertMessage('Os campos Nome de usuário e E-mail de usuário são obirgatórios, preencha-os e tente novamente')
        }
    }

    function handleChangeFile(event: ChangeEvent) {
        const { files } = event.target as HTMLInputElement
        files && setPicture(files[0])
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
            <PageHeader title={user ? 'ATUALIZAR USUÁRIO' : 'NOVO USUÁRIO'} description={user ? 'Atualize as credenciais do usuário' : 'Crie novas credenciais de usuário'} />
            <form className={Styles.data} onSubmit={(e) => createUser(e)}>
                <div className={Styles.coverHeader}>
                    <div className={Styles.coverTitle}>
                        <h2 className={Styles.title}>Imagem do perfil</h2>
                        <p>Envie uma imagem para representar seu usuário dentro do painel administrativo</p>
                        <p className={Styles.subtitle}><b>OBS.</b> Para melhor exibição esta imagem deve possuir um formato quadrado, com base e altura iguais, o tamanho recomendado é de 100px x 100px</p>
                    </div>
                    <label className={Styles.personalInputFile} htmlFor="picture">
                        <input type="file" id={'picture'} name={'picture'} accept=".jpeg, .jpg, .png, .bmp, .img" onChange={handleChangeFile} />
                    </label>
                    <div className={Styles.previewContainer}>
                        <label htmlFor={'picture'} className={Styles.coverPreview}>
                            {(picture || pictureThumbnail) && <img id="preview" className={Styles.preview} />}
                            {(!picture && !pictureThumbnail) && <PictureAdd />}
                        </label>
                        {(picture || pictureThumbnail) && <span className={Styles.removeFile} onClick={() => removePreview() } >X</span>}
                    </div>
                </div>
                <div className={Styles.info}>
                    <h2 className={Styles.title}>
                        <p>Nome de exibição</p>
                        <input type="text" name="userName" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Nome do usuário</p>
                        <input type="text" name="slug" id="slug" disabled={user ? true : false} value={userLogin} onChange={(e) => setUserLogin(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Email do usuário</p>
                        <input type="text" name="slug" id="slug" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Nova senha</p>
                        <input type="text" name="slug" id="slug" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Tema</p>
                        <select name="theme-option" id="theme-option" value={userProfileTheme} onChange={(e) => setUserProfileTheme(e.target.value)}>
                            <option value="light">Claro</option>
                            <option value="dark">Escuro</option>
                        </select>
                    </h2>
                    {(loggedUser?.capability === 'administrator' || loggedUser?.capability === 'editor') && <h2 className={Styles.title}>
                        <p>Nível de capacidade</p>
                        <select name="button-text" id="button-text" value={userCapability} onChange={(e) => setUserCapability(e.target.value)}>
                            <option value="contributor">Usuário</option>
                            <option value="editor">Usuário Master</option>
                            {loggedUser?.capability === 'administrator' && <option value="administrator">MS Administrador</option>}
                        </select>
                    </h2>}
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={user ? 'Atualizar usuário' : 'Criar novo usuário'} />
                </div>
            </form>
        </div>
    )
}

export default User


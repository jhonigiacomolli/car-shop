import axios from 'axios'
import Link from 'next/link'
import { useConfig } from 'context'
import {administration_token, token, token_validation} from 'api/api'
import { ChangeEvent, Dispatch, FormEvent, useEffect, useState } from 'react'
import { User, Key, Eye, User_Logo, ArrowLeft } from 'components/icons'
import { TYPE_Users, TYPE_Message_Types, TYPE_API_Response } from 'context/context-types'
import CheckBox from 'components/checkbox/check-box'
import Image from 'next/image'
import MessageBox from 'components/admin/messages/message-box'
import Styles from './login.module.css'

type LoginProps = {
    setLogin: Dispatch<string>
    setUserName: Dispatch<TYPE_Users | undefined> 
    setLoading: Dispatch<boolean>
    users: TYPE_Users[] 
}
const Login = ({ setLogin, setUserName, setLoading, users }: LoginProps) => {
    const { config } = useConfig()
    const [passVisibility, setPassVisibility] = useState(false)
    const [user, setUser] = useState('')
    const [userError, setUserError] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [remind, setRemind] = useState(false)
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxMessage, setMessageBoxMessage] = useState('')

    useEffect(() => {
        const localToken =  localStorage.getItem('ms-auth-token') ? localStorage.getItem('ms-auth-token') : sessionStorage.getItem('ms-auth-token')
        const localUserEmail =  localStorage.getItem('ms-user-email') ? localStorage.getItem('ms-user-email') : sessionStorage.getItem('ms-user-email')

        if(localToken) {
            setLoading(true)
            axios({
                method: 'POST',
                url: `${token_validation}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localToken}`
                },
            }).then(resp => {
                console.log(resp);
                
                setLogin(localToken)                
                const user = users.filter(user => user.email === localUserEmail)
                setUserName(user[0])
            }).catch(error => {
                setLoading(false)
                setLogin('')
                setUserName(undefined)
                setMessageBoxType('warning')
                setMessageBoxTitle('SESSÃO FINALIZADA')
                setMessageBoxMessage('Sua sessão expirou, faça o login novamente')
                setTimeout(() => {
                    setMessageBoxMessage('')
                }, 2500);
            })
        } else {
            setLoading(false)
        }

        return () => {
            localToken
            localUserEmail
        }
    }, [])
    
    function inputValidate() {
        user ? setUserError(false) : setUserError(true)
        password ? setPasswordError(false) : setPasswordError(true) 
    }

    async function login(event: FormEvent) {
        event.preventDefault()
        if(!userError && !passwordError) {
            setLoading(true)

            try {
                const axiosdata = {
                    'username': user,
                    'password': password
                }
                const axiosconfig = {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
                const { data } = await axios.post<{ token: string, user_email: string}>(`${token}`, axiosdata, axiosconfig)
                
                if(data.token) {
                    if (remind) {
                        localStorage.setItem('ms-auth-token', data.token) 
                        localStorage.setItem('ms-user-email', data.user_email)
                    }else {
                        sessionStorage.setItem('ms-auth-token', data.token)
                        sessionStorage.setItem('ms-user-email', data.user_email)
                    }
                    const user = users.filter(user => user.email === data.user_email)
                    setUserName(user[0])
                    setLogin(data.token)
                }else {
                    setLoading(false)
                    setMessageBoxType('warning')
                    setMessageBoxTitle('CREDENCIAIS INVÁLIDAS')
                    setMessageBoxMessage('As credenciais informadas são inválidas, verifique e tente novamente')
                    setTimeout(() => {
                        setMessageBoxMessage('')
                    }, 2500);
                }
            }catch {
                try {
                    const axiosdata = {
                        'username': user,
                        'password': password
                    }
                    const axiosconfig = {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                    const { data } = await axios.post<{ token: string, user_email: string}>(`${administration_token}`, axiosdata, axiosconfig)
                                
                    if(data.token) {
                        if (remind) {
                            localStorage.setItem('ms-auth-token', data.token) 
                            localStorage.setItem('ms-user-email', data.user_email)
                        }else {
                            sessionStorage.setItem('ms-auth-token', data.token)
                            sessionStorage.setItem('ms-user-email', data.user_email)
                        }
                        const user = users.filter(user => user.email === data.user_email)
                        setUserName(user[0])
                        setLogin(data.token)
                    }else {
                        setLoading(false)
                        setMessageBoxType('warning')
                        setMessageBoxTitle('CREDENCIAIS INVÁLIDAS')
                        setMessageBoxMessage('As credenciais informadas são inválidas, verifique e tente novamente')
                        setTimeout(() => {
                            setMessageBoxMessage('')
                        }, 2500);
                    }
                }catch {
                    setLoading(false)
                    setMessageBoxType('warning')
                    setMessageBoxTitle('CREDENCIAIS INVÁLIDAS')
                    setMessageBoxMessage('As credenciais informadas são inválidas, verifique e tente novamente')
                    setTimeout(() => {
                        setMessageBoxMessage('')
                    }, 2500);
                }
            }
        }
    }

    function handleRemindChange (event: ChangeEvent) {
        const { checked } = event.target as HTMLInputElement
        setRemind(checked)
    }
    
    return ( 
        <div className={`${Styles.content}`}>
            {messageBoxMessage && (
                <MessageBox 
                    type={messageBoxType} 
                    title={messageBoxTitle} 
                    message={messageBoxMessage} 
                />
            )}
           <form onSubmit={(e) => login(e)} className={Styles.form}>
                <section className={Styles.logomarca}>
                    <User_Logo gradientName="loginGradient" color1="#bb00ff" color2="#bb00ff10" />
                    <Image src={'https://www.microsite.net.br/microsite/Logo.png'} width={'285'} height={'138'} quality={'100'} layout={'responsive'} />
                </section>
                <div className={Styles.userData}>
                    <input type="text" name="user" id="user"  placeholder="Usuário" className={Styles.user} value={user} onChange={(e) => setUser(e.target.value)}/>
                    <User color1={'#bb00ff'} color2={'#6a0785'} />
                </div>
                {userError && <span className={Styles.displayError}>Campo obrigatório, preencha com um usuário válido</span>}
                <div className={Styles.passwordData}>
                    <input type={passVisibility ? 'text' : 'password'} name="pass" id="pass" placeholder="Senha" className={Styles.pass} value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <Key color1={'#bb00ff'} color2={'#6a0785'}/>
                    <div className={`${Styles.revealPassword} ${passVisibility ? Styles.active : ''}`} onClick={() => setPassVisibility(!passVisibility)}>
                        <Eye />
                    </div>
                </div>
                {passwordError && <span className={Styles.displayError}>Campo obrigatório, preencha com uma senha válida</span>}
                <div className={Styles.submit}>
                    <label  htmlFor="remind-me">
                        <CheckBox id="remind-me" initialCheck={remind} onChange={handleRemindChange} />
                        <p>Salve minhas credenciais</p>
                    </label>
                    <input type="submit" name="submit" id="submit" value="Entrar" className={Styles.submit} onClick={() => inputValidate()}/>
                </div>
                <Link aria-label={'Valtar para o site'} href={'/'}>
                    <span className={Styles.return} onClick={() => setLoading(true)}>
                        <ArrowLeft label={config ? `Voltar para ${config.siteTitle}` : 'Voltar para a navegação'}/>
                    </span>
                </Link>
           </form>
        </div>
    )
}

export default Login
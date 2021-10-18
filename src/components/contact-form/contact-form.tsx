import axios from 'axios'
import { api } from 'api/api'
import { useConfig } from 'context'
import { TYPE_API_Response } from 'context/context-types'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import PrimarySubmit from 'components/buttons/primary-submit'
import CheckBox from 'components/checkbox/check-box'
import CircleLoader from 'components/loaders/circle-loader'
import AlertBox from 'components/messages/alert-box'
import Styles from './contact-form.module.scss'

const ContactForm = () => {
    const { config } = useConfig()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [LGPDauth, setLGPDauth] = useState(false)
    const [LGPDauthIP, setLGPDautIP] = useState('')
    const [LGPDauthDate, setLGPDauthDate] = useState('')
    const [LGPDauthError, setLGPDauthError] = useState(false)
    const [LGPDauthErrorMessage, setLGPDauthErrorMessage] = useState('')
    const [mailState, setMailState] = useState(0)
    const [loader, setLoader] = useState(false)
    const [initialSubmit, setinictialSubmit] = useState(false)
    const [nameError, setNameError] = useState(false)
    const [nameErrorMessage, setNameErrorMessage] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState('')
    const [phoneError, setPhoneError] = useState(false)
    const [phoneErrorMessage, setPhoneErrorMessage] = useState('')
    const [messageBox, setMessageBox] = useState('')
    
     
    function validateInputs(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setinictialSubmit(true)
        nameVerify(name, true)
        emailVerify(email)
        phoneVerify(phone)
        LGPDverify(LGPDauth, true)

        if(!nameError && !emailError && LGPDauth) {
            sendEmail()
        } else {
            setMessageBox('Os campos marcados com * são obrigatórios, preencha-os e tente novamente')
        }
    }

    function phoneMask(value: string){
        value = value.replace(/\D/g,""); //Remove tudo o que não é dígito
        value = value.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
        value = value.replace(/(\d)(\d{4})$/,"$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
        phoneVerify(value);
    }

    function nameVerify(name: string, submit?: boolean) {
        
        submit && name ? setNameErrorMessage('') : setNameErrorMessage('Este campo é obrigatório!')
        submit && (name ? setNameError(false) : setNameError(true))
        setName(name)
    }

    function emailVerify(email: string, submit?: boolean) {
        const REGEX_Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        submit && (REGEX_Email.test(email) ? setEmailErrorMessage('') : setEmailErrorMessage('Este campo é obrigatório, preencha-o com um endereço de e-mail válido!'))
        submit && (REGEX_Email.test(email) ? setEmailError(false) : setEmailError(true)) 
        setEmail(email)
    }

    function phoneVerify(phone: string, submit?: boolean) {
        const REGEX_Phone = /\s{0,1}[(]\d{2,2}[)]\s{0,1}\d{4,5}\s{0,1}[\-]{0,1}\s{0,1}\d{4,4}\s{0,1}/
        submit && (REGEX_Phone.test(phone) ? setPhoneErrorMessage('') : setPhoneErrorMessage('Este campo é obrigatório, preencha-o com um numero de telefone válido!'))
        submit && (REGEX_Phone.test(phone) ? setPhoneError(false) : setPhoneError(true))
        setPhone(phone)
    }

    
    function LGPDverify(checkState: boolean, submit?: boolean) {
        submit && setLGPDauthError(checkState ? true : false)
        submit && checkState ? setLGPDauthErrorMessage('') : setLGPDauthErrorMessage('Para poder enviar esta mensagem, você deve estar ciente e concordar com nossa politica de privacidade, marcando este campo')
        setLGPDauth(checkState)
    }

    function clearForm() {
        setName('')
        setEmail('')
        setPhone('')
        setSubject('')
        setMessage('')
        setLGPDauth(false)
    }

    async function sendEmail() {
        setLoader(true)
        const url = document.URL.split('/')
        const URL_Site = `${url[0]}//${url[2]}`

        if(LGPDauth) {
            const mail_massage = `  <style>
                                        .p {
                                            font-size: 16px;
                                            color: #181818;   
                                        }
                                        a {
                                            text-decoration: none;
                                            color: #181818;
                                        }
                                        .title {
                                            font-size: 13px;
                                            font-style: italic;
                                            margin-right: 10px;
                                            color: $424242;
                                        }
                                        .lgpd {
                                            font-size: 13px;
                                            color: #424242
                                        }
                                        .footer {
                                            font-size: 13px;
                                            color: #424242;
                                        }
                                    </style
                                    <div class="body">
                                        <span class="title">Você acaba de receber um contato através do seu website!</span><br><br>
                                        <span class="title">Nome:  </span><b>${name}</b><br>
                                        <span class="title">E-mail:  </span><b>${email}</b><br>
                                        <span class="title">Telefone:  </span><b>${phone}</b><br>
                                        <span class="title">Serviços:  </span><b>${subject}</b><br>
                                        <span class="title">Mensagem:</span><br>
                                        ${message}<br><br>
                                    </div>

                                    <b>LGPD</b><br>
                                    <div class="lgpd">
                                        <i>O Cliente concordou com o uso dos seus dados em:  <b>${LGPDauthDate}</b><br>
                                        Acesso realizado através do endereço IP: <b>${LGPDauthIP}</b></i>   
                                    <div>  
                                    <div class="footer">
                                        Esta mensagem foi enviada através do seu portal de negócios ${URL_Site}
                                    </div>
            `
            const headers = {
                'to': config.companyEmailAddress,
                'name': name,
                'email': email,
                'subject': subject,
                'message': mail_massage
            }
    
            axios.post<TYPE_API_Response<string>>(`${api}/mail`, headers).then(resp => {
                setLoader(false)
                setMailState(resp.data.status)
                clearForm()
                setTimeout(() => {
                    setMailState(0)
                }, 5000);
            })
        }else {
            alert('Devido a Lei Geral de Proteção de Dados, nós poderemos receber seu contato por e-mail apenas após você concordar com nossa politica de uso de Cookies, marque a caixa "Concordo com a utilização de cookies"')
        }
    }

    async function LGPDauthorization(event: ChangeEvent<HTMLInputElement>) {
        setLGPDauth(event.target.checked)        
        LGPDverify(event.target.checked, initialSubmit)
        event.target.checked ? setLGPDauthDate(new Date().toLocaleString('pt-BR')) : setLGPDauthDate('')
        event.target.checked && await axios.get<string>('https://api.ipify.org').then(resp => {
            setLGPDautIP(resp.data)
        })
    }
    
    return (
        <form className={Styles.form} onSubmit={validateInputs}>
            {messageBox && <AlertBox type="warning" message={messageBox} onConfirm={() => setMessageBox('')}/>}
            <h2 className={Styles.title}>Envie uma mensagem para nossa equipe</h2>
            <p>Preencha o formulário abaixo com as suas informações, que em breve um membro de nossa equipe irá entrar em contato para esclarecer todas as suas dúvidas.</p>
            <div className={`${Styles.name} ${Styles.input}`} >
                <label htmlFor={'name'}>Nome</label>
                <input type="text" name="name" id="name" value={name} onChange={(e) => nameVerify(e.target.value, initialSubmit)} />
                {nameError && <span className={Styles.displayError}>{nameErrorMessage}</span>}
            </div>
            <div className={`${Styles.phone} ${Styles.input}`} >
                <label htmlFor={'phone'}>Telefone</label>
                <input type="tel" name="phone" id="phone" value={phone} onChange={(e) => phoneMask(e.target.value)} />
                {phoneError && <span className={Styles.displayError}>{phoneErrorMessage}</span>}
            </div>
            <div className={`${Styles.email} ${Styles.input}`}>
                <label htmlFor={'email'}>E-mail</label>
                <input type="text" name="email" id="email" value={email}  onChange={(e) => emailVerify(e.target.value, initialSubmit)} />
                {emailError && <span className={Styles.displayError}>{emailErrorMessage}</span>}
            </div>
            <div className={`${Styles.pack} ${Styles.input}`}>
                <label htmlFor={'pack'}>Nossos Serviços</label>
                <select id="pack" value={subject}  onChange={(e) => setSubject(e.target.value)} >
                    <option value="Planos de Hospedagem">Planos de Hospedagem</option>
                    <option value="Serviços de E-mail Profissional">Serviços de E-mail Profissional</option>
                    <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                    <option value="Marketing para Mídias Sociais">Marketing para Mídias Sociais</option>
                    <option value="Seja um Revendedor Microsite">Seja um Revendedor Microsite</option>
                </select>
                {emailError && <span className={Styles.displayError}>{emailErrorMessage}</span>}
            </div>
            <div className={`${Styles.message} ${Styles.input}`} >
                <label htmlFor={'message'}>Sua Mensagem</label>
                <textarea name="message" id="" cols={30} rows={10} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className={Styles.authorization}>
                <label className={Styles.check} htmlFor="accept-terms">
                    <CheckBox id="accept-terms"  onChange={LGPDauthorization} initialCheck={LGPDauth}/>
                    <p>Ao usar este formulário, você concorda com o armazenamento e manuseio de seus dados por este site. Para maiores informações consulte nossa Política de Privacidade</p>
                </label>
                {initialSubmit && <span className={Styles.displayError}>{LGPDauthErrorMessage}</span>}
            </div>
            <span className={`${Styles.mailStatus} ${mailState === 200 && Styles.success} ${ mailState !== 0 &&  mailState !== 200 && Styles.error}`}>
                {
                    mailState === 200 && "Mensagem enviada com sucesso!!!"
                }
            </span>
            <div className={Styles.submit}>
                <PrimarySubmit value={'Enviar Dúvida'} />
                {loader &&  <CircleLoader />}
            </div>
        </form>
    )
}

export default ContactForm

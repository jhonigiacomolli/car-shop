import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Branch } from 'context/context-types'
import { FormEvent, useContext, useEffect, useState } from 'react'
import PrimarySubmit from 'components/buttons/PrimarySubmit'
import AlertBox from 'components/messages/AlertBox'
import MessageBox from 'components/messages/MessageBox'
import TextEditor from 'components/text-editor/text-editor'
import PageHeader from '../page-header'
import Styles from './branch.module.css'

type BranchProps = {
    branch?: TYPE_Branch
}
const Branch = ({ branch }: BranchProps) => {
    const { loginToken, theme, setLoading, user:loggedUser } = useContext(TokenContext)
    const { branches, setBranches } = useConfig()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('<p><br></p>')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [mobilePhone, setMobilePhone] = useState('')
    const [fixedPhone, setFixedPhone] = useState('')
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')

    useEffect(() => {
        if(branch) {
            setTitle(branch.title)
            setDescription(branch.description)
            setAddress(branch.address)
            setEmail(branch.email)
            setMobilePhone(branch.mobilePhone.toString())
            setFixedPhone(branch.fixedPhone.toString())
        }else {
            clearForm()
        }
        
        return () => {
            clearForm()
        }
    }, [branch])

    async function createUser(event: FormEvent) {
        event.preventDefault()
    
        if (title) {
            setLoading(true)
        
            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Branch>>(`${api}/branch`, {
                    id: branch?.id ?? 0,
                    title,
                    description,
                    address,
                    email,
                    fixedPhone,
                    mobilePhone,
                }, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    }
                })
    
                setLoading(false)
                setSendStatus(data.status)
                setSendResponse(data.message)
                data.status === 200 && !branch && clearForm()
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
                if(data.status === 200 && branch){
                    setBranches(branches.map(info => info.id === data.data.id ? data.data : info))
                }
                if(data.status === 200 && !branch) {
                    setBranches([data.data, ...branches])
                }
            }catch (error: any) {
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
            setAlertMessage('Os campos Titulo e descrição são obirgatórios, preencha-os e tente novamente')
        }
    }

    function clearForm() {
        setTitle('')
        setDescription('<p><br></p>')
        setAddress('')
        setEmail('')
        setMobilePhone('')
        setFixedPhone('')
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
            <PageHeader title={branch ? 'ATUALIZAR INFORMAÇÕES DA FILIAL' : 'NOVA FILIAL'} description={branch ? 'Atualize os dados das suas Filiais' : 'Crie novas Filiais'} />
            <form className={Styles.data} onSubmit={(e) => createUser(e)}>
                <div className={Styles.info}>
                    <h2 className={Styles.title}>
                        <p>Título</p>
                        <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Descrição</p>
                        <div className={Styles.editorContainer}>
                            <TextEditor content={description} setText={setDescription} />
                        </div>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Endereço</p>
                        <input type="text" name="address" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>E-mail</p>
                        <input type="email" name="e-mail" id="e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Telefones Fixos
                        </p>
                        <input type="text" name="fixed-phone" id="fixed-phone" value={fixedPhone} onChange={(e) => setFixedPhone(e.target.value)} />
                    </h2>
                    <p>Insira os telefones separados por vígula caso hourem mais do que um número.</p>
                    <h2 className={Styles.title}>
                        <p>Telefones Móveis</p>
                        <input type="text" name="mobile-phone" id="mobile-phone" value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)} />
                    </h2>
                    <p>Insira os telefones separados por vígula caso hourem mais do que um número.</p>
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={branch ? 'Atualizar usuário' : 'Criar novo usuário'} />
                </div>
            </form>
        </div>
    )
}

export default Branch


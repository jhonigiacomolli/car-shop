import { api } from 'api/api'
import axios from 'axios'
import PrimarySubmit from 'components/buttons/PrimarySubmit'
import AlertBox from 'components/messages/AlertBox'
import MessageBox from 'components/messages/MessageBox'
import TextEditor from 'components/text-editor/text-editor'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Tickets, TYPE_Ticket_Message } from 'context/context-types'
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { TokenContext } from '..'
import PageHeader from '../page-header'
import TicketMessage from './ticket-message'
import Styles from './ticket.module.css'

type TicketProps = {
    ticket?: TYPE_Tickets
}
const Ticket = ({ ticket }: TicketProps) => {
    const { loginToken, theme, user, setLoading, setBodyComponent, setOpenTickets } = useContext(TokenContext)
    const { config, tickets, setTickets } = useConfig()
    const [file, setFile] = useState<File[]>([])
    const [status, setStatus] = useState<'open' | 'progress' | 'closed'>('open')
    const [messages, setMessages] = useState<TYPE_Ticket_Message[]>([])
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('<p><br></p>')
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const fileInputRef = useRef(null)
    const states = {
        open: {
            label: 'Aberto',
            color: '#f00', 
        },
        progress: {
            label: 'Em progresso',
            color: '#ffae00',
        },
        closed: {
            label: 'Fechado',
            color: '#00ff00',
        }
    }

    useEffect(() => {
        if(ticket) {
            const selectedTicket = tickets.filter(item => item.id === ticket.id)[0]
            setTitle(selectedTicket.title)
            setStatus(selectedTicket.status)
            setMessages(selectedTicket.messages)
        }else {
            clearForm()
        }
        setOpenTickets(tickets.filter(item => item.status !== 'closed').length)
        
        return () => {
            clearForm()
        }
    }, [ticket, tickets])

    async function createTicket(event:FormEvent) {
        event.preventDefault()
        
        if (title && message) {
            setLoading(true)
            const headers = new FormData
            headers.append('title', title)
            headers.append('status', ticket ? 'progress' : 'open')
            if (ticket) {
                headers.append('id', ticket.id.toString())
                headers.append('author', ticket.author)
                headers.append('domain', ticket.domain)
            }else {
                headers.append('domain', document.domain)
                headers.append('author', user?.email ?? '')
            }
            messages.map(msg => headers.append('messages[]', `author:${msg.author}/&/message:${msg.message}/&/time:${msg.time}/&/attachments:${msg.attachments.map(file=> `file:${file}`)}`))
            headers.append('messages[]', `author:${user?.email}/&/message:${message}/&/time:${new Date().toLocaleString()}`)
            file?.map((file, index) => headers.append(`file${index}`, file))
            user && headers.append('user', user?.capability === 'administrator' ?  'microsite' : user?.email)
            
            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Tickets>>(`${api}/tickets`, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: headers
                })
                setLoading(false)
                setSendStatus(data.status)
                setSendResponse(data.message)
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
                if(data.status === 200 && ticket){
                    setTickets(tickets.map(tick => tick.id === data.data.id ? data.data : tick ))
                    if (fileInputRef.current) {
                        const input = fileInputRef.current as HTMLInputElement
                        input.value = ''
                    }
                    setFile([])
                }
                if(data.status === 200 && !ticket) {
                    setTickets([data.data, ...tickets])
                    if (fileInputRef.current) {
                        const input = fileInputRef.current as HTMLInputElement
                        input.value = ''
                    }
                    setFile([])
                    setBodyComponent(<Ticket ticket={data.data}/>)
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
        files && setFile(old => [...Array.from(files), ...old])
    }

    function clearForm() {
        setFile([])
        setTitle('')
        setMessage('<p><br></p>')
    }
    
    function handleRemoveAttachment(attachment: File) {
        setFile(file?.filter(fl => fl.name !== attachment.name))
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
                title={ticket ? 'RESPONDER CHAMADO' : 'NOVO CHAMADO'} 
                description={ticket ? 'Verifique as informações do seu chamado ou envie uma nova mensagem' : 'Abra um chamado técnico'} 
            />
            <form className={Styles.data} onSubmit={createTicket}>
                <div className={Styles.info}>
                    <h2 >
                        <p>Título</p>
                        <input type="text" name="title" id="title" disabled={ticket ? true : false} value={title} onChange={(e) => setTitle(e.target.value)} />
                    </h2>
                    {ticket && (
                        <h2 className={Styles.title}>
                            <p>Status</p>
                            <span style={{ color: states[status].color }}>
                                {states[status].label}
                            </span>
                        </h2>
                    )}
                    {ticket && messages && (
                        <div className={Styles.history}>
                            <p>Mensages Anteriores:</p>
                            {
                                messages.map(message => (
                                    <TicketMessage  key={message.time} message={message}/>
                                ))
                            }
                        </div>
                    )}
                    {status !== 'closed' && (
                        <>
                            <h2>
                                <p>Mensagem</p>
                            </h2>
                            <div className={Styles.textEditor}>
                                <TextEditor content={message} setText={setMessage}/>
                            </div>
                            <div className={Styles.actions}>
                                <label htmlFor="file" className={Styles.files}>
                                    <span className={Styles.filesButton}>Anexar arquivos</span>
                                    <input ref={fileInputRef}  multiple type="file" id={'file'} name={'file'} accept=".jpeg, .jpg, .png, .bmp, .img .gif .txt .doc .docx .pdf .xls .xlsm" onChange={handleChangeFile} />
                                </label>
                                <span className={Styles.removeButton} onClick={() => setFile([])} >
                                    Remover todos os arquivos
                                </span>
                            </div>
                            <div className={Styles.filesList}>
                            {
                                file?.map(fl => (
                                    <div key={fl.name} className={Styles.fileItem} onClick={() => handleRemoveAttachment(fl)}>
                                        <span>X</span>
                                        Anexo: 
                                        <p>{fl.name}</p>
                                    </div>
                                ))
                            }
                            </div>
                        </>
                    )}
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={ticket ? 'Responder' : 'Abrir chamado'} />
                </div>
            </form>
        </div>
    )
}

export default Ticket


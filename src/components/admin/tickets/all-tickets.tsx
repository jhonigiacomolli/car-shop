import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Tickets } from 'context/context-types'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { PadlockClose, PadlockOpen, Trash } from 'components/icons'
import AdminButton from 'components/buttons/admin-button'
import CheckBox from 'components/checkbox/check-box'
import ConfirmBox from 'components/messages/confirm-box'
import MessageBox from 'components/messages/message-box'
import PageHeader from '../page-header'
import Styles from './all-tickets.module.css'
import TicketItem from './ticket-item'

const AllTickets = () => {
    const { loginToken, theme, user, setLoading, setBodyComponent, setOpenTickets } = useContext(TokenContext)
    const { searchTerms, tickets: originalTickets, setTickets: setOriginalTickets} = useConfig()
    const [tickets, setTickets] = useState<TYPE_Tickets[]>([])
    const [massSelection, setMassSelection] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [selectTickets, setSelectTickets] = useState<string[]>([])
    const [ticketToDelete, setTicketToDelete] = useState<TYPE_Tickets[]>([])
    const [messageBox, setMessageBox] = useState(false)
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [messageBoxMessage, setMessageBoxMessage] = useState('')
    const [confirmBox, setConfirmBox] = useState(false)

    useEffect(() => {
        const selects = document.querySelectorAll('[ms-ticket]')
        const newTicket =[...selectTickets]
        
        for(let i=0; i<selects.length; i++) {
            const selected = selects[i] as HTMLInputElement

            if(selectAll && selects) {
                selected.checked = true
                setSelectTickets([...newTicket, selected.value])
            }else {
                selected.checked = false
                setSelectTickets(newTicket.filter(car => car !== selected.value))
            }
        }
    }, [selectAll])
    
    useEffect(() => {
        setTickets(
            (searchTerms && searchTerms !== '') 
                ? originalTickets.filter(ticket => ticket.title.toLowerCase().includes(searchTerms.toLowerCase())) 
                : originalTickets
        )
    }, [searchTerms, originalTickets])
    
    useEffect(() => {
        ticketToDelete && ticketToDelete.length > 0 ? setConfirmBox(true) : setConfirmBox(false)
        ticketToDelete && ticketToDelete.length > 1 ? setMessageBoxTitle('Exclusão em massa') : setMessageBoxTitle('Exclusão')
        ticketToDelete && ticketToDelete.length > 1 ? setMessageBoxMessage('Deseja excluir permanentemente os tickets selecionados ?') : setMessageBoxMessage('Deseja excluir permanentemente este ticket ?')
    }, [ticketToDelete])

    useEffect(() => {
        setTickets(originalTickets)
        setOpenTickets(originalTickets.filter(item => item.status !== 'closed').length)
    }, [originalTickets])

    function checkPosts(event: ChangeEvent<HTMLInputElement>) {
        const result = event.target as HTMLInputElement
        setSelectTickets(
            result.checked 
                ? [...selectTickets, result.getAttribute('ms-ticket') ?? ''] 
                : selectTickets.filter(ticket => ticket !== result.getAttribute('ms-ticket'))
        )
    }

    function massVerification(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target as HTMLInputElement
        setMassSelection(checked)
        if(!checked) {
            setSelectAll(false) 
            setSelectTickets([])
        }  
    }

    async function ticketDelete(tickets: TYPE_Tickets[]) {
        setConfirmBox(false)
        setLoading(true)
        try {
            const { data } = await axios.delete<TYPE_API_Response<TYPE_Tickets[]>>(`${api}/tickets`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${loginToken}`
                },
                data: { 'tickets': tickets }
            })
            setLoading(false)
            setMessageBoxMessage(data.message)
            if(data.status === 200) {
                setMessageBoxTitle('Sucesso!')
                setMessageBoxType('success')
                setMessageBox(true)
                setOriginalTickets(originalTickets.filter(old => !data.data.find(item => item.id === old.id)))
            } else {
                setMessageBoxTitle('Erro!')
                setMessageBoxType('error')
                setMessageBox(true)
            }
            setTimeout(() => {
                setMessageBox(false)
            }, 1500);
        }catch(error:any) {
            setLoading(false)
            setMessageBox(true)
            setMessageBoxTitle(error.status)
            setMessageBoxType('error')
            setMessageBoxMessage(error.message)
            setTimeout(() => {
                setMessageBox(false)
                setMessageBoxMessage('')
            }, 2000);
        }
    }

    function massiveDelete() {
        const ticketsDeleted:TYPE_Tickets[] = []
        document.querySelectorAll('[ms-ticket]').forEach(ticket => {
            const actualTicket = ticket as HTMLInputElement
            actualTicket.checked === true ?
                tickets.map(originalTicket => originalTicket.id === Number(ticket.getAttribute('ms-ticket')) && ticketsDeleted.push(originalTicket))
            : ''
        })
        setTicketToDelete(ticketsDeleted)
    }

    function handleCheck(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target as HTMLInputElement
        setSelectAll(checked)
    }

    async function handleCloseTicket(ticket: TYPE_Tickets) {
        setLoading(true)
        
        try {
            const axiosdata = {
                ...ticket,
                messages: ticket.messages.map(msg => `author:${msg.author}/&/message:${msg.message}/&/time:${msg.time}/&/attachments:${msg.attachments.map(file=> `file:${file}`)}`),
                status: ticket.status === 'closed' ? 'progress' : 'closed',
                user: user?.capability === 'administrator' ?  'microsite' : user?.email
            }
            const { data } = await axios.post<TYPE_API_Response<TYPE_Tickets>>(`${api}/tickets`, axiosdata, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${loginToken}`
                }
            })
            setLoading(false)
            setMessageBoxMessage(data.message)
            if(data.status === 200) {
                setMessageBoxTitle('Sucesso!')
                setMessageBoxType('success')
                setMessageBox(true)
                setOriginalTickets(originalTickets.map(old => data.data.id === old.id ? data.data : old))
            } else {
                setMessageBoxTitle('Erro!')
                setMessageBoxType('error')
                setMessageBox(true)
            }
            setTimeout(() => {
                setMessageBox(false)
            }, 1500);
        }catch(error: any) {
            setLoading(false)
            setMessageBox(true)
            setMessageBoxTitle(error.status)
            setMessageBoxType('error')
            setMessageBoxMessage(error.message)
            setTimeout(() => {
                setMessageBox(false)
                setMessageBoxMessage('')
            }, 2000);
        }
    }

    return (
        <div id={'body'} className={theme.content}>
            {messageBox && (
                <MessageBox 
                    type={messageBoxType}
                    title={messageBoxTitle}
                    message={messageBoxMessage}
                />
            )}
            {confirmBox && (
                <ConfirmBox 
                    title={messageBoxTitle}
                    message={messageBoxMessage}
                    onConfirm={() => ticketDelete(ticketToDelete)}
                    onCancel={() => setTicketToDelete([])}
                />
            )}
            <PageHeader 
                search 
                title={'SLIDES | SLIDE SHOW'} 
                description=""
            />
            <div className={Styles.options}>
                <p className={Styles.ticketsCount}><span>{tickets.length}</span> Tickets encontrados</p>
               <label className={Styles.selectionContainer} htmlFor="mass-selection">
                   <CheckBox id="mass-selection" onChange={massVerification}/>
                    Seleção em massa
                </label>
                {massSelection && <label className={Styles.selectionContainer} htmlFor="selection-all">
                    <CheckBox id="selection-all" onChange={handleCheck} />
                    Selecionar todos
                </label>}
                {selectTickets.length > 0 && (
                    <AdminButton link="" label="" icon="" onClick={() => massiveDelete()} >
                        Excluir itens selecionados
                    </AdminButton>
                )}
            </div>
            <div className={Styles.articlesContainer}>
                {[...tickets].sort((a, b) => {
                    if(a.status === 'progress' && b.status === 'closed') {
                        return 0
                    }
                    if (a.status === 'open' && b.status === 'closed') {
                        return -1
                    }
                    else {
                        return 1
                    }
                }).map(ticket => {
                    return (
                        <div key={ticket.id} className={Styles.ticket} >
                            {massSelection && <label className={Styles.selectionContainer} htmlFor="item-selection">
                                <label htmlFor={`ticket-${ticket.id}`}>
                                    <CheckBox 
                                        id={`ticket-${ticket.id}`}
                                        initialCheck={selectAll}
                                        ms-ticket={ticket.id} 
                                        onChange={checkPosts}
                                    />
                                </label>
                            </label>}
                            <TicketItem 
                                ticket={ticket}
                                action={setBodyComponent}
                            />
                            <div className={Styles.actions}>
                                <AdminButton icon={ticket.status === 'closed' ? <PadlockOpen /> : <PadlockClose />} onClick={() => handleCloseTicket(ticket)}/>
                                <AdminButton onClick={() => setTicketToDelete([ticket])} icon={<Trash />} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllTickets

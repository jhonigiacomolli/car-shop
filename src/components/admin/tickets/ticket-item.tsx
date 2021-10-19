import { Dispatch, ReactElement, useEffect, useState } from 'react'
import { TYPE_Tickets } from 'context/context-types'
import Ticket from './ticket'
import Styles from './ticket-item.module.css'

type TicketItemProps = {
    ticket: TYPE_Tickets
    action: Dispatch<ReactElement>
}

const TicketItem = ({ ticket, action }: TicketItemProps) => {
    const [attachments, setAttachments] = useState(0)
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
        ticket.messages.length > 0 && setAttachments(ticket.messages.map(item => item.attachments ? item.attachments.length : 0).reduce((acc, item) => acc + item))
    }, [ticket])
    return (
            <div className={Styles.item} onClick={() => action(<Ticket ticket={ticket}/>)}>
                <span className={Styles.status} style={{ color: states[ticket.status].color }}>
                    {states[ticket.status].label}
                </span>
                <span className={Styles.domain} >
                    {ticket.domain}
                </span>
                <h1 className={Styles.title}>
                    {ticket.title}
                </h1>
                {attachments > 0 && <span className={Styles.attachments}>
                    {attachments}
                    <p>{attachments > 1 ? 'arquivos em anexo' : 'arquivo em anexo'}</p>
                </span>}
            </div> 
    )
}

export default TicketItem

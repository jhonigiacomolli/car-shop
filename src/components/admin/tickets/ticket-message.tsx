import { TYPE_Ticket_Message } from "context/context-types"
import Styles from './ticket-message.module.css'

type TicketMessageProps = {
    message: TYPE_Ticket_Message
}
const TicketMessage = ({ message }: TicketMessageProps) => {
    return (
        <div className={`${Styles.container} ${message.author.includes('microsite.net.br') ? Styles.support : ''}`}>
            <div>
                <p className={Styles.title}>
                    {message.author.includes('microsite.net.br') ? <span className={Styles.supportFlag}>Suporte Microsite</span> : 'Autor:'}
                    <span>{message.author.includes('microsite.net.br') ? `<${message.author}>` : message.author}</span>
                </p>
                <p className={Styles.title}>
                    Data:
                    <span>{message.time}</span>
                </p>   
                {message.attachments && message.attachments.length > 0 && (
                    <>
                        <p className={Styles.title}>Anexos:</p>
                        <div className={Styles.attachments}>
                            {message.attachments.map(att => (
                                <a href={att} target="__blank" rel="noopener norefferer" key={att}>
                                    {att}
                                </a>
                            ))} 
                        </div>
                    </>
                )}
            </div>
            <div>
                <p className={Styles.title}>Mensagem:</p>
                <div className={Styles.message} dangerouslySetInnerHTML={{ __html: message.message }}/>
            </div>
        </div>
    )
}

export default TicketMessage

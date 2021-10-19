import React, { ReactElement } from 'react'
import { Error, Success, Warning } from 'components/icons'
import Styles from './message-box.module.css'

type MessageBoxProps = {
    title: string
    message: string
    type: 'success' | 'warning' | 'error'
}
const MessageBox = (props: MessageBoxProps) => {
    const [type, setType] = React.useState('')
    const [typeIcon, setTypeIcon] = React.useState<ReactElement>()
    const {
        title,
        message,
        type: typeTerm
    } = props
    
    React.useEffect(() => {
        setType(typeTerm)
    }, [typeTerm])
    
    React.useEffect(() => {
        type === 'success' && setTypeIcon(<Success />)
        type === 'warning' && setTypeIcon(<Warning />)
        type === 'error' && setTypeIcon(<Error />)
    }, [type])

    return (
        <div className={Styles.messageContainer}>
            <div className={Styles.messageContent}>
                <div className={Styles.confirmBox}>
                    <div className={`${Styles.messageIcon} ${Styles[type]}`}>
                        {typeIcon}
                    </div>
                    <div className={Styles.messageBody}>
                        <h1 className={Styles.title}>{title}</h1>
                        <p className={Styles.message}>{message}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageBox

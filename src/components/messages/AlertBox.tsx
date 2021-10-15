import React, { ReactElement } from 'react'
import AdminButton from '../buttons/AdminButton'
import Styles from './AlertBox.module.css'
import { Success, Warning, Error } from '../icons'

type AlertBoxProps = {
    title?: string
    message: string
    type: 'success' | 'warning' | 'error' | string
    onConfirm: () => void
}
const AlertBox = ({title, message, type = 'success', onConfirm }: AlertBoxProps) => {
    const [typeIcon, setTypeIcon] = React.useState<ReactElement>()

    React.useEffect(() => {
        type === 'success' && setTypeIcon(<Success />)
        type === 'warning' && setTypeIcon(<Warning />)
        type === 'error' && setTypeIcon(<Error />)
    }, [type])

    return (
        <div className={Styles.messageContainer}>
            <div className={Styles.messageContent}>
                <div className={Styles.confirmBox}>
                    <div className={Styles.messageIcon}>
                        {typeIcon}
                    </div>
                    <div className={Styles.messageBody}>
                        <h1 className={Styles.title}>{title ? title : 'Alerta'}</h1>
                        <p className={Styles.message}>{message}</p>
                    </div>
                </div>
                <div className={Styles.actions}>
                    <AdminButton onClick={onConfirm}>OK</AdminButton>
                </div>
            </div>
        </div>
    )
}

export default AlertBox

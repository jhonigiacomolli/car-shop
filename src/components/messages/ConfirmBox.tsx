import React from 'react'
import AdminButton from '../buttons/AdminButton'
import Styles from './ConfirmBox.module.css'
import { Confirm } from '../icons'

type ConfirmBoxProps = {
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
}
const ConfirmBox = (props: ConfirmBoxProps) => {
    const {
        title,
        message,
        onConfirm,
        onCancel
    } = props

    return (
        <div className={Styles.messageContainer}>
            <div className={Styles.messageContent}>
                <div className={Styles.confirmBox}>
                    <div className={Styles.messageIcon}>
                        <Confirm />
                    </div>
                    <div className={Styles.messageBody}>
                        <h1 className={Styles.title}>{title}</h1>
                        <p className={Styles.message}>{message}</p>
                    </div>
                </div>
                <div className={Styles.actions}>
                    <AdminButton onClick={onConfirm}>OK</AdminButton>
                    <AdminButton onClick={onCancel}>Cancelar</AdminButton>
                </div>
            </div>
        </div>
    )
}

export default ConfirmBox

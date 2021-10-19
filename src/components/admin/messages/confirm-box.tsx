import { Confirm } from 'components/icons'
import SecundaryButton from 'components/buttons/secundary-button'
import Styles from './confirm-box.module.css'

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
                    <SecundaryButton onClick={onConfirm}>OK</SecundaryButton>
                    <SecundaryButton onClick={onCancel}>Cancelar</SecundaryButton>
                </div>
            </div>
        </div>
    )
}

export default ConfirmBox

import { FormEvent, ReactElement } from 'react'
import Styles from './buttons.module.css'

type PrimarySubmitProps = {
    value: string
    className?: string
    loader?: ReactElement
    disabled?: boolean
}
const PrimarySubmit = ({ value, className, loader, disabled }: PrimarySubmitProps) => {
    return (
        <span className={`${Styles.buttonContainer} ${className}`} >
            <input 
                type={'submit'} 
                disabled={disabled} 
                className={Styles.primarySubmit} 
                value={value} 
            />
        </span>
    ) 
}

export default PrimarySubmit

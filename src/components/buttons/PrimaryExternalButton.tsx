import React, { ReactNode } from 'react'
import Styles from './Buttons.module.css'

type PrimarExternalButton = {
    link: string
    target?: string
    children: string | ReactNode
    className?: string
    onClick?: () => void
}
const PrimaryExternalButton = ({ link, target, children, className, onClick }: PrimarExternalButton) => {
    return (
        <a href={link} target={target ?? ''} rel={'noreferer noopener'}>
            <span onClick={onClick} className={`${Styles.primaryButton} ${className ?? ''}`}>
                {children}
            </span>
        </a>
    )
}

export default PrimaryExternalButton

import React, { ReactNode } from 'react'
import Link from 'next/link'
import Styles from './Buttons.module.css'

type AdminExternalLinkProps = {
    link?: string
    label?: string
    children?: ReactNode
    theme?: string
    icon?: ReactNode
    onClick?: () => void
}

const AdminExternalLink = ({ link, onClick, children, theme, icon, label }: AdminExternalLinkProps) => {
    return (
        <a href={link ? link : ''} target={'_blank'} rel={'noopener noreferrer'}>
            <span aria-label={label} onClick={onClick} className={`${Styles.adminButton} ${ theme ? theme : ''}`}>
                {icon}
                {children}
            </span>
        </a>
    )
}

export default AdminExternalLink
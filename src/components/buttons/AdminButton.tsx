import React, { ReactNode } from 'react'
import Link from 'next/link'
import Styles from './Buttons.module.css'

type AdminButtonProps = {
    link?: string
    label?: string
    children?: ReactNode
    theme?: string
    icon?: ReactNode
    onClick?: () => void
}
const AdminButton = ({ link, onClick, children, theme, icon, label }: AdminButtonProps) => {
    return (
        <Link href={link ? link : ''} passHref >
            <span aria-label={label}  onClick={() => onClick && onClick()} className={`${Styles.adminButton} ${theme}`}>
                {icon}
                {children}
            </span>
        </Link>
    )
}

export default AdminButton
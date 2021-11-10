import React, { ReactNode } from 'react'
import Link from 'next/link'
import Styles from './buttons.module.css'

type AdminButtonProps = {
    link?: string
    label?: string
    children?: ReactNode
    theme?: string
    icon?: ReactNode
    onClick?: () => void
}
const SecundaryButton = ({ link, onClick, children, theme, icon, label }: AdminButtonProps) => {
    return (
        <Link href={link ? link : ''} passHref >
            <span onClick={() => onClick && onClick()} className={`${Styles.adminButton} ${theme}`}>
                {icon}
                {children}
            </span>
        </Link>
    )
}

export default SecundaryButton
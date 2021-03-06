import { ReactNode } from 'react'
import Link from 'next/link'
import Styles from './buttons.module.css'

type PrimaryButtonProps = {
    label?: string
    link?: string
    children: ReactNode
    onClick?: () => void
    className?: string
}
const PrimaryButton = ({ label, link, onClick, className, children }: PrimaryButtonProps) => {
    return (
        link ? (
            <Link href={link ?? ''} passHref>
                <span 
                    onClick={onClick} 
                    className={`${Styles.primaryButton} ${className ?? ''}`}
                >
                    {children}
                </span>
            </Link>
        ) : (
            <span 
                onClick={onClick} 
                className={`${Styles.primaryButton} ${className ?? ''}`}
            >
                {children}
            </span>
        )
    )
}

export default PrimaryButton

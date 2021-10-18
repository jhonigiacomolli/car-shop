import React from 'react'
import Styles from './title-with-separator.module.css'

type TitleWithSeparetorProps = {
    title: string
    Semantics: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    text?: string
    animationDelay?: string
    animation?: string
    titleColor?: string
}
const TitleWithSeparator = ({ Semantics, title, text, animation, animationDelay, titleColor }: TitleWithSeparetorProps) => {
    return (
        <Semantics className={`${Styles.title} ${animation} ${animationDelay}`} style={{ backgroundColor: titleColor ? titleColor : '#000' }}>
            {text}
        </Semantics >
    )
}

export default TitleWithSeparator

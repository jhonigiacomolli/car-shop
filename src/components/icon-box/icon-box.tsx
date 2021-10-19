import React, { ReactElement } from 'react'
import Styles from './icon-box.module.css'

type IconBoxProps = {
    icon: ReactElement
    title: string
    text: string
}
const IconBox = ({ icon, title, text }: IconBoxProps) => {
    return (
        <div className={Styles.container}>
            {icon}
            <h2 className={Styles.title}>{title}</h2>
            <p className={Styles.text} dangerouslySetInnerHTML={{__html: text}} />
        </div>
    )
}

export default IconBox

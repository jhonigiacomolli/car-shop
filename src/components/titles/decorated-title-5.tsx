import React from 'react'
import Styles from './decorated-title-5.module.css'

type DecoratedTitle5Props = {
    text: string
}
export const DecoratedTitle5 = ({ text }: DecoratedTitle5Props) => {
    return (
        <div className={Styles.titleContainer}>
            <h1 className={Styles.textTitle}>
                {text}
            </h1>
        </div>
    )
}

export default DecoratedTitle5
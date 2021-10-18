import React, { ChangeEvent, HTMLAttributes, HTMLInputTypeAttribute, useEffect, useState } from 'react'
import { CheckAlt } from '../icons'
import Styles from './check-box.module.css'

type CheckBoxProps = {
    id: string
    initialCheck?: boolean
    props?: HTMLAttributes<HTMLInputTypeAttribute>
    onChange?: (event:ChangeEvent<HTMLInputElement>) => void
}
const CheckBox = ({ id, initialCheck = false, onChange, ...props }:CheckBoxProps) => {
    const [check, setCheck] = useState(false)

    useEffect(() => {
        const state = document.querySelector(`#${id}`) as HTMLInputElement
        state && setCheck(state.checked)
    })
    
    useEffect(() => {
        setCheck(initialCheck)
    }, [initialCheck])

    return (
        <>
            <span className={`${Styles.personalCheck} ${check ? Styles.checked : ''}`}>
                <CheckAlt />
            </span>
            <input
                {...props}
                id={id}
                className={Styles.originalCheck} 
                type="checkbox"
                checked={check}
                onChange={(e) => {
                    setCheck(e.target.checked)
                    onChange && onChange(e)
                }}
                person-input={'true'}
            />          
        </>
    )
}

export default CheckBox

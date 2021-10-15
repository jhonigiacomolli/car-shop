import React from 'react'
import Styles from './Buttons.module.css'

const PrimarySubmit = (props) => {
    const marginLeft = props.value.length * 16

    return (
        <span className={`${Styles.buttonContainer} ${props.className}`} >
            {props.loader && <div className={Styles.loader} style={{marginLeft: `-${marginLeft}px`}} >{props.loader}</div>}
            <input type={'submit'} aria-label={props.label}  disabled={props.disabled || props.loader} onClick={props.onClick} className={Styles.primarySubmit} value={props.value}></input>
        </span>
    ) 
}

export default PrimarySubmit

import React from 'react'
import Styles from './decorated-title-4.module.css'

type DecoratedTitle_4Props = {
    text: string
}
export const DecoratedTitle4 = ({ text }: DecoratedTitle_4Props) => {
    return (
        <div className={Styles.titleContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48.84mm" height="7.95mm" viewBox="0 0 138.44 22.53">
                <path className={Styles.line1} d="M297.21,425.12s-27.81-4-49.89-13a205.55,205.55,0,0,0,49.89,15.66,205,205,0,0,0,49.86-15.66c-22.05,9-49.86,13-49.86,13Z" transform="translate(-227.99 -409.58)" fill="#cc9932" fillRule="evenodd"/>
                <path className={Styles.line2} d="M297.21,432.11h0c-36.08-6.53-58.19-17.09-60.29-18h0a.33.33,0,0,1-.12-.06c-3-1.37-5.92-2.86-8.81-4.46h8.42c27.66,14.17,60.8,19.41,60.8,19.41s32.2-5.24,59.87-19.41h9.35c-2.95,1.6-5.95,3.12-8.95,4.55-2.36,1-24.61,11.48-60.27,18Z" transform="translate(-227.99 -409.58)" fillRule="evenodd"/>
            </svg>
            <h1 className={Styles.textTitle}>
                {text}
            </h1>
        </div>
    )
}

export default DecoratedTitle4
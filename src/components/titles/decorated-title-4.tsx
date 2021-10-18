import React from 'react'
import Styles from './decorated-title-4.module.css'

type DecoratedTitle_4Props = {
    text: string
    detach: string
}
export const DecoratedTitle4 = ({ text, detach }: DecoratedTitle_4Props) => {
    return (
        <div className={Styles.titleContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="132.45mm" height="43.41mm" viewBox="0 0 375.45 123.04">
                <path d="M133.27,480.35c-11.74,21-67-45-65.42-84.46,3.17-77.13,50.08,3.92,122.54,3.92s318.16-43.4,183.85,49.05c-107.91,74.26-206.36-30.55-241,31.49Z" fillOpacity="0.3" transform="translate(-67.81 -362.6)" fillRule="evenodd"/>
                <path d="M162.41,481.38c-32.51,6.84-57.15-10.51-62.11-49.7-9.69-76.56,50-4.61,121.44-16.86s306.45-96.66,189.38,17.23c-94,91.47-179.66,34.82-248.71,49.33Z" fillOpacity="0.2" transform="translate(-67.81 -362.6)" fillRule="evenodd"/>
            </svg>
            <h1 className={Styles.textTitle}>
                {text}
                <span>{detach}</span>
            </h1>
        </div>
    )
}

export default DecoratedTitle4
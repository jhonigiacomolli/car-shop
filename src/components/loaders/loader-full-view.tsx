import React from 'react'
import { useConfig } from '../../context'
import Styles from './loader-full-view.module.css'

const LoaderFullView = () => {
    const { loading } = useConfig()
    return (
        <>
        {
            loading && (
                <div className={Styles.loaderContainer}>
                    <span className={Styles.loader} />
                </div>
            )
        }
        </>
    )
}

export default LoaderFullView

import React from 'react'
import Styles from './loader.module.scss'

//Componet Types
type LoaderProps = {
    loaderColor?: string;
    theme?: 'light' | 'dark';
    fullScreen?: true | false;
}
const Loader = ({ loaderColor, theme = 'light', fullScreen = false }:LoaderProps) => {
    return (
        <div className={`${Styles.loaderContainer} ${Styles[theme]}`}>
            <div className={`${Styles.loaderContent}  ${fullScreen ? Styles.fullscreen : ''}`}>
                <span className={Styles.loader} style={{ borderColor: loaderColor}}/>
            </div>
        </div>
    )
}

export default Loader

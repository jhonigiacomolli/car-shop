import React from 'react'
import Styles from './slide.module.css'
import Animations from '../../animations/animations.module.css'
import Image from 'next/image'
import { useConfig } from '../../context'

type SlideProps = {
    id: number
    visibility: boolean
    width: number
    height: number
    timeAnimation: number
    url: string
    title: string
    subTitle: string
    description: string
    buttonLabel: string
    buttonLink: string
}
const Slide = (props: SlideProps) => {
    const [info, setInfo] = React.useState(false)
    const { windowWidth, config } = useConfig()
    const {
        id,
        visibility,
        width,
        height,
        timeAnimation,
        url,
        title,
        subTitle,
        description,
        buttonLabel,
        buttonLink,
    } = props

    function handleLoad () {
        setInfo(true)
    }    

    if(config.slideShow && config.slideShow.config.isSlideShow) {
        return (
            <div id={`slide${id}`} className={`${Styles.slide} ${Animations.reveal}`} style={{ display: visibility ? 'flex' :  'none', minHeight: windowWidth <= 767 ? height * 0.7 : height, animationDuration:  `${timeAnimation}ms`}} >
                <Image 
                    className={Styles.imageSlide}
                    src={url}
                    alt={title}
                    width={ windowWidth <= 767 ? width * 0.7 : width} 
                    height={ windowWidth <= 767 ? height * 0.7 : height} 
                    onLoad={handleLoad}
                    quality="100" 
                    layout="fixed"
                />
                {info && <div className={Styles.info}>
                        <h1 
                        className={`${Styles.title} ${Animations.slideLeftInOut}`} 
                        style={{animationDuration: `${timeAnimation - 350}ms`, animationDelay: `${300}ms`}} 
                        >
                            {title}
                        </h1>
                        <h2 
                        className={`${Styles.subTitle} ${Animations.slideRightInOut}`} 
                        style={{animationDuration:  `${timeAnimation - 350}ms`, animationDelay: `${600}ms`}}
                        >
                            {subTitle}
                        </h2>
                        <p 
                        className={`${Styles.description} ${Animations.slideLeftInOut}`} 
                        style={{animationDuration:  `${timeAnimation - 350}ms`, animationDelay: `${900}ms`}}
                        >
                            {description}
                        </p>
                        <div className={Styles.buttonContainer}>
                            {buttonLink ? 
                                <a 
                                href={buttonLink} 
                                className={`${Styles.button} ${Animations.slideBottomInOut}`} 
                                style={{animationDuration: `${timeAnimation - 350}ms`, animationDelay: `${900}ms`}}
                                >
                                    {buttonLabel}
                                </a> 
                            : ''}
                        </div>
                </div>
                }
            </div>
        )
    }else {
        return (
            <div id={`slide${id}`} className={Styles.slide} style={{ display: visibility ? 'flex' : 'none', minHeight: windowWidth <= 767 ? height * 0.7 : height, animationDuration:  `${timeAnimation}ms`}} >
                <Image 
                    className={Styles.imageSlide}
                    src={url}
                    alt={title}
                    width={ windowWidth <= 767 ? width * 0.7 : width} 
                    height={ windowWidth <= 767 ? height * 0.7 : height} 
                    onLoad={handleLoad}  
                    quality="100" 
                    layout="fixed"
                />
                {info && <div className={Styles.info}>
                        <h1 
                        className={`${Styles.title} ${Animations.slideLeft}`} 
                        style={{animationDuration: `${timeAnimation - 350}ms`, animationDelay: `${300}ms`}} 
                        >
                            {title}
                        </h1>
                        <h2 
                        className={`${Styles.subTitle} ${Animations.slideRight}`} 
                        style={{animationDuration:  `${timeAnimation - 350}ms`, animationDelay: `${600}ms`}}
                        >
                            {subTitle}
                        </h2>
                        <p 
                        className={`${Styles.description} ${Animations.slideLeft}`} 
                        style={{animationDuration:  `${timeAnimation - 350}ms`, animationDelay: `${900}ms`}}
                        >
                            {description}
                        </p>
                        <div className={Styles.buttonContainer}>
                            {buttonLink ? 
                                <a 
                                href={buttonLink} 
                                className={`${Styles.button} ${Animations.slideBottom}`} 
                                style={{animationDuration: `${timeAnimation - 350}ms`, animationDelay: `${900}ms`}}
                                >
                                    {buttonLabel}
                                </a> 
                            : ''}
                        </div>
                </div>
                }
            </div>
        )
    }
}

export default Slide

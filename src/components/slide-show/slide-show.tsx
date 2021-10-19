import Styles from './slide-show.module.css'
import { useConfig } from 'context'
import { ArrowLeft, ArrowRight } from 'components/icons'
import Slide from './slide'
import { useState, useEffect, useRef, Fragment } from 'react'


const SlideShow = () => {
    const { windowWidth, config } = useConfig()
    const [numberSlides, setNumberSlides] = useState(1)
    const [slideVisible, setSlideVisible] = useState(0)
    const [timeAnimation, setTimeAnimation] = useState(1000)
    let timerSlide = useRef(0)

    useEffect(() => {
        if (config.slideShow && config.slideShow.config.isSlideShow) {
            if(numberSlides === 1) {
                timerSlide.current = window.setTimeout(() => {
                    setSlideVisible(0)
                }, 5000)
            }
            if(slideVisible < numberSlides ){
                timerSlide.current = window.setTimeout(() => {
                    setSlideVisible(slideVisible + 1)
                }, 5000)
            }else {
                clearTimeout(timerSlide.current)
                setSlideVisible(0)
            }
        }
        return () => {
            clearTimeout(timerSlide.current)
        }
    }, [slideVisible, config])
    
    useEffect(()=> {
        if(config.slideShow && config.slideShow.config.isSlideShow) {
            if(config.slideShow) {
                setNumberSlides(config.slideShow.slides.length)
                config.slideShow.config.duration && setTimeAnimation(config.slideShow.config.duration)
            } 
        } 
    }, [config])

    function nextSlide() {
        if(slideVisible <= numberSlides){
            clearTimeout(timerSlide.current)
            setSlideVisible(slideVisible + 1)
        }else {
            clearTimeout(timerSlide.current)
            setSlideVisible(0)
        }
    }

    function previousSlide() {
        if(slideVisible > 0){
            clearTimeout(timerSlide.current)
            setSlideVisible(slideVisible - 1)
        }else {
            clearTimeout(timerSlide.current)
            setSlideVisible(numberSlides-1)
        }
    }
    
    function renderSlide() {
        if(config.slideShow){
            return (
                config.slideShow.slides.map( (slide, index) => {
                    const title = config.slideShow.config.displayTitle ? slide.title : ''
                    const subTitle = config.slideShow.config.displaySubTitle ? slide.subTitle : ''
                    const description = config.slideShow.config.displayDescription ? slide.description : ''
                    const buttonLabel = config.slideShow.config.displayButton ? slide.buttonLabel : ''
                    const buttonLink = config.slideShow.config.displayButton ? slide.buttonLink : ''
                    return (
                        <Fragment key={index}>
                            <Slide 
                                id={index + 1}
                                visibility={slideVisible === index ? true : false}
                                timeAnimation={timeAnimation}
                                url={slide.backgroundImage} 
                                width={config.slideShow.config.width}
                                height={config.slideShow.config.height}
                                title={title}
                                subTitle={subTitle}
                                description={description}
                                buttonLink={buttonLink}
                                buttonLabel={buttonLabel} />
                        </Fragment>
                    )
                })
            )
        } else {
            return (
                <Fragment >
                            <Slide 
                                id={1}
                                url={'/images/defaultSlider.jpg'} 
                                width={1920}
                                height={900}
                                visibility={true}
                                timeAnimation={1000}
                                title={'SEUS VEÍCULOS AQUI'}
                                subTitle={'Comercialize seus veículos de forma fácil e rápida'}
                                description={'#comercioautomoveis'}
                                buttonLink={'#'}
                                buttonLabel={'Saiba mais'} />
                        </Fragment>
            )
        }
    }

    return (
        <div className={Styles.SlideContainer} style={{height: `${ config.slideShow && (windowWidth <= 767 ? config.slideShow.config.height * 0.7 : config.slideShow.config.height)}px`}}>
            {config.slideShow && config.slideShow.config.displayNav && config.slideShow.config.isSlideShow &&  numberSlides > 1 && 
                <button onClick={() => previousSlide()} className={Styles.buttonPrev}>
                    <ArrowLeft />
                </button>
            }
            {renderSlide()}
            {config.slideShow && config.slideShow.config.displayNav && config.slideShow.config.isSlideShow && numberSlides > 1 && 
                <button onClick={() => nextSlide()} className={Styles.buttonNext}>
                    <ArrowRight />
                </button>
            }
        </div>
    )
}

export default SlideShow

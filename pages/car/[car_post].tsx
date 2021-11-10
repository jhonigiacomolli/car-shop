import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import Styles from './car_post.module.css'
import { useConfig } from 'context'
import { dateFormat_inFull } from 'functions/date-format'
import { registerAccess } from 'functions/register-access'
import { api } from 'api/api'
import { TYPE_Cars, TYPE_ConfigProps, TYPE_Image } from 'context/context-types'
import { GetStaticPaths, GetStaticProps } from 'next'
import Breadcrumb from 'components/breadcrumb/breadcrumb'
import { ArrowLeft, ArrowRight, Calendar, CarPlate, Check, CheckAlt, Color, Door, Engine, Fuel, SteeringWheel, Tachometer, Transmission, Vehicle } from 'components/icons'
import PrimaryButton from 'components/buttons/primary-button'
import DecoratedTitle1 from 'components/titles/decorated-title-1'
import VideoPlayer from 'components/video/video-player'
import ShareBox from 'components/shareBox/share-box'
import CarPage_Form from 'components/contact-form/car-page-form'

type CarProps = {
    car: TYPE_Cars
    config: TYPE_ConfigProps
}

const Car = ({ car, config }: CarProps) => {
    const { config: contextConfig, windowWidth, setConfig, setPage, setLoading } = useConfig()
    const {
        code,
        title,
        slug,
        description,
        condition,
        motor,
        ports,
        transmission,
        assembler,
        fuel,
        direction,
        endPlate,
        color,
        price,
        salePrice,
        registration,
        km,
        year,
        thumbnail,
        gallery,
        video,
        optionals
    } = car ? car : {
        code: '',
        title: '',
        slug: '',
        description: '',
        condition: '',
        motor: '',
        ports: '',
        transmission: '',
        assembler: '',
        fuel: '',
        direction: '',
        endPlate: '',
        color: '',
        price: '',
        salePrice: '',
        registration: '',
        km: '',
        year: '',
        thumbnail: '',
        gallery: [],
        video: '',
        optionals: []
    }

    

    const formatedKm = Number(km).toLocaleString("pt-BR")
    const formatedRegistration = dateFormat_inFull(registration)
    const formatedPrice = price.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })
    const formatedSalePrice = salePrice.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })
    const [slide, setSlide] = React.useState(0)
    const [slideImages, setSlideImages] = React.useState<TYPE_Image[]>([])
    const [player, setPlayer] = React.useState(false)    
    const [url, setUrl] = React.useState('')
    const [descriptionString, setDescriptionString] = React.useState<string | null>('')
    
    React.useEffect(() => {
        setLoading(false)
        registerAccess()
        setPage('car')
        setConfig(config)
        setSlideImages([{ id: 0, url: thumbnail }, ...gallery])
        document && document.URL && setUrl(document.URL)
        const element = document.querySelector('[car-description]')
        document && element && setDescriptionString(element.textContent);
    }, [])

    function slideNext () {
        slide < slideImages.length -1 && slideImages.length > 1 ? setSlide(slide + 1) : setSlide(0)
    }
    function slidePrev() {
        slide > 0 ? setSlide(slide - 1) : setSlide(slideImages.length - 1)
    }

    function priceVerification(){
        if(salePrice) {
            return (
                <div className={Styles.value}>
                    <h1 className={Styles.scratch}>
                        {formatedPrice}
                    </h1>
                    <h1 className={Styles.price}>
                        {formatedSalePrice}
                    </h1>
                </div>
            )
        }else {
            return (
                <div className={Styles.value}>
                    <h1 className={Styles.price}>
                        {formatedPrice}
                    </h1>
                </div>
            )
        }
    }

    return (
        <div className={Styles.container}>
            {player && (
                <VideoPlayer url={video} closeChange={() => setPlayer(false)} />
            )}
            <Breadcrumb />
            <Head>
                <title>
                    {`${config && config.siteTitle} | ${title} `}
                </title>
                <meta name="description"          content={descriptionString ?? ''}/>         
                <meta property="og:url"           content={url ? url : ''} />
                <meta property="og:type"          content={'website'} />
                <meta property="og:title"         content={title} />
                <meta property="og:description"   content={descriptionString ?? ''} />
                <meta property="og:image"         content={thumbnail} />
            </Head>
            {/* SlideShow  */}
            <div className={Styles.imageContainer}>
                <div className={Styles.imageContent}>
                    <a className={Styles.buttonPrev} onClick={slidePrev}>
                        <ArrowLeft />
                        {windowWidth > 767 && "Anterior"}
                    </a>
                    <div className={Styles.imagePrev}>
                        {
                            slideImages.map((image, index, array) => {
                                if(image.url) {
                                    return (
                                        <div  
                                        key={slug + index} 
                                        className={`
                                        ${Styles.image} 
                                        ${index + 1 === slide && Styles.prev} 
                                        ${ slide === 0 && index+1 === array.length && Styles.prev}
                                        `}
                                        >
                                            <Image  
                                                src={image.url} 
                                                alt={`${title}-${index}`} 
                                                width={750} 
                                                height={500} 
                                                layout={'responsive'} 
                                                objectFit={'cover'}
                                            /> 
                                        </div>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                    </div>
                    <div className={Styles.imageSlide}>
                        {
                            slideImages.map((image, index, array) => {
                                if(image.url) {
                                    return (
                                        <div  key={slug + index} className={`${Styles.image} ${index === slide && Styles.slide}`}>
                                            <Image  
                                                src={image.url} 
                                                alt={`${title}-${index}`} 
                                                width={750} 
                                                height={500} 
                                                layout={'responsive'} 
                                                objectFit={'cover'}
                                            /> 
                                            <span className={Styles.slideCount}>
                                                {`Imagem ${index+1} de ${array.length}`}
                                            </span>
                                        </div>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                    </div>
                    <div className={Styles.imageNext}>
                        {
                            slideImages.map((image, index, array) => {
                                if(image.url) {
                                    return (
                                        <div  
                                            key={slug + index} 
                                            className={`
                                            ${Styles.image} 
                                            ${index-1 === slide && Styles.next} 
                                            ${slide === array.length - 1 && index === 0 && Styles.next}
                                            `}
                                        >
                                            <Image  
                                                src={image.url} 
                                                alt={`${title}-${index}`} 
                                                width={750} 
                                                height={500} 
                                                layout={'responsive'} 
                                                objectFit={'cover'}
                                            /> 
                                        </div>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                    </div>
                    <a className={Styles.buttonNext} onClick={slideNext}>
                        {windowWidth > 767 && "Próximo"}
                        <ArrowRight />
                    </a>
                </div>
            </div>
            {/* Informações do Veículo */}
            <div className={Styles.content}>
                <div className={Styles.carContent}>
                    <div className={Styles.titleContainer}>
                        <div className={Styles.title}>
                            <h1>{title}</h1>
                            <span className={Styles.postDate}>
                                Veículo anúnciado em: <p>
                                    {formatedRegistration}
                                </p>
                            </span>
                            {code && <span className={Styles.carCode}>
                                Código do Anúncio: <p>
                                    {code ?? ''}
                                </p>
                            </span>}
                        </div>
                        {priceVerification()}
                    </div>
                    {video && (
                        <div className={Styles.video}>
                            Este anúncio possuí um video com detalhes do veículo
                            <PrimaryButton link='' onClick={() => {setPlayer(true), scrollTo(0,0)}}>
                                Assistir video
                            </PrimaryButton>
                        </div>
                    )}
                    <DecoratedTitle1 
                        text={ config && config.cars && config.cars.carPage && config.cars.carPage.dataSectionTitle} 
                        className={Styles.sectionTitle} 
                    />
                    <div className={Styles.dataContainer}>
                        {condition && (
                            <span className={Styles.dataItem}>
                                <Check label={'Condição'} />
                                <p>{condition}</p>
                            </span>
                        )}
                        {assembler && (
                            <span className={Styles.dataItem}>
                                <Vehicle label={'Montadora'} />
                                <p>{assembler}</p>
                            </span>
                        )}
                        {transmission && (
                            <span className={Styles.dataItem}>
                                <Transmission label={'Câmbio'} />
                                <p>{transmission}</p>
                            </span>
                        )}
                        {fuel && (
                            <span className={Styles.dataItem}>
                                <Fuel label={'Combustível'} />
                                <p>{fuel}</p>
                            </span>
                        )}
                        {motor && (
                            <span className={Styles.dataItem}>
                                <Engine label={'Motorização'} />
                                <p>{motor}</p>
                            </span>
                        )}
                        {ports && (
                            <span className={Styles.dataItem}>
                                <Door label={'Portas'} />
                                <p>{ports}</p>
                            </span>
                        )}
                        {direction && (
                            <span className={Styles.dataItem}>
                                <SteeringWheel label={'Direção'} />
                                <p>{direction}</p>
                            </span>
                        )}
                        {formatedKm && (
                            <span className={Styles.dataItem}>
                                <Tachometer label={'KM'} />
                                <p>{formatedKm}</p>
                            </span>
                        )}
                        {endPlate && (
                            <span className={Styles.dataItem}>
                                <CarPlate label={'Final da Placa'} />
                                <p>{endPlate}</p>
                            </span>
                        )}
                        {year && (
                            <span className={Styles.dataItem}>
                                <Calendar label={'Ano'} />
                                <p>{year}</p>
                            </span>
                        )}
                        {color && (
                            <span className={Styles.dataItem}>
                                <Color label={'Cor'} />
                                <p>{color}</p>
                            </span>
                        )}
                    </div>
                    <DecoratedTitle1 
                        text={config && config.cars && config.cars.carPage && config.cars.carPage.optionsSectionTitle}  
                        className={Styles.sectionTitle} 
                    />
                    <div className={Styles.optionsContainer}>
                    {
                        optionals?.map((optional, index) => (
                                <div key={index} className={Styles.optionalItem}>
                                    <CheckAlt />
                                    <p>{optional}</p>
                                </div>
                            )
                        )
                    }
                    </div>
                    <DecoratedTitle1 
                        text={config && config.cars && config.cars.carPage && config.cars.carPage.descriptionSectionTitle}  
                        className={Styles.sectionTitle} 
                    />
                    <div 
                        car-description="car" 
                        className={Styles.description} 
                        dangerouslySetInnerHTML={{ __html: description }} 
                    />
                    <div className={Styles.share}>
                        <ShareBox 
                            sectionTitle="Compartilhe este anúncio com os seus amigos(as)" 
                            title={title} 
                            description={descriptionString ? descriptionString : ''} 
                            link={url} 
                        />
                    </div>
                </div>
                <div className={Styles.contactContainer}>
                    <CarPage_Form car={car}/>
                </div>
            </div>
        </div>
    )
}

export default Car


//Busca de dados na api
export const getStaticPaths: GetStaticPaths = async () => {
    const { data: slugs } = await axios.get<TYPE_Cars[]>(`${api}/cars`)
    
    return {
        paths : slugs.map(resp => {
                    return {
                        params: {
                            car_post: resp.slug,
                        }
                    }
                }),
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => { 
    const { data: config } = await  axios.get<TYPE_ConfigProps>(`${api}/config`)
    const { data: car } = await axios.get<TYPE_Cars>(`${api}/car/${params?.car_post}`)
    return {
        props: {
            config,
            car
        },
        revalidate: config.revalidate
    }
}

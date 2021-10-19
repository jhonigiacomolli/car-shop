import React from 'react'
import Axios from 'axios'
import { api } from '../../api/api'
import Head from 'next/head'
import Image from 'next/image'
import { useConfig } from '../../context/index'
import { DateFormat_inFull } from '../../functions/DateFormat'
import { Engine, Tachometer, Calendar, Transmission, Vehicle, Fuel, Check, CheckAlt, Door, SteeringWheel, CarPlate, Color, ArrowLeft, ArrowRight} from '../../components/icons'
import { RegisterAccess } from '../../functions/RegisterAccess'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import DecoratedTitle_1 from '../../components/utils/titles/DecoratedTitle_1'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import CarPage_Form from '../../components/contactForm/CarPage_Form'
import VideoPlayer from '../../components/video/VideoPlayer'
import Styles from './car_post.module.css'
import ShareBox from '../../components/utils/shareBox/ShareBox'

const Car = ({ car, config, setLoading }) => {
    const { config: contextConfig, setConfig, setPage, windowSize } = useConfig()
    const { cars } = config ? config : ''
    const {
        id,
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
        id: 0,
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
    const formatedRegistration = DateFormat_inFull(registration)
    const formatedPrice = price.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })
    const formatedSalePrice = salePrice.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })
    const [slide, setSlide] = React.useState(0)
    const [slideImages, setSlideImages] = React.useState([])
    const [player, setPlayer] = React.useState(false)    
    const [url, setUrl] = React.useState()
    const [descriptionString, setDescriptionString] = React.useState('')
    
    React.useEffect(() => {
        setLoading(false)
        RegisterAccess()
        setPage('car')
        setConfig(config)
        setSlideImages([{ url: thumbnail }, ...gallery])
        document && document.URL && setUrl(document.URL)
        document &&setDescriptionString(document.querySelector('[car-description]').textContent);
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
                    <h1 className={Styles.scratch}>{formatedPrice}</h1>
                    <h1 className={Styles.price}>{formatedSalePrice}</h1>
                </div>
            )
        }else {
            return (
                <div className={Styles.value}>
                    <h1 className={Styles.price}>{formatedPrice}</h1>
                </div>
            )
        }
    }

    return (
        (config && car) ? <div className={Styles.container}>
            {player && <VideoPlayer url={video} closeChange={() => setPlayer(false)} />}
            <Breadcrumb setLoading={setLoading}/>
            <Head>
                <title>{`${config && config.siteTitle} | ${title} `}</title>
                <meta name="description" content={descriptionString}/>         
                <meta property="og:url"           content={url ? url : ''} />
                <meta property="og:type"          content={'website'} />
                <meta property="og:title"         content={title} />
                <meta property="og:description"   content={descriptionString} />
                <meta property="og:image"         content={thumbnail} />
            </Head>
            {/* SlideShow  */}
            <div className={Styles.imageContainer}>
                <div className={Styles.imageContent}>
                    <a className={Styles.buttonPrev} onClick={slidePrev}>
                        <ArrowLeft />
                        {windowSize > 767 && "Anterior"}
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
                                            <Image  src={image.url} alt={`${title}-${index}`} width={750} height={500} layout={'responsive'} objectFit={'cover'}/> 
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
                                            <Image  src={image.url} alt={`${title}-${index}`} width={750} height={500} layout={'responsive'} objectFit={'cover'}/> 
                                            <span className={Styles.slideCount} >{`Imagem ${index+1} de ${array.length}`}</span>
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
                                            <Image  src={image.url} alt={`${title}-${index}`} width={750} height={500} layout={'responsive'} objectFit={'cover'}/> 
                                        </div>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                    </div>
                    <a className={Styles.buttonNext} onClick={slideNext}>
                        {windowSize > 767 && "Próximo"}
                        <ArrowRight />
                    </a>
                </div>
            </div>
            {/* Informações do Veículo */}
            <div className={Styles.content}>
                <div className={Styles.carContent}>
                    <div className={Styles.titleContainer}>
                        <div className={Styles.title}>
                            <h1 >{title}</h1>
                            <span className={Styles.postDate}>Veículo anúnciado em: <p>{formatedRegistration}</p></span>
                            {code && <span className={Styles.carCode}>Código do Anúncio: <p>{code}</p></span>}
                        </div>
                        {priceVerification()}
                    </div>
                    {video && <div className={Styles.video}>
                        Este anúncio possuí um video com detalhes do veículo
                        <PrimaryButton link='' onClick={(e) => {e.preventDefault(), setPlayer(true), scrollTo(0,0)}} >Assistir video</PrimaryButton>
                    </div>}
                    <DecoratedTitle_1 text={cars && cars.carPage && cars.carPage.dataSectionTitle} className={Styles.sectionTitle} />
                    <div className={Styles.dataContainer}>
                        {condition && <span className={Styles.dataItem}>
                            <Check label={'Condição'} />
                            <p>{condition}</p>
                        </span>}
                        {assembler && <span className={Styles.dataItem}>
                            <Vehicle label={'Montadora'} />
                            <p>{assembler}</p>
                        </span>}
                        {transmission && <span className={Styles.dataItem}>
                            <Transmission label={'Câmbio'} />
                            <p>{transmission}</p>
                        </span>}
                        {fuel && <span className={Styles.dataItem}>
                            <Fuel label={'Combustível'} />
                            <p>{fuel}</p>
                        </span>}
                        {motor && <span className={Styles.dataItem}>
                            <Engine label={'Motorização'} />
                            <p>{motor}</p>
                        </span>}
                        {ports && <span className={Styles.dataItem}>
                            <Door label={'Portas'} />
                            <p>{ports}</p>
                        </span>}
                        {direction && <span className={Styles.dataItem}>
                            <SteeringWheel label={'Direção'} />
                            <p>{direction}</p>
                        </span>}
                        {formatedKm && <span className={Styles.dataItem}>
                            <Tachometer label={'KM'} />
                            <p>{formatedKm}</p>
                        </span>}
                        {endPlate && <span className={Styles.dataItem}>
                            <CarPlate label={'Final da Placa'} />
                            <p>{endPlate}</p>
                        </span>}
                        {year && <span className={Styles.dataItem}>
                            <Calendar label={'Ano'} />
                            <p>{year}</p>
                        </span>}
                        {color && <span className={Styles.dataItem}>
                            <Color label={'Cor'} />
                            <p>{color}</p>
                        </span>}
                    </div>
                    <DecoratedTitle_1 text={cars && cars.carPage && cars.carPage.optionsSectionTitle}  className={Styles.sectionTitle} />
                    <div className={Styles.optionsContainer}>
                    {
                        optionals && optionals.map((optional, index) => {
                            return (
                                <span key={index} className={Styles.optionalItem}>
                                    <CheckAlt />
                                    <p>{optional.optional}</p>
                                </span>
                            )
                        })
                    }
                    </div>
                    <DecoratedTitle_1 text={cars && cars.carPage && cars.carPage.descriptionSectionTitle}  className={Styles.sectionTitle} />
                    <p car-description={'car'} className={Styles.description} dangerouslySetInnerHTML={{__html: description}} />
                <div className={Styles.share}>
                    <ShareBox sectionTitle={'Compartilhe este anúncio com os seus amigos(as)'} title={title} description={descriptionString} link={url} />
                </div>
                </div>
                <div className={Styles.contactContainer}>
                    <CarPage_Form config={config} car={car}/>
                </div>
            </div>
        </div> : <div></div>
    )
}

export default Car


//Busca de dados na api
export async function getStaticPaths() {
    const slugs = await Axios(`${api}/cars`).then(resp => resp.data)
    
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

export async function getStaticProps({params}) { 
    const config = await  Axios(`${api}/config`).then(resp => resp.data)
    const car = await Axios(`${api}/car/${params.car_post}`).then(resp => resp.data)
    return {
        props: {
            config,
            car
        },
        revalidate: config.revalidate
    }
}

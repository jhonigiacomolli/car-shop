import axios from 'axios'
import Image from 'next/image'
import { api } from 'api/api'
import { useConfig } from 'context'
import { registerAccess } from 'functions/register-access'
import Styles from './index.module.css'
import { TYPE_Cars, TYPE_CarTaxonomies, TYPE_ConfigProps, TYPE_Portfolio, TYPE_Posts } from 'context/context-types'
import AboutUs from 'components/about-us/about-us'
import LatestCars from 'components/car/latest-cars'
import FilterBox from 'components/filter/filter-box'
import SlideShow from 'components/slide-show/slide-show'
import DivisorCar from 'components/divisors/divisor-car'
import { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import DecoratedTitle5 from 'components/titles/decorated-title-5'

type HomeProps = {
    config: TYPE_ConfigProps
    cars: TYPE_Cars[]
    taxonomies: TYPE_CarTaxonomies
}
const Home = ({ config, cars, taxonomies }: HomeProps) => {
    const { setPage, setLoading, setConfig, setCarsTaxonomies, setCars } = useConfig()
    const [portfolio, setPortfolio] = useState<TYPE_Portfolio[]>([])

    useEffect(() => {
        setLoading(false)
        registerAccess()
        setConfig(config)
        setCars(cars)
        setCarsTaxonomies(taxonomies)
        setPage('home')
    }, [])
    
    useEffect(() => {
        async function getPortfolio() {
            const { data: portfolios } = await axios.get<TYPE_Portfolio[]>(`${api}/portfolio`)
            setPortfolio(portfolios)
        }
        getPortfolio()
    }, [])
    
    return (
        <div className={Styles.contentContainer}>
            <SlideShow />
            <FilterBox id="veiculos" />
            <LatestCars numberOfCars={cars && config.cars.latestCars.numberOfCars} cars={cars} />
            <DivisorCar 
                id={'sobre'} 
                color={'var(--dark-gray)'} 
                height={150} 
                invertedY={true} 
                invertedX={false}
            />
            <AboutUs />
            <div className={Styles.partners}>
                <DecoratedTitle5 text="Parceiros" />
                <div className={Styles.partner}>
                    {
                        portfolio?.map(item => (
                            <div key={item.id} >
                                <Image 
                                    src={item.cover} 
                                    alt="Parceiros" 
                                    width="150" 
                                    height="100" 
                                    objectFit="contain" 
                                    layout="fixed"
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Home

export const getStaticProps:GetStaticProps = async () => {
    const { data: config } = await  axios.get<TYPE_ConfigProps>(`${api}/config`)
    const { data: cars } = await  axios.get<TYPE_Cars[]>(`${api}/cars`)
    const { data: taxonomies } = await axios.get<TYPE_CarTaxonomies>(`${api}/cars/taxonomies`)
  
    return {
        props: {
            config,
            cars,
            taxonomies,
        },
        revalidate: config.revalidate
    }
}
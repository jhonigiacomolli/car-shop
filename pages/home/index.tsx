import React from 'react'
import axios from 'axios'
import { api } from 'api/api'
import { useConfig } from 'context'
import { registerAccess } from 'functions/register-access'
import Styles from './index.module.css'
import DivisorWave from 'components/divisors/divisor-wave'
import { TYPE_Cars, TYPE_CarTaxonomies, TYPE_ConfigProps, TYPE_Posts } from 'context/context-types'
import AboutUs from 'components/about-us/about-us'
import LatestCars from 'components/car/latest-cars'
import { carTaxonomies } from 'context/initial-contexts'
import FilterBox from 'components/filter/filter-box'
import SlideShow from 'components/slide-show/slide-show'

type HomeProps = {
    config: TYPE_ConfigProps
    cars: TYPE_Cars[]
    taxonomies: TYPE_CarTaxonomies
}
const Home = ({config, cars, taxonomies}: HomeProps) => {
    const { setPage, setLoading, setConfig, setCarsTaxonomies, setCars } = useConfig()

    React.useEffect(() => {
        setLoading(false)
        registerAccess()
        setConfig(config)
        setCars(cars)
        setCarsTaxonomies(taxonomies)
        setPage('home')
    }, [])
    
    return (
        <div className={Styles.contentContainer}>
            <SlideShow />
            <FilterBox id="veiculos" />
            <LatestCars  numberOfCars={cars && config.cars.latestCars.numberOfCars} cars={cars} />
            <DivisorWave 
                id={'sobre'} 
                overlap="bottom"
                fillColor1={'var(--ice-white)'} 
                fillColor2={'var(--detach-tertiary)'} 
                fillColor3={'transparent'} 
                height={170} 
                invertedY={false} 
                invertedX={false} 
            />
            <AboutUs />
        </div>
    )
}

export default Home

export async function getStaticProps() {
    const { data: config } = await  axios.get<TYPE_ConfigProps>(`${api}/config`)
    const { data: cars } = await  axios.get<TYPE_Cars[]>(`${api}/cars`)
    const { data: taxonomies } = await axios.get<TYPE_CarTaxonomies>(`${api}/cars/taxonomies`)
  
    return {
        props: {
            cars,
            taxonomies,
            config,
        },
        revalidate: config.revalidate
    }
}
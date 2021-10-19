import React from 'react'
import Axios from 'axios'
import API from '../../api/api'
import Styles from './index.module.css'
import { useConfig } from '../../context'
import { RegisterAccess } from '../../functions/RegisterAccess'
import FilterSideBar from '../../components/filter/FilterSideBar'
import BoxedCar from '../../components/car/BoxedCar'
import ListedCar from '../../components/car/ListedCar'
import { Grid, List } from '../../components/icons/index'
import { DateFormat_short } from '../../functions/DateFormat'

const Cars = ({ cars, taxonomies, config, setLoading }) => {
    
    const { setPage, setConfig, filter1, filter2, filter3, filter4 } = useConfig()
    const [Cars, setCars] = React.useState()
    const [carsPerPage, setCarsPerPage] = React.useState(config.cars.config.carsPerPage)
    const [wait, setWait] = React.useState(false)
    const [order, setOrder] = React.useState("dateUp")
    const [view, setView] = React.useState('grid')
    const [filterCondition, setFilterCondition] = React.useState('empty')
    const [filterAssembler, setFilterAssembler] = React.useState('empty')
    const [filterTransmission, setFilterTransmission] = React.useState('empty')
    const [filterFuel, setFilterFuel] = React.useState('empty')
    const [filterMotor, setFilterMotor] = React.useState('empty')
    const [filterPorts, setFilterPorts] = React.useState('empty')
    const [filterDirection, setFilterDirection] = React.useState('empty')
    const [filterKm, setFilterKm] = React.useState('empty')
    const [filterEndPlate, setFilterEndPlate] = React.useState('empty')
    const [filterYear, setFilterYear] = React.useState('empty')
    const [filterColor, setFilterColor] = React.useState('empty')

    const {
        homeFilter1,
        homeFilter2,
        homeFilter3,
        homeFilter4
    } = config.cars.config
    
    React.useEffect(() => {
        setLoading(false)
        RegisterAccess()
        setPage('cars')
        setConfig(config)

        homeFilter1 === 'condition' && filter1 && setFilterCondition(filter1)
        homeFilter1 === 'assembler' && filter1 && setFilterAssembler(filter1)
        homeFilter1 === 'transmission' && filter1 && setFilterTransmission(filter1)
        homeFilter1 === 'fuel' && filter1 && setFilterFuel(filter1)
        homeFilter1 === 'motor' && filter1 && setFilterMotor(filter1)
        homeFilter1 === 'ports' && filter1 && setFilterPorts(filter1)
        homeFilter1 === 'direction' && filter1 && setFilterDirection(filter1)
        homeFilter1 === 'endPlate' && filter1 && setFilterEndPlate(filter1)
        homeFilter1 === 'year' && filter1 && setFilterYear(filter1)
        homeFilter1 === 'color' && filter1 && setFilterColor(filter1)
        
        homeFilter2 === 'condition' && filter2 && setFilterCondition(filter2)
        homeFilter2 === 'assembler' && filter2 && setFilterAssembler(filter2)
        homeFilter2 === 'transmission' && filter2 && setFilterTransmission(filter2)
        homeFilter2 === 'fuel' && filter2 && setFilterFuel(filter2)
        homeFilter2 === 'motor' && filter2 && setFilterMotor(filter2)
        homeFilter2 === 'ports' && filter2 && setFilterPorts(filter2)
        homeFilter2 === 'direction' && filter2 && setFilterDirection(filter2)
        homeFilter2 === 'endPlate' && filter2 && setFilterEndPlate(filter2)
        homeFilter2 === 'year' && filter2 && setFilterYear(filter2)
        homeFilter2 === 'color' && filter2 && setFilterColor(filter2)

        homeFilter3 === 'condition' && filter3 && setFilterCondition(filter3)
        homeFilter3 === 'assembler' && filter3 && setFilterAssembler(filter3)
        homeFilter3 === 'transmission' && filter3 && setFilterTransmission(filter3)
        homeFilter3 === 'fuel' && filter3 && setFilterFuel(filter3)
        homeFilter3 === 'motor' && filter3 && setFilterMotor(filter3)
        homeFilter3 === 'ports' && filter3 && setFilterPorts(filter3)
        homeFilter3 === 'direction' && filter3 && setFilterDirection(filter3)
        homeFilter3 === 'endPlate' && filter3 && setFilterEndPlate(filter3)
        homeFilter3 === 'year' && filter3 && setFilterYear(filter3)
        homeFilter3 === 'color' && filter3 && setFilterColor(filter3)

        homeFilter4 === 'condition' && filter4 && setFilterCondition(filter4)
        homeFilter4 === 'assembler' && filter4 && setFilterAssembler(filter4)
        homeFilter4 === 'transmission' && filter4 && setFilterTransmission(filter4)
        homeFilter4 === 'fuel' && filter4 && setFilterFuel(filter4)
        homeFilter4 === 'motor' && filter4 && setFilterMotor(filter4)
        homeFilter4 === 'ports' && filter4 && setFilterPorts(filter4)
        homeFilter4 === 'direction' && filter4 && setFilterDirection(filter4)
        homeFilter4 === 'endPlate' && filter4 && setFilterEndPlate(filter4)
        homeFilter4 === 'year' && filter4 && setFilterYear(filter4)
        homeFilter4 === 'color' && filter4 && setFilterColor(filter4)
    }, [])
    
    React.useEffect(() => {
        function infiteScrool () {
            const scrool = window.scrollY
            const height = document.body.offsetHeight - window.innerHeight
            if(scrool > height * 0.25) {
                if(!wait){
                    if(carsPerPage < cars.length) {
                        setCarsPerPage(carsPerPage + config.cars.config.carsPerPage)
                        setWait(true)
                        setTimeout(() => {
                            setWait(false)
                        }, 1000)
                    }
                }
            }
        }
        window.addEventListener('scrool', infiteScrool)
        window.addEventListener('wheel', infiteScrool)
        
        return () => {
            window.removeEventListener('scrool', infiteScrool)
            window.removeEventListener('wheel', infiteScrool)
        }
    },[wait])
    
    React.useEffect(() => {
        const filter = cars
                        .filter(car => (filterCondition && filterCondition !== "empty") ? filterCondition === car.condition : car )
                        .filter(car => (filterAssembler && filterAssembler !== "empty") ? filterAssembler === car.assembler : car )
                        .filter(car => (filterTransmission && filterTransmission !== "empty") ? filterTransmission === car.transmission : car )
                        .filter(car => (filterFuel && filterFuel !== "empty") ? filterFuel === car.fuel : car )
                        .filter(car => (filterMotor && filterMotor !== "empty") ? filterMotor === car.motor : car)
                        .filter(car => (filterPorts && filterPorts !== "empty") ? filterPorts === car.ports : car)
                        .filter(car => (filterDirection && filterDirection !== "empty") ? filterDirection === car.direction : car)
                        .filter(car => (filterEndPlate && filterEndPlate !== "empty") ? filterEndPlate === car.endPlate : car)
                        .filter(car => (filterYear && filterYear !== "empty") ? filterYear === car.year : car)
                        .filter(car => (filterColor && filterColor !== "empty") ? filterColor === car.color : car)
                        .sort((carA, carB) => order === 'dateUp' &&  new Date(carB.registration) - new Date(carA.registration))
                        .sort((carA, carB) => order === 'dateDown' && new Date(carA.registration) - new Date(carB.registration))
                        .sort((carA, carB) => order === 'kmUp' && carB.km - carA.km)
                        .sort((carA, carB) => order === 'kmDown' && carA.km - carB.km)
                        .sort((carA, carB) =>  {
                            return order === "valueDown" ? carA.salePrice ? 
                                                    carB.salePrice ?  carA.salePrice - carB.salePrice : carA.salePrice - carB.price
                                                    :
                                                    carB.salePrice ? carA.price - carB.salePrice : carA.price - carB.price
                                                : ""
                        })
                        .sort((carA, carB) =>  {
                            return order === "valueUp" ? carA.salePrice ? 
                                                    carB.salePrice ?  carB.salePrice - carA.salePrice : carB.price - carA.salePrice
                                                    :
                                                    carB.salePrice ? carB.salePrice - carA.price : carB.price - carA.price
                                                : ""
                        })

        setCars(filter)
    }, [order, filterCondition, filterAssembler, filterTransmission, filterFuel, filterMotor, filterPorts, filterDirection, filterEndPlate, filterYear, filterColor] )

    function renderCars() {
        if (view === 'grid') {
            return (
                Cars && Cars.map((car, index) => {
                    return index < carsPerPage &&  <BoxedCar key={car.title} theme="light" car={car} setLoading={setLoading}/>
                })
            )
        }
        if(view === 'list') {
            return (
                Cars && Cars.map((car, index) => {
                    return index < carsPerPage &&  <ListedCar  key={car.title} theme="light" car={car} setLoading={setLoading}/>
                    }
                )
            )
        }
    }

    return (
        <React.Fragment>
            <div className={Styles.container}>
                <aside className={Styles.filters}>
                    <FilterSideBar 
                        taxonomies={taxonomies} 
                        config={config}
                        filterCondition={filterCondition}
                        filterAssembler={filterAssembler}
                        filterTransmission={filterTransmission}
                        filterFuel={filterFuel}
                        filterMotor={filterMotor}
                        filterPorts={filterPorts}
                        filterDirection={filterDirection}
                        filterEndPlate={filterEndPlate}
                        filterYear={filterYear}
                        filterColor={filterColor}
                        setFilterCondition={setFilterCondition} 
                        setFilterAssembler={setFilterAssembler}
                        setFilterTransmission={setFilterTransmission}
                        setFilterFuel={setFilterFuel}
                        setFilterMotor={setFilterMotor}
                        setFilterPorts={setFilterPorts}
                        setFilterDirection={setFilterDirection}
                        setFilterEndPlate={setFilterEndPlate}
                        setFilterYear={setFilterYear}
                        setFilterColor={setFilterColor}
                    />
                </aside>
                <div className={Styles.content}>
                    <div className={Styles.contentHeader}>
                        <div>
                            <h2 className={Styles.sectionTitle}>VEÍCULOS A VENDA</h2>
                            <span className={Styles.result}>{`${Cars && Cars.length} resultados`}</span>
                        </div>
                        <div className={Styles.ordenation}>
                            <p>Ordenar por: </p>  
                            <select name="ordenation" id="ordenation" onChange={(e) => setOrder(e.target.value)}>
                                <option value="dateUp">Mais Recentes Primeiro</option>
                                <option value="dateDown">Mais Antigos Primeiro</option>
                                <option value="valueUp">Valores Maiores Primeiro</option>
                                <option value="valueDown">Valores Menores Primeiro</option>
                                <option value="kmUp">Maior Kilometragem Primeiro</option>
                                <option value="kmDown">Menor Kilometragem Primeiro</option>
                            </select>
                            <a className={view === 'grid' ? Styles.active : ''} onClick={() => setView('grid')} >
                                <Grid />
                            </a>
                            <a className={view === 'list' ? Styles.active : ''} onClick={() => setView('list')}>
                                <List />
                            </a>
                        </div>
                    </div>
                    <div className={`${Styles.carContent} ${ view === 'list' ? Styles.listed : '' }`}>
                        {
                            renderCars()   
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Cars


export async function getStaticProps() {
    const config = await  Axios(`${API}/config`).then(resp => resp.data)
    const cars = await  Axios(`${API}/cars`).then(resp => resp.data)
    const taxonomies = await Axios(`${API}/cars/taxonomies`).then(resp => resp.data)
  
    return {
        props: {
            cars,
            taxonomies: taxonomies,
            config,
        },
        revalidate: config.revalidate
    }
  }
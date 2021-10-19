import Styles from './filter-box.module.css'
import { useConfig } from 'context'
import { TYPE_Cars, TYPE_CarTaxonomies, TYPE_Image, TYPE_Taxonomy } from 'context/context-types'
import { useEffect, useState } from 'react'
import PrimaryButton from 'components/buttons/primary-button'

type FilterboxProps = {
    id?: string
}
const FilterBox = ({ id }: FilterboxProps) => {
    const {  } = useConfig()
    const { 
        carsTaxonomies, 
        cars, 
        config, 
        setFilter1 : setHomeFilter1,
        setFilter2 : setHomeFilter2,
        setFilter3 : setHomeFilter3,
        setFilter4 : setHomeFilter4,
        setLoading
    } = useConfig()

    const {
        homeFilter1,
        homeFilter2,
        homeFilter3,
        homeFilter4,
        displayFilters,
    } = config.cars.config

    const [numberCars, setNumberCars] = useState(cars.length)
    const [filter1, setFilter1] = useState('')
    const [filter2, setFilter2] = useState('')
    const [filter3, setFilter3] = useState('')
    const [filter4, setFilter4] = useState('')
    const [label1, setLabel1] = useState('')
    const [label2, setLabel2] = useState('')
    const [label3, setLabel3] = useState('')
    const [label4, setLabel4] = useState('')
    const [taxonomies, setTaxonomies] = useState<{[key: string]: TYPE_Taxonomy[]}>({})

    useEffect(() => {
        setTaxonomies(carsTaxonomies)
    }, [carsTaxonomies])

    useEffect(() => {
        function verification (filter: string) {
            let labelString: string = ''
            filter === 'condition' ? labelString = 'Condição' : ''
            filter === 'assembler' ? labelString = 'Montadora' : ''
            filter === 'transmission' ? labelString = 'Transmissão' : ''
            filter === 'fuel' ? labelString = 'Combustível' : ''
            filter === 'motor' ? labelString = 'Motorização' : ''
            filter === 'ports' ? labelString = 'Portas' : ''
            filter === 'direction' ? labelString = 'Direção' : ''
            filter === 'endPlate' ? labelString = 'Final da Placa' : ''
            filter === 'year' ? labelString = 'Ano' : ''
            filter === 'color' ? labelString = 'Cor' : ''
            return labelString
        }
        setLabel1(verification(homeFilter1))
        setLabel2(verification(homeFilter2))
        setLabel3(verification(homeFilter3))
        setLabel4(verification(homeFilter4))
    }, [homeFilter1, homeFilter2, homeFilter3, homeFilter4])

    useEffect(() => {
        const mapedCars:{[key: string]: string | string[] | number | TYPE_Image[]}[] = cars
        const filter = mapedCars
                        .filter(car => (filter1 && filter1 !== "empty") ? filter1 === car[homeFilter1] : car )
                        .filter(car => (filter2 && filter2 !== "empty") ? filter2 === car[homeFilter2] : car )
                        .filter(car => (filter3 && filter3 !== "empty") ? filter3 === car[homeFilter3] : car )
                        .filter(car => (filter4 && filter4 !== "empty") ? filter4 === car[homeFilter4] : car )
        setNumberCars(filter.length)        
    }, [cars, filter1, filter2, filter3, filter4])
    
    function updateStateFilters() {
        setLoading(true)
        setHomeFilter1(filter1)
        setHomeFilter2(filter2)
        setHomeFilter3(filter3)
        setHomeFilter4(filter4)
    }

    return (
        <div id={id} className={Styles.filterContainer}>
            <div className={Styles.filterContent}>
                {displayFilters && <div className={Styles.labelContainer}>
                    <label className={Styles.label}>Buscá Rápida</label>
                </div>}
                {displayFilters && <div className={Styles.filter}>
                    <div className={Styles.selection}>
                        <label>{label1}</label>
                        <select onChange={(e) => setFilter1(e.target.value)}>
                                <option value="empty" >Selecione...</option>
                                {
                                    taxonomies[homeFilter1]?.map(filter1 => {
                                        return (
                                            <option key={filter1.slug} value={filter1.name}>{filter1.name}</option>
                                        )
                                    })
                                }
                            </select>
                    </div>
                    <div className={Styles.selection}>
                        <label>{label2}</label>
                        <select onChange={(e) => setFilter2(e.target.value)}>
                            <option value="empty" >Selecione...</option>
                            {
                                taxonomies[homeFilter2]?.map(filter2 => {
                                    return (
                                        <option key={filter2.slug} value={filter2.name}>{filter2.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={Styles.selection}>
                        <label>{label3}</label>
                        <select onChange={(e) => setFilter3(e.target.value)}>
                            <option value="empty" >Selecione...</option>
                            {
                                taxonomies[homeFilter3]?.map(filter3 => {
                                    return (
                                        <option key={filter3.slug} value={filter3.name}>{filter3.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={Styles.selection}>
                        <label>{label4}</label>
                        <select onChange={(e) => setFilter4(e.target.value)}>
                            <option value="empty" >Selecione...</option>
                            {
                                taxonomies[homeFilter4]?.map(filter4 => {
                                    return (
                                        <option key={filter4.slug} value={filter4.name}>{filter4.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <PrimaryButton onClick={updateStateFilters} link={"/car"}>{numberCars} Carros</PrimaryButton>
                </div>}
            </div>
        </div>
    )
}

export default FilterBox
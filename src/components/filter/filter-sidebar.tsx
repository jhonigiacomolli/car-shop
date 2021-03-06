import React, { Dispatch } from 'react'
import { useConfig } from '../../context'
import Styles from './filter-sidebar.module.css'
import { VehicleSearch, Check, Transmission, Vehicle, Fuel, Engine, Door, SteeringWheel, Color, CarPlate, Calendar, ArrowDown, ArrowUp } from 'components/icons/index'
import PrimaryButton from '../buttons/primary-button'
import { TYPE_CarTaxonomies, TYPE_ConfigProps } from 'context/context-types'

type FilterSidebarProps = {
    config: TYPE_ConfigProps
    taxonomies: TYPE_CarTaxonomies 
    filterCondition: string
    filterAssembler: string
    filterTransmission: string
    filterFuel: string
    filterMotor: string
    filterPorts: string
    filterDirection: string
    filterEndPlate: string
    filterYear: string
    filterColor: string
    setFilterCondition: Dispatch<string>
    setFilterAssembler: Dispatch<string>
    setFilterTransmission: Dispatch<string>
    setFilterFuel: Dispatch<string>
    setFilterMotor: Dispatch<string>
    setFilterPorts: Dispatch<string>
    setFilterDirection: Dispatch<string>
    setFilterEndPlate: Dispatch<string>
    setFilterYear: Dispatch<string>
    setFilterColor: Dispatch<string>
}
const FilterSidebar = (props: FilterSidebarProps) => {
    const [contract, setContract] = React.useState(true)
    const { windowWidth } = useConfig()
    const {
        config,
        taxonomies, 
        filterCondition,
        filterAssembler,
        filterTransmission,
        filterFuel,
        filterMotor,
        filterPorts,
        filterDirection,
        filterEndPlate,
        filterYear,
        filterColor,
        setFilterCondition,
        setFilterAssembler,
        setFilterTransmission,
        setFilterFuel,
        setFilterMotor,
        setFilterPorts,
        setFilterDirection,
        setFilterEndPlate,
        setFilterYear,
        setFilterColor,
    } = props

    const {
        condition,
        assembler,
        transmission,
        fuel,
        motor,
        ports,
        direction,
        endPlate,
        year,
        color
    } = taxonomies

    const {
        displayFilters,
        displayFilterCondition,
        displayFilterAssembler,
        displayFilterTransmission,
        displayFilterFuel,
        displayFilterMotor,
        displayFilterPorts,
        displayFilterDirection,
        displayFilterEndPlate,
        displayFilterYear,
        displayFilterColor,
    } = config.cars.config

    function resetFilters() {
        setFilterCondition('empty')
        setFilterAssembler('empty')
        setFilterTransmission('empty')
        setFilterFuel('empty')
        setFilterMotor('empty')
        setFilterPorts('empty')
        setFilterDirection('empty')
        setFilterEndPlate('empty')
        setFilterYear('empty')
        setFilterColor('empty')
    }

    React.useEffect(() => {
        windowWidth > 767 ? setContract(false) : setContract(true)
    }, [windowWidth])

    return (
        displayFilters ? <div className={Styles.filterContainer}>
            <div className={`${Styles.labelContainer} ${contract ? Styles.contracted : ''}`} onClick={() => windowWidth <= 767 && setContract(!contract)} >
                <label className={Styles.label}>{contract ? 'EXIBIR FILTROS' : 'Filtros de Busca'}</label>
                {windowWidth > 767 && <VehicleSearch />}
                {!contract && windowWidth <= 767 && <ArrowUp />}
                {contract && windowWidth <= 767 && <ArrowDown />}
            </div>
            <div className={`${Styles.filter} ${contract ? Styles.contracted : ''}`}>
                {displayFilterCondition && <Check label={'Condi????o'}/>}
                {displayFilterCondition && <select className={filterCondition !== 'empty' ? Styles.selected : ''} name="selectCondiction" id="selectCondiction" value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
                    <option value="empty" >Selecione...</option>
                    {
                        condition.map(cond => {
                            return (
                                <option key={cond.slug} value={cond.name}>{cond.name}</option>
                            )
                        })
                    }
                </select>}
                {displayFilterAssembler && <Vehicle label={'Montadora'} />}
                {displayFilterAssembler && <select className={filterAssembler !== 'empty' ? Styles.selected : ''} name="selectAssembler" id="selectAssembler"  value={filterAssembler} onChange={(e) => setFilterAssembler(e.target.value)}>
                    <option value="empty" >Selecione...</option>
                    {
                        assembler.map(assemble => {
                            return (
                                <option key={assemble.slug} value={assemble.name}>{assemble.name}</option>
                            )
                        })
                    }
                </select>}
                {displayFilterTransmission && <Transmission label={'Transmiss??o'} />}
                {displayFilterTransmission && <select className={filterTransmission !== 'empty' ? Styles.selected : ''} name="selectTrasnmission" id="selectTrasnmission" value={filterTransmission} onChange={(e) => setFilterTransmission(e.target.value)}>
                    <option value="empty" >Selecione...</option>
                    {
                        transmission.map(transm => {
                            return (
                                <option key={transm.slug} value={transm.name}>{transm.name}</option>
                            )
                        })
                    }
                </select>}
                {displayFilterFuel && <Fuel label={'Combust??vel'} />}
                {displayFilterFuel && <select className={filterFuel !== 'empty' ? Styles.selected : ''} name="selectFuel" id="selectFuel" value={filterFuel} onChange={(e) => setFilterFuel(e.target.value)}>
                    <option value="empty" >Selecione...</option>
                    {
                        fuel.map(fuel => {
                            return (
                                <option key={fuel.slug} value={fuel.name}>{fuel.name}</option>
                            )
                        })
                    }
                </select>}
                {displayFilterMotor && <Engine label={'Motoriza????o'} />}
                {displayFilterMotor && <select className={filterMotor !== 'empty' ? Styles.selected : ''} name="selectMotor" id="selectMotor" value={filterMotor} onChange={(e) => setFilterMotor(e.target.value)}>
                    <option value="empty" >Selecione...</option>
                    {
                        motor.map(motor => {
                            return (
                                <option key={motor.slug} value={motor.name}>{motor.name}</option>
                            )
                        })
                    }
                </select>}
                {displayFilterPorts && <Door label={'Portas'} />}
                {displayFilterPorts && <select className={filterPorts !== 'empty' ? Styles.selected : ''} name="selectPorts" id="selectPorts" value={filterPorts} onChange={(e) => setFilterPorts(e.target.value)}>
                    <option value="empty" >Selecione...</option>
                    {
                        ports.map(port => {
                            return (
                                <option key={port.slug} value={port.name}>{port.name}</option>
                            )
                        })
                    }
                </select>}
                {displayFilterDirection && <SteeringWheel label={'Dire????o'} />}
                {displayFilterDirection && <select className={filterDirection !== 'empty' ? Styles.selected : ''} name="selectDirection" id="selectDirection" value={filterDirection} onChange={(e) => setFilterDirection(e.target.value)}>
                    <option value="empty" >Selecione...</option>
                    {
                        direction.map(direction => {
                            return (
                                <option key={direction.slug} value={direction.name}>{direction.name}</option>
                            )
                        })
                    }
                </select>}
                {displayFilterEndPlate && <CarPlate label={'Final da Placa'} />}
                {displayFilterEndPlate && <select className={filterEndPlate !== 'empty' ? Styles.selected : ''} name="selectEndPlate" id="selectEndPlate" value={filterEndPlate} onChange={(e) => setFilterEndPlate(e.target.value)}>
                    <option value="empty" >Selecione...</option>
                    {
                        endPlate.map(plate => {
                            return (
                                <option key={plate.slug} value={plate.name}>{plate.name}</option>
                            )
                        })
                    }
                </select>}
                {displayFilterYear && <Calendar label={'Ano'} />}
                {displayFilterYear && <select className={filterYear !== 'empty' ? Styles.selected : ''} name="selectYear" id="selectYear" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                    <option value="empty" >Selecione...</option>
                    {
                        year.map(year => {
                            return (
                                <option key={year.slug} value={year.name}>{year.name}</option>
                            )
                        })
                    }
                </select>}
                {displayFilterColor && <Color label={'Cor'} />}
                {displayFilterColor && <select className={filterColor !== 'empty' ? Styles.selected : ''} name="selectColor" id="selectColor" value={filterColor} onChange={(e) => setFilterColor(e.target.value)}>
                    <option value="empty" >Selecione...</option>
                    {
                        color.map(color => {
                            return (
                                <option key={color.slug} value={color.name}>{color.name}</option>
                            )
                        })
                    }
                </select>}
                <PrimaryButton label={'Restaurar filtros'} onClick={resetFilters} >Restaurar Filtros</PrimaryButton>
            </div>
        </div> : null
    )
}

export default FilterSidebar

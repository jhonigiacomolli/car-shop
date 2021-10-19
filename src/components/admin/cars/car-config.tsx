import { api } from 'api/api'
import axios from 'axios'
import PrimarySubmit from 'components/admin/buttons/primary-submit'
import AlertBox from 'components/admin/messages/alert-box'
import MessageBox from 'components/admin/messages/message-box'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_ConfigProps } from 'context/context-types'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { TokenContext } from '..'
import PageHeader from '../page-header'
import Styles from './car-config.module.css'


const CarConfig = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [carsPerPage, setCarsPerPage] = useState(0)
    const [displayFilters, setDisplayFilters] = useState('false')
    const [displayCondition, setDisplayCondition] = useState('false')
    const [displayAssembler, setDisplayAssembler] = useState('false')
    const [displayTransmission, setDisplayTransmission] = useState('false')
    const [displayFuel, setDisplayFuel] = useState('false')
    const [displayMotor, setDisplayMotor] = useState('false')
    const [displayPorts, setDisplayPorts] = useState('false')
    const [displayDirection, setDisplayDirection] = useState('false')
    const [displayEndPlate, setDisplayEndPlate] = useState('false')
    const [displayYear, setDisplayYear] = useState('false')
    const [displayColor, setDisplayColor] = useState('false')
    const [filterHome1, setFilterHome1] = useState('')
    const [filterHome2, setFilterHome2] = useState('')
    const [filterHome3, setFilterHome3] = useState('')
    const [filterHome4, setFilterHome4] = useState('')
    const [numberOfCars, setNumberOfCars] = useState('')
    const [titleSection1, setTitleSection1] = useState('')
    const [titleSection2, setTitleSection2] = useState('')
    const [titleSection3, setTitleSection3] = useState('')
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const {
        config
    } = useConfig()


    useEffect(() => {
        config.cars && setDisplayFilters(`${config.cars.config.displayFilters}`)
        config.cars && setDisplayCondition(`${config.cars.config.displayFilterCondition}`)
        config.cars && setDisplayAssembler(`${config.cars.config.displayFilterAssembler}`)
        config.cars && setDisplayTransmission(`${config.cars.config.displayFilterTransmission}`)
        config.cars && setDisplayFuel(`${config.cars.config.displayFilterFuel}`)
        config.cars && setDisplayMotor(`${config.cars.config.displayFilterMotor}`)
        config.cars && setDisplayPorts(`${config.cars.config.displayFilterPorts}`)
        config.cars && setDisplayDirection(`${config.cars.config.displayFilterDirection}`)
        config.cars && setDisplayEndPlate(`${config.cars.config.displayFilterEndPlate}`)
        config.cars && setDisplayYear(`${config.cars.config.displayFilterYear}`)
        config.cars && setDisplayColor(`${config.cars.config.displayFilterColor}`)
        config.cars && setFilterHome1(config.cars.config.homeFilter1)
        config.cars && setFilterHome2(config.cars.config.homeFilter2)
        config.cars && setFilterHome3(config.cars.config.homeFilter3)
        config.cars && setFilterHome4(config.cars.config.homeFilter4)
        config.cars && setNumberOfCars(config.cars.latestCars.numberOfCars.toString())
        config.cars && setCarsPerPage(config.cars.config.carsPerPage)
        config.cars && setTitleSection1(config.cars.carPage.dataSectionTitle)
        config.cars && setTitleSection2(config.cars.carPage.optionsSectionTitle)
        config.cars && setTitleSection3(config.cars.carPage.descriptionSectionTitle)
    }, [])

    async function updateCarConfig(event: FormEvent) {
        event.preventDefault()

        setLoading(true)
        const formConfig  = new FormData
        formConfig.append('id', config.id.toString())
        formConfig.append('type', 'cars')
        formConfig.append('carsPerPage', carsPerPage.toString())
        formConfig.append('displayFilters', displayFilters)
        formConfig.append('displayFilterCondition', displayCondition)
        formConfig.append('displayFilterAssembler', displayAssembler)
        formConfig.append('displayFilterTransmission', displayTransmission)
        formConfig.append('displayFilterFuel', displayFuel)
        formConfig.append('displayFilterMotor', displayMotor)
        formConfig.append('displayFilterPorts', displayPorts)
        formConfig.append('displayFilterDirection', displayDirection)
        formConfig.append('displayFilterEndPlate', displayEndPlate)
        formConfig.append('displayFilterYear', displayYear)
        formConfig.append('displayFilterColor', displayColor)
        formConfig.append('homeFilter1', filterHome1)
        formConfig.append('homeFilter2', filterHome2)
        formConfig.append('homeFilter3', filterHome3)
        formConfig.append('homeFilter4', filterHome4)
        formConfig.append('numberOfCars', numberOfCars)
        formConfig.append('dataSectionTitle', titleSection1)
        formConfig.append('optionsSectionTitle', titleSection2)
        formConfig.append('descriptionSectionTitle', titleSection3)

        try {
            const { data } = await axios.post<TYPE_API_Response<TYPE_ConfigProps>>(`${api}/config`, formConfig, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            })
            setLoading(false)

            if(data.status === 200) {
                setSendResponse('Configurações atualizadas com sucesso')
                setSendStatus(data.status)
                config.cars.config.carsPerPage = data.data.cars.config.carsPerPage
                config.cars.config.displayFilters = data.data.cars.config.displayFilters
                config.cars.config.displayFilterCondition = data.data.cars.config.displayFilterCondition
                config.cars.config.displayFilterAssembler = data.data.cars.config.displayFilterAssembler
                config.cars.config.displayFilterTransmission = data.data.cars.config.displayFilterTransmission
                config.cars.config.displayFilterFuel = data.data.cars.config.displayFilterFuel
                config.cars.config.displayFilterMotor = data.data.cars.config.displayFilterMotor
                config.cars.config.displayFilterPorts = data.data.cars.config.displayFilterPorts
                config.cars.config.displayFilterDirection = data.data.cars.config.displayFilterDirection
                config.cars.config.displayFilterEndPlate = data.data.cars.config.displayFilterEndPlate
                config.cars.config.displayFilterYear = data.data.cars.config.displayFilterYear
                config.cars.config.displayFilterColor = data.data.cars.config.displayFilterColor
                config.cars.config.homeFilter1 = data.data.cars.config.homeFilter1
                config.cars.config.homeFilter2 = data.data.cars.config.homeFilter2
                config.cars.config.homeFilter3 = data.data.cars.config.homeFilter3
                config.cars.config.homeFilter4 = data.data.cars.config.homeFilter4
                config.cars.latestCars.numberOfCars = data.data.cars.latestCars.numberOfCars
                config.cars.carPage.dataSectionTitle = data.data.cars.carPage.dataSectionTitle
                config.cars.carPage.optionsSectionTitle = data.data.cars.carPage.optionsSectionTitle
                config.cars.carPage.descriptionSectionTitle = data.data.cars.carPage.descriptionSectionTitle
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
            }
        } catch(error: any) {
            setLoading(false)
            setSendStatus(error.status)
            setSendResponse(error.message)
            setTimeout(() => {
                setSendResponse('')
            }, 2000);
        }
    }

    return (
        <div className={theme.content}>
            {alertMessage && (
                <AlertBox 
                    type={alertType} 
                    title={alertTitle} 
                    message={alertMessage} 
                    onConfirm={() => setAlertMessage('')}
                />
            )}
            {sendResponse && (
                <MessageBox 
                    type={sendStatus === 200 ? 'success' : 'error'} 
                    title={sendStatus === 200 ? 'Sucesso!!!' : 'Ops... ocorreu um erro!' } 
                    message={sendResponse}
                />
            )}
            <PageHeader title={'CONFIGURAÇÃOS DOS VEÍCULOS'} description={'Configure as principais características dos veículos'} />
            <form className={Styles.data} onSubmit={(e) => updateCarConfig(e)}>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>FILTROS DE AUTOMÓVEIS</h2>
                    <h2 className={Styles.title}>
                        <p>Exibir Filtros</p>
                        <select name="display-filters" id="display-filters" value={displayFilters} onChange={(e) => setDisplayFilters(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    {JSON.parse(displayFilters) && <div>
                        <h2 className={Styles.title}>FILTROS:</h2>
                        <h2 className={Styles.title}>
                            <p>Condição</p>
                            <select name="display-filter-condition" id="display-filter-condition" value={displayCondition} onChange={(e) => setDisplayCondition(e.target.value)}>
                                <option value={'true'}>Sim</option>
                                <option value={'false'}>Não</option>
                            </select>
                        </h2>
                        <h2 className={Styles.title}>
                            <p>Montadora</p>
                            <select name="display-filter-assembler" id="display-filter-assembler" value={displayAssembler} onChange={(e) => setDisplayAssembler(e.target.value)}>
                                <option value={'true'}>Sim</option>
                                <option value={'false'}>Não</option>
                            </select>
                        </h2>
                        <h2 className={Styles.title}>
                            <p>Transmissão</p>
                            <select name="display-filters-transmission" id="display-filters-transmission" value={displayTransmission} onChange={(e) => setDisplayTransmission(e.target.value)}>
                                <option value={'true'}>Sim</option>
                                <option value={'false'}>Não</option>
                            </select>
                        </h2>
                        <h2 className={Styles.title}>
                            <p>Combustível</p>
                            <select name="display-filters-fuel" id="display-filters-fuel" value={displayFuel} onChange={(e) => setDisplayFuel(e.target.value)}>
                                <option value={'true'}>Sim</option>
                                <option value={'false'}>Não</option>
                            </select>
                        </h2>
                        <h2 className={Styles.title}>
                            <p>Motorização</p>
                            <select name="display-filters-motor" id="display-filters-motor" value={displayMotor} onChange={(e) => setDisplayMotor(e.target.value)}>
                                <option value={'true'}>Sim</option>
                                <option value={'false'}>Não</option>
                            </select>
                        </h2>
                        <h2 className={Styles.title}>
                            <p>Portas</p>
                            <select name="display-filters-ports" id="display-filters-ports" value={displayPorts} onChange={(e) => setDisplayPorts(e.target.value)}>
                                <option value={'true'}>Sim</option>
                                <option value={'false'}>Não</option>
                            </select>
                        </h2>
                        <h2 className={Styles.title}>
                            <p>Direção</p>
                            <select name="display-filters-direction" id="display-filters-direction" value={displayDirection} onChange={(e) => setDisplayDirection(e.target.value)}>
                                <option value={'true'}>Sim</option>
                                <option value={'false'}>Não</option>
                            </select>
                        </h2>
                        <h2 className={Styles.title}>
                            <p>Final da placa</p>
                            <select name="display-filters-end-plate" id="display-filters-end-plate" value={displayEndPlate} onChange={(e) => setDisplayEndPlate(e.target.value)}>
                                <option value={'true'}>Sim</option>
                                <option value={'false'}>Não</option>
                            </select>
                        </h2>
                        <h2 className={Styles.title}>
                            <p>Ano</p>
                            <select name="display-filters-year" id="display-filters-year" value={displayYear} onChange={(e) => setDisplayYear(e.target.value)}>
                                <option value={'true'}>Sim</option>
                                <option value={'false'}>Não</option>
                            </select>
                        </h2>
                        <h2 className={Styles.title}>
                            <p>Cor</p>
                            <select name="display-filters-color" id="display-filters-color" value={displayColor} onChange={(e) => setDisplayColor(e.target.value)}>
                                <option value={'true'}>Sim</option>
                                <option value={'false'}>Não</option>
                            </select>
                        </h2>
                    </div>}
                </div>
                {displayFilters && <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>FILTROS DA PÁGINA INICIAL</h2>
                    <h2 className={Styles.title}>
                        <p>1º Filtro</p>
                        <select name="home-filter-1" id="home-filter-1" value={filterHome1} onChange={(e) => setFilterHome1(e.target.value)}>
                            <option value={'condition'}>Condição</option>
                            <option value={'assembler'}>Montadora</option>
                            <option value={'transmission'}>Transmissão</option>
                            <option value={'fuel'}>Combustível</option>
                            <option value={'motor'}>Motorização</option>
                            <option value={'ports'}>Portas</option>
                            <option value={'direction'}>Direção</option>
                            <option value={'endPlate'}>Final da Placa</option>
                            <option value={'year'}>Ano</option>
                            <option value={'color'}>Cor</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>2º Filtro</p>
                        <select name="home-filter-2" id="home-filter-2" value={filterHome2} onChange={(e) => setFilterHome2(e.target.value)}>
                        <option value={'condition'}>Condição</option>
                            <option value={'assembler'}>Montadora</option>
                            <option value={'transmission'}>Transmissão</option>
                            <option value={'fuel'}>Combustível</option>
                            <option value={'motor'}>Motorização</option>
                            <option value={'ports'}>Portas</option>
                            <option value={'direction'}>Direção</option>
                            <option value={'endPlate'}>Final da Placa</option>
                            <option value={'year'}>Ano</option>
                            <option value={'color'}>Cor</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>3º Filtro</p>
                        <select name="home-filter-3" id="home-filter-3" value={filterHome3} onChange={(e) => setFilterHome3(e.target.value)}>
                        <option value={'condition'}>Condição</option>
                            <option value={'assembler'}>Montadora</option>
                            <option value={'transmission'}>Transmissão</option>
                            <option value={'fuel'}>Combustível</option>
                            <option value={'motor'}>Motorização</option>
                            <option value={'ports'}>Portas</option>
                            <option value={'direction'}>Direção</option>
                            <option value={'endPlate'}>Final da Placa</option>
                            <option value={'year'}>Ano</option>
                            <option value={'color'}>Cor</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>4º Filtro</p>
                        <select name="home-filter-4" id="home-filter-4" value={filterHome4} onChange={(e) => setFilterHome4(e.target.value)}>
                        <option value={'condition'}>Condição</option>
                            <option value={'assembler'}>Montadora</option>
                            <option value={'transmission'}>Transmissão</option>
                            <option value={'fuel'}>Combustível</option>
                            <option value={'motor'}>Motorização</option>
                            <option value={'ports'}>Portas</option>
                            <option value={'direction'}>Direção</option>
                            <option value={'endPlate'}>Final da Placa</option>
                            <option value={'year'}>Ano</option>
                            <option value={'color'}>Cor</option>
                        </select>
                    </h2>
                </div>}
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>ULTIMOS VEÍCULOS</h2>
                    <h2 className={Styles.title}>
                        <p>Numero de veículos</p>
                        <input type="text" name="number-of-cars" id="number-of-cars" value={numberOfCars} onChange={(e) => setNumberOfCars(e.target.value)} />
                    </h2>
                </div>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>PÁGINA DE VEÍCULOS</h2>
                    <h2 className={Styles.title}>
                    <p>Veículos por página</p>
                        <input type="text" name="cars-per-page" id="cars-per-page" value={carsPerPage} onChange={(e) => setCarsPerPage(Number(e.target.value))} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Título da sessão 1</p>
                        <input type="text" name="title-section-1" id="title-section-1" value={titleSection1} onChange={(e) => setTitleSection1(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Título da sessão 2</p>
                        <input type="text" name="title-section-2" id="title-section-2" value={titleSection2} onChange={(e) => setTitleSection2(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Título da sessão 3</p>
                        <input type="text" name="title-section-3" id="title-section-3" value={titleSection3} onChange={(e) => setTitleSection3(e.target.value)} />
                    </h2>
                </div>                
                <div className={Styles.button}>
                    <PrimarySubmit value={'Atualizar configurações'} />
                </div>
            </form>
        </div>
    )
}

export default CarConfig
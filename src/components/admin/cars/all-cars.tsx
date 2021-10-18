import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Cars, TYPE_Message_Types } from 'context/context-types'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Edit, Trash, VehicleView } from 'components/icons'
import MessageBox from 'components/messages/message-box'
import CheckBox from 'components/checkbox/check-box'
import Car from './car'
import CarItem from './car-item'
import PageHeader from '../page-header'
import ConfirmBox from 'components/messages/confirm-box'
import AdminButton from 'components/buttons/admin-button'
import AdminExternalLink from 'components/buttons/admin-external-link'
import Styles from './all-cars.module.css'


const AllArticles = () => {
    const { loginToken, theme, setLoading, setBodyComponent } = useContext(TokenContext)
    const { searchTerms, cars: originalCars , setCars: setOriginalCars} = useConfig()
    const [cars, setCars] = useState(originalCars)
    const [massSelection, setMassSelection] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [selectCars, setSelectCars] = useState<string[]>([])
    const [carToDelete, setCarToDelete] = useState<TYPE_Cars[]>([])
    const [messageBox, setMessageBox] = useState(false)
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [messageBoxMessage, setMessageBoxMessage] = useState('')
    const [confirmBox, setConfirmBox] = useState(false)

    useEffect(() => {
        carToDelete.length > 0 ? setConfirmBox(true) : setConfirmBox(false)
        carToDelete.length > 0 && !carToDelete.length ? setMessageBoxTitle('Exclusão') : setMessageBoxTitle('Exclusão em massa')
        carToDelete.length > 0 && !carToDelete.length ? setMessageBoxMessage('Deseja excluir permanentemente este artigo ?') : setMessageBoxMessage('Deseja excluir permanentemente os artigos selecionados ?')
    }, [carToDelete])

    useEffect(() => {
        setCars(originalCars)
    }, [originalCars])    

    useEffect(() => {
        const selects = document.querySelectorAll('[ms-car]')
        const newCar =[...selectCars]

        for(let i=0; i<selects.length; i++) {
            const selected = selects[i] as HTMLInputElement

            if(selectAll && selects) {
                selected.checked = true
                setSelectCars([...newCar, selected.getAttribute('ms-car') ?? ''])
            }else {
                selected.checked = false
                setSelectCars(newCar.filter(car => car !== selected.getAttribute('ms-car') ?? ''))
            }
        }
    }, [selectAll])
    
    useEffect(() => {
        setCars((searchTerms && searchTerms !== '')
            ? originalCars.filter(car => car.title.toLowerCase().includes(searchTerms.toLowerCase()))
            : originalCars
        )
    }, [searchTerms, originalCars])

    function checkCars(event: ChangeEvent) {
        const result = event.target as HTMLInputElement
        setSelectCars(old => result.checked ? [...old, result.getAttribute('ms-car') ?? ''] : old.filter(car => car !== result.getAttribute('ms-car')))
    }

    function massVerification(event: ChangeEvent) {
        const { checked } = event.target as HTMLInputElement
        setMassSelection(checked)
        if(!checked) {
            setSelectAll(false) 
            setSelectCars([])
        }  
    }
    
    async function carDelete(car: TYPE_Cars[]) {
        setConfirmBox(false)
        setLoading(true)
        try {
            const { data } = await axios.delete<TYPE_API_Response<TYPE_Cars[]>>(`${api}/cars`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${loginToken}`
                },
                data: { 
                    'cars': car
                }
            })
    
            setLoading(false)
            setMessageBoxMessage(data.message)
            setMessageBoxTitle(data.status === 200 ? 'Sucesso!' : 'Erro!')
            setMessageBoxType(data.status === 200 ? 'success' : 'error')
            setMessageBox(true)
            setOriginalCars(cars.filter(cars => data.data.filter(car => car.id === cars.id).length === 0 ))
            setTimeout(() => {
                setMessageBox(false)
            }, 1500);
        }catch (error: any) {
            setLoading(false)
            setMessageBoxType('error')
            setMessageBoxTitle('Erro!')
            setMessageBoxMessage(error)
            setTimeout(() => {
                setMessageBoxMessage('')
            }, 2000);
        }
    }

    function massiveDelete() {
        const carsIdsDeleted:number[] = []
        const selecteds =  document.querySelectorAll('[ms-car]') as NodeListOf<HTMLInputElement>
        selecteds.forEach(car => car.checked === true && carsIdsDeleted.push(Number(car.getAttribute('ms-car'))))
        const carsDeleted = cars.filter(car => carsIdsDeleted.includes(Number(car.id)))
            
        setCarToDelete(carsDeleted)
    }

    function handleChangeSelectedAll (event: ChangeEvent) {
        const selected = event.target as HTMLInputElement
        setSelectAll(selected.checked)
    }
    
    return (
        <div id={'body'} className={theme.content}>
            {messageBox && (
                <MessageBox 
                    type={messageBoxType}
                    title={messageBoxTitle}
                    message={messageBoxMessage}
                />
            )}
            {confirmBox && (
                <ConfirmBox 
                    title={messageBoxTitle}
                    message={messageBoxMessage}
                    onConfirm={() => carDelete(carToDelete)}
                    onCancel={() => setCarToDelete([])}
                />
            )}
            <PageHeader 
                search
                title={'VEÍCULOS | ESTOQUE'} 
                description=""
            />
            <div className={Styles.options}>
                <p className={Styles.carsCount}><span>{cars.length}</span> Veículos encontrados</p>
               <label className={Styles.selectionContainer} htmlFor="mass-selection">
                   <CheckBox id="mass-selection" onChange={massVerification}/>
                    Seleção em massa
                </label>
                {massSelection && <label className={Styles.selectionContainer} htmlFor="selection-all">
                   <CheckBox id="selection-all" onChange={handleChangeSelectedAll}/>
                    Selecionar todos
                </label>}
                {selectCars.length > 0 && <AdminButton onClick={() => massiveDelete()} >Excluir itens selecionados</AdminButton>}
            </div>
            <div className={Styles.articlesContainer}>
                {cars.map(car => {
                    return (
                        <div key={car.slug} className={Styles.article}>
                            {massSelection && <label className={Styles.selectionContainer} htmlFor="item-selection">
                                <label htmlFor={car.slug}>
                                    <CheckBox id={car.slug} initialCheck={selectAll} ms-car={car.id} onChange={checkCars}/>
                                </label>
                            </label>}
                            <CarItem car={car}/>
                            <div className={Styles.actions}>
                                <AdminExternalLink link={`/car/${car.slug}`} icon={<VehicleView />} ></AdminExternalLink>
                                <AdminButton onClick={() => setBodyComponent(<Car car={car}/>)} icon={<Edit />} ></AdminButton>
                                <AdminButton onClick={() => setCarToDelete([car])} icon={<Trash />}></AdminButton>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllArticles

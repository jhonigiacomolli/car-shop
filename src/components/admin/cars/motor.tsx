import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { useContext, useState } from 'react'
import { emptyTaxonomy } from 'context/initial-contexts'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Taxonomy } from 'context/context-types'
import AdminButton from 'components/buttons/AdminButton'
import AlertBox from 'components/messages/AlertBox'
import ConfirmBox from 'components/messages/ConfirmBox'
import MessageBox from 'components/messages/MessageBox'
import PageHeader from '../page-header'
import TaxonomyItem from '../taxonomy-item'
import Styles from './taxonomy.module.css'

const Motor = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { carsTaxonomies, cars, setCarsTaxonomies, windowWidth } = useConfig()  
    const {
        motor
    } = carsTaxonomies 
    const [newMotor, setNewMotor] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editMotor(newMotor: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewMotor({
            id: newMotor.id,
            name: newMotor.name,
            slug: newMotor.slug
        })
        scrollTo(0,0)
    }
    
    async function createMotor() {
        if(newMotor.name) {
            setLoading(true)

            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'motor',
                        taxonomy: newMotor,
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Motorização')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    motor: [...motor.filter(motor => motor.id !== data.data.id), data.data]
                })
                setNewMotor(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Motorização')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha corretamente o campo de Motorização')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deleteMotor(newMotor: TYPE_Taxonomy) {
        if(newMotor) {
            setConfirmAction(undefined)
            setLoading(true)
            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'motor',
                        taxonomy: newMotor,
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    motor: motor.filter(motor => motor.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Motorização')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha corretamente o campo de motorização')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    return (
        <div className={Styles.taxonomyContainer}>
            {messageBox && (
                 <MessageBox 
                    type={messageBoxType} 
                    title={messageBoxTitle} 
                    message={messageBox} 
                 />
            )}
            {alertBox && (
                <AlertBox 
                    type={alertBoxType} 
                    title={alertBoxTitle} 
                    message={alertBox} 
                    onConfirm={() => setAlertBox('')} 
                />
            )}
            {confirmAction && (
                <ConfirmBox 
                    title={'Motorização'} 
                    message={'Deseja excluir esta motorização ?'} 
                    onConfirm={() => deleteMotor(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'MOTORIZAÇÃO'} description={'Adicione ou edite as motorizações dos seus veículos'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newMotor?.id ? 'Editar motorização' : 'Adicionar nova motorização'}</h1>
                {newMotor?.id ? <span className={Styles.newId}>ID: <p>{newMotor.id}</p></span> : ''}
                {newMotor?.id ? <span className={Styles.newSlug}>SLUG: <p>{newMotor.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-motor" id="new-motor" value={newMotor ? newMotor.name : ''} onChange={(e) => setNewMotor({ ...newMotor, name: e.target.value })} />
                    <AdminButton onClick={() => createMotor()}>{newMotor?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newMotor && <AdminButton onClick={() => setNewMotor(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    motor.map(mot => {
                        let count = 0
                        cars.map(tax => tax.motor === mot.name && count++) 
                         
                        return <TaxonomyItem key={mot.slug} taxonomy={mot} count={count} editAction={editMotor} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Motor

import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { useContext, useState } from 'react'
import { emptyTaxonomy } from 'context/initial-contexts'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Taxonomy } from 'context/context-types'
import AdminButton from 'components/buttons/admin-button'
import AlertBox from 'components/messages/alert-box'
import ConfirmBox from 'components/messages/confirm-box'
import MessageBox from 'components/messages/message-box'
import PageHeader from '../page-header'
import TaxonomyItem from '../taxonomy-item'
import Styles from './taxonomy.module.css'

const Condition = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { carsTaxonomies, cars, setCarsTaxonomies, windowWidth } = useConfig()  
    const {
        condition
    } = carsTaxonomies 
    const [newCondition, setNewCondition] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editCondition(newCondition: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewCondition({
            id: newCondition.id,
            name: newCondition.name,
            slug: newCondition.slug
        })
        scrollTo(0,0)
    }
    
    async function createCondition() {
        if(newCondition.name) {
            setLoading(true)

            try {
                const axiosdata = {
                    type: 'condition',
                    taxonomy: newCondition
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Montadora')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    condition: [...condition.filter(cond => cond.id !== data.data.id), data.data]
                })
                setNewCondition(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Montadora')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de Montadora')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deleteCondition(newCondition: TYPE_Taxonomy) {
        if(newCondition) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'condition',
                        taxonomy: newCondition
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    condition: condition.filter(cond => cond.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Condição')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de condição')
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
                    title={'Montadora'} 
                    message={'Deseja excluir esta condição ?'} 
                    onConfirm={() => deleteCondition(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'CONDIÇÃO'} description={'Adicione ou edite as condições dos seus veículos'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newCondition?.id ? 'Editar condição' : 'Adicionar nova condição'}</h1>
                {newCondition?.id ? <span className={Styles.newId}>ID: <p>{newCondition.id}</p></span> : ''}
                {newCondition?.id ? <span className={Styles.newSlug}>SLUG: <p>{newCondition.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-condition" id="new-condition" value={newCondition ? newCondition.name : ''} onChange={(e) => setNewCondition({ ...newCondition, name: e.target.value })} />
                    <AdminButton onClick={() => createCondition()}>{newCondition?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newCondition && <AdminButton onClick={() => setNewCondition(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    condition.map(cond => {
                        let count = 0
                        cars.map(tax => tax.condition === cond.name && count++) 
                         
                        return <TaxonomyItem key={cond.slug} taxonomy={cond} count={count} editAction={editCondition} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Condition

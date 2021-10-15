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

const EndPlate = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { carsTaxonomies, cars, setCarsTaxonomies, windowWidth } = useConfig()  
    const {
        endPlate
    } = carsTaxonomies 
    const [newEndPlate, setNewEndPlate] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editEndPlate(newEndPlate: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewEndPlate({
            id: newEndPlate.id,
            name: newEndPlate.name,
            slug: newEndPlate.slug
        })
        scrollTo(0,0)
    }
    
    async function createEndPlate() {
        if(newEndPlate.name) {
            setLoading(true)

            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'endPlate',
                        taxonomy: newEndPlate,
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Final de Placa')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    endPlate: [...endPlate.filter(plate => plate.id !== data.data.id), data.data]
                })
                setNewEndPlate(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Final de Placa')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha corretamente o campo de Final de Placa')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deleteEndPlate(newEndPlate: TYPE_Taxonomy) {
        if(newEndPlate) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'endPlate',
                        taxonomy: newEndPlate,
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    endPlate: endPlate.filter(plate => plate.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Final de Placa')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de final de placa')
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
                    title={'Final de Placa'} 
                    message={'Deseja excluir este final de placa ?'} 
                    onConfirm={() => deleteEndPlate(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'FINAL DE PLACA'} description={'Adicione ou edite os finais de placas dos seus veículos'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newEndPlate?.id ? 'Editar final de placa' : 'Adicionar novo final de placa'}</h1>
                {newEndPlate?.id ? <span className={Styles.newId}>ID: <p>{newEndPlate.id}</p></span> : ''}
                {newEndPlate?.id ? <span className={Styles.newSlug}>SLUG: <p>{newEndPlate.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-endPlate" id="new-endPlate" value={newEndPlate ? newEndPlate.name : ''} onChange={(e) => setNewEndPlate({ ...newEndPlate, name: e.target.value })} />
                    <AdminButton onClick={() => createEndPlate()}>{newEndPlate?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newEndPlate && <AdminButton onClick={() => setNewEndPlate(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    endPlate.map(end => {
                        let count = 0
                        cars.map(tax => tax.endPlate === end.name && count++) 
                         
                        return <TaxonomyItem key={end.slug} taxonomy={end} count={count} editAction={editEndPlate} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default EndPlate

import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { useContext, useState } from 'react'
import { emptyTaxonomy } from 'context/initial-contexts'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Taxonomy } from 'context/context-types'
import AdminButton from 'components/admin/buttons/admin-button'
import AlertBox from 'components/admin/messages/alert-box'
import ConfirmBox from 'components/admin/messages/confirm-box'
import MessageBox from 'components/admin/messages/message-box'
import PageHeader from '../page-header'
import TaxonomyItem from '../taxonomy-item'
import Styles from './taxonomy.module.css'

const Transmission = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { carsTaxonomies, cars, setCarsTaxonomies, windowWidth } = useConfig()  
    const {
        transmission
    } = carsTaxonomies
    const [newTransmission, setNewTransmission] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editTransmission(newTransmission: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewTransmission({
            id: newTransmission.id,
            name: newTransmission.name,
            slug: newTransmission.slug
        })
        scrollTo(0,0)
    }
    
    async function createTransmission() {
        if(newTransmission.name) {
            setLoading(true)
            try {
                const axiosdata = {
                    type: 'transmission',
                    taxonomy: newTransmission,
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Transmiss??o')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    transmission: [...transmission.filter(transm => transm.id !== data.data.id), data.data]
                })
                setNewTransmission(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Transmiss??o')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de Transmiss??o')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informa????es insuficientes')
        }
    }

    async function deleteTransmission(newTransmission: TYPE_Taxonomy) {
        if(newTransmission) {
            setConfirmAction(undefined)
            setLoading(true)
            
            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'transmission',
                        taxonomy: newTransmission,
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclus??o')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    transmission: transmission.filter(transm => transm.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Transmiss??o')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de transmiss??o')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informa????es insuficientes')
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
                    title={'Transmiss??o'} 
                    message={'Deseja excluir esta transmiss??o ?'} 
                    onConfirm={() => deleteTransmission(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'TRANSMISS??O'} description={'Adicione ou edite as transmiss??es dos seus ve??culos'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newTransmission?.id ? 'Editar transmiss??o' : 'Adicionar nova transmiss??o'}</h1>
                {newTransmission?.id ? <span className={Styles.newId}>ID: <p>{newTransmission.id}</p></span> : ''}
                {newTransmission?.id ? <span className={Styles.newSlug}>SLUG: <p>{newTransmission.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-transmission" id="new-transmission" value={newTransmission ? newTransmission.name : ''} onChange={(e) => setNewTransmission({ ...newTransmission, name: e.target.value })} />
                    <AdminButton onClick={() => createTransmission()}>{newTransmission?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newTransmission && <AdminButton onClick={() => setNewTransmission(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    transmission.map(transm => {
                        let count = 0
                        cars.map(tax => tax.transmission === transm.name && count++) 
                         
                        return <TaxonomyItem key={transm.slug} taxonomy={transm} count={count} editAction={editTransmission} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Transmission

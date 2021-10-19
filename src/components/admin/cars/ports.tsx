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

const Ports = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { carsTaxonomies, cars, setCarsTaxonomies, windowWidth } = useConfig()  
    const {
        ports
    } = carsTaxonomies 
    const [newPorts, setNewPorts] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editPorts(newPorts: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewPorts({
            id: newPorts.id,
            name: newPorts.name,
            slug: newPorts.slug
        })
        scrollTo(0,0)
    }
    
    async function createPorts() {
        if(newPorts.name) {
            setLoading(true)
            
            try {
                const axiosdata = {
                    type: 'ports',
                    taxonomy: newPorts,
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Portas')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    ports: [...ports.filter(port => port.id !== data.data.id), data.data]
                })
                setNewPorts(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Portas')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de Portas')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deletePorts(newPorts: TYPE_Taxonomy) {
        if(newPorts) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'ports',
                        taxonomy: newPorts,
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    ports: ports.filter(port => port.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Portas')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de portas')
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
                    title={'Portas'} 
                    message={'Deseja excluir esta opção ?'} 
                    onConfirm={() => deletePorts(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}/>
            )}
            <PageHeader title={'NUMERO DE PORTAS'} description={'Adicione ou edite as portas dos seus veículos'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newPorts?.id ? 'Editar portas' : 'Adicionar novas portas'}</h1>
                {newPorts?.id ? <span className={Styles.newId}>ID: <p>{newPorts.id}</p></span> : ''}
                {newPorts?.id ? <span className={Styles.newSlug}>SLUG: <p>{newPorts.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-ports" id="new-ports" value={newPorts ? newPorts.name : ''} onChange={(e) => setNewPorts({ ...newPorts, name: e.target.value })} />
                    <AdminButton onClick={() => createPorts()}>{newPorts?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newPorts && <AdminButton onClick={() => setNewPorts(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    ports.map(port => {
                        let count = 0
                        cars.map(tax => tax.ports === port.name && count++) 
                         
                        return <TaxonomyItem key={port.slug} taxonomy={port} count={count} editAction={editPorts} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Ports

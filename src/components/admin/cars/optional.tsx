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
const Optional = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { carsTaxonomies, cars, setCarsTaxonomies, windowWidth } = useConfig()  
    const {
        optional
    } = carsTaxonomies 
    const [newOptional, setNewOptional] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editOptional(newOptional: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewOptional({
            id: newOptional.id,
            name: newOptional.name,
            slug: newOptional.slug
        })
        scrollTo(0,0)
    }
    
    async function createOptional() {
        if(newOptional.name) {
            setLoading(true)
            
            try {
                const axiosdata = {
                    type: 'optional',
                    taxonomy: newOptional,
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Opcional')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    optional: [...optional.filter(opt => opt.id !== data.data.id), data.data]
                })
                setNewOptional(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Opcional')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha corretamente o campo de Opcional')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deleteOptional(newOptional: TYPE_Taxonomy) {
         if(newOptional) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'optional',
                        taxonomy: newOptional,
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    optional: optional.filter(opt => opt.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Opcional')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de opcional')
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
                    title={'Opcional'} 
                    message={'Deseja excluir este opcional ?'} 
                    onConfirm={() => deleteOptional(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'ITENS OPCIONAIS'} description={'Adicione ou edite os opcionais dos seus veículos'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newOptional?.id ? 'Editar opcional' : 'Adicionar novo opcional'}</h1>
                {newOptional?.id ? <span className={Styles.newId}>ID: <p>{newOptional.id}</p></span> : ''}
                {newOptional?.id ? <span className={Styles.newSlug}>SLUG: <p>{newOptional.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-optional" id="new-optional" value={newOptional ? newOptional.name : ''} onChange={(e) => setNewOptional({ ...newOptional, name: e.target.value })} />
                    <AdminButton onClick={() => createOptional()}>{newOptional?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newOptional && <AdminButton onClick={() => setNewOptional(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    optional.map(opt => {
                        let count = 0
                        cars.map(tax => {
                            tax.optionals.map(optional => optional === opt.name && count++ ) 
                        })  
                         
                        return <TaxonomyItem key={opt.slug} taxonomy={opt} count={count} editAction={editOptional} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Optional


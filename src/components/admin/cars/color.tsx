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

const Color = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { carsTaxonomies, cars, setCarsTaxonomies, windowWidth } = useConfig()  
    const {
        color
    } = carsTaxonomies 
    const [newColor, setNewColor] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editColor(newColor: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewColor({
            id: newColor.id,
            name: newColor.name,
            slug: newColor.slug
        })
        scrollTo(0,0)
    }
    
    async function createColor() {
        if(newColor.name) {
            setLoading(true)
            try {
                const axiosdata = {
                    type: 'color',
                    taxonomy: newColor,
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    } 
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Cor')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    color: [...color.filter(color => color.id !== data.data.id), data.data]
                })
                setNewColor(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            } catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Cor')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de Cor')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deleteColor(newColor: TYPE_Taxonomy) {
        if(newColor) {
            setConfirmAction(undefined)
            setLoading(true)
            
            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'color',
                        taxonomy: newColor,
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    color: color.filter(color => color.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            } catch (error: any) {                    
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Cor')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de cor')
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
                    title={'Cor'} 
                    message={'Deseja excluir esta cor ?'} 
                    onConfirm={() => deleteColor(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'COR'} description={'Adicione ou edite as cors dos seus veículos'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newColor?.id ? 'Editar cor' : 'Adicionar nova cor'}</h1>
                {newColor?.id ? <span className={Styles.newId}>ID: <p>{newColor.id}</p></span> : ''}
                {newColor?.id ? <span className={Styles.newSlug}>SLUG: <p>{newColor.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-color" id="new-color" value={newColor ? newColor.name : ''} onChange={(e) => setNewColor({ ...newColor, name: e.target.value })} />
                    <AdminButton onClick={() => createColor()}>{newColor?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newColor && <AdminButton onClick={() => setNewColor(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    color.map(cr => {
                        let count = 0
                        cars.map(tax => tax.color === cr.name && count++) 
                         
                        return <TaxonomyItem key={cr.slug} taxonomy={cr} count={count} editAction={editColor} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Color

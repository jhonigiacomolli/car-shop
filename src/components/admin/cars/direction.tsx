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

const Direction = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { carsTaxonomies, cars, setCarsTaxonomies, windowWidth } = useConfig()  
    const {
        direction
    } = carsTaxonomies 
    const [newDirection, setNewDirection] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editDirection(newDirection: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewDirection({
            id: newDirection.id,
            name: newDirection.name,
            slug: newDirection.slug
        })
        scrollTo(0,0)
    }
    
    async function createDirection() {
        if(newDirection.name) {
            setLoading(true)
            
            try {
                const axiosdata = {
                    type: 'direction',
                    taxonomy: newDirection,
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Direção')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    direction: [...direction.filter(direct => direct.id !== data.data.id), data.data]
                })
                setNewDirection(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Direção')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de Direção')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deleteDirection(newDirection: TYPE_Taxonomy) {
        if(newDirection) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'direction',
                        taxonomy: newDirection,
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    direction: direction.filter(direct => direct.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Direção')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha corretamente o campo de direção')
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
                    title={'Direção'} 
                    message={'Deseja excluir esta direção ?'} 
                    onConfirm={() => deleteDirection(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'DIREÇÃO'} description={'Adicione ou edite as direções dos seus veículos'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newDirection?.id ? 'Editar direção' : 'Adicionar nova direção'}</h1>
                {newDirection?.id ? <span className={Styles.newId}>ID: <p>{newDirection.id}</p></span> : ''}
                {newDirection?.id ? <span className={Styles.newSlug}>SLUG: <p>{newDirection.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-direction" id="new-direction" value={newDirection ? newDirection.name : ''} onChange={(e) => setNewDirection({ ...newDirection, name: e.target.value })} />
                    <AdminButton onClick={() => createDirection()}>{newDirection?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newDirection && <AdminButton onClick={() => setNewDirection(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    direction.map(direct => {
                        let count = 0
                        cars.map(tax => tax.direction === direct.name && count++) 
                         
                        return <TaxonomyItem key={direct.slug} taxonomy={direct} count={count} editAction={editDirection} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Direction

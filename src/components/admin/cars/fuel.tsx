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

const Fuel = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { carsTaxonomies, cars, setCarsTaxonomies, windowWidth } = useConfig()  
    const {
        fuel
    } = carsTaxonomies 
    const [newFuel, setNewFuel] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editFuel(newFuel: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewFuel({
            id: newFuel.id,
            name: newFuel.name,
            slug: newFuel.slug
        })
        scrollTo(0,0)
    }
    
    async function createFuel() {
        if(newFuel.name) {
            setLoading(true)
            try {
                const axiosdata = {
                    type: 'fuel',
                    taxonomy: newFuel,
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Combust??vel')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    fuel: [...fuel.filter(fl => fl.id !== data.data.id), data.data]
                })
                setNewFuel(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Combust??vel')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de Combust??vel')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informa????es insuficientes')
        }
    }

    async function deleteFuel(newFuel: TYPE_Taxonomy) {
        if(newFuel) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'fuel',
                        taxonomy: newFuel,
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclus??o')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    fuel: fuel.filter(fl => fl.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Combust??vel')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha corretamente o campo de combust??vel')
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
                    title={'Combust??vel'} 
                    message={'Deseja excluir este combust??vel ?'} 
                    onConfirm={() => deleteFuel(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'COMBUST??VEL'} description={'Adicione ou edite os combust??veis dos seus ve??culos'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newFuel?.id ? 'Editar combust??vel' : 'Adicionar novo combust??vel'}</h1>
                {newFuel?.id ? <span className={Styles.newId}>ID: <p>{newFuel.id}</p></span> : ''}
                {newFuel?.id ? <span className={Styles.newSlug}>SLUG: <p>{newFuel.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-fuel" id="new-fuel" value={newFuel ? newFuel.name : ''} onChange={(e) => setNewFuel({ ...newFuel, name: e.target.value })} />
                    <AdminButton onClick={() => createFuel()}>{newFuel?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newFuel && <AdminButton onClick={() => setNewFuel(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    fuel.map(fl => {
                        let count = 0
                        cars.map(tax => tax.fuel === fl.name && count++) 
                         
                        return <TaxonomyItem key={fl.slug} taxonomy={fl} count={count} editAction={editFuel} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Fuel

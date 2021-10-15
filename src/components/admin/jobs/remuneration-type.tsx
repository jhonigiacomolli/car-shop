import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { useContext, useState } from 'react'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Taxonomy } from 'context/context-types'
import { emptyTaxonomy } from 'context/initial-contexts'
import AdminButton from 'components/buttons/AdminButton'
import AlertBox from 'components/messages/AlertBox'
import ConfirmBox from 'components/messages/ConfirmBox'
import MessageBox from 'components/messages/MessageBox'
import PageHeader from '../page-header'
import TaxonomyItem from '../taxonomy-item'
import Styles from './taxonomy.module.css'

const RemunerationType = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { jobsTaxonomies, jobs, setJobsTaxonomies, windowWidth } = useConfig()  
    const {
        remunerationType
    } = jobsTaxonomies 
    const [newRemunerationType, setNewRemunerationType] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editColor(newRemunerationType: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewRemunerationType({
            id: newRemunerationType.id,
            name: newRemunerationType.name,
            slug: newRemunerationType.slug
        })
        scrollTo(0,0)
    }    
    
    async function createSector() {
        if(newRemunerationType.name) {
            setLoading(true)

            try {
                const axiosdata = {
                    type: 'remunerationType',
                    tax: newRemunerationType
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, axiosdata, { 
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)     
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Tipo de Remuneração')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    remunerationType: [...remunerationType.filter(assemb => assemb.id !== newRemunerationType.id), data.data]
                })
                setNewRemunerationType(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Setor')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha setorretamente o campo de taxonomia')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deleteColor(newRemunerationType: TYPE_Taxonomy) {
        if(newRemunerationType) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'remunerationType',
                        tax: newRemunerationType
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    remunerationType: remunerationType.filter(assemb => assemb.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Tipo de Remuneração')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha setorretamente o campo de tipo de remuneração')
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
                    title={'Tipo de Remuneração'} 
                    message={'Deseja excluir este tipo de remuneração ?'} 
                    onConfirm={() => deleteColor(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'TIPO DE REMUNERAÇÃO'} description={'Adicione ou edite os tipos de remuneração das suas vagas'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newRemunerationType?.id ? 'Editar tipo de remuneração' : 'Adicionar novo tipo de remuneração'}</h1>
                {newRemunerationType?.id ? <span className={Styles.newId}>ID: <p>{newRemunerationType.id}</p></span> : ''}
                {newRemunerationType?.id ? <span className={Styles.newSlug}>SLUG: <p>{newRemunerationType.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-remunerationType" id="new-remunerationType" value={newRemunerationType ? newRemunerationType.name : ''} onChange={(e) => setNewRemunerationType({ ...newRemunerationType, name: e.target.value })} />
                    <AdminButton onClick={() => createSector()}>{newRemunerationType?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newRemunerationType && <AdminButton onClick={() => setNewRemunerationType(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    remunerationType.map(cr => {
                        let count = 0
                        jobs.map(tax => tax.remunerationType === cr.name && count++) 
                         
                        return <TaxonomyItem key={cr.slug} taxonomy={cr} count={count} editAction={editColor} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default RemunerationType

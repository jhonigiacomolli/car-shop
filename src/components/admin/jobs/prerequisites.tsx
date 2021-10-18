import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { useContext, useState } from 'react'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Taxonomy } from 'context/context-types'
import { emptyTaxonomy } from 'context/initial-contexts'
import AdminButton from 'components/buttons/admin-button'
import AlertBox from 'components/messages/alert-box'
import ConfirmBox from 'components/messages/confirm-box'
import MessageBox from 'components/messages/message-box'
import PageHeader from '../page-header'
import TaxonomyItem from '../taxonomy-item'
import Styles from './taxonomy.module.css'

const Prerequisistes = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { jobsTaxonomies, jobs, setJobsTaxonomies, windowWidth } = useConfig()  
    const {
        prerequisites
    } = jobsTaxonomies 
    const [newPrerequisites, setNewPrerequisites] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editColor(newPrerequisites: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewPrerequisites({
            id: newPrerequisites.id,
            name: newPrerequisites.name,
            slug: newPrerequisites.slug
        })
        scrollTo(0,0)
    }    
    
    async function createPrerequisistes() {
        if(newPrerequisites.name) {
            setLoading(true)

            try {
                const axiosdata = {
                    type: 'prerequisites',
                    tax: newPrerequisites
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)     
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Pré Requisitos')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    prerequisites: [...prerequisites.filter(assemb => assemb.id !== newPrerequisites.id), data.data]
                })
                setNewPrerequisites(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Pré Requisitos')
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

    async function deleteColor(newPrerequisites: TYPE_Taxonomy) {
        if(newPrerequisites) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'prerequisites',
                        tax: newPrerequisites
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    prerequisites: prerequisites.filter(assemb => assemb.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Pré Requisitos')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha setorretamente o campo de pré requisitos')
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
                    title={'Pré Requisitos'} 
                    message={'Deseja excluir este pré requisito ?'}
                    onConfirm={() => deleteColor(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'PRÉ REQUISITOS'} description={'Adicione ou edite os pré requisitos das suas vagas'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newPrerequisites?.id ? 'Editar pré requisito' : 'Adicionar novo pré requisito'}</h1>
                {newPrerequisites?.id ? <span className={Styles.newId}>ID: <p>{newPrerequisites.id}</p></span> : ''}
                {newPrerequisites?.id ? <span className={Styles.newSlug}>SLUG: <p>{newPrerequisites.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-prerequisites" id="new-prerequisites" value={newPrerequisites ? newPrerequisites.name : ''} onChange={(e) => setNewPrerequisites({ ...newPrerequisites, name: e.target.value })} />
                    <AdminButton onClick={() => createPrerequisistes()}>{newPrerequisites?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newPrerequisites && <AdminButton onClick={() => setNewPrerequisites(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    prerequisites.map(cr => {
                        let count = 0
                        jobs.map(tax => tax.prerequisites.includes(cr.slug) && count++) 
                         
                        return <TaxonomyItem key={cr.slug} taxonomy={cr} count={count} editAction={editColor} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Prerequisistes

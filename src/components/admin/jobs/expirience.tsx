import axios from 'axios'
import { useContext, useState } from 'react'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Taxonomy } from 'context/context-types'
import { emptyTaxonomy } from 'context/initial-contexts'
import AdminButton from 'components/buttons/AdminButton'
import AlertBox from 'components/messages/AlertBox'
import ConfirmBox from 'components/messages/ConfirmBox'
import MessageBox from 'components/messages/MessageBox'
import PageHeader from '../page-header'
import TaxonomyItem from '../taxonomy-item'
import Styles from './taxonomy.module.css'

const Expirience = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { jobsTaxonomies, jobs, setJobsTaxonomies, windowWidth } = useConfig()  
    const {
        expirience
    } = jobsTaxonomies 
    const [newExpirience, setNewExpirience] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editColor(newExpirience: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewExpirience({
            id: newExpirience.id,
            name: newExpirience.name,
            slug: newExpirience.slug
        })
        scrollTo(0,0)
    }    
    
    async function createExpirience() {
        if(newExpirience.name) {
            setLoading(true)

            try {
                const axiosdata = {
                    type: 'expirience',
                    tax: newExpirience
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)     
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Experiência')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    expirience: [...expirience.filter(assemb => assemb.id !== newExpirience.id), data.data]
                })
                setNewExpirience(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Exepriência')
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

    async function deleteColor(newExpirience: TYPE_Taxonomy) {
        if(newExpirience) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'expirience',
                        tax: newExpirience
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    expirience: expirience.filter(assemb => assemb.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Experiência')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha setorretamente o campo de experiência')
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
                    title={'Experiência'} 
                    message={'Deseja excluir esta experiência ?'} 
                    onConfirm={() => deleteColor(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'SETOR'} description={'Adicione ou edite as experiências das suas vagas'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newExpirience?.id ? 'Editar experiência' : 'Adicionar nova experiência'}</h1>
                {newExpirience?.id ? <span className={Styles.newId}>ID: <p>{newExpirience.id}</p></span> : ''}
                {newExpirience?.id ? <span className={Styles.newSlug}>SLUG: <p>{newExpirience.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-expirience" id="new-expirience" value={newExpirience ? newExpirience.name : ''} onChange={(e) => setNewExpirience({ ...newExpirience, name: e.target.value })} />
                    <AdminButton onClick={() => createExpirience()}>{newExpirience?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newExpirience && <AdminButton onClick={() => setNewExpirience(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    expirience.map(cr => {
                        let count = 0
                        jobs.map(tax => tax.expirience === cr.name && count++) 
                         
                        return <TaxonomyItem key={cr.slug} taxonomy={cr} count={count} editAction={editColor} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Expirience

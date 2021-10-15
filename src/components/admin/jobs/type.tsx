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

const Type = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { jobsTaxonomies, jobs, setJobsTaxonomies, windowWidth } = useConfig()  
    const {
        type
    } = jobsTaxonomies 
    const [newType, setNewType] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editColor(newType: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewType({
            id: newType.id,
            name: newType.name,
            slug: newType.slug
        })
        scrollTo(0,0)
    }    
    
    async function createSector() {
        if(newType.name) {
            setLoading(true)

            try {
                const axiosdata = {
                    type: 'type',
                    tax: newType
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)     
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Tipo de Vaga')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    type: [...type.filter(assemb => assemb.id !== newType.id), data.data]
                })
                setNewType(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Tipo de Vaga')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha corretamente o campo de Tipo de Vaga')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deleteColor(newType: TYPE_Taxonomy) {
        if(newType) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'type',
                        tax: newType
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    type: type.filter(assemb => assemb.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Tipo de Vaga')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha corretamente o campo de taxonomia')
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
                    title={'Tipo de Vaga'} 
                    message={'Deseja excluir este tipo de vaga ?'} 
                    onConfirm={() => deleteColor(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'TIPO DE VAGA'} description={'Adicione ou edite os tipos de vagas'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newType?.id ? 'Editar tipo de vaga' : 'Adicionar novo tipo de vaga'}</h1>
                {newType?.id ? <span className={Styles.newId}>ID: <p>{newType.id}</p></span> : ''}
                {newType?.id ? <span className={Styles.newSlug}>SLUG: <p>{newType.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-type" id="new-type" value={newType ? newType.name : ''} onChange={(e) => setNewType({ ...newType, name: e.target.value })} />
                    <AdminButton onClick={() => createSector()}>{newType?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newType && <AdminButton onClick={() => setNewType(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    type.map(cr => {
                        let count = 0
                        jobs.map(tax => tax.type === cr.name && count++) 
                         
                        return <TaxonomyItem key={cr.slug} taxonomy={cr} count={count} editAction={editColor} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Type

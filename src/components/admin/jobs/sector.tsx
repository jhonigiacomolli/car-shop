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

const Sector = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { jobsTaxonomies, jobs, setJobsTaxonomies, windowWidth } = useConfig()  
    const {
        sector
    } = jobsTaxonomies 
    const [newSector, setNewSector] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editColor(newSector: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewSector({
            id: newSector.id,
            name: newSector.name,
            slug: newSector.slug
        })
        scrollTo(0,0)
    }    
    
    async function createSector() {
        if(newSector.name) {
            setLoading(true)

            try {
                const axiosdata = {
                    type: 'sector',
                    tax: newSector
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)     
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Setor')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    sector: [...sector.filter(assemb => assemb.id !== newSector.id), data.data]
                })
                setNewSector(emptyTaxonomy)
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

    async function deleteSector(newSector: TYPE_Taxonomy) {
        if(newSector) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'sector',
                        tax: newSector
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    sector: sector.filter(assemb => assemb.id !== data.data.id)
                })
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
            setAlertBox('Preencha setorretamente o campo de setor')
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
                    title={'Setor'} 
                    message={'Deseja excluir este setor ?'} 
                    onConfirm={() => deleteSector(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'SETOR'} description={'Adicione ou edite os setors das suas vagas'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newSector?.id ? 'Editar setor' : 'Adicionar novo setor'}</h1>
                {newSector?.id ? <span className={Styles.newId}>ID: <p>{newSector.id}</p></span> : ''}
                {newSector?.id ? <span className={Styles.newSlug}>SLUG: <p>{newSector.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-sector" id="new-sector" value={newSector ? newSector.name : ''} onChange={(e) => setNewSector({ ...newSector, name: e.target.value })} />
                    <AdminButton onClick={() => createSector()}>{newSector?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newSector && <AdminButton onClick={() => setNewSector(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    sector.map(cr => {
                        let count = 0
                        jobs.map(tax => tax.sector === cr.name && count++) 
                         
                        return <TaxonomyItem key={cr.slug} taxonomy={cr} count={count} editAction={editColor} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Sector

import { api } from 'api/api'
import axios from 'axios'
import AdminButton from 'components/buttons/AdminButton'
import AlertBox from 'components/messages/AlertBox'
import ConfirmBox from 'components/messages/ConfirmBox'
import MessageBox from 'components/messages/MessageBox'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Taxonomy } from 'context/context-types'
import { emptyTaxonomy } from 'context/initial-contexts'
import { useContext, useState } from 'react'
import { TokenContext } from '..'
import PageHeader from '../page-header'
import TaxonomyItem from '../taxonomy-item'
import Styles from './taxonomy.module.css'

const CareerLevel = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { jobsTaxonomies, jobs, setJobsTaxonomies, windowWidth } = useConfig()  
    const {
        careerLevel
    } = jobsTaxonomies 
    const [newCareerLevel, setNewCareerLevel] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editColor(newCareerLevel: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewCareerLevel({
            id: newCareerLevel.id,
            name: newCareerLevel.name,
            slug: newCareerLevel.slug
        })
        scrollTo(0,0)
    }    
    
    async function createCareerLevel() {
        if(newCareerLevel.name) {
            setLoading(true)

            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'careerLevel',
                        tax: newCareerLevel
                    }
                })
                setLoading(false)     
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Nível de Carreira')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    careerLevel: [...careerLevel.filter(assemb => assemb.id !== newCareerLevel.id), data.data]
                })
                setNewCareerLevel(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Nível de Carreira')
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

    async function deleteColor(newCareerLevel: TYPE_Taxonomy) {
        if(newCareerLevel) {
            setConfirmAction(undefined)
            setLoading(true)

            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/jobs/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'careerLevel',
                        tax: newCareerLevel
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setJobsTaxonomies({
                    ...jobsTaxonomies,
                    careerLevel: careerLevel.filter(assemb => assemb.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Nível de Carreira')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha setorretamente o campo de nivel de carreira')
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
                    title={'Nível de Carreira'} 
                    message={'Deseja excluir este nível de carreira ?'} 
                    onConfirm={() => deleteColor(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'NÍVEL DE CARREIRA'} description={'Adicione ou edite os níveis de carreira das suas vagas'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newCareerLevel?.id ? 'Editar nível de carreira' : 'Adicionar novo nível de carreira'}</h1>
                {newCareerLevel?.id ? <span className={Styles.newId}>ID: <p>{newCareerLevel.id}</p></span> : ''}
                {newCareerLevel?.id ? <span className={Styles.newSlug}>SLUG: <p>{newCareerLevel.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-careerLevel" id="new-careerLevel" value={newCareerLevel ? newCareerLevel.name : ''} onChange={(e) => setNewCareerLevel({ ...newCareerLevel, name: e.target.value })} />
                    <AdminButton onClick={() => createCareerLevel()}>{newCareerLevel?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newCareerLevel && <AdminButton onClick={() => setNewCareerLevel(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    careerLevel.map(cr => {
                        let count = 0
                        jobs.map(tax => tax.careerLevel === cr.name && count++) 
                         
                        return <TaxonomyItem key={cr.slug} taxonomy={cr} count={count} editAction={editColor} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default CareerLevel

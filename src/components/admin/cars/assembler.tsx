import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { useContext, useState } from 'react'
import { emptyTaxonomy } from 'context/initial-contexts'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Taxonomy } from 'context/context-types'
import AdminButton from 'components/buttons/AdminButton'
import AlertBox from 'components/messages/AlertBox'
import ConfirmBox from 'components/messages/ConfirmBox'
import MessageBox from 'components/messages/MessageBox'
import PageHeader from '../page-header'
import TaxonomyItem from '../taxonomy-item'
import Styles from './taxonomy.module.css'

const Assembler = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { carsTaxonomies, cars, setCarsTaxonomies, windowWidth } = useConfig()  
    const {
        assembler
    } = carsTaxonomies 
    const [newAssembler, setNewAssembler] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editAssembler(newAssembler: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setNewAssembler({
            id: newAssembler.id,
            name: newAssembler.name,
            slug: newAssembler.slug
        })
        scrollTo(0,0)
    }
    
    async function createAssembler() {
        if(newAssembler.name) {
            setLoading(true)
            
            try {
                const axiosdata = {
                    type: 'assembler',
                    taxonomy: newAssembler,
                }
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, axiosdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Montadora')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    assembler: [...assembler.filter(assemb => assemb.id !== data.data.id), data.data]
                })
                setNewAssembler(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            } catch (error:any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Montadora')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha corretamente o campo de Montadora')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deleteAssembler(newAssembler: TYPE_Taxonomy) {
        if(newAssembler) {
            setConfirmAction(undefined)
            setLoading(true)
            
            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/cars/taxonomies`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: {
                        type: 'assembler',
                        taxonomy: newAssembler
                    } 
                })
                setLoading(false)                
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setCarsTaxonomies({
                    ...carsTaxonomies,
                    assembler: assembler.filter(assemb => assemb.id !== data.data.id)
                })
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            } catch (error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Montadora')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de montadora')
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
                    title={'Montadora'} 
                    message={'Deseja excluir esta montadora ?'} 
                    onConfirm={() => deleteAssembler(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'MONTADORA'} description={'Adicione ou edite as montadoras dos seus veículos'} />
            <div className={Styles.newTaxonomy}>
                <h1>{newAssembler?.id ? 'Editar montadora' : 'Adicionar nova montadora'}</h1>
                {newAssembler?.id ? <span className={Styles.newId}>ID: <p>{newAssembler.id}</p></span> : ''}
                {newAssembler?.id ? <span className={Styles.newSlug}>SLUG: <p>{newAssembler.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-assembler" id="new-assembler" value={newAssembler ? newAssembler.name : ''} onChange={(e) => setNewAssembler({ ...newAssembler, name: e.target.value })} />
                    <AdminButton onClick={() => createAssembler()}>{newAssembler?.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {newAssembler && <AdminButton onClick={() => setNewAssembler(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.taxonomyList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    assembler.map(assemble => {
                        let count = 0
                        cars.map(tax => tax.assembler === assemble.name && count++) 
                         
                        return <TaxonomyItem key={assemble.slug} taxonomy={assemble} count={count} editAction={editAssembler} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Assembler

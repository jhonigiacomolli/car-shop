import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { Edit, Trash } from 'components/icons'
import { TYPE_API_Response, TYPE_InfoBox, TYPE_Message_Types } from 'context/context-types'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import AdminButton from 'components/buttons/admin-button'
import CheckBox from 'components/checkbox/check-box'
import ConfirmBox from 'components/messages/confirm-box'
import MessageBox from 'components/messages/message-box'
import PageHeader from '../page-header'
import UserItem from './box-item'
import InfoBox from './info-box'
import Styles from './all-boxes.module.css'


const AllInfoBoxes = () => {
    const { loginToken, theme, setLoading, setBodyComponent } = useContext(TokenContext)
    const { searchTerms, setInfoBoxes, infoBoxes} = useConfig()
    const [massSelection, setMassSelection] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [selectInfoBox, setSelectInfoBox] = useState<TYPE_InfoBox[]>([])
    const [infoBoxToDelete, setInfoBoxToDelete] = useState<TYPE_InfoBox[]>([])
    const [messageBox, setMessageBox] = useState(false)
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [messageBoxMessage, setMessageBoxMessage] = useState('')
    const [confirmBox, setConfirmBox] = useState(false)

    useEffect(() => {
        const selects = document.querySelectorAll('[ms-info-box]')
        const newUser:TYPE_InfoBox[] = [...selectInfoBox]
        
        for(let i=0; i<selects.length; i++) {
            const selected = selects[i] as HTMLInputElement

            if(selectAll && selects) {
                selected.checked = true
                setSelectInfoBox([...newUser, ...infoBoxes.filter(user => selected.value === user.id.toString())])
            }else {
                selected.checked = false
                setSelectInfoBox(newUser.filter(user => user.id.toString() !== selected.value))
            }
        }
    }, [selectAll])
    
    useEffect(() => {
        setInfoBoxes((searchTerms && searchTerms !== '') ? infoBoxes.filter(user => user.title.toLowerCase().includes(searchTerms?.toLowerCase())) : infoBoxes)
    }, [searchTerms, infoBoxes])
    
    useEffect(() => {
        infoBoxToDelete && infoBoxToDelete.length > 0 ? setConfirmBox(true) : setConfirmBox(false)
        infoBoxToDelete && infoBoxToDelete.length > 1 ? setMessageBoxTitle('Exclusão em massa') : setMessageBoxTitle('Exclusão')
        infoBoxToDelete && infoBoxToDelete.length > 1 ? setMessageBoxMessage('Deseja excluir permanentemente os boxes de informação selecionados ?') : setMessageBoxMessage('Deseja excluir permanentemente este box de informação ?')
    }, [infoBoxToDelete])

    function checkPosts(event: ChangeEvent<HTMLInputElement>) {
        const result = event.target as HTMLInputElement
        setSelectInfoBox(
            result.checked 
            ? [...selectInfoBox, ...infoBoxes.filter(user => user.id.toString() === result.getAttribute('ms-info-box'))] 
            : selectInfoBox.filter(user => user.id.toString() !== result.getAttribute('ms-info-box'))
        )
    }

    function massVerification(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target as HTMLInputElement
        setMassSelection(checked)
        if(!checked) {
            setSelectAll(false) 
            setSelectInfoBox([])
        }  
    }

    async function infoBoxDelete(infoBox: TYPE_InfoBox[]) {
        setConfirmBox(false)
        setLoading(true)

        try {
            const { data } = await axios.delete<TYPE_API_Response<TYPE_InfoBox[]>>(`${api}/info-box`, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                },
                data: { 'info-box': infoBox }
            })
            setLoading(false)            
            setMessageBoxMessage(data.message)
            setMessageBoxTitle(data.status === 200 ? 'Sucesso!' : 'Erro!')
            setMessageBoxType(data.status === 200 ? 'success' : 'error')
            setMessageBox(true)
            setInfoBoxes(infoBoxes.filter(info => !data.data.find(item => item.id === info.id)))
            setTimeout(() => {
                setMessageBox(false)
            }, 1500);
        }catch(error: any) {
            setLoading(false)
            setMessageBoxTitle(error.status)
            setMessageBoxType('error')
            setMessageBoxMessage(error.message)
            setMessageBox(true)
            setTimeout(() => {
                setMessageBox(false)
            }, 2000);
        }

    }

    function massiveDelete() {
        const infoBoxDelelted:TYPE_InfoBox[] = []
        document.querySelectorAll('[ms-info-box]').forEach(infoBox => {
            const selected = infoBox as HTMLInputElement
            selected.checked === true ?
            infoBoxes.map(originalInfo=> originalInfo.id === Number(infoBox.getAttribute('ms-info-box')) && infoBoxDelelted.push(originalInfo))
            : ''
        })
        setInfoBoxToDelete(infoBoxDelelted)
    }
    
    function handleCheckAll(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target as HTMLInputElement
        setSelectAll(checked)
    }

    return (
        <div id={'body'} className={theme.content}>
            {messageBox && (
                <MessageBox 
                    type={messageBoxType}
                    title={messageBoxTitle}
                    message={messageBoxMessage}
                />
            )}
            {confirmBox && (
                <ConfirmBox 
                    title={messageBoxTitle}
                    message={messageBoxMessage}
                    onConfirm={() => infoBoxDelete(infoBoxToDelete)}
                    onCancel={() => setInfoBoxToDelete([])}
                />
            )}
            <PageHeader 
                search 
                title={'BOX DE INFORMAÇÕES'} 
                description="" 
            />
            <div className={Styles.options}>
                <p className={Styles.infoBoxesCount}><span>{infoBoxes.length}</span> Box encontrados</p>
                <label className={Styles.selectionContainer} htmlFor="mass-selection">
                   <CheckBox id="mass-selection" onChange={massVerification}/>
                    Seleção em massa
                </label>
                {massSelection && <label className={Styles.selectionContainer} htmlFor="selection-all">
                   <CheckBox id="selection-all" onChange={handleCheckAll}/>
                    Selecionar todos
                </label>}
                {selectInfoBox.length > 0 && <AdminButton onClick={() => massiveDelete()} >Excluir itens selecionados</AdminButton>}
            </div>
            <div className={Styles.articlesContainer}>                
                {infoBoxes.map(infoItem => {                    
                    return (
                        <div key={infoItem.id} className={Styles.user}>
                            {massSelection && <label className={Styles.selectionContainer} htmlFor="item-selection">
                                <label htmlFor={`box-${infoItem.id}`}>
                                    <CheckBox id={`box-${infoItem.id}`} initialCheck={selectAll} ms-info-box={infoItem.id} onChange={checkPosts}/>
                                </label>
                            </label>}
                            <UserItem infobox={infoItem} />
                            <div className={Styles.actions}>
                                <AdminButton onClick={() => setBodyComponent(<InfoBox infoBox={infoItem} />)} icon={<Edit />} ></AdminButton>
                                <AdminButton onClick={() => setInfoBoxToDelete([infoItem])} icon={<Trash />}></AdminButton>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllInfoBoxes

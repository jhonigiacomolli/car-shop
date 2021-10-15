import axios from 'axios'
import { api } from 'api/api'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Branch, TYPE_Message_Types } from 'context/context-types'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { TokenContext } from '..'
import { Edit, Trash } from 'components/icons'
import CheckBox from 'components/checkbox/CheckBox'
import AdminButton from 'components/buttons/AdminButton'
import ConfirmBox from 'components/messages/ConfirmBox'
import MessageBox from 'components/messages/MessageBox'
import PageHeader from '../page-header'
import Branch from './branch'
import BranchItem from './branch-item'
import Styles from './all-branches.module.css'


const AllBRanches = () => {
    const { loginToken, theme, setLoading, setBodyComponent } = useContext(TokenContext)
    const { searchTerms, branches, setBranches} = useConfig()
    const [massSelection, setMassSelection] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [selectedBranches, setSelectedBranches] = useState<TYPE_Branch[]>([])
    const [branchesToDelete, setBranchesToDelete] = useState<TYPE_Branch[]>([])
    const [messageBox, setMessageBox] = useState(false)
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [messageBoxMessage, setMessageBoxMessage] = useState('')
    const [confirmBox, setConfirmBox] = useState(false)

    useEffect(() => {
        const selects = document.querySelectorAll('[ms-branches]')
        const newBranch:TYPE_Branch[] = [...selectedBranches]
        
        for(let i=0; i<selects.length; i++) {
            const selected = selects[i] as HTMLInputElement

            if(selectAll && selects) {
                selected.checked = true
                setSelectedBranches([...newBranch, ...branches.filter(branch => selected.value === branch.id.toString())])
            }else {
                selected.checked = false
                setSelectedBranches(newBranch.filter(branch => branch.id.toString() !== selected.value))
            }
        }
    }, [selectAll])
    
    useEffect(() => {
        setBranches((searchTerms && searchTerms !== '') ? branches.filter(branch => branch.title.toLowerCase().includes(searchTerms?.toLowerCase())) : branches)
    }, [searchTerms, branches])
    
    useEffect(() => {
        branchesToDelete && branchesToDelete.length > 0 ? setConfirmBox(true) : setConfirmBox(false)
        branchesToDelete && branchesToDelete.length > 1 ? setMessageBoxTitle('Exclusão em massa') : setMessageBoxTitle('Exclusão')
        branchesToDelete && branchesToDelete.length > 1 ? setMessageBoxMessage('Deseja excluir permanentemente os boxes de informação selecionados ?') : setMessageBoxMessage('Deseja excluir permanentemente este box de informação ?')
    }, [branchesToDelete])

    function checkPosts(event: ChangeEvent<HTMLInputElement>) {
        const result = event.target as HTMLInputElement
        setSelectedBranches(
            result.checked 
            ? [...selectedBranches, ...branches.filter(branch => branch.id.toString() === result.getAttribute('ms-branches'))] 
            : selectedBranches.filter(branch => branch.id.toString() !== result.getAttribute('ms-branches'))
        )
    }

    function massVerification(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target as HTMLInputElement
        setMassSelection(checked)
        if(!checked) {
            setSelectAll(false) 
            setSelectedBranches([])
        }  
    }

    async function infoBoxDelete(branch: TYPE_Branch[]) {
        setConfirmBox(false)
        setLoading(true)

        try {
            const { data } = await axios.delete<TYPE_API_Response<TYPE_Branch[]>>(`${api}/branch`, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                },
                data: { 'branch': branch }
            })
            setLoading(false)            
            setMessageBoxMessage(data.message)
            setMessageBoxTitle(data.status === 200 ? 'Sucesso!' : 'Erro!')
            setMessageBoxType(data.status === 200 ? 'success' : 'error')
            setMessageBox(true)
            console.log(data);
            
            setBranches(branches.filter(info => !data.data.find(item => item.id === info.id)))
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
        const branchDelelted:TYPE_Branch[] = []
        document.querySelectorAll('[ms-branches]').forEach(branch => {
            const selected = branch as HTMLInputElement
            selected.checked === true ?
            branches.map(originalInfo=> originalInfo.id === Number(branch.getAttribute('ms-branches')) && branchDelelted.push(originalInfo))
            : ''
        })
        setBranchesToDelete(branchDelelted)
    }
    
    function handleCheckAll(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target as HTMLInputElement
        setSelectAll(checked)
    }

    return (
        <div id={'body'} className={theme.content}>
            {messageBox && <MessageBox 
                type={messageBoxType}
                title={messageBoxTitle}
                message={messageBoxMessage}
                />}
            {confirmBox && <ConfirmBox 
                title={messageBoxTitle}
                message={messageBoxMessage}
                onConfirm={() => infoBoxDelete(branchesToDelete)}
                onCancel={() => setBranchesToDelete([])}
            />}
            <PageHeader 
                search 
                title={'FILIAIS'} 
                description="" 
            />
            <div className={Styles.options}>
                <p className={Styles.infoBoxesCount}><span>{branches.length}</span> Filiais encontradas</p>
                <label className={Styles.selectionContainer} htmlFor="mass-selection">
                   <CheckBox id="mass-selection" onChange={massVerification}/>
                    Seleção em massa
                </label>
                {massSelection && <label className={Styles.selectionContainer} htmlFor="selection-all">
                   <CheckBox id="selection-all" onChange={handleCheckAll}/>
                    Selecionar todos
                </label>}
                {selectedBranches.length > 0 && <AdminButton onClick={() => massiveDelete()} >Excluir itens selecionados</AdminButton>}
            </div>
            <div className={Styles.articlesContainer}>                
                {branches.map(branch => {                    
                    return (
                        <div key={branch.id} className={Styles.user}>
                            {massSelection && <label className={Styles.selectionContainer} htmlFor="item-selection">
                                <label htmlFor={`branch-${branch.id}`}>
                                    <CheckBox id={`branch-${branch.id}`} initialCheck={selectAll} ms-branches={branch.id} onChange={checkPosts}/>
                                </label>
                            </label>}
                            <BranchItem branch={branch} />
                            <div className={Styles.actions}>
                                <AdminButton onClick={() => setBodyComponent(<Branch branch={branch}/>)} icon={<Edit />} ></AdminButton>
                                <AdminButton onClick={() => setBranchesToDelete([branch])} icon={<Trash />}></AdminButton>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllBRanches

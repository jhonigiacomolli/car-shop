import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Users } from 'context/context-types'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Edit, Trash } from 'components/icons'
import AdminButton from 'components/buttons/admin-button'
import CheckBox from 'components/checkbox/check-box'
import ConfirmBox from 'components/messages/confirm-box'
import MessageBox from 'components/messages/message-box'
import PageHeader from '../page-header'
import User from './user'
import UserItem from './user-item'
import Styles from './all-users.module.css'

const AllUsers = () => {
    const { loginToken, theme, user, setLoading, setBodyComponent } = useContext(TokenContext)
    const { searchTerms, config, setConfig, users, setUsers} = useConfig()
    const [massSelection, setMassSelection] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [selectUsers, setSelectUsers] = useState<TYPE_Users[]>([])
    const [userToDelete, setUserToDelete] = useState<TYPE_Users[]>([])
    const [messageBox, setMessageBox] = useState(false)
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [messageBoxMessage, setMessageBoxMessage] = useState('')
    const [confirmBox, setConfirmBox] = useState(false)

    useEffect(() => {
        const selects = document.querySelectorAll('[ms-user]')
        const newUser:TYPE_Users[] = [...selectUsers]
        
        for(let i=0; i<selects.length; i++) {
            const selected = selects[i] as HTMLInputElement

            if(selectAll && selects) {
                selected.checked = true
                setSelectUsers([...newUser, ...users.filter(user => selected.value === user.id.toString())])
            }else {
                selected.checked = false
                setSelectUsers(newUser.filter(user => user.id.toString() !== selected.value))
            }
        }
    }, [selectAll])
    
    useEffect(() => {
        setUsers((searchTerms && searchTerms !== '') ? users.filter(user => user.username.toLowerCase().includes(searchTerms?.toLowerCase())) : users)
    }, [searchTerms, users])
    
    useEffect(() => {
        userToDelete && userToDelete.length > 0 ? setConfirmBox(true) : setConfirmBox(false)
        userToDelete && userToDelete.length > 1 ? setMessageBoxTitle('Exclusão em massa') : setMessageBoxTitle('Exclusão')
        userToDelete && userToDelete.length > 1 ? setMessageBoxMessage('Deseja excluir permanentemente os users selecionados ?') : setMessageBoxMessage('Deseja excluir permanentemente este user ?')
    }, [userToDelete])

    function checkPosts(event: ChangeEvent<HTMLInputElement>) {
        const result = event.target
        setSelectUsers(
            result.checked 
            ? [...selectUsers, ...users.filter(user => user.id.toString() === result.getAttribute('ms-user'))] 
            : selectUsers.filter(user => user.id.toString() !== result.getAttribute('ms-user'))
        )
    }

    function massVerification(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target
        setMassSelection(checked)
        if(!checked) {
            setSelectAll(false) 
            setSelectUsers([])
        }  
    }

    async function userDelete(user: TYPE_Users[]) {
        setConfirmBox(false)
        setLoading(true)

        try {
            const { data } = await axios.delete<TYPE_API_Response<TYPE_Users[]>>(`${api}/user`, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                },
                data: { 'user': user }
            })
            setLoading(false)
            setMessageBoxMessage(data.message)
            setMessageBoxTitle(data.status === 200 ? 'Sucesso!' : 'Erro!')
            setMessageBoxType(data.status === 200 ? 'success' : 'error')
            setMessageBox(true)            
            setUsers(users.filter(user => !data.data.find(item => item.id === user.id)))
            setTimeout(() => {
                setMessageBox(false)
            }, 1500)
        }catch(error: any) {
            setLoading(false)
            setMessageBoxTitle(error.status)
            setMessageBoxType('error')
            setMessageBoxMessage(error.message)
            setMessageBox(true)
            setTimeout(() => {
                setMessageBox(false)
            }, 2000)
        }
    }

    function massiveDelete() {
        const userDelelted:TYPE_Users[] = []
        document.querySelectorAll('[ms-user]').forEach(user => {
            const selected = user as HTMLInputElement
            selected.checked === true ?
            users.map(originalUser => originalUser.id === Number(user.getAttribute('ms-user')) && userDelelted.push(originalUser))
            : ''
        })
        setUserToDelete(userDelelted)
    }
    
    function handleCheckAll(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target
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
                    onConfirm={() => userDelete(userToDelete)}
                    onCancel={() => setUserToDelete([])}
                />
            )}
            <PageHeader 
                search 
                title={'USUÁRIOS'} 
                description="" 
            />
            <div className={Styles.options}>
                <p className={Styles.usersCount}><span>{users.length}</span> Usuários encontrados</p>
                <label className={Styles.selectionContainer} htmlFor="mass-selection">
                   <CheckBox id="mass-selection" onChange={massVerification}/>
                    Seleção em massa
                </label>
                {massSelection && <label className={Styles.selectionContainer} htmlFor="selection-all">
                   <CheckBox id="selection-all" onChange={handleCheckAll}/>
                    Selecionar todos
                </label>}
                {selectUsers.length > 0 && <AdminButton onClick={() => massiveDelete()} >Excluir itens selecionados</AdminButton>}
            </div>
            <div className={Styles.articlesContainer}>                
                {users.map(userItem => {                    
                    return (
                        (user?.capability !== 'contributor' || user?.email === userItem.email) && <div key={userItem.id} className={Styles.user}>
                            {massSelection && <label className={Styles.selectionContainer} htmlFor="item-selection">
                                <label htmlFor={`user-${userItem.id}`}>
                                    <CheckBox id={`user-${userItem.id}`} initialCheck={selectAll} ms-user={userItem.id} onChange={checkPosts}/>
                                </label>
                            </label>}
                            <UserItem user={userItem} />
                            <div className={Styles.actions}>
                                <AdminButton onClick={() => setBodyComponent(<User user={userItem} />)} icon={<Edit />} ></AdminButton>
                                <AdminButton onClick={() => setUserToDelete([userItem])} icon={<Trash />}></AdminButton>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllUsers

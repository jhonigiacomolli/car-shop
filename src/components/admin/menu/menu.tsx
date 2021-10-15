import { Fragment, useContext, useEffect, useState } from 'react'
import { AdminPanelOption, TYPE_AdminPanelOption, TYPE_AdminPanelSubOption } from 'api/api'
import { useConfig } from 'context'
import { TokenContext } from '..'
import SubMenu from './sub-menu'
import Styles from './menu.module.css'

type AdminMenuProps = {
}
const AdminMenu = ({  }: AdminMenuProps) => {
    const { windowWidth } = useConfig()
    const { setBodyComponent, setUser, setLoginToken, user, openTickets } = useContext(TokenContext)
    const [menuOptions, setMenuOptions] = useState<TYPE_AdminPanelOption[]>([])

    useEffect(() => {
        setMenuOptions(AdminPanelOption)
        AdminPanelOption.map(item => item.subitens?.map(sub => sub.visible && setBodyComponent(sub.component)))
    }, [])

    function logout() {
        localStorage.removeItem('ms-auth-token')
        localStorage.removeItem('ms-user-email')
        sessionStorage.removeItem('ms-auth-token')
        sessionStorage.removeItem('ms-user-email')
        setLoginToken('')
        setUser(undefined)
    }

    function handleSelect(clickedItem: TYPE_AdminPanelOption) {
        setMenuOptions(old => (
            old?.map(item => {
                if(item.id === clickedItem.id) {
                    return (
                        {
                            ...item,
                            subitens: item.subitens?.map((sub, index) => (
                                {
                                    ...sub,
                                    visible: index === 0
                                }
                            ))
                        }
                    )
                }else {
                    return (
                        {
                            ...item,
                            subitens: item.subitens?.map((sub, index) => (
                                {
                                    ...sub,
                                    visible: false
                                }
                            ))
                        }
                    )
                }
                
            })
        ))
        windowWidth > 991 && clickedItem.subitens && setBodyComponent(clickedItem.subitens[0].component)
    }

    function handleUpdateSelected(subitem: TYPE_AdminPanelSubOption) {
        setMenuOptions(old => (
            old?.map((item) => {
                if (item.subitens?.find(sub => sub.id === subitem.id)) {
                    return ({
                        ...item,
                        subitens: (
                            item.subitens.map(sub => {
                                if(sub.id === subitem.id) {
                                    setBodyComponent(subitem.component)
                                    return ({
                                        ...sub,
                                        visible: true
                                    })
                                }else { 
                                    return ({
                                        ...sub,
                                        visible: false
                                    })
                                }
                            })
                        )
                    })
                }else { 
                    return item
                }
            })
        ))
    }

    function renderMenu() {
        return  (
            <Fragment>
                {
                    user && menuOptions?.map(item => {
                        const activeItem = item.subitens?.find(item => item.visible)
                        
                        if(item.display && item.capability[user?.capability]) {
                            if (item.title !== 'Sair') {
                                return (
                                    <Fragment key={item.title} >
                                        <span className={`${Styles.menuItem} ${ activeItem ? Styles.active : '' }`} onClick={() => handleSelect(item)} >
                                            <span className={Styles.title}>
                                                {item.icon}
                                                <div>
                                                    <p>
                                                        {item.title}
                                                    </p>
                                                    {item.id === 'tickets' && openTickets > 0 && <span className={Styles.detach}>{openTickets}</span>}
                                                </div>
                                            </span>
                                        </span>
                                        <span className={Styles.subtitle}>
                                            {activeItem && item.subitens && <SubMenu item={item.subitens} updateItem={handleUpdateSelected} />}
                                        </span>
                                    </Fragment>
                                )
                            } else {
                                return (
                                    <span key={item.title} className={`${Styles.menuItem}`} >
                                        <span className={Styles.title} onClick={() => logout()}>
                                            {item.icon}
                                            <p>{item.title}</p>
                                        </span>
                                    </span>
                                )
                            }
                        }
                    })
                }
            </Fragment> 
        )
    }
    
    return renderMenu()
}

export default AdminMenu

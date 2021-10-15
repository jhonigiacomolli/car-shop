import { useContext } from 'react'
import { TokenContext } from '..'
import { TYPE_AdminPanelSubOption } from 'api/api'
import Styles from './sub-menu.module.css'

type AdminSubMenuItemProps = {
    item: TYPE_AdminPanelSubOption[]
    updateItem: (item: TYPE_AdminPanelSubOption) => void
}
const SubMenu = ({ item, updateItem }: AdminSubMenuItemProps) => {
    const { user } = useContext(TokenContext)
    return (
            <>
            {
                item.map(subitem => (
                    user && subitem.capability[user.capability] && (
                        <a key={subitem.title} className={`${subitem.visible ? Styles.active : Styles.menuSubItem}`} onClick={() => updateItem(subitem)}>
                            {subitem.title}
                        </a>
                    )
                ))
            }
            </>
    )
}

export default SubMenu

import React from 'react'
import { useConfig } from 'context'
import SearchBar from './search-bar'
import Styles from './page-header.module.css'

type PageHeaderProps = {
    title: string
    description: string
    search?: boolean
}
const PageHeader = ({ title, description, search = false }: PageHeaderProps) => {
    const { windowWidth } = useConfig()
    return (
        <div className={Styles.header}>
            <h1>{title}</h1>
            {search && <div className={Styles.searchContainer}>
                <SearchBar theme={'dark'} />
            </div>}
               {`${windowWidth > 991 && !search ? ' | ' : ''} ${description ? description : ''}`}
        </div>
    )
}

export default PageHeader
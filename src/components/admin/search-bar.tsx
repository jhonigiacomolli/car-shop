import { useEffect, useState } from 'react'
import { useConfig } from '../../context'
import { Search } from '../icons'
import Styles from './search-bar.module.css'

type SearchBarProps = {
    theme: string
}
const SearchBar = ({ theme }: SearchBarProps) => {
    const { setSearchTerms } = useConfig()
    const [term, setTerm] = useState('')
    const themes = theme === 'dark' ? Styles.dark : theme === 'light' &&  Styles.light
    
    useEffect(() => {
        setSearchTerms(term)
    }, [term])

    return (
        <div className={`${Styles.searchBox} ${themes}`}>
            <input 
                type="text" 
                name="search" 
                id="search" 
                value={term}
                onChange={(e) => setTerm(e.target.value)} className={Styles.search} 
            />
            <Search className={Styles.icon} />
        </div>
    )
}

export default SearchBar

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Search } from 'components/icons'
import Styles from './search-bar.module.css'
import { useConfig } from 'context'
import { searchParameterize } from 'functions/paramatrize'
import { HostsPackages, SocialMediaProducts, WebDevProdcuts } from 'context/initial-contexts'

type SearchBarProps = {
    theme?: string
    className?: string
}
const SearchBar = ({ theme, className = '' }: SearchBarProps) => {
    const { portfolios } = useConfig()
    const [term, setTerm] = useState('')
    const [visible, setVisible] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const themes = theme === 'dark' ? Styles.dark : theme === 'light' &&  Styles.light
    const searchPortfolio = portfolios.filter(item => (
        'portfolio'.includes(searchParameterize(term)) ||
        searchParameterize(item.title).includes(searchParameterize(term)) ||
        searchParameterize(item.subtitle).includes(searchParameterize(term)) ||
        searchParameterize(item.description).includes(searchParameterize(term))
    ))
    const searchHost = HostsPackages.filter(item => (
        'hospedagem'.includes(searchParameterize(term)) ||
        'host'.includes(searchParameterize(term)) ||
        searchParameterize(item.title).includes(searchParameterize(term)) ||
        item.itens.filter(subitem => subitem.text.toLowerCase().includes(searchParameterize(term))).length > 0
    ))
    const searchProducts = WebDevProdcuts.filter(item => (
        'site'.includes(searchParameterize(term)) ||
        'ecommerce'.includes(searchParameterize(term)) ||
        'institucional'.includes(searchParameterize(term)) ||
        'loja virtual'.includes(searchParameterize(term)) ||
        'vendas'.includes(searchParameterize(term)) ||
        searchParameterize(item.title).includes(searchParameterize(term)) ||
        searchParameterize(item.subtitle).includes(searchParameterize(term)) ||
        searchParameterize(item.description).includes(searchParameterize(term)) ||
        item.resources.filter(resource => (
            searchParameterize(resource.title).includes(searchParameterize(term)) ||
            searchParameterize(resource.description).includes(searchParameterize(term))
        )).length > 0
    ))
    const searchMedias = SocialMediaProducts.filter(item => (
        searchParameterize(term).includes('midias') ||
        searchParameterize(term).includes('sociais') ||
        searchParameterize(item.sectionTitle).includes(searchParameterize(term)) ||
        searchParameterize(item.title).includes(searchParameterize(term)) ||
        searchParameterize(item.subtitle).includes(searchParameterize(term)) ||
        searchParameterize(item.description).includes(searchParameterize(term)) ||
        item.resources.filter(resource => (
            searchParameterize(resource.title).includes(searchParameterize(term)) ||
            searchParameterize(resource.description).includes(searchParameterize(term))
        )).length > 0
    ))
    
    
    return (
        <div className={Styles.container}>
            <div className={`${Styles.searchBox} ${themes} ${className}`}>
                <input 
                    ref={inputRef}
                    className={Styles.search} 
                    type="search" 
                    name="search" 
                    id="search"
                    value={term}
                    onBlur={() => setTimeout(() => setVisible(false), 300)} 
                    onFocus={() => setVisible(true)}
                    onChange={(e) => setTerm(e.target.value)} 
                />
                <Search />
            </div>
            {term && visible && (
                <div className={Styles.modal}>
                    <h2>Resultados</h2>
                    {searchPortfolio.length > 0 && <h3>Portfólio</h3>}
                    {
                        searchPortfolio.map((item, index) => (
                            <Link key={item.title} href="#portfolio" passHref>
                                <a>{item.title}</a>
                            </Link>
                        ))
                    }
                    {searchHost.length > 0 && <h3>Planos de Hospedagem</h3>}
                    {
                        searchHost.map(item => (
                            <Link key={item.title} href="#planos-hospedagem" passHref>
                                <div className={Styles.hostResult}>
                                    <p>Plano {item.title}</p>
                                    {item.itens.map(subitem => subitem.text.toLowerCase().includes(searchParameterize(term)) ? <span key={subitem.text}>{subitem.text}</span> : '')}
                                </div>
                            </Link>
                        ))
                    }
                    {searchProducts.length > 0 && <h3>Produtos</h3>}
                    {
                        searchProducts.map(item => (
                            <Link key={item.title} href="#desenvolvimento-web" passHref>
                                <div className={Styles.hostResult}>
                                    <p>{item.sectionTitle}</p>
                                    <div className={Styles.resultDescription}>
                                        {item.resources.map(subitem => (
                                            searchParameterize(subitem.title).includes(searchParameterize(term)) ||
                                            searchParameterize(subitem.description).includes(searchParameterize(term))
                                            ? (
                                                <span key={subitem.title}>
                                                    <p>{subitem.title}</p>
                                                    <div dangerouslySetInnerHTML={{__html: subitem.description}} />
                                                </span>
                                            ) 
                                            : ''
                                            )
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
                    {searchMedias.length > 0 && <h3>Mídias Sociais</h3>}
                    {
                        searchMedias.map(item => (
                            <Link key={item.title} href="midias-sociais" passHref>
                                <div className={Styles.hostResult}>
                                    <p>Pacote de Mídia {item.sectionTitle}</p>
                                    {item.resources.map(subitem => (
                                        searchParameterize(subitem.title).includes(searchParameterize(term)) ||
                                        searchParameterize(subitem.description).includes(searchParameterize(term))
                                        ? (
                                            <span key={subitem.title}>
                                                <p>{subitem.title}</p>
                                                <div dangerouslySetInnerHTML={{__html: subitem.description}} />
                                            </span>
                                        ) 
                                        : ''
                                        )
                                    )}
                                </div>
                            </Link>
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default SearchBar

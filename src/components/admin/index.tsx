import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { useConfig } from 'context'
import { createContext, Dispatch, ReactElement, useEffect, useState } from 'react'
import { TYPE_Access, TYPE_Branch, TYPE_Cars, TYPE_CarTaxonomies, TYPE_ConfigProps, TYPE_InfoBox, TYPE_Jobs, TYPE_Jobs_Taxonomies, TYPE_Portfolio, TYPE_Posts, TYPE_Taxonomy, TYPE_Tickets, TYPE_Users } from 'context/context-types'
import { api, support_api, AdminPanelOption } from 'api/api'
import { ArrowLeft, User } from 'components/icons'
import Dashboard from './dashboard/dashboard'
import AdminMenu from './menu/menu'
import Login from './login/login'
import Styles from './index.module.css'
import Theme_Dark from './theme-dark.module.css'
import Theme_Light from './theme-light.module.css'

type AdminContext = {
    loginToken: string
    theme: {[key: string]: string}
    user: TYPE_Users | undefined
    userTheme: string
    access: TYPE_Access[]
    openTickets: number
    setLoading: Dispatch<boolean>
    setUser: Dispatch<TYPE_Users | undefined>
    setUserTheme: Dispatch<string>
    setTheme: Dispatch<{[key: string]: string}>
    setBodyComponent: Dispatch<ReactElement>
    setLoginToken: Dispatch<string>
    setOpenTickets: Dispatch<number>
    Theme_Light: object
    Theme_Dark: object
}
type AdminProps = {
    users: TYPE_Users[]
}
export const TokenContext = createContext({} as AdminContext) 
const AdminPanel = ({ users }: AdminProps) => {
    const { 
        config, 
        adminComponent, 
        windowWidth, 
        setConfig, 
        setUsers, 
        setBlog, 
        setBlogCategories, 
        setBlogTags, 
        setCars, 
        setCarsTaxonomies, 
        setInfoBoxes, 
        setBranches, 
        setJobs, 
        setJobsTaxonomies, 
        setPortfolios,
        setTickets,
        setLoading, 
    } = useConfig()
    const [theme, setTheme] = useState(Theme_Dark)
    const [loginToken, setLoginToken] = useState('')
    const [bodyComponent, setBodyComponent] = useState(<Dashboard />)
    const [toggle, setToggle] = useState(false)
    const [user, setUser] = useState<TYPE_Users>()
    const [userTheme, setUserTheme] = useState('dark')
    const [access, setAccess] = useState<TYPE_Access[]>([])
    const [openTickets, setOpenTickets] = useState(0)
    
    useEffect(() => {
        getData()
    }, [])       
    
    useEffect(() => {
        getData()
        if(process.browser) {
            const WebFontLoader = require('webfontloader')
            WebFontLoader.load ({
                google: {
                    families: ['Krona One: 400', 'Montserrat: 100,300,600,900'],
                }
            })
        }      
    }, [])        


    const getData = async () => {
        
        const { data } = await  axios.get<TYPE_ConfigProps>(`${api}/config`)
        setConfig(data)
        console.log(data);
        
        
        async function getAccess() {
            const { data: access } = await axios.get<TYPE_Access[]>(`${api}/access`)
            setAccess(access)
        }
        async function getArticles() {
            const { data: blog } = await  axios.get<TYPE_Posts[]>(`${api}/blog?_limit=-1`)
            setBlog(blog)
            const { data: categories } = await  axios.get<TYPE_Taxonomy[]>(`${api}/blog/categories`)
            setBlogCategories(categories)
            const { data: tags } = await  axios.get<TYPE_Taxonomy[]>(`${api}/blog/tags`)
            setBlogTags(tags)
        }
        async function getCars() {
            const { data: cars } = await  axios.get<TYPE_Cars[]>(`${api}/cars`)
            setCars(cars)
            const { data: taxonomies } = await axios.get<TYPE_CarTaxonomies>(`${api}/cars/taxonomies`)
            setCarsTaxonomies(taxonomies)
        }
        async function getInfoBoxes() {
            const { data: infoBoxes } = await axios.get<TYPE_InfoBox[]>(`${api}/info-box`)
            setInfoBoxes(infoBoxes)
        }
        async function getBranches() {
            const { data: branches } = await axios.get<TYPE_Branch[]>(`${api}/branch`)
            setBranches(branches)
        }
        async function getJobs() {
            const { data: jobs } = await axios.get<TYPE_Jobs[]>(`${api}/jobs`)
            setJobs(jobs)
            const { data: jobsTaxonomies } = await axios.get<TYPE_Jobs_Taxonomies>(`${api}/jobs/taxonomies`)
            setJobsTaxonomies(jobsTaxonomies)
        }
        async function getPortfolios() {
            const { data: portfolios } = await axios.get<TYPE_Portfolio[]>(`${api}/portfolio`)
            setPortfolios(portfolios)
        }
        AdminPanelOption.map(item => {
            if(item.display) {                
                item.id  === 'dashboard' && getAccess()
                item.id  === 'articles' && getArticles()
                item.id  === 'portfolios' && getPortfolios()
                item.id  === 'info-boxes' &&  getInfoBoxes()
                item.id  === 'jobs' && getJobs()
                item.id  === 'vehicles' && getCars()
                item.id  === 'branches' && getBranches()
            }
        })
    }

    useEffect(() => {
        async function getTickets() {
            const { data: tickets } = await axios.get<TYPE_Tickets[]>(`${support_api}?capability=${user?.capability}&domain=${document.domain}`)
            setTickets(tickets)
            setOpenTickets(tickets.filter(item => item.status !== 'closed').length)
        }
        AdminPanelOption.map(item => {
            if(item.display) {
                item.id  === 'tickets' && getTickets()
            }
        })
    }, [user])

    useEffect(() => {
        switch(userTheme) {
            case 'light':
                setTheme(Theme_Light)
                break
            case 'dark':
                setTheme(Theme_Dark)
                break
        }
    }, [userTheme])

    useEffect(() => {
        switch(user?.theme) {
            case 'light':
                setTheme(Theme_Light)
                break
            case 'dark':
                setTheme(Theme_Dark)
                break
        }
    }, [user, bodyComponent])

    useEffect(() => {
        if(user?.capability === 'administrator') {
            setUsers(users)
        }else {
            setUsers(users.filter(user => user.capability !== 'administrator'))
        }
    }, [user, users, setUsers])

    useEffect(() => {
        loginToken && setLoading(false)
    }, [loginToken, setLoading])

    useEffect(() => {
        setToggle(false)
    }, [bodyComponent])    
    
    return ( 
        <>
        <Head>
            <title>{config && `Painel Administrativo | ${config.siteTitle}`}</title>
            <link rel="icon" href={config && config.favIcon} />
            <meta name="description" content={config && config.siteDescription}/>
            <script id="head-scripts"/>
        </Head>
        {loginToken ? 
            <TokenContext.Provider value={{ loginToken, theme, user, userTheme, access, openTickets, setLoading, setUser, setUserTheme, setTheme, setBodyComponent, setLoginToken, setOpenTickets, Theme_Light, Theme_Dark }}>
                <div className={`${Styles.content} ${theme.content}`}>
                    <header className={Styles.header}>
                        <div className={Styles.headerToggle} onClick={() => setToggle(!toggle)} >
                            {windowWidth <= 991 && <div className={Styles.toggle} >
                                <span className={toggle ? `${Styles.toggle1} ${Styles.toggleOpen}` : Styles.toggle1}></span>
                                <span className={toggle ? `${Styles.toggle2} ${Styles.toggleOpen}` : Styles.toggle2}></span>
                                <span className={toggle ? `${Styles.toggle3} ${Styles.toggleOpen}` : Styles.toggle3}></span>
                            </div>}
                            {windowWidth <= 991 && <span>{toggle ? 'Recolher Menu' : 'Expandir Menu'}</span>}
                        </div>
                    </header>
                    <nav className={`${Styles.nav} ${toggle ? Styles.navActive : ''}`}>
                        <div className={Styles.user}>
                            <div className={Styles.avatar}>
                                { (user?.picture !== '' && user?.picture !== null) ? user?.picture && <Image src={user.picture} alt="imagem-usuário" width="110" height="110"/> : <User />}
                            </div>
                            <h1 className={Styles.username}>
                                {user?.name}{user?.username && <span>({user.username})</span>}
                            </h1>
                            <h1 className={Styles.userCompany}>{user && user.capability === 'administrator' ? 'Microsite Agência Digital' : config.siteTitle}</h1>
                            <Link href={'/'} passHref>
                                <span className={Styles.return} onClick={() => setLoading(true)}>
                                    <ArrowLeft label="Retornar para a navegação" />
                                </span>
                            </Link>
                        </div>
                        <nav className={Styles.menu}>
                            <AdminMenu />    
                        </nav>
                        <div className={Styles.others}>

                        </div>
                    </nav>
                    <section id={'admin-body'} className={Styles.body}>
                        {bodyComponent}
                    </section>
                </div>
            </TokenContext.Provider>
        :
            <Login setLogin={setLoginToken} setUserName={setUser} users={users} setLoading={setLoading}/>
        }
        </>
    )
}

export default AdminPanel
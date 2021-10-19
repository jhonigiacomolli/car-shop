import * as initial from './initial-contexts'
import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react'
import { TYPE_Branch, TYPE_Cars, TYPE_CarTaxonomies, TYPE_Category, TYPE_ConfigProps, TYPE_ContextProps, TYPE_InfoBox, TYPE_Jobs, TYPE_Jobs_Taxonomies, TYPE_Portfolio, TYPE_Posts, TYPE_Taxonomy, TYPE_Tickets, TYPE_Users } from './context-types'

export const configContext = createContext({} as TYPE_ContextProps)

type ConfigContextProviderProps = {
  children: ReactNode | ReactNode[]
}
//Contexto de configuração da aplicação
export const ConfigContextProvider = ({children}: ConfigContextProviderProps) => {
  const [config, setConfig] = useState<TYPE_ConfigProps>(initial.configProps)
  const [blog, setBlog] = useState<TYPE_Posts[]>([])
  const [blogCategories, setBlogCategories] = useState<TYPE_Taxonomy[]>([])
  const [blogTags, setBlogTags] = useState<TYPE_Taxonomy[]>([])
  const [cars, setCars ] = useState<TYPE_Cars[]>([]) 
  const [carsTaxonomies, setCarsTaxonomies] = useState<TYPE_CarTaxonomies>(initial.carTaxonomies) 
  const [infoBoxes, setInfoBoxes] = useState<TYPE_InfoBox[]>([])
  const [branches, setBranches] = useState<TYPE_Branch[]>([])
  const [jobs, setJobs] = useState<TYPE_Jobs[]>([])
  const [jobsTaxonomies, setJobsTaxonomies] = useState<TYPE_Jobs_Taxonomies>(initial.jobsTaxonomies)
  const [portfolios, setPortfolios] = useState<TYPE_Portfolio[]>([])
  const [tickets, setTickets] = useState<TYPE_Tickets[]>([])
  const [page, setPage] = useState('home')
  const [windowWidth, setWindowWidth] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [position, setPosition] = useState(0)
  const [filter1, setFilter1] = useState('')
  const [filter2, setFilter2] = useState('')
  const [filter3, setFilter3] = useState('')
  const [filter4, setFilter4] = useState('')
  const [searchTerms, setSearchTerms] = useState('')
  const [carsResults, setCarsResults] = useState()
  const [postsResults, setPostsResults] = useState()
  const [clearCheck, setClearCheck] = useState(false)
  const [adminComponent, setAdminComponent] = useState<ReactElement>(<div></div>)
  const [users, setUsers] = useState<TYPE_Users[]>([])
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
    function readWindowSize () {
      setWindowWidth(window.screen.width)
      setWindowHeight(window.screen.height)
    }
    readWindowSize()
    window.addEventListener('resize', readWindowSize)
    return () => {
        window.removeEventListener('resize', readWindowSize)
    }
  }, [])
  
  // console.log(blog, portfolios, infoBoxes, jobs, jobsTaxonomies, cars, carsTaxonomies, branches);
  

  useEffect(() => {
    function position(){
        const scrool = window.scrollY
        const height = document.body.offsetHeight - window.innerHeight
        const percent = (scrool/height) * 100
        setPosition(percent)
    }
    window.addEventListener('touchmove', position)
    window.addEventListener('scrool', position)
    window.addEventListener('wheel', position)
    
    return () => {
      window.removeEventListener('touchmove', position)
      window.removeEventListener('scrool', position)
      window.removeEventListener('wheel', position)
    }
}, [])

  return (
    <configContext.Provider value={{
      config, 
      page, 
      windowWidth,
      windowHeight,
      position,
      searchTerms,
      adminComponent,
      users,
      blog,
      blogCategories,
      blogTags,
      cars,
      carsTaxonomies,
      infoBoxes,
      branches,
      jobs,
      jobsTaxonomies,
      portfolios,
      tickets,
      loading,
      filter1,
      filter2,
      filter3,
      filter4,
      setConfig, 
      setPosition,
      setPage, 
      setSearchTerms,
      setAdminComponent,
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
      setFilter1,
      setFilter2,
      setFilter3,
      setFilter4,
    }}>
      {children }
    </configContext.Provider>
  )
}
//Função para utilizar o Contexto de Configuracões
export const useConfig = () => {
  return useContext(configContext)
}

export default ConfigContextProvider

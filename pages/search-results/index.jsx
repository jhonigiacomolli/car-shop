import React from 'react'
import Axios from 'axios'
import { api } from '../../api/api'
import { useConfig } from '../../context'
import { DateFormat_inFull } from '../../functions/DateFormat'
import { RegisterAccess } from '../../functions/RegisterAccess'
import SearchItem from '../../components/search/SearchItem'
import Styles from './index.module.css'

const index = ({ cars, blog, config, setLoading }) => {
    const [carsResults, setCarsResults] = React.useState()
    const [postsResults, setPostsResults] = React.useState()
    const {
        setConfig,
        setPage,
        searchTerms,
    } = useConfig()
    
    React.useEffect(() => {
        setLoading(false)
        RegisterAccess()
        setConfig(config)
        setPage('search')
    }, [])

    React.useEffect(() => {
        const car = searchTerms && cars.filter(car => car.title.toLowerCase().includes(searchTerms.toLowerCase()))
        const post = searchTerms && blog.filter(post => post.title.toLowerCase().includes(searchTerms.toLowerCase()))
        setCarsResults(car)
        setPostsResults(post)
    }, [searchTerms])

    return (
        <div className={Styles.container}>
            <div className={Styles.searchResults}>
                <div>
                    <p><b>{carsResults && carsResults.length > 0 ? carsResults.length : 'Nenhum' }</b> {carsResults && carsResults.length > 1  ? 'Resultados' : 'Resultado' } encontrados para "<b>{searchTerms}</b>" em <span className={Styles.sectionResult}>Veículos</span>  </p>
                    {
                        carsResults && carsResults.length > 0 ? carsResults.map(car => {
                            return (
                                <SearchItem key={car.slug} image={car.thumbnail} title={car.title} date={DateFormat_inFull(car.registration)} link={`/car/${car.slug}`} />
                            )
                        }):
                        <span className={Styles.noResults}></span>
                    } 
                </div>
                <div>
                    <p><b>{postsResults && postsResults.length > 0 ? postsResults.length : 'Nenhum'}</b> {postsResults && postsResults.length > 1 ? 'Resultados' : 'Resultado' } encontrados para <b>{searchTerms}</b> em <span className={Styles.sectionResult}>Artigos</span></p>
                    {
                        postsResults && postsResults.length > 0 ? postsResults.map(post => {
                            return (
                                <SearchItem key={post.slug} image={post.thumbnail} title={post.title} date={DateFormat_inFull(post.postDate)} link={`/blog/${post.slug}`} />
                            )
                        }):
                        <span className={Styles.noResults}></span>
                    }
                </div>
            </div>
        </div>
    )
}

export default index

export async function getStaticProps() {
    const config = await  Axios(`${api}/config`).then(resp => resp.data)
    const blog = await  Axios(`${api}/blog`).then(resp => resp.data)
    const cars = await  Axios(`${api}/cars`).then(resp => resp.data)
  
    return {
        props: {
            blog,
            cars,
            config,
        },
        revalidate: config.revalidate
    }
  }
import { api } from 'api/api'
import axios from 'axios'
import { useConfig } from 'context'
import { TYPE_ConfigProps } from 'context/context-types'
import { GetStaticProps } from 'next'
import React, { useEffect } from 'react'
import Styles from '../styles/404.module.scss'

type Custom404Props = {
    config: TYPE_ConfigProps
}
const Custom404 = ({ config }: Custom404Props) => {
    const { setLoading, setConfig } = useConfig()

    useEffect(() => {
        setConfig(config)
        setLoading(false)
    }, [])

    return (
        <div className={Styles.notFound}>
            <h1>404</h1>
            <h2>Página não encontrada!</h2>
            <p>A página que você esta tentando acessar não existe, verifique o endereço e tente novamente!</p>
        </div>
    )
}

export default Custom404

export const getStaticProps:GetStaticProps = async () => {
    const { data: config } = await  axios.get<TYPE_ConfigProps>(`${api}/config`)
  
    return {
        props: {
            config,
        },
        revalidate: config.revalidate
    }
  }
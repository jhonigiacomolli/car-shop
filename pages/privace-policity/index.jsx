import React from 'react'
import Axios from 'axios'
import { api } from '../../api/api'
import Styles from './index.module.css'
import Head from 'next/head'
import PrimaryExternalButton from '../../components/buttons/PrimaryExternalButton'
import { useConfig } from '../../context'
import { RegisterAccess } from '../../functions/RegisterAccess'

const PrivacePolicity = ({ config, setLoading }) => {
    const { setConfig, setPage } = useConfig()
    const [privacePolicity, setPrivacePolicity] = React.useState()

    React.useEffect(() => {
        setLoading(false)
        RegisterAccess()
        setPage('privace')
        setConfig(config)
        setPrivacePolicity(config.privacePolicity.content)
    },[])

    return (
        <React.Fragment>
            <Head>
                <title>{config.siteTitle}</title>
                <meta name="description" content={config.siteDescription}/>
                <link rel="icon" href={config.favIcon} />
            </Head>
            <div className={Styles.contentContainer}>
                <div className={Styles.content}>
                    <h1>POLÍTICAS DE PRIVACIDADE</h1>
                    <div className={Styles.message} dangerouslySetInnerHTML={{__html: privacePolicity}}></div>
                    <p className={Styles.lastModified}>Última atualização em: {config.privacePolicity.lastModified}</p>
                    <p className={Styles.siteTitle}>{config.siteTitle}</p>
                    <PrimaryExternalButton className={Styles.button} link={config.privacePolicity.downloadLink} target={'_blank'}>DOWNLOAD POLITICA DE PRIVACIDADE</PrimaryExternalButton>
                </div>
            </div>
        </React.Fragment>
    )
}

export default PrivacePolicity

export async function getStaticProps() {
    const config = await  Axios(`${api}/config`).then(resp => resp.data)

    return {
        props: {
            config
        },
        revalidate: config.revalidate
    }
}
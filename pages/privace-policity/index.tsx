import axios from 'axios'
import Head from 'next/head'
import { api } from 'api/api'
import { TYPE_ConfigProps } from 'context/context-types'
import { useConfig } from 'context'
import { registerAccess } from 'functions/register-access'
import PrimaryExternalButton from 'components/buttons/primary-external-button'
import Styles from './index.module.css'
import { Fragment, useEffect, useState } from 'react'

type PrivacePolicityProps = {
    config: TYPE_ConfigProps
}
const PrivacePolicity = ({ config }: PrivacePolicityProps) => {
    const { setConfig, setPage, setLoading } = useConfig()
    const [privacePolicity, setPrivacePolicity] = useState('')

    useEffect(() => {
        setLoading(false)
        registerAccess()
        setPage('privace')
        setConfig(config)
        setPrivacePolicity(config.privacePolicity.content)
    },[])

    return (
        <Fragment>
            <Head>
                <title>
                    {config.siteTitle}
                </title>
                <meta name="description" content={config.siteDescription}/>
                <link rel="icon" href={config.favIcon} />
            </Head>
            <div className={Styles.contentContainer}>
                <div className={Styles.content}>
                    <h1>
                        POLÍTICAS DE PRIVACIDADE
                    </h1>
                    <div className={Styles.message} dangerouslySetInnerHTML={{__html: privacePolicity}} />
                    <p className={Styles.lastModified}>
                        Última atualização em: {config.privacePolicity.lastModified}
                    </p>
                    <p className={Styles.siteTitle}>
                        {config.siteTitle}
                    </p>
                    <PrimaryExternalButton 
                        className={Styles.button} 
                        link={config.privacePolicity.downloadLink} 
                        target={'_blank'}
                    >
                        DOWNLOAD POLITICA DE PRIVACIDADE
                    </PrimaryExternalButton>
                </div>
            </div>
        </Fragment>
    )
}

export default PrivacePolicity

export async function getStaticProps() {
    const { data: config } = await  axios.get<TYPE_ConfigProps>(`${api}/config`)

    return {
        props: {
            config
        },
        revalidate: config.revalidate
    }
}
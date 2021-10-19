import React, { Dispatch } from 'react'
import Link from 'next/link'
import { useConfig } from 'context'
import Socials from 'components/socials/socials'
import Styles from './copyright.module.css'

const Copyright = () => {
    const { config, windowWidth, setLoading } = useConfig()
    return (
        <div className={Styles.container}>
            <div className={Styles.copyright}>
                <div className={Styles.copyLeft}> 
                    <div dangerouslySetInnerHTML={{__html: config.copyright ? config.copyright.message : ""}} />
                    {windowWidth > 767 && <p>|</p>}
                    <div><Link href="/privace-policity">Politica de Privacidade</Link></div>
                    {windowWidth > 767 && <p>|</p>}
                    <div onClick={() => setLoading(true)}>
                        <Link href="/admin">
                            Administração
                        </Link>
                    </div>
                </div>
                <div className={Styles.copyRight}>
                    <Socials title={'Siga-nos nas Redes Sociais'} size={'big'} />
                </div>
            </div>
        </div>
    )
}

export default Copyright

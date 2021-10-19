import { useConfig } from 'context'
import { ArrowRight } from 'components/icons'
import Item from './breadcrumb-item'
import Styles from './breadcrumb.module.css'
import { Fragment, useEffect, useState } from 'react'

const Breadcrumb = () => {
    const [url, setUrl] = useState<string[]>([])
    const { config } = useConfig()

    useEffect(() => {
        setUrl(document.URL.split('/'))
    }, [])

    function RenderBreadcrumb() { 
        let itemLink = `${url[0]}//`    
        return url.filter(resp => resp !== "" && resp !== 'http:' && resp !== 'https:')
                    .map((args, argsIndex, argsArray) => {
                        itemLink += `/${args}`
                        return (
                            <Fragment key={argsIndex}>
                                {argsIndex == 0 
                                    ? <Item link={itemLink} text={config.siteTitle} /> 
                                    : <Item  link={itemLink} text={args} />
                                }
                                {argsIndex < (argsArray.length -1) && <div className={Styles.icon}><ArrowRight /></div>}
                            </Fragment>
                        ) 
                    })
    }

    return (
        <div className={Styles.container}>
            <div className={Styles.content}>
            {
                RenderBreadcrumb()
            }
            </div>
        </div>
    )
}

export default Breadcrumb

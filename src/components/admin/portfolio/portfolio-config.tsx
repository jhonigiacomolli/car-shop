import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { TYPE_API_Response, TYPE_ConfigProps } from 'context/context-types'
import PrimarySubmit from 'components/buttons/primary-submit'
import AlertBox from 'components/messages/alert-box'
import MessageBox from 'components/messages/message-box'
import PageHeader from '../page-header'
import Styles from './portfolio-config.module.css'

const PortfolioConfig = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [numberPortfoliosInDetach, setNumberPortfoliosInDetach] = useState(0)
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const {
        config
    } = useConfig()


    useEffect(() => {
        setNumberPortfoliosInDetach(config.portfolio.latestPortfolios.itemsPerPage)
    }, [])

    async function updatePortfolioConfig(event: FormEvent) {
        event.preventDefault()
        setLoading(true)
        const formConfig  = new FormData
        formConfig.append('id', config.id.toString())
        formConfig.append('type', 'portfolio')
        formConfig.append('numberPortfoliosInDetach', `${numberPortfoliosInDetach}`)
        
        try {
            const { data } = await axios.post<TYPE_API_Response<TYPE_ConfigProps>>(`${api}/config`, formConfig, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            })
            setLoading(false)
            if(data.status === 200) {
                setSendResponse('Configurações atualizadas com sucesso')
                setSendStatus(data.status)
                config.portfolio.latestPortfolios.itemsPerPage = data.data.portfolio.latestPortfolios.itemsPerPage
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
            }
        }catch(error: any) {
            setLoading(false)
            setSendStatus(error.status)
            setSendResponse(error.message)
            setTimeout(() => {
                setSendResponse('')
            }, 2000);
        }

    }

    return (
        <div className={theme.content}>
            {alertMessage && (
                <AlertBox 
                    type={alertType} 
                    title={alertTitle} 
                    message={alertMessage} 
                    onConfirm={() => setAlertMessage('')}
                />
            )}
            {sendResponse && (
                <MessageBox 
                    type={sendStatus === 200 ? 'success' : 'error'} 
                    title={sendStatus === 200 ? 'Sucesso!!!' : 'Ops... ocorreu um erro!' } 
                    message={sendResponse}
                />
            )}
            <PageHeader 
                search={false} 
                title={'CONFIGURAÇÕES DO PORTFÓLIO'} 
                description={'Configure as principais caracteristicas do seu portfolio'} 
            />
            <form className={Styles.data} onSubmit={(e) => updatePortfolioConfig(e)}>
                <h2 className={Styles.title}>
                    <p>Numero de itens no Portfólio em destaque</p>
                    <input 
                        type="number" 
                        name="portfolio-duration" 
                        id="portfolio-duration" 
                        value={numberPortfoliosInDetach} 
                        onChange={(e) => setNumberPortfoliosInDetach(Number(e.target.value))} 
                    />
                </h2>
                <div className={Styles.button}>
                    <PrimarySubmit value={'Atualizar configurações'} />
                </div>
            </form>
        </div>
    )
}

export default PortfolioConfig
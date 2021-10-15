import axios from 'axios'
import { api } from 'api/api'
import { Edit, Trash } from 'components/icons'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Portfolio } from 'context/context-types'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { TokenContext } from '..'
import AdminButton from 'components/buttons/AdminButton'
import CheckBox from 'components/checkbox/CheckBox'
import ConfirmBox from 'components/messages/ConfirmBox'
import MessageBox from 'components/messages/MessageBox'
import PageHeader from '../page-header'
import Portfolio from './portfolio'
import PortfolioItem from './portfolio-item'
import Styles from './all-portfolios.module.css'


const AllPortfolios = () => {
    const { loginToken, theme, setLoading, setBodyComponent } = useContext(TokenContext)
    const { searchTerms, portfolios, setPortfolios} = useConfig()
    const [portfolio, setPortfolio] = useState<TYPE_Portfolio[]>([])
    const [massSelection, setMassSelection] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [selectPortfolios, setSelectPortfolios] = useState<string[]>([])
    const [portfolioToDelete, setPortfolioToDelete] = useState<TYPE_Portfolio[]>([])
    const [messageBox, setMessageBox] = useState(false)
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [messageBoxMessage, setMessageBoxMessage] = useState('')
    const [confirmBox, setConfirmBox] = useState(false)

    useEffect(() => {
        const selects = document.querySelectorAll('[ms-portfolio]')
        const newPortfolio =[...selectPortfolios]
        
        for(let i=0; i<selects.length; i++) {
            const selected = selects[i] as HTMLInputElement

            if(selectAll && selects) {
                selected.checked = true
                setSelectPortfolios([...newPortfolio, selected.value])
            }else {
                selected.checked = false
                setSelectPortfolios(newPortfolio.filter(car => car !== selected.value))
            }
        }
    }, [selectAll])
    
    useEffect(() => {
        setPortfolio(
            (searchTerms && searchTerms !== '') 
                ? portfolios.filter(portfolio => portfolio.title.toLowerCase().includes(searchTerms.toLowerCase())) 
                : portfolios
        )
    }, [searchTerms, portfolios])
    
    useEffect(() => {
        portfolioToDelete && portfolioToDelete.length > 0 ? setConfirmBox(true) : setConfirmBox(false)
        portfolioToDelete && portfolioToDelete.length > 1 ? setMessageBoxTitle('Exclusão em massa') : setMessageBoxTitle('Exclusão')
        portfolioToDelete && portfolioToDelete.length > 1 ? setMessageBoxMessage('Deseja excluir permanentemente os portfolio selecionados ?') : setMessageBoxMessage('Deseja excluir permanentemente este portfolio ?')
    }, [portfolioToDelete])

    useEffect(() => {
        setPortfolio(portfolios)
    }, [portfolios])

    function checkPosts(event: ChangeEvent<HTMLInputElement>) {
        const result = event.target as HTMLInputElement
        setSelectPortfolios(
            result.checked 
                ? [...selectPortfolios, result.getAttribute('ms-portfolio') ?? ''] 
                : selectPortfolios.filter(portfolio => portfolio !== result.getAttribute('ms-portfolio'))
        )
    }

    function massVerification(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target as HTMLInputElement
        setMassSelection(checked)
        if(!checked) {
            setSelectAll(false) 
            setSelectPortfolios([])
        }  
    }

    async function portfolioDelete(portfolio: TYPE_Portfolio[]) {
        setConfirmBox(false)
        setLoading(true)

        try {
            const { data } = await axios.delete<TYPE_API_Response<TYPE_Portfolio[]>>(`${api}/portfolio`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${loginToken}`
                },
                data: { 'portfolio': portfolio }
            })
            setLoading(false)
            setMessageBoxMessage(data.message)
            setMessageBoxTitle(data.status === 200 ? 'Sucesso!' : 'Erro!')
            setMessageBoxType(data.status === 200 ? 'success' : 'error')
            setMessageBox(true)
            data.status === 200 && setPortfolios(portfolios.filter(portfolio => !data.data.find(item => item.id === portfolio.id)))
            setTimeout(() => {
                setMessageBox(false)
            }, 1500);
        }catch(error: any) {
            setLoading(false)
            setMessageBox(true)
            setMessageBoxTitle(error.status)
            setMessageBoxType('error')
            setMessageBoxMessage(error.message)
            setTimeout(() => {
                setMessageBoxMessage('')
            }, 2000);
        }
    }

    function massiveDelete() {
        const portfolioDeleted:TYPE_Portfolio[] = []
        document.querySelectorAll('[ms-portfolio]').forEach(portfolio => {
            const actualPortfolio = portfolio as HTMLInputElement
            actualPortfolio.checked === true ?
                portfolios.map(originalPortfolio => originalPortfolio.id === Number(portfolio.getAttribute('ms-portfolio')) && portfolioDeleted.push(originalPortfolio))
            : ''
        })
        console.log(portfolioDeleted);
        setPortfolioToDelete(portfolioDeleted)
    }

    function handleCheck(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target as HTMLInputElement
        setSelectAll(checked)
    }
    
    return (
        <div id={'body'} className={theme.content}>
            {messageBox && (
                <MessageBox 
                    type={messageBoxType}
                    title={messageBoxTitle}
                    message={messageBoxMessage}
                />
            )}
            {confirmBox && (
                <ConfirmBox 
                    title={messageBoxTitle}
                    message={messageBoxMessage}
                    onConfirm={() => portfolioDelete(portfolioToDelete)}
                    onCancel={() => setPortfolioToDelete([])}
                />
            )}
            <PageHeader 
                search 
                title={'SLIDES | SLIDE SHOW'} 
                description=""
            />
            <div className={Styles.options}>
                <p className={Styles.portfolioCount}><span>{portfolio.length}</span> Portfolios encontrados</p>
               <label className={Styles.selectionContainer} htmlFor="mass-selection">
                   <CheckBox id="mass-selection" onChange={massVerification}/>
                    Seleção em massa
                </label>
                {massSelection && <label className={Styles.selectionContainer} htmlFor="selection-all">
                    <CheckBox id="selection-all" onChange={handleCheck} />
                    Selecionar todos
                </label>}
                {selectPortfolios.length > 0 && (
                    <AdminButton link="" label="" icon="" onClick={() => massiveDelete()} >
                        Excluir itens selecionados
                    </AdminButton>
                )}
            </div>
            <div className={Styles.articlesContainer}>
                {portfolio.map(portfolio => {
                    return (
                        <div key={portfolio.id} className={Styles.portfolio}>
                            {massSelection && <label className={Styles.selectionContainer} htmlFor="item-selection">
                                <label htmlFor={`portfolio-${portfolio.id}`}>
                                    <CheckBox 
                                        id={`portfolio-${portfolio.id}`}
                                        initialCheck={selectAll}
                                        ms-portfolio={portfolio.id} 
                                        onChange={checkPosts}
                                    />
                                </label>
                            </label>}
                            <PortfolioItem 
                                portfolio={portfolio}
                            />
                            <div className={Styles.actions}>
                                <AdminButton onClick={() => setBodyComponent(<Portfolio portfolio={portfolio} />)} icon={<Edit />} />
                                <AdminButton onClick={() => setPortfolioToDelete([portfolio])} icon={<Trash />} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllPortfolios

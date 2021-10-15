import { useContext, useEffect, useState } from 'react'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { AccessPerDay, PercentualAccess } from 'functions/AccessData'
import { Google_Chrome, Microsoft_Edge, Mozilla_Firefox, Opera_Browser, Safari_Browser } from 'components/icons'
import { registerLocale } from 'react-datepicker'
import { Doughnut } from 'react-chartjs-2'
import PageHeader from '../page-header'
import DatePicker from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'
import { subDays } from 'date-fns'
import "react-datepicker/dist/react-datepicker.css"
import Styles from './devices.module.css'

const Dashboard = () => {
    const { access } = useContext(TokenContext)
    const { windowWidth } = useConfig()
    const [initialDate, setInitialDate] = useState<Date>(subDays(new Date(), 30))
    const [finalDate, setFinalDate] = useState<Date>(new Date())
    const [period, setPeriod] = useState(0)
    const [pageViewsOfPeriod, setPageViewsOfPeriod] = useState<Number[]>([])
    const [chrome, setChrome] = useState(0)
    const [firefox, setFirefox] = useState(0)
    const [edge, setEdge] = useState(0)
    const [safari, setSafari] = useState(0)
    const [opera, setOpera] = useState(0)
    const [others, setOthers] = useState(0)

    registerLocale('pt-BR', ptBR)

    useEffect(() => {
        setPeriod(((((new Date(finalDate).getTime() - new Date(initialDate).getTime()) / 1000) / 60) / 60) /24)
    }, [initialDate, finalDate])

    useEffect(() => {
        const dataViews:Number[] = []
        for (let i = 0; i <= period; i++) {
            const dayResult = AccessPerDay(access, subDays(new Date(finalDate), (period - i)).toLocaleDateString('pt-BR'),'views')
            if(dayResult.length > 0) {
                dayResult.map(acc => dataViews.push(acc))
            }
        }
        setPageViewsOfPeriod(dataViews)
    }, [access, period, finalDate])

    useEffect(() => {
        setChrome(Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'browser', 'Google Chrome'))))
        setFirefox(Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'browser', 'Mozilla Firefox'))))
        setEdge(Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'browser', 'Microsoft Edge'))))
        setSafari(Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'browser', 'Safari'))))
        setOpera(Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'browser', 'Opera'))))
    }, [pageViewsOfPeriod])

    useEffect(() => {
        setOthers(
            Math.floor(
                Number(
                    100 - (
                        Number(chrome) 
                        + Number(firefox) 
                        + Number(edge) 
                        + Number(safari) 
                        + Number(opera))
                    )
                )
            )
    }, [chrome, firefox, edge, safari, opera])
    
    const data = {
        labels: ['Google Chrome', 'Mozilla Firefox', 'Microsoft Edge', 'Safari', 'Opera'],
        datasets: [
          {
            label: 'Visitantes',
            data: [
                chrome,
                firefox,
                edge,
                safari,
                opera,
                others
            ],
            fill: true,
            backgroundColor: [
                '#6a0785',
                '#ff329d',
                '#ff5d38',
                '#38beff',
                '#683dff',
                'gray'
            ],
            borderColor: '#ffffff00',
        }
        ],
    }

    const options: any = {
        plugins: {
            legend: {
                display: windowWidth > 1240 || (windowWidth > 767 && windowWidth < 991),
                align: 'left',
                position: 'left'
            }
        },
      };

    return (
        <div className={Styles.container}>
            <PageHeader 
                title={'NAVEGADORES'} 
                description={'Métricas dos navegadores utilizados'} 
            />
            <div className={Styles.content}>
                <div className={Styles.filter}>
                    <p>
                        Selecione o período para o qual as métricas devem ser calculadas
                    </p>
                    <div className={Styles.datePicker}>
                        <p>Data inicial: </p> 
                        <DatePicker 
                            locale={'pt-BR'} 
                            dateFormat={'dd MMMM yyyy'} 
                            selected={initialDate} 
                            startDate={initialDate} 
                            endDate={finalDate} 
                            onChange={(date) => date !== null && setInitialDate(new Date(date?.toString()))} 
                        />
                    </div>
                    <div className={Styles.datePicker}>
                        <p>Data Final: </p>
                        <DatePicker 
                            locale={'pt-BR'} 
                            dateFormat={'dd MMMM yyyy'} 
                            selected={finalDate} 
                            startDate={initialDate} 
                            endDate={finalDate} 
                            onChange={(date) => date !== null && setFinalDate(new Date(date?.toString()))} 
                        />
                    </div>
                </div>
                <div className={Styles.general}>
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <Google_Chrome />
                            <h3>Google Chrome</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${chrome} %`}</p>
                            </span>
                        </div>
                    </div>
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <Mozilla_Firefox />
                            <h3>Mozilla Firefox</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${firefox} %`}</p>
                            </span>
                        </div>
                    </div>                    
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <Microsoft_Edge />
                            <h3>Microsoft Edge</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${edge} %`}</p>
                            </span>
                        </div>
                    </div>
                </div>
                <div className={Styles.general}>
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <Safari_Browser />
                            <h3>Safari Browser</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${safari} %`}</p>
                            </span>
                        </div>
                    </div>
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <Opera_Browser />
                            <h3>Opera Browser</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${opera} %`}</p>
                            </span>
                        </div>
                    </div>
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <h3>Outros Navegadores</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${others} %`}</p>
                            </span>
                        </div>
                    </div>
                </div>
                <div className={Styles.chartContainer}>
                    <div className={Styles.chart}>
                        <Doughnut data={data} options={options}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

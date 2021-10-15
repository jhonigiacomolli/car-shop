import { useContext, useEffect, useState } from 'react'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { Doughnut } from 'react-chartjs-2'
import { registerLocale } from 'react-datepicker'
import { Apple_Icon, Linux_Icon, Windows_Icon } from 'components/icons'
import { subDays } from 'date-fns'
import { AccessPerDay, PercentualAccess } from 'functions/AccessData'
import DatePicker from 'react-datepicker'
import PageHeader from '../page-header'
import ptBR from 'date-fns/locale/pt-BR'
import  "react-datepicker/dist/react-datepicker.css"
import Styles from './devices.module.css'

const Dashboard = () => {
    const { access } = useContext(TokenContext)
    const { windowWidth } = useConfig()
    const [initialDate, setInitialDate] = useState<Date>(subDays(new Date(), 30))
    const [finalDate, setFinalDate] = useState<Date>(new Date())
    const [period, setPeriod] = useState(0)
    const [pageViewsOfPeriod, setPageViewsOfPeriod] = useState<Number[]>([])
    const [windows, setWindows] = useState(0)
    const [mac, setMac] = useState(0)
    const [linux, setLinux] = useState(0)
    const [unix, setUnix] = useState(0)

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
        setWindows(
            Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'os', 'Windows 10')) +
                        Number(PercentualAccess(pageViewsOfPeriod, 'os', 'Windows 8')) +
                        Number(PercentualAccess(pageViewsOfPeriod, 'os', 'Windows 7')) + 
                        Number(PercentualAccess(pageViewsOfPeriod, 'os', 'Windows Vista')) +
                        Number(PercentualAccess(pageViewsOfPeriod, 'os', 'Windows XP')) +
                        Number(PercentualAccess(pageViewsOfPeriod, 'os', 'Windows 2000')))
        )
        setMac(Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'os', 'Mac/iOS'))))
        setLinux(Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'os', 'Linux'))))
        setUnix(Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'os', 'UNIX'))))
    }, [pageViewsOfPeriod])
    
    const data = {
        labels: ['Windows', 'MAC | iOS', 'Linux', 'Unix'],
        datasets: [
          {
            label: 'Visitantes',
            data: [
                windows,
                mac,
                linux,
                unix
            ],
            fill: true,
            backgroundColor: [
                '#6a0785',
                '#683dff',
                '#ff329d',
                '#ff5d38',
                '#38beff',
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
                title={'SISTEMA OPERACIONAL'} 
                description={'Métricas dos sistemas operacionais utilizados'} 
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
                            <Windows_Icon />
                            <h3>Windows</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${windows} %`}</p>
                            </span>
                        </div>
                    </div>
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <Apple_Icon />
                            <h3>MAC | iOS</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${mac} %`}</p>
                            </span>
                        </div>
                    </div>                    
                </div>
                <div className={Styles.general}>                 
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <Linux_Icon />
                            <h3>Linux</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${linux} %`}</p>
                            </span>
                        </div>
                    </div>
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <h3>Unix</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${unix} %`}</p>
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

import { useContext, useEffect, useState } from 'react'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { subDays } from 'date-fns'
import { Doughnut } from 'react-chartjs-2'
import { registerLocale } from 'react-datepicker'
import { AccessPerDay, PercentualAccess } from 'functions/AccessData'
import { Desktop, Mobile, Tablet } from 'components/icons'
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
    const [pageViewsOfPeriod, setPageViewsOfPeriod] = useState<number[]>([])
    const [mobile, setMobile] = useState(0)
    const [tablet, setTablet] = useState(0)
    const [desktop, setDesktop] = useState(0)

    registerLocale('pt-BR', ptBR)

    useEffect(() => {
        setPeriod(((((new Date(finalDate).getTime() - new Date(initialDate).getTime()) / 1000) / 60) / 60) /24)
    }, [initialDate, finalDate])

    useEffect(() => {
        const dataViews: number[] = []
        for (let i = 0; i <= period; i++) {
            const dayResult = AccessPerDay(access, subDays(new Date(finalDate), (period - i)).toLocaleDateString('pt-BR'),'views')
            if(dayResult.length > 0) {
                dayResult.map(acc => dataViews.push(acc))
            }
        }
        setPageViewsOfPeriod(dataViews)
    }, [period, access, finalDate])

    useEffect(() => {
        setMobile(Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'device', 'Mobile'))))
        setTablet(Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'device', 'Tablet'))))
        setDesktop(Math.round(Number(PercentualAccess(pageViewsOfPeriod, 'device', 'Desktop'))))
    }, [pageViewsOfPeriod])
    
    const data = {
        labels: ['Desktop', 'Tablet', 'Celular'],
        datasets: [
          {
            label: 'Visitantes',
            data: [
                desktop,
                tablet,
                mobile,
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
                title={'DISPOSITIVOS'} 
                description={'Métricas dos dispositivos utilizados'} 
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
                            <Desktop />
                            <h3>Desktop</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${desktop} %`}</p>
                            </span>
                        </div>
                    </div>
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <Tablet />
                            <h3>Tablet</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${tablet} %`}</p>
                            </span>
                        </div>
                    </div>                    
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <Mobile />
                            <h3>Celular</h3>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Acessos</p> 
                                <p className={Styles.result}>{`${mobile} %`}</p>
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

import { useContext, useEffect, useState } from 'react'
import { Line  } from 'react-chartjs-2'
import { TokenContext } from '..'
import { registerLocale } from 'react-datepicker'
import { Desktop, Eye, LinkIcon, PageViews, Users } from 'components/icons'
import { AccessPerDay } from 'functions/AccessData'
import { subDays } from 'date-fns'
import DatePicker from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'
import PageHeader from '../page-header'
import  "react-datepicker/dist/react-datepicker.css"
import Styles from './access.module.css'

type VisitedPages = {
    url: string
    access: number
}
const Dashboard = () => {
    const { access, theme } = useContext(TokenContext)
    const [initialDate, setInitialDate] = useState<Date>(subDays(new Date(), 30))
    const [finalDate, setFinalDate] = useState<Date>(new Date())
    const [period, setPeriod] = useState(0)
    const [visitorsOfPeriod, setVisitorsOfPeriod] = useState<number>()
    const [pageViewsOfPeriod, setPageViewsOfPeriod] = useState<number>()
    const [chartLabels, setChartLabels] = useState<string[]>([])
    const [chartDataVisits, setChartDataVisits] = useState<number[]>([])
    const [chartDataViews, setChartDataViews] = useState<number[]>([])
    const [visitedPages, setVisitedPages] = useState<VisitedPages[]>([])

    registerLocale('pt-BR', ptBR)

    useEffect(() => {
        const time = ((((new Date(finalDate).getTime() - new Date(initialDate).getTime()) / 1000) / 60) / 60) /24
        setPeriod(time)
    }, [initialDate, finalDate])

    useEffect(() => {
        const labels = []
        const dataVisits = []
        const dataViews = []
        setVisitedPages(
            access
            .filter((item, index, arr) => index === arr.findIndex(it => it.url === item.url))
            .map(item => ({
                url: item.url,
                access: access.reduce((acc, it) => item.url === it.url ? acc + 1 : acc, 0)
            }))
        )
        for (let i = 0; i <= period; i++) {
            labels.push(subDays(new Date(finalDate), period - i).toLocaleDateString('pt-BR'))
            dataVisits.push(AccessPerDay(access, subDays(new Date(finalDate).getTime(), period - i).toLocaleDateString('pt-BR'),'visit').length)
            dataViews.push(AccessPerDay(access, subDays(new Date(finalDate).getTime(), period - i).toLocaleDateString('pt-BR'),'views').length)
        }
        try {
            labels && setChartLabels(labels)
            dataVisits && setChartDataVisits(dataVisits)
            dataViews && setChartDataViews(dataViews)
            dataVisits && setVisitorsOfPeriod(dataVisits.reduce((acc, item) => acc + item))
            dataViews && setPageViewsOfPeriod(dataViews.reduce((acc, item) => acc + item))
        }catch {
            return
        }
    }, [period, finalDate, access])
    
    const data = {
        labels: chartLabels,
        datasets: [
          {
            label: 'Visitantes',
            data: chartDataVisits,
            fill: true,
            backgroundColor: '#ee8cff30',
            borderColor: '#c800ff',
        },
        {
            label: 'Visualizações',
            data: chartDataViews,
            fill: true,
            backgroundColor: theme.content.includes('dark') ? '#ffffff10' : '#00000010',
            borderColor: theme.content.includes('dark') ? '#ffffff50' : '#00000050',
          }
        ],
    }    

    const options: any = {
        scales: {
            yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
    }

    const urls = access.filter((item, index, arr) => {
        return index === arr.findIndex(it => it.url === item.url)
    }).map(item => item.url)    
    
    return (
        <div className={Styles.container}>
            <PageHeader 
                title={'ACESSOS'} 
                description={'Métricas dos visitantes e visualizações'} 
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
                            <h3>Visitantes</h3>
                            <Users color1={'var(--color-primary)'} color2={'var(--color-subtitle)'}/>
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Visitantes no período</p> 
                                <p className={Styles.result}>{visitorsOfPeriod}</p>
                            </span>
                        </div>
                    </div>
                    <div className={Styles.generalItem}>
                        <div className={Styles.itemHeader}>
                            <h3>Páginas visitadas</h3>
                            <PageViews />
                        </div>
                        <div className={Styles.data}>
                            <span>
                                <p>Páginas visitadas no período</p> 
                                <p className={Styles.result}>{pageViewsOfPeriod}</p>
                            </span>
                        </div>
                    </div>
                </div>
                <div className={Styles.chart}>
                    <Line data={data} options={options} height={80}/>
                </div>
                <div className={Styles.pages}>
                    <h3>Páginas mais acessadas</h3>
                    <div>
                        {
                            [...visitedPages].sort((a, b) => {
                                if (a.access < b.access) {
                                  return 1;
                                }
                                if (a.access > b.access) {
                                  return -1;
                                }
                                return 0
                            }).map(item => (
                                <div key={item.url}  className={Styles.pagesData}>
                                    <span className={Styles.view}>
                                        <Eye/>
                                        {item.access}
                                    </span>
                                    <p className={Styles.page}>
                                        <Desktop />
                                        {item.url.split('/')[3] ?item.url.split('/')[3] : 'Página Inicial'}
                                    </p>
                                    <a className={Styles.link} href={item.url} target="_blank" rel="noopener noreferrer" >
                                        <LinkIcon />
                                        {item.url}
                                    </a>
                                </div>
                            ))
                        }
                    </div>   
                </div>
            </div>
        </div>
    )
}

export default Dashboard

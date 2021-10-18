import { useContext, useEffect, useState } from 'react'
import { TokenContext } from '..'
import { Line, Doughnut } from 'react-chartjs-2'
import { Apple_Icon, Desktop, Google_Chrome, Linux_Icon, Microsoft_Edge, Mobile, Mozilla_Firefox, Opera_Browser, Safari_Browser, Tablet, Windows_Icon } from '../../icons'
import { accessPerDay, percentualAccess } from 'functions/access-data'
import { subDays } from 'date-fns'
import PageHeader from '../page-header'
import Styles from './dashboard.module.css'
import { TYPE_Access } from 'context/context-types'

const Dashboard = () => {
    const { access, user, theme } = useContext(TokenContext)
    const [chartLabels, setChartLabels] = useState<string[]>([])
    const [accessOfMonth, setAccessOfMonth] = useState<TYPE_Access[]>([])
    const [accessOfWeek, setAccessOfWeek] = useState<number[]>([])
    const [visitsOfWeek, setVisitsOfWeek] = useState<number[]>([])
    const [visitorsOfDay, setVisitorOfDay] = useState<number>(0)
    const [visitorsOfWeek, setVisitorOfWeek] = useState<number>(0)
    const [visitorsOfMonth, setVisitorOdMonth] = useState<number>(0)
    const [pageViewsOfDay, setPageViewsOfDay] = useState<number>(0)
    const [pageViewsOfWeek, setPageViewsOfWeek] = useState<number>(0)
    const [pageViewsOfMonth, setPageViewsOfMonth] = useState<number>(0)

    useEffect(() => {
        const labels = []
        const dataVisitsOfDay = []
        const dataVisitsOfWeek = []
        const dataVisitsOfMonth = []
        const dataViewsOfDay = []
        const dataViewsOfWeek = []
        const dataViewsOfMonth = []
        const monthAccess = []

        for(let i = 0; i <= 30; i++) {
            let date = subDays(new Date(), (30 - i)).toLocaleDateString('pt-BR')
            if(i > 23 && i <= 30) {
                labels.push(date)
                dataVisitsOfWeek.push(accessPerDay(access, date,'visit').length)
                dataViewsOfWeek.push(accessPerDay(access, date,'views').length)
            }
            if(i === 30) {
                dataVisitsOfDay.push(accessPerDay(access, date,'visit').length)
                dataViewsOfDay.push(accessPerDay(access, date,'views').length)
            }
            if(accessPerDay(access, date,'views') !== []) {
                monthAccess.push(...accessPerDay(access, date,'views'))
            }
            dataVisitsOfMonth.push(accessPerDay(access, date,'visit').length)
            dataViewsOfMonth.push(accessPerDay(access, date,'views').length)
        }
        try {
            setChartLabels(labels)
            setVisitorOfDay(dataVisitsOfDay.reduce((acc, item) => acc + item))
            setVisitorOfWeek(dataVisitsOfWeek.reduce((acc, item) => acc + item))
            setVisitorOdMonth(dataVisitsOfMonth.reduce((acc, item) => acc + item))
            setVisitsOfWeek(dataViewsOfWeek)
            setPageViewsOfDay(dataViewsOfDay.reduce((acc, item) => acc + item))
            setPageViewsOfWeek(dataViewsOfWeek.reduce((acc, item) => acc + item))
            setPageViewsOfMonth(dataViewsOfMonth.reduce((acc, item) => acc + item))
            setAccessOfWeek(dataViewsOfWeek)
            setAccessOfMonth(monthAccess)
        }catch {
            return
        }
    }, [access])
    
    const visitorData = {
        labels: chartLabels,
        datasets: [
          {
            label: 'Visitantes',
            data: visitsOfWeek,
            fill: true,
            backgroundColor: '#ee8cff30',
            borderColor: '#c800ff',
        }
        ],
    }

    const viewsData = {
        labels: chartLabels,
        datasets: [
          {
            label: 'Páginas visitadas',
            data: accessOfWeek,
            fill: true,
            backgroundColor: theme.content.includes('dark') ? '#ffffff30' : '#00000030',
            borderColor: theme.content.includes('dark') ? '#ffffff50' : '#00000050',
        }
        ],
    }

    const navigatorData = {
        labels: [
            'Google Chrome',
            'Mozilla Firefox',
            'Microsoft Edge',
            'Safari',
            'Opera',
            'Outros',
        ],
        datasets: [
          {
            label: 'Visitantes',
            data: [
                Math.round(Number(percentualAccess(accessOfMonth, 'browser', 'Google Chrome'))),
                Math.round(Number(percentualAccess(accessOfMonth, 'browser', 'Mozilla Firefox'))),
                Math.round(Number(percentualAccess(accessOfMonth, 'browser', 'Microsoft Edge'))),
                Math.round(Number(percentualAccess(accessOfMonth, 'browser', 'Safari'))),
                Math.round(Number(percentualAccess(accessOfMonth, 'browser', 'Opera'))),
                Math.round(Number(percentualAccess(accessOfMonth, 'browser', 'Outro'))),
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

    const devicesData = {
        labels: [
            'Desktop',
            'Tablet',
            'Celular',
        ],
        datasets: [
            {
                label: 'Visitantes',
                data: [
                    Math.round(Number(percentualAccess(accessOfMonth, 'device', 'Desktop'))),
                    Math.round(Number(percentualAccess(accessOfMonth, 'device', 'Tablet'))),
                    Math.round(Number(percentualAccess(accessOfMonth, 'device', 'Mobile'))),
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

    const operationSystemData = {
        labels: [
            'Windows',
            'MAC, iOS',
            'Linux',
            'Unix',
        ],
        datasets: [
            {
                label: 'Visitantes',
                data: [
                    (
                        Math.round(Number (
                            Number(percentualAccess(accessOfMonth, 'os', 'Windows 10')) +
                            Number(percentualAccess(accessOfMonth, 'os', 'Windows 8')) +
                            Number(percentualAccess(accessOfMonth, 'os', 'Windows 7')) + 
                            Number(percentualAccess(accessOfMonth, 'os', 'Windows Vista')) +
                            Number(percentualAccess(accessOfMonth, 'os', 'Windows XP')) +
                            Number(percentualAccess(accessOfMonth, 'os', 'Windows 2000'))
                        ))
                    ),
                    Math.round(Number(percentualAccess(accessOfMonth, 'os', 'Mac/iOS'))),
                    Math.round(Number(percentualAccess(accessOfMonth, 'os', 'Linux'))),
                    Math.round(Number(percentualAccess(accessOfMonth, 'os', 'UNIX'))),
                ],
                fill: true,
                backgroundColor: [
                    '#6a0785',
                    '#683dff',
                    '#ff329d',
                    '#ff5d38',
                ],
                borderColor: '#ffffff00',
            }
        ],
    }

    const options: any = {
        plugins: {
            legend: {
                display: false,
                align: 'left',
                position: 'bottom'
            }
        },
    }

    return (
        <div className={Styles.container}>
            <PageHeader  
                title={'DASHBOARD'} 
                description={'Resumo das principais métricas da sua plataforma'} 
            />
            <div className={Styles.content}>
                <h1><p>Bem vindo </p>{user?.name}</h1>
                <p>Este é o seu painel administrativo, aqui você consegue gerenciar todos os recursos do seu site com poucos cliques. Logo abaixo você encontra as principais metricas geradas com os dados dos usuários que navegaram pelo seu site nos ultimos 30 dias.</p>
                <div className={Styles.access}>
                    <div className={Styles.accessItem}>
                        <h3>Visitantes</h3>
                        <div className={Styles.data}>
                            <span>
                                <p>Hoje</p> 
                                <p className={Styles.result}>{visitorsOfDay}</p>
                            </span>
                            <span>
                                <p>Ultimos 7 dias</p> 
                                <p className={Styles.result}>{visitorsOfWeek}</p>
                            </span>
                            <span>
                                <p>Ultimos 30 dias</p> 
                                <p className={Styles.result}>{visitorsOfMonth}</p>
                            </span>

                        </div>
                        <div className={Styles.chart}>
                            <Line data={visitorData} options={options}/>
                        </div>
                    </div>
                    <div className={Styles.accessItem}>
                        <h3>Páginas visitadas</h3>
                        <div className={Styles.data}>
                            <span>
                                <p>Hoje</p> 
                                <p className={Styles.result}>{pageViewsOfDay}</p>
                            </span>
                            <span>
                                <p>Ultimos 7 dias</p> 
                                <p className={Styles.result}>{pageViewsOfWeek}</p>
                            </span>
                            <span>
                                <p>Ultimos 30 dias</p> 
                                <p className={Styles.result}>{pageViewsOfMonth}</p>
                            </span>
                        </div>
                        <div className={Styles.chart}>
                            <Line data={viewsData} options={options}/>
                        </div>
                    </div>
                </div>
                <div className={Styles.general}>
                    <div className={Styles.generalItem}>
                        <div className={Styles.dataContainer}>
                            <div className={Styles.data}>
                                <h2>Dispositivos</h2>
                                <p>Quais dispositivos os usuários estavam utilizando quando acessaram o seu site nos ultimos 30 dias</p>
                                <div>
                                    <span>
                                        <Desktop />
                                        <p>Desktop</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'device', 'Desktop', true)}</p>
                                    </span>
                                    <span>
                                        <Tablet />
                                        <p>Tablet</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'device', 'Tablet', true)}</p>
                                    </span>
                                    <span>
                                        <Mobile />
                                        <p>Celular</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'device', 'Mobile', true)}</p>
                                    </span>
                                </div>
                            </div>
                            <div className={Styles.chartContainer}>
                                <div className={Styles.pieChart}>
                                    <Doughnut data={devicesData} options={options}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={Styles.generalItem}>
                        <div className={Styles.dataContainer}>
                            <div className={Styles.data}>
                                <h2>Navegadores</h2>
                                <p>Qual o navegador que os usuários estavam utilizando quando acessaram o seu site nos ultimos 30 dias</p>
                                <div>
                                    <span>
                                        <Google_Chrome />
                                        <p>Google Chrome</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'browser', 'Google Chrome', true)}</p>
                                    </span>
                                    <span>
                                        <Mozilla_Firefox />
                                        <p>Mozilla Firefox</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'browser', 'Mozilla Firefox', true)}</p>
                                    </span>
                                    <span>
                                        <Microsoft_Edge />
                                        <p>Microsoft Edge</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'browser', 'Microsoft Edge', true)}</p>
                                    </span>
                                    <span>
                                        <Safari_Browser />
                                        <p>Safari</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'browser', 'Safari', true)}</p>
                                    </span>
                                    <span>
                                        <Opera_Browser />
                                        <p>Opera</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'browser', 'Opera', true)}</p>
                                    </span>
                                    <span>
                                        <p></p>
                                        <p>Outros</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'browser', 'Outro', true)}</p>
                                    </span>
                                </div>
                            </div>
                            <div className={Styles.chartContainer}>
                                <div className={Styles.pieChart}>
                                    <Doughnut data={navigatorData} options={options}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={Styles.generalItem}>
                        <div className={Styles.dataContainer}>
                            <div className={Styles.data}>
                                <h2>Sistemas Operacionais</h2>
                                <p>Quais sistema operacional os usuários estavam utilizando em suas máquinas quando acessaram o seu site nos ultimos 30 dias</p>
                                <div>
                                    <span>
                                        <Windows_Icon />
                                        <p>Windows</p> 
                                        <p className={Styles.result}>{
                                            `${Number(  
                                                    Number(percentualAccess(accessOfMonth, 'os', 'Windows 10')) +
                                                    Number(percentualAccess(accessOfMonth, 'os', 'Windows 8')) +
                                                    Number(percentualAccess(accessOfMonth, 'os', 'Windows 7')) + 
                                                    Number(percentualAccess(accessOfMonth, 'os', 'Windows Vista')) +
                                                    Number(percentualAccess(accessOfMonth, 'os', 'Windows XP')) +
                                                    Number(percentualAccess(accessOfMonth, 'os', 'Windows 2000'))
                                                ).toFixed(0)} %`
                                            }</p>
                                    </span>
                                    <span>
                                        <Apple_Icon />
                                        <p>MAC | iOS</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'os', 'Mac/iOS', true)}</p>
                                    </span>
                                    <span>
                                        <Linux_Icon />
                                        <p>Linux</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'os', 'Linux', true)}</p>
                                    </span>
                                    <span>
                                        <p></p>
                                        <p>Unix</p> 
                                        <p className={Styles.result}>{percentualAccess(accessOfMonth, 'os', 'UNIX', true)}</p>
                                    </span>
                                </div>
                            </div>
                            <div className={Styles.chartContainer}>
                                <div className={Styles.pieChart}>
                                    <Doughnut data={operationSystemData} options={options}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

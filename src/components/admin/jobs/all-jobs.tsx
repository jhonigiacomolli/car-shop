import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { Edit, Trash } from 'components/icons'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Jobs, TYPE_Message_Types } from 'context/context-types'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import AdminButton from 'components/buttons/AdminButton'
import CheckBox from 'components/checkbox/CheckBox'
import ConfirmBox from 'components/messages/ConfirmBox'
import MessageBox from 'components/messages/MessageBox'
import PageHeader from '../page-header'
import Job from './job'
import JobItem from './job-item'
import Styles from './all-jobs.module.css'


const AllJobs = () => {
    const { loginToken, theme, setLoading, setBodyComponent } = useContext(TokenContext)
    const { searchTerms, config, setConfig, jobs, setJobs} = useConfig()
    const [allJobs, setAllJobs] = useState<TYPE_Jobs[]>([])
    const [massSelection, setMassSelection] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [selectJobs, setSelectJobs] = useState<string[]>([])
    const [jobToDelete, setJobToDelete] = useState<TYPE_Jobs[]>([])
    const [messageBox, setMessageBox] = useState(false)
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [messageBoxMessage, setMessageBoxMessage] = useState('')
    const [confirmBox, setConfirmBox] = useState(false)

    useEffect(() => {
        const selects = document.querySelectorAll('[ms-job]')
        const newJob =[...selectJobs]
        
        for(let i=0; i<selects.length; i++) {
            const selected = selects[i] as HTMLInputElement

            if(selectAll && selects) {
                selected.checked = true
                setSelectJobs([...newJob, selected.value])
            }else {
                selected.checked = false
                setSelectJobs(newJob.filter(car => car !== selected.value))
            }
        }
    }, [selectAll])
    
    useEffect(() => {
        setAllJobs(
            (searchTerms && searchTerms !== '') 
                ? jobs.filter(job => job.title.toLowerCase().includes(searchTerms.toLowerCase())) 
                : jobs
        )
    }, [searchTerms, jobs])
    
    useEffect(() => {
        jobToDelete && jobToDelete.length > 0 ? setConfirmBox(true) : setConfirmBox(false)
        jobToDelete && jobToDelete.length > 1 ? setMessageBoxTitle('Exclusão em massa') : setMessageBoxTitle('Exclusão')
        jobToDelete && jobToDelete.length > 1 ? setMessageBoxMessage('Deseja excluir permanentemente as vagas selecionadas ?') : setMessageBoxMessage('Deseja excluir permanentemente esta vaga ?')
    }, [jobToDelete])

    useEffect(() => {
        setAllJobs(jobs)
    }, [jobs])

    function checkPosts(event: ChangeEvent<HTMLInputElement>) {
        const result = event.target
        setSelectJobs(
            result.checked 
                ? [...selectJobs, result.getAttribute('ms-job') ?? ''] 
                : selectJobs.filter(job => job !==  result.getAttribute('ms-job'))
        )
    }

    function massVerification(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target
        setMassSelection(checked)
        if(!checked) {
            setSelectAll(false) 
            setSelectJobs([])
        }  
    }
    

    async function jobDelete(job: TYPE_Jobs[]) {
        setConfirmBox(false)
        setLoading(true)

        try {
            const { data } = await axios.delete<TYPE_API_Response<TYPE_Jobs[]>>(`${api}/jobs`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${loginToken}`
                },
                data: { 'jobs': job }
            })
            setLoading(false)
            setMessageBoxMessage(data.message)
            setMessageBoxTitle(data.status === 200 ? 'Sucesso!' : 'Erro!')
            setMessageBoxType(data.status === 200 ? 'success' : 'error')
            setMessageBox(true)
            setJobs([...jobs.filter(job => !data.data.find(item => item.id === job.id))])
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
        const jobsDeleted:TYPE_Jobs[] = []
        document.querySelectorAll('[ms-job]').forEach(job => {
            const actualJob = job as HTMLInputElement
            actualJob.checked === true ?
            allJobs.map(originalJob => originalJob.id === Number(job.getAttribute('ms-job')) && jobsDeleted.push(originalJob))
            : ''
        })
        setJobToDelete(jobsDeleted)
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
                    onConfirm={() => jobDelete(jobToDelete)}
                    onCancel={() => setJobToDelete([])}
                />
            )}
            <PageHeader 
                search 
                title={'SLIDES | SLIDE SHOW'} 
                description=""
            />
            <div className={Styles.options}>
                <p className={Styles.jobsCount}><span>{allJobs.length}</span> Jobs encontrados</p>
               <label className={Styles.selectionContainer} htmlFor="mass-selection">
                   <CheckBox id="mass-selection" onChange={massVerification}/>
                    Seleção em massa
                </label>
                {massSelection && <label className={Styles.selectionContainer} htmlFor="selection-all">
                    <CheckBox id="selection-all" onChange={handleCheck} />
                    Selecionar todos
                </label>}
                {selectJobs.length > 0 && (
                    <AdminButton link="" label="" icon="" onClick={() => massiveDelete()} >
                        Excluir itens selecionados
                    </AdminButton>
                )}
            </div>
            <div className={Styles.articlesContainer}>
                {allJobs.map(job => {
                    return (
                        <div key={job.id} className={Styles.job}>
                            {massSelection && <label className={Styles.selectionContainer} htmlFor="item-selection">
                                <label htmlFor={`job-${job.id}`}>
                                    <CheckBox 
                                        id={`job-${job.id}`}
                                        initialCheck={selectAll}
                                        ms-job={job.id} 
                                        onChange={checkPosts}
                                    />
                                </label>
                            </label>}
                            <JobItem job={job}/>
                            <div className={Styles.actions}>
                                <AdminButton onClick={() => setBodyComponent(<Job job={job} />)} icon={<Edit />} />
                                <AdminButton onClick={() => setJobToDelete([job])} icon={<Trash />} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllJobs

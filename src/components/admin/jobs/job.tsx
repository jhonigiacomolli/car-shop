import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Jobs } from 'context/context-types'
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { PictureAdd } from 'components/icons'
import PrimarySubmit from 'components/admin/buttons/primary-submit'
import CheckBox from 'components/checkbox/check-box'
import AlertBox from 'components/admin/messages/alert-box'
import MessageBox from 'components/admin/messages/message-box'
import TextEditor from 'components/admin/text-editor/text-editor'
import PageHeader from '../page-header'
import Styles from './job.module.css'

type SlideProps = {
    job?: TYPE_Jobs
}
const Job = ({ job }: SlideProps) => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const { jobsTaxonomies, config, jobs, setJobs } = useConfig()
    const [file, setFile] = useState<File>()
    const [fileThumbnail, setFileThumbnail] = useState('')
    const [slug, setSlug] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [sector, setSector] = useState('')
    const [expirience, setExpirience] = useState('')
    const [type, setType] = useState('')
    const [skills, setSkills] = useState('')
    const [careerLevel, setCareerLevel] = useState('')
    const [gender, setGender] = useState('')
    const [prerequisites, setPrerequisites] = useState<string[]>([])
    const [remunerationType, setRemunerationType] = useState('')
    const [remuneration, setRemuneration] = useState(0)
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')

    useEffect(() => {
        previewRender()
    }, [file])

    useEffect(() => {
        if(job) {
            setSlug(job.slug)
            setTitle(job.title) 
            setDescription(job.description) 
            setSector(job.sector)
            setType(job?.type)
            setSkills(job.skills)
            setCareerLevel(job.careerLevel)
            setGender(job.gender)
            setRemunerationType(job.remunerationType)
            setRemuneration(job.remuneration)
            setFileThumbnail(job.image)
            setPrerequisites(job.prerequisites)
        }else {
            clearForm()
        }
        
        return () => {
            clearForm()
        }
    }, [job])
    
    useEffect(() => {
        const img = document.getElementById('preview')
        fileThumbnail && img && img.setAttribute('src', fileThumbnail)
    }, [fileThumbnail] )

    function previewRender(){
        if(file) {
            const reader = new FileReader()
            const img = document.getElementById('preview')
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const data = event.target?.result
                data && img?.setAttribute('src', data.toString())
            }
            reader.readAsDataURL(file)
        }
    }
    
    function removePreview() {
        const img = document.getElementById('preview') as HTMLImageElement
        const input = document.getElementById('file') as HTMLInputElement
        img && img.removeAttribute('src') 
        input.value = ''
        setFile(undefined)
        setFileThumbnail('')
    }

    

    async function createJob(event:FormEvent) {
        event.preventDefault()
    
        if (title && description) {
            setLoading(true)
            const checkboxes = document.querySelectorAll('[data-js="pre-requisites"]') as NodeListOf<HTMLInputElement>
            const requesites: string[] = []
            checkboxes.forEach(item => {
                item.checked && requesites.push(item.getAttribute('data-value') ?? '')
            })
            
            const headers = new FormData
            job && headers.append('id', job.id.toString())
            headers.append('slug', slug)
            headers.append('title', title)
            headers.append('description', description)
            headers.append('sector', sector)
            headers.append('type', type)
            headers.append('skills', skills)
            headers.append('careerLevel', careerLevel)
            headers.append('gender', gender)
            headers.append('prerequisites', requesites.toString())
            headers.append('remunerationType', remunerationType)
            headers.append('remuneration', remuneration.toString())
            headers.append('cover', file ? file : fileThumbnail)
            
            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Jobs>>(`${api}/jobs`, headers, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                console.log(data);
                
                setSendStatus(data.status)
                setSendResponse(data.message)
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
                if(data.status === 200 && job){
                    setJobs(jobs.map(jb => jb.id === data.data.id ? data.data : jb))
                }
                if(data.status === 200 && !job) {
                    setJobs([data.data, ...jobs])
                    clearForm()
                }
                setFile(undefined)
                setFileThumbnail(data.data.image)
            }catch(error: any) {
                setLoading(false)
                setSendStatus(error.status)
                setSendResponse(error.message)
                setTimeout(() => {
                    setSendResponse('')
                }, 2000);
            }

        }else {
            setAlertType('warning')
            setAlertTitle('Dados incompletos')
            setAlertMessage('Os campos Título e Descrição são obirgatórios, preencha-os e tente novamente')
        }
    }

    function handleChangeFile(event: ChangeEvent) {
        const { files } = event.target as HTMLInputElement
        files && setFile(files[0])
    }

    function clearForm() {
        setSlug('')
        setTitle('') 
        setDescription('<p><br></p>') 
        setSector('')
        setType('')
        setSkills('<p><br></p>')
        setPrerequisites([])
        setCareerLevel('')
        setGender('')
        setRemunerationType('')
        setRemuneration(0)
        setFileThumbnail('')
        const checkboxes = document.querySelectorAll('[data-js="pre-requisites"]') as NodeListOf<HTMLInputElement>
        checkboxes.forEach(item => !item.checked)
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
                title={job ? 'ATUALIZAR SLIDE' : 'NOVO SLIDE'} 
                description={job ? 'Atualize as informações do seu job show' : 'Crie job shows incríveis para o seu público'} 
            />
            <form className={Styles.data} onSubmit={createJob}>
                {config.jobs.jobImageType === 'job' && (
                    <>
                        <div className={Styles.coverHeader}>
                            <div className={Styles.coverTitle}>
                                <h2 className={Styles.title}>Imagem de background</h2>
                                <p>Envie uma imagem para ilustrar a sua vaga, caso nenhuma imagem seja inserida e a exibição de imagem estiver habilitada nas configurações de vagas, sera exibida a sua logomarca.</p>
                            </div>
                            <label className={Styles.personalInputFile} htmlFor="file">
                                <input type="file" id={'file'} name={'file'} accept=".jpeg, .jpg, .png, .bmp, .img" onChange={(e) => handleChangeFile(e)} />
                            </label>
                        </div>
                        <div className={Styles.previewContainer}>
                            <label htmlFor={'file'} className={Styles.coverPreview}>
                                {(file || fileThumbnail) && <img id="preview" className={Styles.preview} />}
                                {(!file && !fileThumbnail) && <PictureAdd />}
                            </label>
                            {(file || fileThumbnail) && <span className={Styles.removeFile} onClick={() => removePreview() } >X</span>}
                        </div>
                    </>
                )}
                <div className={Styles.info}>
                    <h2 className={Styles.title}>
                        <p>Título</p>
                        <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Slug</p>
                        <input type="text" name="title" id="title" value={slug} onChange={(e) => setSlug(e.target.value)} />
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Descrição</p>
                        <div className={Styles.textEditor}>
                            <TextEditor content={description} setText={setDescription} />
                        </div>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Setor</p>
                        <select value={sector} onChange={(e) => setSector(e.target.value)}>
                            <option value="null">Selecione...</option>
                            {
                                jobsTaxonomies.sector.map(sector => (
                                    <option key={sector.slug} value={sector.slug}>{sector.name}</option>
                                ))
                            }
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Tipo de Vaga</p>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="null">Selecione...</option>
                            {
                                jobsTaxonomies.type.map(type => (
                                    <option key={type.slug} value={type.slug}>{type.name}</option>
                                ))
                            }
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Habilidades Necessárias</p>
                        <div className={Styles.textEditor}>
                            <TextEditor content={skills} setText={setSkills} />
                        </div>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Nível de Carreira</p>
                        <select value={careerLevel} onChange={(e) => setCareerLevel(e.target.value)}>
                            <option value="null">Selecione...</option>
                            {
                                jobsTaxonomies.careerLevel.map(careerLevel => (
                                    <option key={careerLevel.slug} value={careerLevel.slug}>{careerLevel.name}</option>
                                ))
                            }
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Gênero</p>
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="null">Selecione...</option>
                            {
                                jobsTaxonomies.gender.map(gender => (
                                    <option key={gender.slug} value={gender.slug}>{gender.name}</option>
                                ))
                            }
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Experiência</p>
                        <select value={expirience} onChange={(e) => setExpirience(e.target.value)}>
                            <option value="null">Selecione...</option>
                            {
                                jobsTaxonomies.expirience.map(expirience => (
                                    <option key={expirience.slug} value={expirience.slug}>{expirience.name}</option>
                                ))
                            }
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Pré Requisitos</p>
                        <div className={Styles.requisitesContainer}>
                            {
                                jobsTaxonomies.prerequisites.map(prereq => (
                                    <label key={prereq.slug} htmlFor={`pre-req-${prereq.slug}`} className={Styles.check}>
                                        <CheckBox id={`pre-req-${prereq.slug}`} initialCheck={prerequisites.includes(prereq.slug)} data-js="pre-requisites" data-value={prereq.slug}/> 
                                        {prereq.name}
                                    </label>
                                ))
                            }
                        </div>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Tipo de Remuneração</p>
                        <select value={remunerationType} onChange={(e) => setRemunerationType(e.target.value)}>
                            <option value="null">Selecione...</option>
                            {
                                jobsTaxonomies.remunerationType.map(remunerationType => (
                                    <option key={remunerationType.slug} value={remunerationType.slug}>{remunerationType.name}</option>
                                ))
                            }
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Remuneração</p>
                        <input type="number" name="button-text" id="button-text" value={remuneration} onChange={(e) => setRemuneration(Number(e.target.value))}/>
                    </h2>
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={job ? 'Atualizar vaga' : 'Criar nova vaga'} />
                </div>
            </form>
        </div>
    )
}

export default Job


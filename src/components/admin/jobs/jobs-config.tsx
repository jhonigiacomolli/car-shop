import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_ConfigProps, TYPE_Job_Image_Type } from 'context/context-types'
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { PictureAdd } from 'components/icons'
import PrimarySubmit from 'components/admin/buttons/primary-submit'
import AlertBox from 'components/admin/messages/alert-box'
import MessageBox from 'components/admin/messages/message-box'
import PageHeader from '../page-header'
import Styles from './jobs-config.module.css'


const JobsConfig = () => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [file, setFile] = useState<File>()
    const [fileThumbnail, setFileThumbnail] = useState('')
    const [displayJobTitle, setDisplayJobTitle] = useState('false')
    const [displayJobDescription, setDisplayJobDescription] = useState('false')
    const [displayJobSector, setDisplayJobSector] = useState('false')
    const [displayJobType, setDisplayJobType] = useState('false')
    const [displayJobSkills, setDisplayJobSkills] = useState('false')
    const [displayJobCareerLevel, setDisplayJobCreerLevel] = useState('false')
    const [displayJobGender, setDisplayJobGender] = useState('false')
    const [displayJobPrerequisites, setDisplayJobPrerequisites] = useState('false')
    const [displayJobRemunerationType, setDisplayJobRemunerationType] = useState('false')
    const [displayJobRemuneration, setDisplayJobRemuneration] = useState('false')
    const [displayJobImage, setDisplayJobImage] = useState('false')
    const [jobImageType, setJobImageType] = useState<TYPE_Job_Image_Type>()
    const [jobRemunerationLabel, setJobRemunerationLabel] = useState('')
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const {
        config
    } = useConfig()


    useEffect(() => {
        config.jobs && setDisplayJobTitle(`${config.jobs.displayTitle}`)
        config.jobs && setDisplayJobDescription(`${config.jobs.displayDescription}`)
        config.jobs && setDisplayJobSector(`${config.jobs.displaySector}`)
        config.jobs && setDisplayJobType(`${config.jobs.displayType}`)
        config.jobs && setDisplayJobSkills(`${config.jobs.displaySkills}`)
        config.jobs && setDisplayJobCreerLevel(`${config.jobs.displayCareerLevel}`)
        config.jobs && setDisplayJobGender(`${config.jobs.displayGender}`)
        config.jobs && setDisplayJobPrerequisites(`${config.jobs.displayPrerequisites}`)
        config.jobs && setDisplayJobRemunerationType(`${config.jobs.displayRemunerationType}`)
        config.jobs && setDisplayJobRemuneration(`${config.jobs.displayRemuneration}`)
        config.jobs && setDisplayJobImage(`${config.jobs.displayImage}`)
        config.jobs && setJobRemunerationLabel(config.jobs.remunerationLabel)
        config.jobs && setJobImageType(config.jobs.jobImageType)
        config.jobs && setFileThumbnail(config.jobs.jobImageDefault)
    }, [config])

    useEffect(() => {
        const img = document.getElementById('preview')
        fileThumbnail && img && img.setAttribute('src', fileThumbnail)
    }, [fileThumbnail, jobImageType] )

    useEffect(() => {
        previewRender()
    }, [file])

    function previewRender(){
        if(file) {
            const reader = new FileReader()
            const img = document.getElementById('preview')
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const result = event.target?.result
                result && img?.setAttribute('src', result.toString())
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

    async function updateCarConfig(event: FormEvent) {
        event.preventDefault()

        setLoading(true)
        const formConfig = new FormData
        formConfig.append('id', config.id.toString())
        formConfig.append('type', 'jobs')
        formConfig.append('displayJobTitle',displayJobTitle)
        formConfig.append('displayJobDescription',displayJobDescription)
        formConfig.append('displayJobSector',displayJobSector)
        formConfig.append('displayJobType',displayJobType)
        formConfig.append('displayJobSkills',displayJobSkills)
        formConfig.append('displayJobCareerLevel',displayJobCareerLevel)
        formConfig.append('displayJobGender',displayJobGender)
        formConfig.append('displayJobPrerequisites',displayJobPrerequisites)
        formConfig.append('displayJobRemunerationType',displayJobRemunerationType)
        formConfig.append('displayJobRemuneration',displayJobRemuneration)
        formConfig.append('displayJobImage',displayJobImage)
        formConfig.append('jobRemunerationLabel',jobRemunerationLabel)    
        formConfig.append('jobImageType',jobImageType ?? '')    
        formConfig.append('jobImageDefault',file ? file : fileThumbnail)    
        
        try {
            const { data } = await axios.post<TYPE_API_Response<TYPE_ConfigProps>>(`${api}/config`, formConfig, {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            })
            setLoading(false)
            if(data.status === 200) {                
                config.jobs.displayTitle = data.data.jobs.displayTitle
                config.jobs.displayDescription = data.data.jobs.displayDescription
                config.jobs.displaySector = data.data.jobs.displaySector
                config.jobs.displayType = data.data.jobs.displayType
                config.jobs.displaySkills = data.data.jobs.displaySkills
                config.jobs.displayCareerLevel = data.data.jobs.displayCareerLevel
                config.jobs.displayGender = data.data.jobs.displayGender
                config.jobs.displayPrerequisites = data.data.jobs.displayPrerequisites
                config.jobs.displayRemunerationType = data.data.jobs.displayRemunerationType
                config.jobs.displayRemuneration = data.data.jobs.displayRemuneration
                config.jobs.displayImage = data.data.jobs.displayImage
                config.jobs.remunerationLabel = data.data.jobs.remunerationLabel
                config.jobs.jobImageType = data.data.jobs.jobImageType
                config.jobs.jobImageDefault = data.data.jobs.jobImageDefault
                setSendResponse(data.message)
                setSendStatus(data.status)
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
    
    function handleChangeFile (event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.target
        files && setFile(files[0])
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
            <PageHeader title={'CONFIGURAÇÃOS DAS VAGAS'} description={'Configure as principais características das suas vagas de emprego'} />
            <form className={Styles.data} onSubmit={(e) => updateCarConfig(e)}>
                <div className={Styles.inputContainer}>
                    <h2 className={Styles.title}>EXIBIÇÃO DE OPÇÕES DAS VAGAS</h2>
                    <h2 className={Styles.title}>
                        <p>Exibir Titulo</p>
                        <select name="display-filters" id="display-filters" value={displayJobTitle} onChange={(e) => setDisplayJobTitle(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Exibir Descrição</p>
                        <select name="display-filter-condition" id="display-filter-condition" value={displayJobDescription} onChange={(e) => setDisplayJobDescription(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Exibir Setor</p>
                        <select name="display-filter-assembler" id="display-filter-assembler" value={displayJobSector} onChange={(e) => setDisplayJobSector(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Exibir Tipo de Vaga</p>
                        <select name="display-filters-transmission" id="display-filters-transmission" value={displayJobType} onChange={(e) => setDisplayJobType(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Exibir Habilidades</p>
                        <select name="display-filters-fuel" id="display-filters-fuel" value={displayJobSkills} onChange={(e) => setDisplayJobSkills(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Exibir Nível de Carreira</p>
                        <select name="display-filters-motor" id="display-filters-motor" value={displayJobCareerLevel} onChange={(e) => setDisplayJobCreerLevel(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Exibir Gênero</p>
                        <select name="display-filters-ports" id="display-filters-ports" value={displayJobGender} onChange={(e) => setDisplayJobGender(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Direção</p>
                        <select name="display-filters-direction" id="display-filters-direction" value={displayJobPrerequisites} onChange={(e) => setDisplayJobPrerequisites(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Exibir Tipo de Remuneração</p>
                        <select name="display-filters-end-plate" id="display-filters-end-plate" value={displayJobRemunerationType} onChange={(e) => setDisplayJobRemunerationType(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Exibir Remuneração</p>
                        <select name="display-filters-year" id="display-filters-year" value={displayJobRemuneration} onChange={(e) => setDisplayJobRemuneration(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    <h2 className={Styles.title}>
                        <p>Exibir Imagem</p>
                        <select name="display-filters-color" id="display-filters-color" value={displayJobImage} onChange={(e) => setDisplayJobImage(e.target.value)}>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                        </select>
                    </h2>
                    {JSON.parse(displayJobImage) && (
                        <>
                            <h2 className={Styles.title}>
                                <p>Qual imagem gostaria de exibir</p>
                                <select name="display-filters-color" id="display-filters-color" value={jobImageType} onChange={(e) => {
                                    const result = e.target.value as TYPE_Job_Image_Type 
                                    setJobImageType(result)
                                }}>
                                    <option value={'default'}>Imagem padrão para todos</option>
                                    <option value={'job'}>Imagem única para cada vaga</option>
                                    <option value={'logo'}>Logomarca para todos</option>
                                </select>
                            </h2>
                            {(jobImageType === 'default') && (
                                <div className={Styles.data}>
                                    <div className={Styles.coverHeader}>
                                        <div className={Styles.coverTitle}>
                                            <h2 className={Styles.title}>Imagem de background</h2>
                                            <p>Selecione a imagem para ser exibida em suas vagas</p>
                                        </div>
                                        <label className={Styles.personalInputFile} htmlFor="file">
                                            <input type="file" id={'file'} name={'file'} accept=".jpeg, .jpg, .png, .bmp, .img" onChange={(e) => handleChangeFile(e)} />
                                        </label>
                                    </div>
                                    <div className={Styles.previewContainer}>
                                        <label htmlFor="file" className={Styles.coverPreview}>
                                            {(file || fileThumbnail) && <img id="preview" className={Styles.preview} />}
                                            {(!file && !fileThumbnail) && <PictureAdd />}
                                        </label>
                                        {(file || fileThumbnail) && <span className={Styles.removeFile} onClick={() => removePreview() } >X</span>}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div className={Styles.details}>
                        <h2 className={Styles.title}>Texto Remuneração</h2>
                        <p>O texto inserido no campo abaixo sera exibido quando a vaga não possuir uma remuneração definida</p>
                        <input type="text" value={jobRemunerationLabel} onChange={(e) => setJobRemunerationLabel(e.target.value)} />
                    </div>
                </div>           
                <div className={Styles.button}>
                    <PrimarySubmit value={'Atualizar configurações'} />
                </div>
            </form>
        </div>
    )
}

export default JobsConfig
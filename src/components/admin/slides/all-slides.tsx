import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { Edit, Trash } from 'components/icons'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Slide } from 'context/context-types'
import { useConfig } from 'context'
import AdminButton from 'components/buttons/admin-button'
import CheckBox from 'components/checkbox/check-box'
import ConfirmBox from 'components/messages/confirm-box'
import MessageBox from 'components/messages/message-box'
import PageHeader from '../page-header'
import Styles from './all-slides.module.css'
import Slide from './slide'
import SlideItem from './slide-item'

const AllSlides = () => {
    const { loginToken, theme, setLoading, setBodyComponent } = useContext(TokenContext)
    const { searchTerms, config, setConfig} = useConfig()
    const [slides, setSlides] = useState(config.slideShow.slides)
    const [massSelection, setMassSelection] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [selectSlides, setSelectSlides] = useState<string[]>([])
    const [slideToDelete, setSlideToDelete] = useState<TYPE_Slide[]>([])
    const [messageBox, setMessageBox] = useState(false)
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [messageBoxMessage, setMessageBoxMessage] = useState('')
    const [confirmBox, setConfirmBox] = useState(false)

    useEffect(() => {
        const selects = document.querySelectorAll('[ms-slide]')
        const newSlide =[...selectSlides]
        
        for(let i=0; i<selects.length; i++) {
            const selected = selects[i] as HTMLInputElement

            if(selectAll && selects) {
                selected.checked = true
                setSelectSlides([...newSlide, selected.value])
            }else {
                selected.checked = false
                setSelectSlides(newSlide.filter(car => car !== selected.value))
            }
        }
    }, [selectAll])
    
    useEffect(() => {
        setSlides(
            (searchTerms && searchTerms !== '') 
                ? config.slideShow.slides.filter(slide => slide.title.toLowerCase().includes(searchTerms.toLowerCase())) 
                : config.slideShow.slides
        )
    }, [searchTerms, config.slideShow.slides])
    
    useEffect(() => {
        slideToDelete && slideToDelete.length > 0 ? setConfirmBox(true) : setConfirmBox(false)
        slideToDelete && slideToDelete.length > 1 ? setMessageBoxTitle('Exclusão em massa') : setMessageBoxTitle('Exclusão')
        slideToDelete && slideToDelete.length > 1 ? setMessageBoxMessage('Deseja excluir permanentemente os slides selecionados ?') : setMessageBoxMessage('Deseja excluir permanentemente este slide ?')
    }, [slideToDelete])

    useEffect(() => {
        setSlides(config.slideShow.slides)
    }, [config])

    function checkPosts(event: ChangeEvent<HTMLInputElement>) {
        const result = event.target as HTMLInputElement
        setSelectSlides(
            result.checked 
                ? [...selectSlides, result.getAttribute('ms-slide') ?? ''] 
                : selectSlides.filter(slide => slide !== result.getAttribute('ms-slide'))
        )
    }

    function massVerification(event: ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target as HTMLInputElement
        setMassSelection(checked)
        if(!checked) {
            setSelectAll(false) 
            setSelectSlides([])
        }  
    }

    async function slideDelete(slide: TYPE_Slide[]) {
        setConfirmBox(false)
        setLoading(true)

        try {
            const { data } = await axios.delete<TYPE_API_Response<TYPE_Slide[]>>(`${api}/slide`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${loginToken}`
                },
                data: { 'slide': slide }
            })
            setLoading(false)
            setMessageBoxMessage(data.message)
            setMessageBoxTitle(data.status === 200 ? 'Sucesso!' : 'Erro!')
            setMessageBoxType(data.status === 200 ? 'success' : 'error')
            config.slideShow.slides = config.slideShow.slides.filter(slide => !data.data.find(exclude => exclude.id === slide.id))
            setMessageBox(true)
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
        const slidesDeleted:TYPE_Slide[] = []
        document.querySelectorAll('[ms-slide]').forEach(slide => {
            const actualSlide = slide as HTMLInputElement
            actualSlide.checked === true ?
                slides.map(originalSlide => originalSlide.id === Number(slide.getAttribute('ms-slide')) && slidesDeleted.push(originalSlide))
            : ''
        })
        console.log(slidesDeleted);
        setSlideToDelete(slidesDeleted)
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
                    onConfirm={() => slideDelete(slideToDelete)}
                    onCancel={() => setSlideToDelete([])}
                />
            )}
            <PageHeader 
                search 
                title={'SLIDES | SLIDE SHOW'} 
                description=""
            />
            <div className={Styles.options}>
                <p className={Styles.slidesCount}><span>{config.slideShow.slides.length}</span> Slides encontrados</p>
               <label className={Styles.selectionContainer} htmlFor="mass-selection">
                   <CheckBox id="mass-selection" onChange={massVerification}/>
                    Seleção em massa
                </label>
                {massSelection && <label className={Styles.selectionContainer} htmlFor="selection-all">
                    <CheckBox id="selection-all" onChange={handleCheck} />
                    Selecionar todos
                </label>}
                {selectSlides.length > 0 && (
                    <AdminButton link="" label="" icon="" onClick={() => massiveDelete()} >
                        Excluir itens selecionados
                    </AdminButton>
                )}
            </div>
            <div className={Styles.articlesContainer}>
                {slides.map(slide => {
                    return (
                        <div key={slide.id} className={Styles.slide}>
                            {massSelection && <label className={Styles.selectionContainer} htmlFor="item-selection">
                                <label htmlFor={`slide-${slide.id}`}>
                                    <CheckBox 
                                        id={`slide-${slide.id}`}
                                        initialCheck={selectAll}
                                        ms-slide={slide.id} 
                                        onChange={checkPosts}
                                    />
                                </label>
                            </label>}
                            <SlideItem 
                                image={slide.backgroundImage} 
                                title={slide.title} 
                                subtitle={slide.subTitle} 
                                description={slide.description} 
                                link={''}
                            />
                            <div className={Styles.actions}>
                                <AdminButton onClick={() => setBodyComponent(<Slide slide={slide} />)} icon={<Edit />} />
                                <AdminButton onClick={() => setSlideToDelete([slide])} icon={<Trash />} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllSlides

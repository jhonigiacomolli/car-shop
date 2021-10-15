import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { BRL_Currency } from 'functions/CurrencyFormat'
import { TYPE_API_Response, TYPE_Cars, TYPE_Image } from 'context/context-types'
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { Calendar, CarPlate, Check, Color, Door, Engine, Fuel, PictureAdd, SteeringWheel, Tachometer, Transmission, Vehicle } from 'components/icons'
import PrimarySubmit from 'components/buttons/PrimarySubmit'
import CheckBox from 'components/checkbox/CheckBox'
import AlertBox from 'components/messages/AlertBox'
import MessageBox from 'components/messages/MessageBox'
import TextEditor from 'components/text-editor/text-editor'
import PageHeader from '../page-header'
import Styles from './car.module.css'

type CarProps = {
    car?: TYPE_Cars
}

const Car = ({ car }: CarProps) => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const [file, setFile] = useState<File>()
    const [fileThumbnail, setFileThumbnail] = useState('')
    const [galleryFiles, setGalleryFiles] = useState<File[]>([])
    const [galleryFilesThumbnail, setGalleryFilesThumbnail] = useState<TYPE_Image[]>([])
    const [tempGallery, setTempGallery] = useState<File[]>([])
    const [tempGalleryThumbnail, setTempGalleryThumbnail] = useState<TYPE_Image[]>([])
    const [deletedGallery, setDeletedGallery] = useState<HTMLDivElement>()
    const [deletedGalleryThumbnail, setDeletedGalleryThumbnail] = useState<HTMLDivElement>()
    const [video, setVideo] = useState('')
    const [category, setCategory] = useState('')
    const [code, setCode] = useState('')
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [price, setPrice] = useState('')
    const [salePrice, setSalePrice] = useState('')
    const [carCondition, setCarCondition] = useState('')
    const [carAssembler, setCarAssembler] = useState('')
    const [carTransmission, setCarTransmission] = useState('')
    const [carFuel, setCarFuel] = useState('')
    const [carMotor, setCarMotor] = useState('')
    const [carPorts, setCarPorts] = useState('')
    const [carDirection, setCarDirection] = useState('')
    const [carKM, setCarKM] = useState(0)
    const [carEndPlate, setCarEndPlate] = useState('')
    const [carYear, setCarYear] = useState('')
    const [carColor, setCarColor] = useState('')
    const [carOptionals, setCarOptionals] = useState<string[]>([])
    const [description, setDescription] = useState('')
    const [clear, setClear] = useState(false)
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const galleryContainerRef = useRef<HTMLDivElement>(null)
    const defaultGalleryItem = useRef<HTMLLabelElement>(null)
    const { 
        cars,
        setCars,  
        carsTaxonomies,
    } = useConfig()

    const {
        condition,
        assembler,
        transmission,
        fuel,
        motor,
        ports,
        direction,
        endPlate,
        year,
        color,
        optional
    } = carsTaxonomies

    useEffect(() => {
        coverPreviewRender()
    }, [file])

    useEffect(() => {
        galleryPreviewRender()
    }, [galleryFiles])
    
    useEffect(() => {
         deletedGallery && removeGalleryItem(deletedGallery)
    }, [deletedGallery])

    useEffect(() => {
        deletedGalleryThumbnail && removeGalleryThumbnailItem(deletedGalleryThumbnail)
    }, [deletedGalleryThumbnail])

    useEffect(() => {
        if(car) {
            setCategory(car.category) 
            setCode(car.code) 
            setTitle(car.title)
            setSlug(car.slug)
            setSalePrice(BRL_Currency(car.salePrice))
            setPrice(BRL_Currency(car.price))
            condition.map(cond=> cond.name === car.condition && setCarCondition(cond.slug))
            assembler.map(assembler=> assembler.name === car.assembler && setCarAssembler(assembler.slug))
            motor.map(motor=> motor.name === car.motor && setCarMotor(motor.slug))
            transmission.map(trans=> trans.name === car.transmission && setCarTransmission(trans.slug))
            direction.map(direct=> direct.name === car.direction && setCarDirection(direct.slug))
            fuel.map(fuel=> fuel.name === car.fuel && setCarFuel(fuel.slug))
            year.map(year=> year.name === car.year && setCarYear(year.slug))
            color.map(color=> color.name === car.color && setCarColor(color.slug))
            ports.map(ports=> ports.name === car.ports && setCarPorts(ports.slug))
            setCarKM(car.km)
            endPlate.map(endPlate=> endPlate.name === car.endPlate && setCarEndPlate(endPlate.slug))
            const options: string[] = []
            car.optionals.map(option => optional.filter(opt => opt.name === option &&  options.push(opt.name) ))
            setCarOptionals(options)
            checkedOptionals(options)
            car.thumbnail && setFileThumbnail(car.thumbnail)
            car.gallery && setGalleryFilesThumbnail(car.gallery)
            car.gallery && setTempGalleryThumbnail(car.gallery)
            setVideo(car.video)
        }else {
            setCategory('')
            setCode('')
            setTitle('')
            setSlug('')
            setSalePrice('')
            setPrice('')
            setCarCondition('')
            setCarAssembler('')
            setCarMotor('')
            setCarTransmission('')
            setCarDirection('')
            setCarFuel('')
            setCarYear('')
            setCarColor('')
            setCarPorts('')
            setCarKM(0)
            setCarEndPlate('')
            setVideo('')
            clearForm()
        }

        return () => {
            clearForm()
        }
    }, [car])

    useEffect(() => {
        fileThumbnail && document.getElementById('cover-preview')?.setAttribute('src', fileThumbnail)
    }, [fileThumbnail])
    
    useEffect(() => {
        tempGalleryThumbnail && galleryPreviewThumbnails()
    }, [tempGalleryThumbnail])
    
    
    function checkedOptionals(optionals: string[]) {
        const inputs = document.querySelectorAll('[ms-optional]') as NodeListOf<HTMLInputElement>
        optionals.map(option => {
            inputs.forEach(input => {                
                input.value === option ?  input.setAttribute('checked', 'true') : ''
            })
        })
        ;
    }

    function coverPreviewRender(){
        if(file) {
            const reader = new FileReader()
            const img = document.getElementById('cover-preview')
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const result = event.target?.result
                result && img?.setAttribute('src', result.toString())
            }
            reader.readAsDataURL(file)
        }
    }

    function removeCoverPreview() {
        const img = document.getElementById('cover-preview')
        img?.removeAttribute('src')
        setFile(undefined)
    } 
    
    function galleryPreviewRender() {
        const container = galleryContainerRef.current
        if(tempGallery && container instanceof HTMLDivElement && galleryFiles.length < 20) {            
            for(let i=0; i < tempGallery.length; i++) {
                const reader = new FileReader()
                reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
                    const div = document.createElement('div')
                    div.className = Styles.galleryItemContainer
                    div.setAttribute('gallery-id', tempGallery[i].name)
                    const img = new Image()
                    const result = event.target?.result
                    img.className = Styles.galleryPreview
                    result && img.setAttribute('src', result?.toString())
                    const button = document.createElement('span')
                    const value = tempGallery[i].name
                    button.className = Styles.removeGalleryFile
                    button.addEventListener('click', () => setDeletedGallery(div))
                    button.innerHTML = 'X'
                    div.appendChild(img)
                    div.appendChild(button)
                    container?.insertBefore(div, defaultGalleryItem.current)
                }, false)
                reader.readAsDataURL(tempGallery[i])
            }
        }
        setTempGallery([])
    }
    
    function galleryPreviewThumbnails() {
        const container = galleryContainerRef.current
        if(tempGalleryThumbnail && container instanceof HTMLDivElement) {
            galleryFilesThumbnail.map(gallery => {
                const div = document.createElement('div')
                div.className = Styles.galleryItemContainer
                div.setAttribute('gallery-id', gallery.url)
                const img = new Image()
                img.className = Styles.galleryPreview
                img.setAttribute('src', gallery.url)
                const button = document.createElement('span')
                button.className = Styles.removeGalleryFile
                button.addEventListener('click', () => setDeletedGalleryThumbnail(div))
                button.innerHTML = 'X'
                div.appendChild(img)
                div.appendChild(button)
                container.insertBefore(div, defaultGalleryItem.current)
            })  
        }
    }
    
    function removeGalleryItem(div: HTMLDivElement) {
        if(div) {
            const container = galleryContainerRef.current
            container?.removeChild(div)
            const id = div.getAttribute('gallery-id')
            setGalleryFiles(galleryFiles.filter(file => file.name !== id))   
            setDeletedGallery(undefined)
        }
    }

    function removeGalleryThumbnailItem(div: HTMLDivElement) {
        if(div) {
            const container = galleryContainerRef.current
            container?.removeChild(div)
            const id = div.getAttribute('gallery-id')
            setGalleryFilesThumbnail(galleryFilesThumbnail.filter(file => file.url !== id))   
            setDeletedGalleryThumbnail(undefined)
        }
    }

    async function createCar(event: FormEvent) {
        event.preventDefault()
        if (title) {
            setLoading(true)
            const headers = new FormData
            car && headers.append('id', car.id.toString())
            headers.append('category', category)
            headers.append('code', code)
            headers.append('title', title)
            headers.append('slug', slug)
            headers.append('price', Number(price.replace('R$', '').replace('.', '').replace(',', '.')).toString())
            headers.append('salePrice', Number(salePrice.replace('R$', '').replace('.', '').replace(',', '.')).toString())
            headers.append('condition', carCondition)
            headers.append('assembler', carAssembler)
            headers.append('motor', carMotor)
            headers.append('transmission', carTransmission)
            headers.append('direction', carDirection)
            headers.append('fuel', carFuel)
            headers.append('year', carYear)
            headers.append('color', carColor)
            headers.append('ports', carPorts)
            headers.append('km', carKM.toString())
            headers.append('endPlate', carEndPlate)
            headers.append('video', video)
            const checkboxes = document.querySelectorAll('[ms-optional]') as NodeListOf<HTMLInputElement>
            const requesites: string[] = []
            checkboxes.forEach(item => {
                item.checked && requesites.push(item.getAttribute('ms-optional') ?? '')
            })
            headers.append('optionals', requesites.toString())
            headers.append('description', description)
            file && headers.append('thumbnail', file)
            headers.append('oldThumbnail', car ? car.thumbnailID.toString() : '0')
            galleryFilesThumbnail.map(thumb => headers.append('oldGallery[]', thumb.id.toString()))
            galleryFiles.map((file, index) => headers.append(`gallery${index + 1}`, file ))

            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Cars>>(`${api}/car`, headers, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setSendStatus(data.status)
                setSendResponse(data.message)
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);
                if(data.status === 200 && car){
                    const newCar = cars.filter(oldcar => oldcar.id !== data.data.id )
                    setCars([data.data, ...newCar])
                }
                if(data.status === 200 && !car) {
                    setCars([data.data, ...cars])
                    clearForm()
                }
            } catch(error: any) {
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
            setAlertMessage('Os campos Título e Conteúdo são obirgatórios, preencha-os e tente novamente')
        }
    }
    
    useEffect(() => {
        clear && setCategory('')
        clear && setCode('')
        clear && setTitle('')
        clear && setSlug('')
        clear && setPrice('')
        clear && setSalePrice('')
        clear && setCarCondition('')
        clear && setCarAssembler('')
        clear && setCarMotor('')
        clear && setCarTransmission('')
        clear && setCarDirection('')
        clear && setCarFuel('')
        clear && setCarYear('')
        clear && setCarColor('')
        clear && setCarPorts('')
        clear && setCarKM(0)
        clear && setCarEndPlate('')
        clear && setCarOptionals([])
        const inputs = document.querySelectorAll('[ms-optional]') as NodeListOf<HTMLInputElement>
        clear && inputs.forEach(check => check.checked = false)
        clear && setFile(undefined)
        clear && setFileThumbnail('')
        clear && setGalleryFiles([])
        clear && setGalleryFilesThumbnail([])
        const galleryThumbs = document.querySelectorAll('[gallery-id]')
        galleryThumbs.forEach(thumb => galleryContainerRef.current?.removeChild(thumb))        
        clear && setVideo('')  
    }, [clear])

    function handleChangeFiles(event: ChangeEvent) {
        const { files } = event.target as HTMLInputElement
        files && setFile(files[0])
    }

    function handleGalleryChange(event: ChangeEvent) {
        const { files } = event.target as HTMLInputElement    
        files && setGalleryFiles([...galleryFiles, ...Array.from(files)])
        files && setTempGallery(Array.from(files))
    }


    function clearForm() {
        setDescription('<p></p>')  
        setClear(true)
        setTimeout(() => {
            setClear(false)
        }, 2000);
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
            <PageHeader title={car ? 'ATUALIZAR DADOS DO VEÍCULO' : 'CADASTRAR NOVO VEÍCULO'} description={car ? 'Mantenha as informações dos seus veículos sempre atualizadas' : 'Inclua um novo veículo em seu estóque'} />
            <form className={Styles.data} onSubmit={(e) => createCar(e)}>
                <h2 className={Styles.title}>Veículo</h2>
                <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <h2 className={Styles.title}>Categoria</h2>
                <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Automóveis">Automóveis</option>
                    <option value="Motocicletas">Motocicletas</option>
                    <option value="Caminhões">Caminhões</option>
                </select>
                <h2 className={Styles.title}>Código do Anúncio</h2>
                <input type="text" name="code" id="code" value={code} onChange={(e) => setCode(e.target.value)} />
                <h2 className={Styles.title}>Slug <span>*Opcional</span></h2>
                <p className={Styles.observation}>Slug é uma identificação unica para o veículo e deve conter apenas caracteres alfanuméricos incluindo o hífen, sem espaços ou caractéres especiais</p>
                <p className={Styles.observation}> Se você não informar o slug, o mesmo será criado automáticamente</p>
                <input type="text" name="slug" id="slug" value={slug} disabled={car ? true : false} onChange={(e) => setSlug(e.target.value)} />
                <h2 className={Styles.title}>Valores</h2>
                <div className={Styles.priceContainer}>
                    <div className={Styles.price}>
                        <h3 className={Styles.subtitle}>Valor padrão</h3>
                        <p className={Styles.observation}> O valor padrão é o valor de venda do veículo</p>
                        <input type="text" name="price" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className={Styles.price}>
                        <h3 className={Styles.subtitle}>Valor promocional</h3>
                        <p className={Styles.observation}> O valor promocional como o nome sugere é uma oferta, e prevalecerá sobre o valor padrão</p>
                        <input type="text" name="sale-price" id="sale-price" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
                    </div>
                </div>
                <h2 className={Styles.title}>Dados do veículo</h2>
                <div className={Styles.carOptions}>
                    <span className={Styles.dataItem}>
                        <Check label={'Condição'} />
                        <select 
                            className={carCondition === "" ? Styles.initialOption : ''} 
                            name="select-condition" 
                            id="select-condition" 
                            value={carCondition} 
                            onChange={(e) => setCarCondition(e.target.value)}
                        >
                            <option className={Styles.initialOption} value="">Selecione...</option>
                            {
                                condition.map(cond => {
                                    return <option key={cond.slug} className={Styles.selectOption} value={cond.slug}>{cond.name}</option>
                                })
                            }
                        </select>
                    </span>
                    <span className={Styles.dataItem}>
                        <Vehicle label={'Montadora'} />
                        <select 
                            className={carAssembler === "" ? Styles.initialOption : ''} 
                            name="select-assembler" 
                            id="select-assembler" 
                            value={carAssembler} 
                            onChange={(e) => setCarAssembler(e.target.value)}
                        >
                            <option className={Styles.initialOption} value="">Selecione...</option>
                            {
                                assembler.map(assemble => {
                                    return <option key={assemble.slug} className={Styles.selectOption} value={assemble.slug}>{assemble.name}</option>
                                })
                            }
                        </select>
                    </span>
                    <span className={Styles.dataItem}>
                        <Engine label={'Motorização'} />
                        <select 
                            className={carMotor === "" ? Styles.initialOption : ''} 
                            name="select-motor" 
                            id="select-motor" 
                            value={carMotor} 
                            onChange={(e) => setCarMotor(e.target.value)}
                        >
                            <option className={Styles.initialOption} value="">Selecione...</option>
                            {
                                motor.map(motor => {
                                    return <option key={motor.slug} className={Styles.selectOption} value={motor.slug}>{motor.name}</option>
                                })
                            }
                        </select>
                    </span>
                    <span className={Styles.dataItem}>
                        <Transmission label={'Câmbio'} />
                        <select 
                            className={carTransmission === "" ? Styles.initialOption : ''} 
                            name="select-transmission" 
                            id="select-transmission"  
                            value={carTransmission} 
                            onChange={(e) => setCarTransmission(e.target.value)}
                        >
                            <option className={Styles.initialOption} value="">Selecione...</option>
                            {
                                transmission.map(trans => {
                                    return <option key={trans.slug} className={Styles.selectOption} value={trans.slug}>{trans.name}</option>
                                })
                            }
                        </select>
                    </span>
                    <span className={Styles.dataItem}>
                        <SteeringWheel label={'Direção'} />
                        <select 
                            className={carDirection === "" ? Styles.initialOption : ''} 
                            name="select-direction" 
                            id="select-direction" 
                            value={carDirection} 
                            onChange={(e) => setCarDirection(e.target.value)}
                        >
                            <option className={Styles.initialOption} value="">Selecione...</option>
                            {
                                direction.map(dir => {
                                    return <option key={dir.slug} className={Styles.selectOption} value={dir.slug}>{dir.name}</option>
                                })
                            }
                        </select>
                    </span>
                    <span className={Styles.dataItem}>
                        <Fuel label={'Combustível'} />
                        <select 
                            className={carFuel === "" ? Styles.initialOption : ''} 
                            name="select-fuel" 
                            id="select-fuel" 
                            value={carFuel} 
                            onChange={(e) => setCarFuel(e.target.value)}
                        >
                            <option className={Styles.initialOption} value="">Selecione...</option>
                            {
                                fuel.map(fuel => {
                                    return <option key={fuel.slug} className={Styles.selectOption} value={fuel.slug}>{fuel.name}</option>
                                })
                            }
                        </select>
                    </span>
                    <span className={Styles.dataItem}>
                        <Calendar label={'Ano'} />
                        <select 
                            className={carYear === "" ? Styles.initialOption : ''} 
                            name="select-year" 
                            id="select-year" 
                            value={carYear}
                            onChange={(e) => setCarYear(e.target.value)}
                        >
                            <option className={Styles.initialOption} value="">Selecione...</option>
                            {
                                year.map(year => {
                                    return <option key={year.slug} className={Styles.selectOption} value={year.slug}>{year.name}</option>
                                })
                            }
                        </select>
                    </span>
                    <span className={Styles.dataItem}>
                        <Color label={'Cor'} />
                        <select 
                            className={carColor === "" ? Styles.initialOption : ''} 
                            name="select-color" 
                            id="select-color" 
                            value={carColor} 
                            onChange={(e) => setCarColor(e.target.value)}
                        >
                            <option className={Styles.initialOption} value="">Selecione...</option>
                            {
                                color.map(color => {
                                    return <option key={color.slug} className={Styles.selectOption} value={color.slug}>{color.name}</option>
                                })
                            }
                        </select>
                    </span>
                    <span className={Styles.dataItem}>
                        <Door label={'Portas'} />
                        <select 
                            className={carPorts === "" ? Styles.initialOption : ''} 
                            name="select-ports" id="select-ports" 
                            value={carPorts} 
                            onChange={(e) => setCarPorts(e.target.value)}
                        >
                            <option className={Styles.initialOption} value="">Selecione...</option>
                            {
                                ports.map(port => {
                                    return <option key={port.slug} className={Styles.selectOption} value={port.slug}>{port.name}</option>
                                })
                            }
                        </select>
                    </span>
                    <span className={Styles.dataItem}>
                        <Tachometer label={'KM'} />
                        <input 
                            type="text" 
                            name="km" 
                            id="km" 
                            value={carKM} 
                            onChange={(e) => setCarKM(Number(e.target.value))}
                        />
                    </span>
                    <span className={Styles.dataItem}>
                        <CarPlate label={'Final da Placa'} />
                        <select 
                            className={carEndPlate === "" ? Styles.initialOption : ''} 
                            name="select-endPlate" 
                            id="select-endPlate"  
                            value={carEndPlate} 
                            onChange={(e) => setCarEndPlate(e.target.value)}
                        >
                            <option className={Styles.initialOption} value="">Selecione...</option>
                            {
                                endPlate.map(plate => {
                                    return <option key={plate.slug} className={Styles.selectOption} value={plate.slug}>{plate.name}</option>
                                })
                            }
                        </select>
                    </span>
                </div>
                <h2 className={Styles.title}>Características do veículo</h2>
                <div className={Styles.carFeatures}>
                    {
                    optional.map(option => {
                        return (
                            <label key={option.slug} className={Styles.featureItem} htmlFor={option.slug}>
                                <CheckBox 
                                    id={option.slug}
                                    initialCheck={car?.optionals.includes(option.slug) ?? false}
                                    ms-optional={option.slug} 
                                />
                                {option.name}
                            </label>
                        ) 
                    })
                    }
                </div>
                <div className={Styles.coverHeader}>
                    <div className={Styles.coverTitle}>
                        <h2 className={Styles.title}>Capa</h2>
                        <p>Envie uma imagem de destaque do veículo</p>
                    </div>
                    <label className={Styles.personalInputFile} htmlFor="file">
                        <input 
                            type="file" 
                            id={'file'} 
                            name={'file'} 
                            multiple={false} 
                            accept=".jpeg, .jpg, .png, .bmp, .img" 
                            onChange={handleChangeFiles} 
                        />
                    </label>
                </div>
                <div className={Styles.previewContainer}>
                    <label htmlFor={'file'} className={Styles.coverPreview}>
                        {(file || fileThumbnail) && (
                            <img id={'cover-preview'} className={Styles.preview}></img>
                        )}
                        {(!file && !fileThumbnail) && <PictureAdd />}
                    </label>
                    {(file || fileThumbnail) && (
                        <span className={Styles.removeFile} onClick={() => removeCoverPreview() } >
                            X
                        </span>
                    )}
                </div>
                <div className={Styles.galleryHeader}>
                    <div className={Styles.galleryTitle}>
                        <h2 className={Styles.title}>Galeria</h2>
                    </div>
                    <label className={Styles.personalInputFile} htmlFor="file">
                        <input 
                            type="file" 
                            id={'gallery-files'} 
                            name={'gallery-files'} 
                            multiple={true} 
                            accept=".jpeg, .jpg, .png, .bmp, .img" 
                            onChange={handleGalleryChange} 
                        />
                    </label>
                </div>
                <div ref={galleryContainerRef} className={Styles.galleryContainer}>
                    <label ref={defaultGalleryItem} htmlFor={'gallery-files'} className={`${Styles.galleryPreview} ${Styles.defaultGallery}`}>
                        <PictureAdd />
                    </label>                    
                </div>
                <h2 className={Styles.title}>Vídeo</h2>
                <p className={Styles.observation}> Caso exista algum material em video sobre este veículo, insira o link para o vídeo no Youtube ou Vimeo no campo abaixo</p>
                <input type="text" name="video" id="video" value={video} onChange={(e) => setVideo(e.target.value)} />
                <h2 className={Styles.title}>Descrição do veículo</h2>
                <div className={Styles.editorContainer}>
                    <TextEditor setText={setDescription} clear={clear} content={car ? car.description : description} />
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={car ? 'Atualizar veículo' : 'Cadastrar novo veículo'} />
                </div>
            </form>
        </div>
    )
}

export default Car


import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { TYPE_API_Response, TYPE_Category, TYPE_Posts } from 'context/context-types'
import { PictureAdd } from 'components/icons'
import AlertBox from 'components/messages/AlertBox'
import MessageBox from 'components/messages/MessageBox'
import PageHeader from '../page-header'
import TextEditor from 'components/text-editor/text-editor'
import CheckBox from 'components/checkbox/CheckBox'
import PrimarySubmit from 'components/buttons/PrimarySubmit'
import Styles from './post.module.css'

type ArticleProps = {
    post?: TYPE_Posts
}
const Article = ({ post }: ArticleProps) => {
    const { loginToken, theme, setLoading } = useContext(TokenContext)
    const { blog, blogCategories, blogTags, setBlog } = useConfig()
    const [file, setFile] = useState<File>()
    const [fileThumbnail, setFileThumbnail] = useState('')
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [content, setContent] = useState('')
    const [clear, setClear] = useState(false)
    const [sendStatus, setSendStatus] = useState(0)
    const [sendResponse, setSendResponse] = useState('')
    const [alertType, setAlertType] = useState('')
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')

    useEffect(() => {
        previewRender()
    }, [file])

    useEffect(() => {
        const img = document.getElementById('preview')
        fileThumbnail && img && img.setAttribute('src', fileThumbnail)
    }, [fileThumbnail] )

    useEffect(() => {
        if(post) {
            setTitle(post.title)
            setSlug(post.slug)
            checkedTags(post.tags)
            checkedCategories(post.categories)        
            setFileThumbnail(post.thumbnail)
        }else {
           setTitle('')
           setSlug('')
           setFileThumbnail('')
           clearForm()
        }
    }, [post])

    useEffect(() => {
        const inputsCat = document.querySelectorAll('[ms-category]') as NodeListOf<HTMLInputElement>
        const inputsTags = document.querySelectorAll('[ms-tag]') as NodeListOf<HTMLInputElement>
        if (clear) {
            (true)
            setTitle('')
            setSlug('')
            inputsCat.forEach(check => check.checked = false)
            inputsTags.forEach(check => check.checked = false)
            removePreview()
            setContent('<p></p>')  
        }
    }, [clear])

    function checkedTags(tags: TYPE_Category[]) {
        const inputs = document.querySelectorAll('[ms-tag]') as NodeListOf<HTMLInputElement>
        tags.map(tag => {
            inputs.forEach(input => {
                input.value === tag.name ?  input.setAttribute('checked', 'true') : ''
            })
        })
    }

    function checkedCategories(categories: TYPE_Category[]) {
        const inputs = document.querySelectorAll('[ms-category]') as NodeListOf<HTMLInputElement>
        categories.map(cat => {
            inputs.forEach(input => {
                Number(input.value) === cat.id ?  input.setAttribute('checked', 'true') : ''
            })
        })
    }

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
        const img = document.getElementById('preview')
        img && img.removeAttribute('src') 
        setFile(undefined)
        setFileThumbnail('')
    }

    async function createPost(event: FormEvent) {
        event.preventDefault()
    
        if (title && content) {
            setLoading(true)
            const headers = new FormData
            post && headers.append('id', post.id.toString())
            headers.append('title', title)
            headers.append('slug', slug)
            headers.append('description', content)
            const arrayCategories: string[] = []
            const inputsCategories = document.querySelectorAll('[ms-category]') as NodeListOf<HTMLInputElement>
            inputsCategories.forEach(cat => {
                cat.checked && arrayCategories.push(cat.getAttribute('ms-category') ?? '')
            })
            
            arrayCategories.map(cat => headers.append('categories[]', cat))
            const arrayTags: string[] = []
            const inputsTags = document.querySelectorAll('[ms-tag]') as NodeListOf<HTMLInputElement>
            inputsTags.forEach(cat => {
                cat.checked && arrayTags.push(cat.getAttribute('ms-tag') ?? '')
            })
            arrayTags.map(tag => headers.append('tags[]', tag))
            const previewContainer = document.getElementById('preview') as HTMLImageElement
            file && previewContainer?.src !== '' && headers.append('file', file)
            !file && previewContainer?.src === '' && headers.append('updateThumbnail', 'true')
            !file && previewContainer?.src !== '' && headers.append('updateThumbnail', 'false')
            post && headers.append('thumbnailID', post.thumbnailID.toString())
            
            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Posts>>(`${api}/post`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: headers
                })
                setLoading(false)
                setSendStatus(data.status)
                setSendResponse(data.message)
                if(data.status === 200 && post){
                    const newBlog = blog.filter(article => article.id !== data.data.id )
                    setBlog([data.data, ...newBlog])
                }
                if(data.status === 200 && !post) {
                    setBlog([data.data, ...blog])  
                    clearForm() 
                }
                setTimeout(() => {
                    setSendResponse('')
                    window.scrollTo(0,0)
                }, 2000);

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

    function handleChangeFile(event: ChangeEvent) {
        const { files } = event.target as HTMLInputElement
        files && setFile(files[0])
    }

    function clearForm() {
        setClear(true)
        setTimeout(() => {
            setClear(false)
        }, 2500);
    }
    
    return (
        <div className={theme.content}>
            {alertMessage &&<AlertBox type={alertType} title={alertTitle} message={alertMessage} onConfirm={() => setAlertMessage('')}/>}
            {sendResponse && <MessageBox type={sendStatus === 200 ? 'success' : 'error'} title={sendStatus === 200 ? 'Sucesso!!!' : 'Ops... ocorreu um erro!' } message={sendResponse}/>}
            <PageHeader title={post ? 'ATUALIZAR ARTIGO' : 'NOVO ARTIGO'} description={post ? 'Deixe este conteúdo ainda mais incrível' : 'Crie conteúdos incríveis e relevantes para o seu público'} />
            <form className={Styles.data} onSubmit={(e) => createPost(e)}>
                <div>
                    <h2 className={Styles.title}>Imagem</h2>
                    <p>Envie uma imagem de destaque para a sua publicação</p>
                    <label className={Styles.personalInputFile} htmlFor="file">
                        <input type="file" id={'file'} accept=".jpeg, .jpg, .png, .bmp, .img" onChange={handleChangeFile} />
                    </label>
                    <div className={Styles.previewContainer}>
                    <label htmlFor={'file'} className={Styles.coverPreview}>
                        {(file || fileThumbnail) && <img id="preview" className={Styles.preview} />}
                        {(!file && !fileThumbnail) && <PictureAdd />}
                    </label>
                    {(file || fileThumbnail) && <span className={Styles.removeFile} onClick={() => removePreview() } >X</span>}
                </div>
                </div>
                
                <h2 className={Styles.title}>Título</h2>
                <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <h2 className={Styles.title}>Slug <span>*Opcional</span></h2>
                <input type="text" name="slug" id="slug" value={slug} disabled={post ? true : false} onChange={(e) => setSlug(e.target.value)} />
                <h2 className={Styles.title}>Conteúdo</h2>
                <div className={Styles.editorContainer}>
                    <TextEditor setText={setContent} content={post ? post.description : content} />
                </div>
                <div className={Styles.taxonomies}>
                    <div className={Styles.taxonomy}>
                        <h2 className={Styles.title}>Categorias</h2>
                        <div className={Styles.categoryList}>
                            {
                                blogCategories.map(category => {
                                    return (
                                        category.slug !== 'sem-categoria' && <label key={category.slug} htmlFor={`cat-${category.id}`}>
                                            <CheckBox ms-category={category.id} id={`cat-${category.id}`} initialCheck={post?.categories.filter(item => item.id === category.id) ? (post.categories.filter(item => item.id === category.id).length > 0) : false}/>
                                            <p>{category.name}</p>
                                        </label>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={Styles.taxonomy}>
                        <h2 className={Styles.title}>Tags</h2>
                        <div className={Styles.tagList}>
                            {
                                blogTags.map(tag => {
                                    return (
                                        <label key={tag.slug} htmlFor={`tag-${tag.id}`}>
                                            <CheckBox ms-tag={tag.slug} id={`tag-${tag.id}`} initialCheck={post?.tags.filter(item => item.id === tag.id) ? (post.tags.filter(item => item.id === tag.id).length > 0) : false} />
                                            <p>{tag.name}</p>
                                        </label>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={Styles.button}>
                    <PrimarySubmit value={post ? 'Atualizar artigo' : 'Criar novo artigo'} />
                </div>
            </form>
        </div>
    )
}

export default Article


import axios from 'axios'
import { TokenContext } from '..'
import { api } from 'api/api'
import { useConfig } from 'context'
import { TYPE_API_Response, TYPE_Message_Types } from 'context/context-types'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Edit, Trash } from 'components/icons'
import CheckBox from 'components/checkbox/check-box'
import AdminButton from 'components/admin/buttons/admin-button'
import ConfirmBox from 'components/admin/messages/confirm-box'
import MessageBox from 'components/admin/messages/message-box'
import PageHeader from '../page-header'
import PostItem from './post-item'
import Article from './post'
import Styles from './all-posts.module.css'


const AllArticles = () => {
    const { loginToken, theme, setLoading, setBodyComponent } = useContext(TokenContext)
    const { searchTerms, blog, setBlog } = useConfig()
    const [blogPosts, setBlogPosts] = useState(blog)
    const [massSelection, setMassSelection] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [selectPosts, setSelectPosts] = useState<string[]>([])
    const [postToDelete, setPostToDelete] = useState<number | number[]>(0)
    const [messageBox, setMessageBox] = useState(false)
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [messageBoxMessage, setMessageBoxMessage] = useState('')
    const [confirmBox, setConfirmBox] = useState(false)

    useEffect(() => {
        postToDelete ? setConfirmBox(true) : setConfirmBox(false)
        postToDelete && typeof(postToDelete) === 'number' ? setMessageBoxTitle('Exclusão') : setMessageBoxTitle('Exclusão em massa')
        postToDelete && typeof(postToDelete) === 'number' ? setMessageBoxMessage('Deseja excluir permanentemente este artigo ?') : setMessageBoxMessage('Deseja excluir permanentemente os artigos selecionados ?')
    }, [postToDelete])

    useEffect(() => {
        setBlogPosts(blog)
    }, [blog])

    useEffect(() => {
        const selects = document.querySelectorAll('[ms-post]')
        const newPost =[...selectPosts]

        for(let i=0; i<selects.length; i++) {
            const selected = selects[i] as HTMLInputElement

            if(selectAll && selects) {
                selected.checked = true
                setSelectPosts([...newPost, selected.getAttribute('ms-post') ?? ''])
            }else {
                selected.checked = false
                setSelectPosts(newPost.filter(car => car !== selected.getAttribute('ms-post') ?? ''))
            }
        }
    }, [selectAll])
    
    useEffect(() => {
        setBlogPosts((searchTerms && searchTerms !== '')
            ? blog.filter(post => post.title.toLowerCase().includes(searchTerms.toLowerCase()))
            : blog
        )
    }, [searchTerms])


    function checkPosts(event: ChangeEvent) {
        const result = event.target as HTMLInputElement
        setSelectPosts(old => result.checked ? [...selectPosts, result.getAttribute('ms-post') ?? ''] : selectPosts.filter(post => post !== result.getAttribute('ms-post') ?? ''))
    }

    function massVerification(event: ChangeEvent) {
        const { checked } = event.target as HTMLInputElement
        setMassSelection(checked)
        if(!checked) {
            setSelectAll(false) 
            setSelectPosts([])
        }  
    }

    async function postDelete(id: number | number[]) {
        setConfirmBox(false)
        setLoading(true)
        if(typeof(id) === 'number') {
            try {
                const { data } = await axios.delete<TYPE_API_Response<number>>(`${api}/post`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: { 'id': id }
                })
                setLoading(false)
                setMessageBoxMessage(data.message)
                setMessageBoxTitle(data.status === 200 ? 'Sucesso!' : 'Erro!')
                setMessageBoxType(data.status === 200 ? 'success' : 'error')
                setMessageBox(true)
                data.status === 200 && setBlog(blogPosts.filter(post => post.id !== id))
                setTimeout(() => {
                    setMessageBox(false)
                }, 1500);
            } catch(error:any) {
                setLoading(false)
                setMessageBoxType('error')
                setMessageBoxTitle('Erro!')
                setMessageBoxMessage(error)
                setTimeout(() => {
                    setMessageBoxMessage('')
                }, 2000);
            }


        }else {
            const { data } = await axios.delete<TYPE_API_Response<number[]>>(`${api}/posts`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${loginToken}`
                },
                data: { 'id': id }
            })  
            setLoading(false)
            setMessageBoxMessage(data.message)
            setMessageBoxTitle(data.status === 200 ? 'Sucesso!' : 'Erro!')
            setMessageBoxType(data.status === 200 ? 'success' : 'error')
            setMessageBox(true)
            data.status === 200 && setBlog(blogPosts.filter(post => !data.data.includes(post.id)))
            setTimeout(() => {
                setMessageBox(false)
            }, 1500);
        }
    }

    function massiveDelete() {
        const posts: number[] = []
        const selecteds = document.querySelectorAll('[ms-post]') as NodeListOf<HTMLInputElement>
        selecteds.forEach(post => post.checked === true ? posts.push(Number(post.getAttribute('ms-post'))): '')
        setPostToDelete(posts)
    }

    function handleChangeSelectedAll(event: ChangeEvent) {
        const { checked } = event.target as HTMLInputElement
        setSelectAll(checked)
    }

    return (
        <div id={'body'} className={theme.content}>
            {messageBox && <MessageBox 
                type={messageBoxType}
                title={messageBoxTitle}
                message={messageBoxMessage}
                />}
            {confirmBox && <ConfirmBox 
                title={messageBoxTitle}
                message={messageBoxMessage}
                onConfirm={() => postDelete(postToDelete)}
                onCancel={() => setPostToDelete(0)}
            />}
            <PageHeader 
                search
                title={'ARTIGOS | BLOG'} 
                description=""
            />
            <div className={Styles.options}>
                <p className={Styles.postsCount}><span>{blogPosts.length}</span> Artigos encontrados</p>
                <label className={Styles.selectionContainer} htmlFor="mass-selection">
                   <CheckBox id="mass-selection" onChange={massVerification}/>
                    Seleção em massa
                </label>
                {massSelection && <label className={Styles.selectionContainer} htmlFor="selection-all">
                   <CheckBox id="selection-all" onChange={handleChangeSelectedAll}/>
                    Selecionar todos
                </label>}
                {selectPosts.length > 0 && <AdminButton onClick={() => massiveDelete()} >Excluir itens selecionados</AdminButton>}
            </div>
            <div className={Styles.articlesContainer}>
                {blogPosts.map(article => {
                    return (
                        <div key={article.slug} className={Styles.article}>
                            {massSelection && <label className={Styles.selectionContainer} htmlFor="item-selection">
                                    <label htmlFor={article.slug}>
                                        <CheckBox id={article.slug} initialCheck={selectAll} ms-post={article.id} onChange={checkPosts}/>
                                    </label>
                                </label>}
                            <PostItem article={article}/>
                            <div className={Styles.actions}>
                                <AdminButton onClick={() => setBodyComponent(<Article post={article} />)} icon={<Edit />} />
                                <AdminButton onClick={() => setPostToDelete(article.id)} icon={<Trash />} />
                            </div>
                        </div>
                )})}
            </div>
        </div>
    )
    
}

export default AllArticles

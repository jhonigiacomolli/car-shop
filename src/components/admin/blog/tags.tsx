import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { useContext, useState } from 'react'
import { emptyTaxonomy } from 'context/initial-contexts'
import { TYPE_API_Response, TYPE_Message_Types, TYPE_Taxonomy } from 'context/context-types'
import PageHeader from '../page-header'
import AdminButton from 'components/buttons/AdminButton'
import AlertBox from 'components/messages/AlertBox'
import ConfirmBox from 'components/messages/ConfirmBox'
import MessageBox from 'components/messages/MessageBox'
import TaxonomyItem from '../taxonomy-item'
import Styles from './tags.module.css'

const Tags = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { blog, blogTags, setBlogTags, windowWidth } = useConfig()   
    const [tag, setTag] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<TYPE_Message_Types>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editTag(tag: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setTag({
            id: tag.id,
            name: tag.name,
            slug: tag.slug
        })
        scrollTo(0,0)
    }

    async function createTag() {
        if(tag.name) {
            setLoading(true)
            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/blog/tags`, tag, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Categoria')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                const oldTag = blogTags.filter(tags => tags.id !== tag.id)
                setBlogTags([data.data, ...oldTag])
                setTag(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxType('warning')
                    setMessageBoxTitle('')
                }, 2000);
            } catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Categoria')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxType('error')
                    setMessageBoxTitle('')
                }, 2000);
            }
            
        }else {
            setAlertBox('Preencha corretamente o campo de tag')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deleteTag(tag: TYPE_Taxonomy) {
        if(tag) {
            setConfirmAction(undefined)
            setLoading(true)
            try {
                const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/blog/tags`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: tag
                })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                data.status === 200 && setBlogTags(blogTags.filter(tags => tags.id != tag.id))
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);

            } catch(error: any) {
                setLoading(false)
                setMessageBox(error.message)
                setMessageBoxTitle('Categoria')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxType('error')
                    setMessageBoxTitle('')
                }, 2000);
            }

        }else {
            setAlertBox('Preencha corretamente o campo de tag')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    return (
        <div className={Styles.tagContainer}>
            {messageBox && (
                <MessageBox 
                    type={messageBoxType} 
                    title={messageBoxTitle} 
                    message={messageBox} 
                />
            )}
            {alertBox && (
                <AlertBox 
                    type={alertBoxType} 
                    title={alertBoxTitle} 
                    message={alertBox} 
                    onConfirm={() => setAlertBox('')} 
                />
            )}
            {confirmAction && (
                <ConfirmBox
                    title={'Categoria'} 
                    message={'Deseja excluir esta tag ?'} 
                    onConfirm={() => deleteTag(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'TAGS'} description={'Adicione ou edite as tags dos seus artigos'} />
            <div className={Styles.newTag}>
                <h1>{tag.id ? 'Editar tag' : 'Adicionar nova tag'}</h1>
                {tag.id ? <span className={Styles.newId}>ID: <p>{tag.id}</p></span> : ''}
                {tag.id ? <span className={Styles.newSlug}>SLUG: <p>{tag.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input 
                        type="text" 
                        name="new-tag" 
                        id="new-tag" 
                        value={tag ? tag.name : ''} 
                        onChange={(e) => setTag({ ...tag, name: e.target.value })} 
                    />
                    <AdminButton onClick={() => createTag()}>{tag.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {tag && <AdminButton onClick={() => setTag(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.tagList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    blogTags.map(tag => {
                        let count = 0
                        blog.map(post=> {
                            post.tags.map(item => item.id === tag.id && count++)  
                        })
                         
                        return <TaxonomyItem key={tag.slug} taxonomy={tag} count={count} editAction={editTag} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Tags

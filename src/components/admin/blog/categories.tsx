import axios from 'axios'
import { api } from 'api/api'
import { TokenContext } from '..'
import { useConfig } from 'context'
import { useContext, useState } from 'react'
import { emptyTaxonomy } from 'context/initial-contexts'
import { TYPE_API_Response, TYPE_Taxonomy } from 'context/context-types'
import AdminButton from 'components/buttons/AdminButton'
import AlertBox from 'components/messages/AlertBox'
import ConfirmBox from 'components/messages/ConfirmBox'
import MessageBox from 'components/messages/MessageBox'
import PageHeader from '../page-header'
import TaxonomyItem from '../taxonomy-item'
import Styles from './categories.module.css'


const Categories = () => {
    const { loginToken, setLoading } = useContext(TokenContext)
    const { blog, blogCategories, setBlogCategories, windowWidth } = useConfig() 
    const [category, setCategory] = useState<TYPE_Taxonomy>(emptyTaxonomy)
    const [messageBox, setMessageBox] = useState('')
    const [messageBoxType, setMessageBoxType] = useState<'warning' | 'error' | 'success'>('warning')
    const [messageBoxTitle, setMessageBoxTitle] = useState('')
    const [alertBox, setAlertBox] = useState('')
    const [alertBoxType, setAlertBoxType] = useState('')
    const [alertBoxTitle, setAlertBoxTitle] = useState('')
    const [confirmAction, setConfirmAction] = useState<TYPE_Taxonomy>()

    function editCategory(category: TYPE_Taxonomy) {
        document.querySelector('#admin-body')?.scrollTo(0,0)
        setCategory({
            id: category.id,
            name: category.name,
            slug: category.slug
        })

        scrollTo(0,0)
    }

    async function createCategory() {
        if(category.name) {
            setLoading(true)

            try {
                const { data } = await axios.post<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/blog/categories`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginToken}`
                    },
                    data: category
                })
                
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Categoria')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                const oldCat = blogCategories.filter(cat => cat.id !== data.data.id)
                data.status === 200 && setBlogCategories([data.data, ...oldCat])
                setCategory(emptyTaxonomy)
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);

            } catch(error: any) {
                setLoading(false)
                setMessageBox(error)
                setMessageBoxTitle('Categoria')
                setMessageBoxType('error')
                setTimeout(() => {
                    setMessageBox('')
                    setMessageBoxTitle('')
                }, 2000);
            } 
        }else {
            setAlertBox('Preencha corretamente o campo de categoria')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    async function deleteCategory(category: TYPE_Taxonomy) {
        if(category) {
            setConfirmAction(undefined)
            setLoading(true)
            try {
            const { data } = await axios.delete<TYPE_API_Response<TYPE_Taxonomy>>(`${api}/blog/categories`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${loginToken}`
                },
                data: category
            })
                setLoading(false)
                setMessageBox(data.message)
                data.status === 200 && setMessageBoxTitle('Exclusão')
                data.status === 200 ? setMessageBoxType('success') : setMessageBoxType('error')
                setBlogCategories(blogCategories.filter(cat => cat.id != data.data.id))
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
                    setMessageBoxTitle('')
                }, 2000);
            }
        }else {
            setAlertBox('Preencha corretamente o campo de categoria')
            setAlertBoxType('warning')
            setAlertBoxTitle('Informações insuficientes')
        }
    }

    return (
        <div className={Styles.categoryContainer}>
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
                    message={'Deseja excluir esta categoria ?'} 
                    onConfirm={() => deleteCategory(confirmAction)} 
                    onCancel={() => setConfirmAction(undefined)}
                />
            )}
            <PageHeader title={'CATEGORIAS'} description={'Adicione ou edite as categorias dos seus artigos'} />
            <div className={Styles.newCategory}>
                <h1>{category.id ? 'Editar categoria' : 'Adicionar nova categoria'}</h1>
                {category.id ? <span className={Styles.newId}>ID: <p>{category.id}</p></span> : ''}
                {category.id ? <span className={Styles.newSlug}>SLUG: <p>{category.slug}</p></span> : ''}
                <div className={Styles.new}>
                    <input type="text" name="new-category" id="new-category" value={category ? category.name : ''} onChange={(e) => setCategory({ ...category, name: e.target.value })} />
                    <AdminButton onClick={createCategory}>{category.id ? 'Atualizar' : 'Adicionar'}</AdminButton>
                    {category && <AdminButton onClick={() => setCategory(emptyTaxonomy)}>Cancelar</AdminButton>}
                </div>
            </div>
            <div className={Styles.categoryList}>
                {windowWidth > 767 && <TaxonomyItem header />}
                {
                    blogCategories.map(cat => {
                        let count = 0
                        blog.map(post=> {
                            post.categories.map(item => item.id === cat.id && count++)  
                        })
                         
                        return <TaxonomyItem key={cat.slug} taxonomy={cat} count={count} editAction={editCategory} deleteAction={setConfirmAction} />
                    })
                }
            </div>
        </div>
    )
}

export default Categories

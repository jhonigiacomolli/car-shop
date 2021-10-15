import React from 'react'
import { TYPE_Taxonomy } from '../../context/context-types'
import AdminButton from '../buttons/AdminButton'
import Styles from './taxonomy-item.module.css'

type TaxonomyItemProps = {
    taxonomy?: TYPE_Taxonomy
    count?: number
    header?: boolean
    editAction?: (taxonomy: TYPE_Taxonomy) => void
    deleteAction?: (taxonomy: TYPE_Taxonomy) => void
}
const TaxonomyItem = ({ taxonomy, count, header = false, editAction, deleteAction }: TaxonomyItemProps) => {
    return (
        <>
        {header ? 
            <div className={`${Styles.itemContainer} ${Styles.headerContainer}`}>
                <span className={Styles.taxonomyId}>ID</span>
                <h1 className={Styles.taxonomyName}>NOME</h1>
                <p className={Styles.taxonomySlug}>SLUG</p>
                <span className={Styles.taxonomyCount}>{count ? 'UTILIZAÇÃO' : ''}</span>
                <div className={Styles.taxonomyActions}>AÇÕES</div>
            </div>
        : 
            <div className={Styles.itemContainer}>
                    <label className={Styles.labelId}>ID</label>
                    <span className={Styles.taxonomyId}>{taxonomy?.id}</span>
                    <label className={Styles.labelName}>Nome</label>
                    <h1 className={Styles.taxonomyName}>{taxonomy?.name}</h1>
                    <label className={Styles.labelSlug}>Slug</label>
                    <p className={Styles.taxonomySlug}>{taxonomy?.slug}</p>
                    <label className={Styles.labelCount}>Utilização</label>
                    <span className={Styles.taxonomyCount}>{count}</span>
                    <label className={Styles.labelAction}>Ações</label>
                    {taxonomy?.slug !== 'sem-categoria' ? <div key={taxonomy?.slug} className={Styles.taxonomyActions}>
                        <AdminButton onClick={() => editAction && taxonomy && editAction(taxonomy)} >Editar</AdminButton>
                        <AdminButton onClick={() => deleteAction && taxonomy && deleteAction(taxonomy) } >Excluir</AdminButton>
                    </div> 
                    :
                    <span className={Styles.taxonomyActions}></span>}
                </div>
        }
        </>
    )
}

export default TaxonomyItem

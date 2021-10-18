import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { dateFormat_inFull } from '../../../functions/date-format'
import { TYPE_Cars } from '../../../context/context-types'
import Styles from './car-item.module.css'

type CarItemProps = {
    car: TYPE_Cars
    link?: string
}

const CarItem = ({ car, link }: CarItemProps) => {
    const { code, thumbnail, title, registration, year, motor, price, salePrice } = car

    return (
        <Link href={link ? link : '#'} passHref>
            <div className={Styles.item}>
                <div className={Styles.image}>
                    {thumbnail && <Image src={thumbnail} alt={title} width={270} height={170} quality={100} objectFit="cover" layout="responsive"/>}
                </div>
                <div className={Styles.title}>
                    <h1>{title}</h1>
                    <div className={Styles.itemDescription}><p>Anunciado em: </p><span>{dateFormat_inFull(registration)}</span></div>
                    <div className={Styles.itemDescription}><p>Código do anúncio: </p><span>{code}</span></div>
                    <div className={Styles.itemDescription}><p>Ano: </p><span>{year}</span></div>
                    <div className={Styles.itemDescription}><p>Motorização: </p><span>{motor}</span></div>
                    <div className={Styles.itemDescription}><p>Valor: </p><span>{Number(price).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}</span></div>
                    {salePrice > 0 && <div className={Styles.itemDescription}><p>Valor promocional: </p><span>{Number(salePrice).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}</span></div>}
                </div>
            </div> 
        </Link>
    )
}

export default CarItem

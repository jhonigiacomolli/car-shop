import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Tachometer, Calendar, Engine } from '../icons'
import Styles from './boxed-car.module.css'
import { dateFormat_short } from 'functions/date-format'
import { TYPE_Cars } from 'context/context-types'
import { useConfig } from 'context'

type BoxedCarProps = {
    car: TYPE_Cars
    theme?: 'light' | 'dark'
}
const BoxedCar = ({ car, theme = 'light' }: BoxedCarProps) => {
    const { slug, thumbnail, title, km, year, motor, registration, price, salePrice } = car
    const { setLoading } = useConfig()
    const formatedPrice = Number(price).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })
    const formatedSalePrice = Number(salePrice).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })
    const formatedKm =  Number(km).toLocaleString("pt-BR")

    function priceVerification(){
        if(salePrice) {
            return (
                <div className={Styles.price}>
                    <div className={Styles.decoratePrice}>
                        <h2 className={Styles.scratch}>{formatedPrice}</h2>
                        <h2 className={Styles.value}>{formatedSalePrice}</h2>
                    </div>
               </div>
            )
        }else {
            return (
                <div className={Styles.price}>
                    <div className={Styles.decoratePrice}>
                        <h2 className={Styles.value}>{formatedPrice}</h2>
                    </div>
               </div>
            )
        }
    }

    return (
        <>
            {
                car 
                ? <Link aria-label={title} href={`/car/${slug}`} passHref>
                    <div onClick={() => setLoading(true)} className={`${Styles.car} ${Styles[theme]}`}>
                        <div className={Styles.image} > 
                            {thumbnail && <Image src={thumbnail} alt={title} width={270} height={170} quality={100} objectFit="cover" layout="responsive"/>}
                        </div>
                        <h2 className={Styles.title}>{title}</h2>
                        <div className={Styles.carDetail}>
                                <Engine label={'Motor'}/>
                                <h2>{motor}</h2>
                                <Tachometer label={'KM'} />
                                <h2>{formatedKm}</h2>
                                <Calendar label={'Ano'} />
                                <h2>{year}</h2>
                        </div>
                        <span className={Styles.publish}>Anúnciado em: {dateFormat_short(registration)}</span>
                            {
                                priceVerification()   
                            }
                    </div>
                </Link> 
                : ''
            }
        </>
    )
}

export default BoxedCar

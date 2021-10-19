import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Styles from './simple-slide.module.css'

type SimpleSlideProps = {
    slides: string[]
}
const SimpleSlide = ({ slides }: SimpleSlideProps) => {
    const [list, setList] = useState<string[]>([])
    const [item, setItem] = useState(0)
    let timer = useRef(0)
    
    useEffect(() => {
        setList(slides)
        setItem(0)
    }, [slides])

    useEffect(() => {
        clearTimeout(timer.current)
        if(item < (list.length - 1)) {
            timer.current = window.setTimeout(() => setItem(item + 1), 10000)
        } else {
            timer.current = window.setTimeout(() => setItem(0), 10000)
        }

        return () => clearTimeout(timer.current)
    }, [item])
    
    return (
        <div className={Styles.container}>
                {list.map((slide, index) => (
                    <div key={`${index}-${slide}`} className={`${Styles.slide} ${index === item ? Styles.visible : ''}`}>
                        <Image alt="Slide" key={`${index}-${slide}`} src={slide}  width="600" height="300" objectFit="cover" />
                    </div>
                ))}
        </div>
    )
}

export default SimpleSlide

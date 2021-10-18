import { useEffect, useState } from 'react'
import { useConfig } from 'context'
import Styles from './divisors.module.css'

type DivisorCarProps = {
    invertedX?: boolean
    invertedY?: boolean
    height?: number
    id?: string
    color?: string
    overlap?: 'top' | 'bottom'
    zIndex?: number
}

const DivisorCar = ({ 
    id,
    invertedX = false,
    invertedY = false,
    height = 100,
    color = '#000',
    overlap,
    zIndex 
}: DivisorCarProps) => {
    const { windowWidth } = useConfig()
    const [rotateX, setRotateX] = useState(invertedX)
    const [rotateY, setRotateY] = useState(invertedY)
    const [rotate, setRotate] = useState('')
    const [divisirHeight, setDivisorHeight] =useState(height)

   useEffect(() => {
        rotateX && rotateY && setRotate("rotateX(180deg) rotateY(180deg)")
        rotateX && !rotateY && setRotate("rotateX(180deg) rotateY(0deg)")
        !rotateX && rotateY && setRotate("rotateX(0deg) rotateY(180deg)")
        !rotateX && !rotateY && setRotate("rotateX(0deg) rotateY(0deg)")
    },[rotateX, rotateY])

   useEffect(() => {
        windowWidth > 767 && setDivisorHeight(height)
        windowWidth <= 767 && windowWidth > 480 && setDivisorHeight(height * 0.5)
        windowWidth <= 480 && setDivisorHeight(height * 0.3)
    }, [windowWidth, height])

    return (
        <svg 
            id={id}
            className={Styles.divisorTop} 
            style={{
                zIndex: zIndex,
                marginTop: overlap === 'top' ? `-${divisirHeight}px` : '0px',
                marginBottom: overlap === 'bottom' ? `-${divisirHeight}px` : '0px',
                transform: rotate,
                fill: color
            }} 
            width={windowWidth.toString()} 
            height={divisirHeight}  
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 457.41 25"
        >
            <path d="M67.74,383.23H524.58V361.76H198.76a12,12,0,0,0-4.21-2.83c-1-.77-5.93-3.38-7.34-3.6a43.12,43.12,0,0,0-6.69-2.29,35.43,35.43,0,0,0-7.77-1.31c-.86-.43-3.56.22-4.64-.22-4.53-1.85-9.28-4.47-14-6.32a47.17,47.17,0,0,0-7.55-2.61,25.19,25.19,0,0,0-4.32-.88c-.33.33-.11.22-.33.55l-.1,1.2a24.11,24.11,0,0,0,3.34,1,61.25,61.25,0,0,1,6.26,2.4,13.69,13.69,0,0,1,2.81,1.41.74.74,0,0,0-.43.55v.87c.1,1.31.43,1.64,1.51,1.85l-.11.22c-1.3,1.09-.22.77-3.45.77h-4.32c-2.81,0-5.4-.33-8.1-.44L138,351.3c-.11-.11,0,0-.22-.11-1.08-.33-8.74-1.09-10.25-1.64l-6.47-2.61-.11.21c0,.11,0,.11-.11.11a31.62,31.62,0,0,1-.32-3.49c0-.65-.11-.87-.76-1a4.41,4.41,0,0,0-1.73.33c-1.08-.22-7.77,1.42-9.49,1.85l-9.61,2c-1.62.21-3.24.65-4.86.87s-3.45.33-5.28.54a45.62,45.62,0,0,0-7.56,1.09c-.54.22-1.72.66-2.16.77-1.29,0-3.23-.33-3.34,1.2-.11.54.21,1.3.11,2.18-.11.65-.33,1.19-.44,1.74-.86.33-1.51.54-1.29,1.74l.43.22c-.75.66-.65,1.42-.65,2.73a6.7,6.7,0,0,0,.11,1.74H67.74Z" transform="translate(-67.46 -341.42)" fillRule="evenodd"/>
        </svg>
    )


}
export default DivisorCar


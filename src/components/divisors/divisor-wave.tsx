import { useConfig } from 'context'
import { useEffect, useState } from 'react'
import Styles from './divisors.module.css'

type DivisorWaveProps = {
    invertedX?: boolean
    invertedY?: boolean
    height?: number
    id?: string
    color?: string
    overlap?: 'top' | 'bottom'
    zIndex?: number
    fillColor1: string
    fillColor2: string
    fillColor3: string
}

const DivisorWave = ({ 
    id,
    invertedX = false,
    invertedY = false,
    height = 100,
    color = '#000',
    fillColor1,
    fillColor2,
    fillColor3,
    overlap,
    zIndex 
}: DivisorWaveProps) => {
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
            viewBox="0 0 460.8 72"
            preserveAspectRatio="none"
        >
            <path fill={fillColor1} d="M536.4,412.49V389.07H75.6v41.14c38.24-39.14,69.7-43.37,110.72-35.5,75.6,13,219.8,64.33,350.08,17.78Z" transform="translate(-75.6 -389.07)" fillRule="evenodd"/>
            <path fill={fillColor2} d="M168.94,392.05c68.92,6.18,226.35,70.6,367.46,20.18v17.92c-207,24.6-298.66-31.26-367.46-38.1Z" transform="translate(-75.6 -389.07)" fillRule="evenodd"/>
            <path fill={fillColor3} d="M75.6,430c100.8-103.27,154.57,36.37,460.8,0v36.37H75.6Z" transform="translate(-75.6 -389.07)" fillRule="evenodd"/>
        </svg>
    )


}
export default DivisorWave


import { useConfig } from 'context'
import { useEffect, useState } from 'react'
import Styles from './divisors.module.css'

type DivisorTiltProps = {
    invertedX?: boolean
    invertedY?: boolean
    gradientName?: string
    gradientOrientation?: 'horizontal' | 'vertical'
    height?: number
    id?: string
    color?: string
    overlap?: 'top' | 'bottom'
    zIndex?: number
}
const DivisorTilt = ({ 
    id,
    invertedX = false,
    invertedY = false,
    gradientOrientation = 'vertical',
    gradientName,
    height = 100,
    color = '#000',
    overlap,
    zIndex 
}: DivisorTiltProps) => {
    const { windowWidth } = useConfig()
    const [rotateX, setRotateX] = useState(invertedX)
    const [rotateY, setRotateY] = useState(invertedY)
    const [rotate, setRotate] = useState('')
    const [divisirHeight, setDivisorHeight] = useState(height)

    useEffect(() => {
        rotateX && rotateY && setRotate("rotateX(180deg) rotateY(180deg)")
        rotateX && !rotateY && setRotate("rotateX(0deg) rotateY(180deg)")
        !rotateX && rotateY && setRotate("rotateX(180deg) rotateY(0deg)")
        !rotateX && !rotateY && setRotate("rotateX(0deg) rotateY(0deg)")
    },[rotateX, rotateY])

    useEffect(() => {
        windowWidth > 767 && setDivisorHeight(height)
        windowWidth <= 767 && windowWidth > 480 && setDivisorHeight(height * 0.5)
        windowWidth <= 480 && setDivisorHeight(height * 0.3)
    }, [windowWidth, height])
    
    return (
        <svg id={id}
            className={Styles.divisorTop} 
            style={{
                zIndex: zIndex,
                marginTop: overlap === 'top' ? `-${Math.ceil(divisirHeight)}px` : '0px',
                marginBottom: overlap === 'bottom' ? `-${Math.ceil(divisirHeight)}px` : '0px',
                transform: rotate,
                fill: gradientName ? `url(#${gradientName})` : color
            }} 
            width={`${windowWidth}`} 
            height={divisirHeight} 
            viewBox={`0 0 1000 100`}
            preserveAspectRatio="none" 
            xmlns="http://www.w3.org/2000/svg"
            >
            <defs>                    
                <linearGradient id={gradientName} x1="0%" y1="0%" x2={gradientOrientation === "vertical" ? '0%' : '100%'} y2={gradientOrientation === "vertical" ? '100%' : '0%'}>
                    <stop offset="0%" stopColor={`var(--${gradientName}-start)`} />
                    <stop offset="100%" stopColor={`var(--${gradientName}-end)`} />
                </linearGradient>
            </defs>
            <path className={Styles.divisorTopSolid} d="M0 90.5L1000 0V100H0V90.5Z"/>
        </svg>
    )


}
export { DivisorTilt }


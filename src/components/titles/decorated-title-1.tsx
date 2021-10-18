import Styles from './decorated-title-1.module.css'

type DecoratedTitle1Props = {
    text: string
    className?: string
}
export const DecoratedTitle1 = ({ text, className }: DecoratedTitle1Props) => {
    return (
        <div className={`${Styles.titleContainer} ${className}`}>
            <svg className={Styles.backTitle} xmlns="http://www.w3.org/2000/svg" width="487.7" height="50" viewBox="0 0 487.7 50">
                <defs>
                    <linearGradient id={'decoratedTitle_1_flag'}>
                        <stop offset={'0%'} className={Styles.colorFlag1} />
                        <stop offset={'100%'} className={Styles.colorFlag3} />
                    </linearGradient>
                    <linearGradient id={'decoratedTitle_1_wrap'} x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset={'0%'} className={Styles.colorWrap1} />
                        <stop offset={'100%'} className={Styles.colorWrap2} />
                    </linearGradient>
                </defs>
                <polygon className={Styles.underFlag} points="185.48 42.07 181.43 47.31 59.89 47.31 63.81 42.33 185.48 42.07" fillRule="evenodd"/>
                <polygon className={Styles.flag} fill={'transparent'} points="28.23 6.91 487.7 6.27 459.59 41.69 0 42.45 28.23 6.91" fillRule="evenodd"/>
                <polygon className={Styles.flagWrap} points="46.09 0 100.4 0 60.52 50 6.2 50 46.09 0" fillRule="evenodd"/>
                <g className={Styles.backTicks}>
                    <polygon points="94.83 6.91 100.4 0 100.4 6.91 94.83 6.91" fillRule="evenodd"/>
                    <polygon points="6.2 42.45 6.2 50 12.41 42.45 6.2 42.45" fillRule="evenodd"/>
                </g>
            </svg>
            <h1 className={Styles.textTitle}>
                {text}
            </h1>
        </div>
    )
}

export default DecoratedTitle1

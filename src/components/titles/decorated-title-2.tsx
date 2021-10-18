import Styles from './decorated-title-2.module.css'

type DecoratedTitle2Props = {
    text: string
    className?: string
}

export const DecoratedTitle2 = ({ text, className }: DecoratedTitle2Props) => {
    return (
        <div className={`${Styles.titleContainer} ${className ?? ''}`}>
            <svg className={Styles.backTitle} xmlns="http://www.w3.org/2000/svg" width="570.73" height="50" viewBox="0 0 570.73 50">
                <defs>
                    <linearGradient id={'decoratedTitle_2_flag'}>
                        <stop offset={'5%'} className={Styles.colorFlag1} />
                        <stop offset={'25%'} className={Styles.colorFlag2} />
                        <stop offset={'75%'} className={Styles.colorFlag3} />
                        <stop offset={'95%'} className={Styles.colorFlag4} />
                    </linearGradient>
                    <linearGradient id={'decoratedTitle_2_wrap'} x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset={'0%'} className={Styles.colorWrap1} />
                        <stop offset={'100%'} className={Styles.colorWrap2} />
                    </linearGradient>
                </defs>
                <g className={Styles.backTicks}>
                    <polygon points="457.12 6.99 463.75 0 463.75 6.99 457.12 6.99" fillRule="evenodd"/>
                    <polygon points="103.22 42.25 103.22 50 110.59 42.25 103.22 42.25" fillRule="evenodd"/>
                </g>
                <polygon className={Styles.flag} points="24.68 6.99 570.73 6.23 546.2 41.64 0 42.25 24.68 6.99" fillRule="evenodd"/>
                <polygon className={Styles.underFlag} points="478.49 41.49 475.03 46.66 60.34 46.66 63.8 41.64 478.49 41.49" fillRule="evenodd"/>
                <polygon className={Styles.flagWrap} points="141.74 0 463.75 0 428.99 50 103.22 50 141.74 0" fillRule="evenodd"/>
            </svg>
            <h1 className={Styles.textTitle}>
                {text}
            </h1>
        </div>
    )
}

export default DecoratedTitle2

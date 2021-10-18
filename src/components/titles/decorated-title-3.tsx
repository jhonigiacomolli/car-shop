import Styles from './decorated-title-2.module.css'

type DecoratedTitle3Props = {
    text: string
    className?: string
}

export const DecoratedTitle3 = ({ text, className }: DecoratedTitle3Props) => {
    return (
        <div className={`${Styles.titleContainer} ${className ?? ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="397.82" height="10" viewBox="0 0 397.82 10">
                <polygon className={Styles.line} points="397.82 7.59 394.48 10 0 10 3.22 7.71 397.82 7.59" fill="#b3b3b3" fillRule="evenodd"/>
                <polygon className={Styles.flag} points="97.58 0 309.07 0 325.42 10 67.16 10 97.58 0" fill="#333" fillRule="evenodd"/>
            </svg>
            <h1 className={Styles.textTitle}>
                {text}
            </h1>
        </div>
    )
}

export default DecoratedTitle3
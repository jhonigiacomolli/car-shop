import { useConfig } from '../../context'
import Styles from './video-player.module.css'

type VideoPlayerProps = {
    url: string
    closeChange: () => void
}
const VideoPlayer = ({ url, closeChange }: VideoPlayerProps) => {
    const { windowHeight } = useConfig()
    const urlSplit =  url.includes('watch') ? url.split('=') : url.split('/')
    const videoURL = urlSplit[urlSplit.length - 1]

    return (
        <div className={Styles.playerContainer}>
            <div className={Styles.playerContent} style={{ height: windowHeight < 500 ? `${windowHeight}` : '100%' }} >
                <span className={Styles.close} onClick={closeChange} >X</span>
                <div className={Styles.player} >
                    {url.includes('youtube') && <object width="100%" height="100%" data={`https://www.youtube.com/embed/${videoURL}`} ></object>}
                    {url.includes('vimeo') && <object width="100%" height="100%" data={`https://player.vimeo.com/video/${videoURL}`} ></object>}
                    {!url.includes('youtube') && !url.includes('vimeo') && <span className={Styles.noVideo}>Formato de video não suportado</span>}
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer


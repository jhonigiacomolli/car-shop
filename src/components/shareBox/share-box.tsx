import { useConfig } from 'context'
import { Facebook, Twitter, Whatsapp, Telegram, Share1 } from 'components/icons'
import Animations from 'animations/animations.module.css'
import Styles from './share-box.module.css'

type ShareBoxProps = {
    sectionTitle: string
    title: string
    description: string
    link: string
}
const ShareBox = ({ sectionTitle, title, description, link }: ShareBoxProps) => {
    const { windowWidth } = useConfig()
    function share() {
        if (navigator.share !== undefined) {
            navigator.share({
                title: title,
                text: description,
                url: link,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        }
    }

    return (
        <div className={Styles.container}>
            <h3 className={Styles.title}>{sectionTitle}</h3>
            {windowWidth > 991 && <div className={Styles.iconsContainer}>
                <a className={`${Styles.icon} ${Styles.facebookIcon} ${Animations.pulse}`} href={`https://www.facebook.com/sharer/sharer.php?u=${link}`} target={'_blank'}  rel={'noopener noreferrer'}>
                    <Facebook />
                </a>
                <a className={`${Styles.icon} ${Styles.twitterIcon} ${Animations.pulse}`} href={`https://twitter.com/intent/tweet?url=${link}&text=${title}`}  target={'_blank'}  rel={'noopener noreferrer'}>
                    <Twitter />
                </a>
                <a className={`${Styles.icon} ${Styles.whatsappIcon} ${Animations.pulse}`} href={`https://wa.me/?text=${link}`}  target={'_blank'}  rel={'noopener noreferrer'}>
                    <Whatsapp />
                </a>
                <a className={`${Styles.icon} ${Styles.telegramIcon} ${Animations.pulse}`} href={`https://t.me/share/url?url=${link}&text=${title}`} target={'_blank'}  rel={'noopener noreferrer'}>
                   <Telegram />
                </a>
            </div>}
            {windowWidth < 991 && (
                <a onClick={() => share()} className={`${Styles.shareIcon} ${Animations.pulse}`}>
                    <>
                    <Share1 label={'Compartilhe com os amigos'} />
                    </>
                </a>
            )}
        </div>
    )
}

export default ShareBox

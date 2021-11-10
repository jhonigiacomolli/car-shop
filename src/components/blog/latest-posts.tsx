import DecoratedTitle4 from 'components/titles/decorated-title-4'
import { useConfig } from 'context'
import Styles from './blog.module.css'
import Animations from 'animations/animations.module.css'
import ShortPost from './short-post'
import { TYPE_Posts } from 'context/context-types'
import PrimaryButton from 'components/buttons/primary-button'

type LatestPostsProps = {
    backgroundColor: string
    blogPosts: TYPE_Posts[]
} 
const LatestPosts = ({backgroundColor, blogPosts}: LatestPostsProps) => {
    const { config, setLoading } = useConfig()

    return (
        <div style={{ backgroundColor: backgroundColor }} className={Styles.container}>
            <div className={Styles.latestPosts}>
                <DecoratedTitle4 text={config.blog && config.blog.latestPosts.sectionTitle} />
                <div className={`${Styles.postContent} ${Animations.revealUp}`}>
                    {blogPosts && blogPosts.map((post, index) => {
                        if(config.blog && index < config.blog.latestPosts.numberOfPosts) {
                            return <ShortPost key={post.id} post={post} />
                        }
                    })}
                </div>
                <div className={Styles.button}>
                    <PrimaryButton 
                        label={'Todas as publicações'} 
                        onClick={() => setLoading(true)} 
                        link={config.blog && config.blog.latestPosts.buttonLink} 
                    >
                        {config.blog && config.blog.latestPosts.buttonLabel}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    )
}

export default LatestPosts

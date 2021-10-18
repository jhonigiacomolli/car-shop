import Image from 'next/image'
import Link from 'next/link'
import { useConfig } from 'context'
import { No_Logo, User } from 'components/icons'
import MainMenu from 'components/menu/main-menu'
import Styles from './header.module.css'
import SearchBar from 'components/search/search-bar'

const Header = () => {
    const { config, windowWidth, page, setLoading, position } = useConfig()

    return(
        <header id="header" className={`${`${Styles.header} ${position > 2 ? Styles.sticky : ''}`} ${page==='home' ? Styles.home : ''}`}>
            <div className={Styles.menu}>
                <div className={Styles.menuContent}>
                    {windowWidth > 767 && <SearchBar className={Styles.search} theme="dark" />}
                    <div onClick={() => page !== 'home' &&  setLoading(true)} className={Styles.logo}> 
                        <Link href={page !== 'home' ? '/' : '#'} aria-label={'Logomarca'}>
                            <a>
                            {(config.header && config.header.logo) ? 
                                <Image src={config.header.logo} alt={'Logomarca'} width={450} height={100} quality={100} objectFit="contain"/> 
                            :
                                <No_Logo className={Styles.noLogo}/>
                            }
                            </a>
                        </Link>
                    </div>
                    <div className={Styles.user} >
                        <Link href="/admin">
                            <a onClick={() => setLoading(true)}>
                                <User />
                                {windowWidth > 480 && 'Entrar'}
                            </a>
                        </Link>
                    </div>
                </div>
                <div className={Styles.mainMenu}>
                    <MainMenu />
                </div>
            </div>
        </header>
    )
}

export default Header
import Image from 'next/image'
import Link from 'next/link'
import { useConfig } from 'context'
import { No_Logo, User } from 'components/icons'
import MainMenu from 'components/menu/main-menu'
import Styles from './header.module.css'
import SearchBar from 'components/search/search-bar'
import { useEffect, useState } from 'react'

type HeaderProps = {
    theme?: 'light' | 'dark'
}
const Header = ({ theme = 'light' }:HeaderProps) => {
    const { config, page, position, setLoading } = useConfig()
    const [sticky, setSticky] = useState(false)

    useEffect(() => {
        setSticky(position > 12 ? true : false)
    }, [position])

    return(
        <header id={'header'} className={`${Styles.header} ${Styles[theme]} ${page==='home' && Styles.home} ${sticky ? Styles.sticky : ''}`}>
            <div className={Styles.menu}>
                <div onClick={() => page !== 'home' &&  setLoading(true)} className={Styles.logo}> 
                    <Link href={page !== 'home' ? '/' : '#'} aria-label={'Logomarca'}>
                        <a>
                        {(config.header && config.header.logo) ? 
                            <Image src={config.header.logo} alt={'Logomarca'} width={sticky ? 200 : 280} height={sticky ? 80 : 100} layout="fixed" quality={100} objectFit="contain"/> 
                        :
                            <No_Logo className={Styles.noLogo}/>
                        }
                        </a>
                    </Link>
                </div>
                <MainMenu theme="light" className={Styles.mainMenu} setSticky={setSticky} position={'main'}/>
            </div>
        </header>
    )
}

export default Header
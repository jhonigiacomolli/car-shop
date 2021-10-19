import Link from 'next/link'
import { Dispatch, useEffect, useState } from 'react'
import { useConfig } from 'context'
import Styles from './main-menu.module.css'

type MainMenuProps = {
    position?: 'main' | 'footer'
    theme: 'light' | 'dark'
    className?: string
    setSticky: Dispatch<boolean>
}
const MainMenu = ({ position = 'main', theme, setSticky }: MainMenuProps) => {
    const { windowWidth, setLoading } = useConfig()
    const [toggle, setToggle] = useState(false)    
    const main = position === 'main' ? true : false

    useEffect(() => {
        if (!toggle) {
            document.getElementById('sub-cars')?.classList.remove(Styles.activeMenu)
        }
    }, [toggle])

    function activateMenu(element: string) {
        element !== 'sub-cars' && document.getElementById('sub-cars')?.classList.remove(Styles.activeMenu)
        document.getElementById(element)?.classList.toggle(Styles.activeMenu)
    }

    return (
        <nav className={`${Styles[theme]} ${toggle ? Styles.mobileMenu : ''}`}>
            <ul className= {windowWidth <= 767 && !toggle ? `${Styles.mainMenu} ${Styles.mobile}` : Styles.mainMenu}>
                <li aria-label={'Para página inicial'} onClick={() => {toggle &&  setToggle(!toggle), setSticky(false), window.scrollTo(0,0) }}>
                    <Link href="/">Home</Link>
                    </li>
                <li aria-label={'Para sessão veículos'} onClick={windowWidth > 767 ? () => {toggle && setToggle(!toggle), setSticky(true) } : (e) => activateMenu('sub-cars')}>
                    <Link href={windowWidth > 767 ? "/#veiculos" : ''}>Veículos</Link>
                    <ul id={'sub-cars'} className={Styles.subMenu}>
                        <li onClick={() => { toggle && setToggle(!toggle), setSticky(true) }}>
                            <Link href={'/#veiculos'}>Em destaque</Link>
                        </li>
                        <li onClick={() => {toggle && setToggle(!toggle), setLoading(true), setSticky(true)}}>
                            <Link href={'/car'}>Todos os veículos</Link>
                        </li>
                    </ul>
                </li>
                <li aria-label={'Para sessão sobre-nós'} onClick={() => {toggle && setToggle(!toggle), setSticky(true)}}>
                    <Link href="/#sobre">Sobre Nós</Link>
                </li>
                <li aria-label={'Para sessão Contato'}  onClick={() => {toggle && setToggle(!toggle), setSticky(true)}}>
                    <Link href="/#sobre">Contato</Link>
                </li>
            </ul>
            <div aria-label={'Menu'}  className={ windowWidth <= 767 && main ? `${Styles.toggleMenu} ${Styles.mobile}` : Styles.toggleMenu} onClick={() => setToggle(!toggle)}>
                <span className={toggle ? `${Styles.toggle1} ${Styles.toggleOpen}` : Styles.toggle1}></span>
                <span className={toggle ? `${Styles.toggle2} ${Styles.toggleOpen}` : Styles.toggle2}></span>
                <span className={toggle ? `${Styles.toggle3} ${Styles.toggleOpen}` : Styles.toggle3}></span>
            </div>
        </nav>
    )
}

export default MainMenu

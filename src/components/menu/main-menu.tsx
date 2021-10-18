import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useConfig } from 'context'
import Styles from './main-menu.module.css'

type MainMenuProps = {
    position?: 'main' | 'footer'
}
const MainMenu = ({ position = 'main' }: MainMenuProps) => {
    const { windowWidth, setLoading } = useConfig()
    const [toggle, setToggle] = useState(false)    
    const main = position === 'main' ? true : false

    useEffect(() => {
        if (!toggle) {
            document.getElementById('sub-portfolio')?.classList.remove(Styles.activeMenu)
            document.getElementById('sub-host')?.classList.remove(Styles.activeMenu)
            document.getElementById('sub-dev')?.classList.remove(Styles.activeMenu)
            document.getElementById('sub-media')?.classList.remove(Styles.activeMenu)
            document.getElementById('sub-blog')?.classList.remove(Styles.activeMenu)
        }
    }, [toggle])

    function activateMenu(element: string) {
        element !== 'sub-portfolio' && document.getElementById('sub-portfolio')?.classList.remove(Styles.activeMenu)
        element !== 'sub-host' && document.getElementById('sub-host')?.classList.remove(Styles.activeMenu)
        element !== 'sub-dev' && document.getElementById('sub-dev')?.classList.remove(Styles.activeMenu)
        element !== 'sub-media' && document.getElementById('sub-media')?.classList.remove(Styles.activeMenu)
        element !== 'sub-blog' && document.getElementById('sub-blog')?.classList.remove(Styles.activeMenu)
        document.getElementById(element)?.classList.toggle(Styles.activeMenu)
    }

    return (
        <div className={toggle ? Styles.container : ''}>
            <nav className={toggle ? Styles.mobileMenu : ''}>
                <ul className= {windowWidth <= 767 && !toggle ? `${Styles.mainMenu} ${Styles.mobile}` : Styles.mainMenu}>
                    <li aria-label={'Para página inicial'} onClick={() => toggle && setToggle(!toggle)}>
                        <Link href="/#">Home</Link>
                    </li>
                    <li onClick={windowWidth > 767 ? () => toggle && setToggle(!toggle) : (e) => activateMenu('sub-portfolio')}>
                        <Link href="/#portfolio">Portfólio</Link>
                        <ul id={'sub-portfolio'} className={Styles.subMenu}>
                            <li onClick={() => toggle && setToggle(!toggle)}>
                                <Link href="/#portfolio">Portfólio Recente</Link>
                            </li>
                            <li onClick={() => toggle && setToggle(!toggle)}>
                                <Link href="/portfolio">Portfólio Completo</Link>
                            </li>
                        </ul>
                    </li>
                    <li onClick={windowWidth > 767 ? () => toggle && setToggle(!toggle) : (e) => activateMenu('sub-host')}>
                        <Link href="/#planos-hospedagem">Planos de Hospedagem</Link>
                        <ul id={'sub-host'} className={Styles.subMenu}>
                            <li onClick={() => toggle && setToggle(!toggle)}>
                                <Link href="/#info-planos">Dúvidas sobre os planos?</Link>
                            </li>
                        </ul>
                    </li>      
                    <li onClick={windowWidth > 767 ? () => toggle && setToggle(!toggle) : (e) => activateMenu('sub-dev')}>
                        <Link href="/#desenvolvimento-web">Desenvolvimento Web</Link>
                        <ul id={'sub-dev'} className={Styles.subMenu}>
                            <li onClick={() => toggle && setToggle(!toggle)}>
                                <Link href="/#site-institucional">Site Institucional</Link>
                            </li>
                            <li onClick={() => toggle && setToggle(!toggle)}>
                                <Link href="/#plataforma-ecommerce">Plataforma Ecommerce</Link>
                            </li>
                        </ul>
                    </li>     
                    <li aria-label={'Para sessão Contato'}  onClick={() => toggle && setToggle(!toggle)}>
                        <Link href="/#depoimentos">Depoimentos</Link>
                    </li>
                    <li onClick={windowWidth > 767 ? () => toggle && setToggle(!toggle) : (e) => activateMenu('sub-media')}>
                        <Link href="/#midias-sociais">Mídias Sociais</Link>
                        <ul id={'sub-media'} className={Styles.subMenu}>
                            <li onClick={() => toggle && setToggle(!toggle)}>
                                <Link href="/#pacote-midia-basico">Pacote Básico</Link>
                            </li>
                            <li onClick={() => toggle && setToggle(!toggle)}>
                                <Link href="/#pacote-midia-ouro">Pacote Ouro</Link>
                            </li>
                            <li onClick={() => toggle && setToggle(!toggle)}>
                                <Link href="/#pacote-midia-diamante">Pacote Diamante</Link>
                            </li>
                        </ul>
                    </li>
                    {/* <li onClick={windowWidth > 767 ? () => toggle && setToggle(!toggle) : (e) => activateMenu('sub-portfolio')}>
                        <a>Blog</a>
                        <ul id={'sub-portfolio'} className={Styles.subMenu}>
                            <li onClick={() => toggle && setToggle(!toggle)}>
                                <Link href="/#portfolio">Matérias Recente</Link>
                            </li>
                            <li onClick={() => toggle && setToggle(!toggle)}>
                                <Link href="/portfolio">Todas as Matérias</Link>
                            </li>
                        </ul>
                    </li> */}
                    <li aria-label={'Para sessão Contato'}  onClick={() => toggle && setToggle(!toggle)}>
                        <Link href="#contato">Contato</Link>
                    </li>
                    
                </ul>
                <div aria-label={'Menu'}  className={ windowWidth <= 767 && main ? `${Styles.toggleMenu} ${Styles.mobile}` : Styles.toggleMenu} onClick={() => setToggle(!toggle)}>
                    <span className={toggle ? `${Styles.toggle1} ${Styles.toggleOpen}` : Styles.toggle1}></span>
                    <span className={toggle ? `${Styles.toggle2} ${Styles.toggleOpen}` : Styles.toggle2}></span>
                    <span className={toggle ? `${Styles.toggle3} ${Styles.toggleOpen}` : Styles.toggle3}></span>
                </div>
            </nav>
        </div>
    )
}

export default MainMenu

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { TYPE_Users } from 'context/context-types'
import Styles from './user-item.module.css'

type UserItemProps = {
    user: TYPE_Users
    link?: string
}
const UserItem = ({ user, link = '#' }: UserItemProps) => {
    const {
        username,
        name,
        capability,
        picture
    } = user
    const [userCapability, setUserCapability] = useState('')

    useEffect(() => {
        switch(user.capability) {
            case 'administrator':
                setUserCapability('MS Administrador')
                break
            case 'editor':
                setUserCapability('Usuário Master')
                break
            case 'contributor':
                setUserCapability('Usuário')
                break
        }
    },  [user])

    return (
        <Link href={link} passHref>
            <div className={Styles.item}>
                <div className={Styles.image}>
                    {picture && (
                        <Image 
                            src={picture} 
                            width={110} 
                            height={110} 
                            quality={100} 
                            alt={`Imagem do perfil ${name}`} 
                            objectFit="cover" 
                            layout="responsive"
                        />
                    )}
                </div>
                <div className={Styles.title}>
                    <span>Nome: <h1>{name}</h1></span>
                    <p>Username: <span>{username}</span></p>
                    <p>Capacidade: <span>{userCapability}</span></p>
                </div>
            </div> 
        </Link>
    )
}

export default UserItem

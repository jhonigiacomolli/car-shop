import axios from 'axios'
import { Dispatch, useEffect } from 'react'
import { administration, api } from 'api/api'
import { TYPE_Users } from 'context/context-types'
import AdminPanel from 'components/admin'

type AdminProps = {
    users: TYPE_Users[]
    setAdminArea: Dispatch<boolean>
}
const Admin = ({ users, setAdminArea }: AdminProps) => {

    useEffect(() => {
        setAdminArea(true)

        return () => {
            setAdminArea(false)
        }
    }, [])  
    
    return <AdminPanel users={users} />
}

export default Admin

export async function getServerSideProps() {
    const { data: usersClient } = await axios.get<TYPE_Users[]>(`${api}/users`)
    const { data: usersMS } = await axios.get<TYPE_Users[]>(`${administration}/users`)

    return {
        props: {
            users: [...usersMS.filter(user => user.capability === 'administrator' && !usersClient.find(item => item.email === user.email)), ...usersClient]
        }
    }
}
import { useConfig } from 'context'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import styles from '../styles/index.module.scss'

const Home: NextPage = () => {
  const { setLoading } = useConfig()

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className={styles.container}>
      
    </div>
  )
}

export default Home

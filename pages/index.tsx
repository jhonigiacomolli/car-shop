import axios from 'axios'
import { api } from 'api/api'
import { useConfig } from 'context'
import { TYPE_Cars, TYPE_CarTaxonomies, TYPE_ConfigProps, TYPE_Posts } from 'context/context-types'
import { useEffect } from 'react'
import Home from './home'

type HomePageProps = {
  config: TYPE_ConfigProps
  blog: TYPE_Posts[]
  cars: TYPE_Cars[]
  taxonomies: TYPE_CarTaxonomies
}
export default function HomePage ({ blog, config, cars, taxonomies }: HomePageProps) {
  const { setConfig, setCars, setBlog, setLoading } = useConfig()
  
  useEffect(() => {
    setConfig(config)
    setCars(cars)
    setBlog(blog)
    setLoading(false)
  }, [])

  return (
      <>
        <Home config={config} blog={blog} cars={cars} taxonomies={taxonomies} />
      </>
  )
}

export async function getStaticProps() {
  const { data: config } = await  axios.get<TYPE_ConfigProps>(`${api}/config`)
  const numberOfPosts = config.blog.latestPosts.numberOfPosts
  const { data: blog } = await  axios.get<TYPE_Posts[]>(`${api}/blog?_limit=${numberOfPosts}`)
  const { data: cars } = await  axios.get<TYPE_Cars[]>(`${api}/cars`)
  const { data: taxonomies } = await axios.get<TYPE_CarTaxonomies>(`${api}/cars/taxonomies`)

  return {
      props: {
          blog,
          cars,
          taxonomies,
          config,
      },
      revalidate: config.revalidate
  }
}

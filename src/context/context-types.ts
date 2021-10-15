import { Dispatch, ReactElement, ReactNode } from "react"

export type TYPE_Message_Types = 'warning' | 'error' | 'success'

export type TYPE_API_Response<T> = {
    status: 200 | 500
    message: string
    data: T
}
export type TYPE_Ticket_Message = {
  author: string
  message: string
  time: string
  attachments: string[]
}
export type TYPE_Tickets = {
  id: number,
  domain: string
  title: string,
  status: 'open' | 'progress' | 'closed',
  author: string,
  messages: TYPE_Ticket_Message[]
}
export type TYPE_Portfolio = {
  id: number
  cover: string
  title: string
  subtitle: string
  description: string
  buttonLabel: string
  buttonLink: string
}
export type TYPE_InfoProduct = {
  sectionTitle: string
  backgroundImage: string
  title: string
  image: string
  subtitle: string
  description: string
  resources: { 
    icon: string
    title: string
    description: string
  }[]
  buyLink: string
  infoLink: string
  contactLink?: string
  price?: number
}
export type TYPE_PacakageItens = {
  text: string
  available: boolean
}
export type TYPE_Packages = {
  recommended: boolean
  title: string,
  icon: string,
  itens: TYPE_PacakageItens[],
  price: number,
  infoLink: string,
  buyLink: string,
}
export type TYPE_Jobs_Taxonomies = {
  sector: TYPE_Taxonomy[]
  type: TYPE_Taxonomy[]
  remunerationType: TYPE_Taxonomy[]
  careerLevel: TYPE_Taxonomy[]
  expirience: TYPE_Taxonomy[]
  gender: TYPE_Taxonomy[]
  prerequisites: TYPE_Taxonomy[]
}
export type TYPE_Jobs = {
  id: number
  slug: string
  title: string
  description: string
  sector: string
  type: string
  skills: string
  careerLevel: string
  expirience: string
  gender: string
  creation: string
  prerequisites: string[]
  remunerationType: string
  remuneration: number
  imageID: number
  image: string
}
export type TYPE_Branch = {
  id: number
  title: string
  description: string
  address: string
  email: string
  fixedPhone: string[]
  mobilePhone: string[]
}
export type TYPE_InfoBox = {
  id: number
  icon: string
  title: string
  subtitle: string
  description: string
  buttonLabel: string
  buttonLink: string
}
export type TYPE_Access = {
  date: string
  time: string
  ip: string
  device: string
  browser: string
  os: string
  url: string
  locale: string
  language: string
  userAgent: string
}
export type TYPE_Taxonomy = {
    id: number
    name: string
    slug: string
}
export type TYPE_Category = {
  id: number
  name: string
}
export type TYPE_Users = {
    id: number
    username: string
    name: string
    email: string
    picture: string
    theme: string
    capability: 'administrator' | 'contributor' | 'editor' 
}
export type TYPE_Image = {
    id: number
    url: string
}
export type TYPE_Slide = {
    id: number
    backgroundImage: string
    backgroundImageID: number
    title: string
    subTitle: string
    description: string
    buttonLabel: string
    buttonLink: string
    align: 'left' | 'center' | 'right'
}
export type TYPE_Socials = {
    link: string
    class: string
}
export type TYPE_Job_Image_Type = 'default' | 'job' | 'logo'

export type TYPE_ConfigProps = {
    id: number
    siteTitle: string
    siteDescription: string
    companyFixedPhone: string
    companyMobilePhone: string
    companyEmailAddress: string
    structure: TYPE_Image[],
    favIcon: string
    revalidate: number
    header: {
      logo: string
      topBarLeft: string
      topBarRight: string
      headScripts: string
    },
    slideShow: {
      config: {
        isSlideShow: boolean,
        width: number,
        height: number,
        displayNav: boolean,
        displayTitle: boolean,
        displaySubTitle: boolean,
        displayDescription: boolean,
        displayButton: boolean,
        duration: number
      },
      slides: TYPE_Slide[]
    },
    aboutUs: {
      imageURL: string
      title: string
      text: string
    },
    jobs: {
      displayTitle: boolean
      displayDescription: boolean
      displaySector: boolean
      displayType: boolean
      displaySkills: boolean
      displayCareerLevel: boolean
      displayGender: boolean
      displayPrerequisites: boolean
      displayRemunerationType: boolean
      displayRemuneration: boolean
      displayImage: boolean
      remunerationLabel: string
      jobImageType: 'default' | 'job' | 'logo'
      jobImageDefault: string
    }
    cars: {
      config: {
        carsPerPage: number
        displayFilters: boolean
        displayFilterCondition: boolean
        displayFilterAssembler: boolean
        displayFilterTransmission: boolean
        displayFilterFuel: boolean
        displayFilterMotor: boolean
        displayFilterPorts: boolean
        displayFilterDirection: boolean
        displayFilterEndPlate: boolean
        displayFilterYear: boolean
        displayFilterColor: boolean
        homeFilter1: string
        homeFilter2: string
        homeFilter3: string
        homeFilter4: string
      }
      latestCars: {
        numberOfCars: number
      },
      carPage: {
        dataSectionTitle: string
        optionsSectionTitle: string
        descriptionSectionTitle: string
      }
    }
    blog: {
      config: {
        postsPerPage: number
      },
      latestPosts: {
        sectionTitle: string
        numberOfPosts: number
        buttonLabel: string
        buttonLink: string
      }
    },
    portfolio: {
      latestPortfolios: {
        itemsPerPage: number
      }
    }
    footer: {
      addressTitle:string
      addressText:string
      phoneTitle:string
      phoneText:string
      scheduleTitle:string
      scheduleText:string
    },
    copyright: {
      message: string
    },
    socials: TYPE_Socials[]
    lgpd: {
      cookieEnabled: boolean
      cookieRegister: boolean
      cookieExpireTime: string
      cookieMessage: string
    },
    privacePolicity: {
      content: string
      downloadLink: string
      lastModified: string
    }
}
export type TYPE_Posts = {
  id: number
  slug: string
  title: string
  description: string
  thumbnailID: number
  thumbnail: string
  postDate: string
  author: number
  authorName: string
  categories: TYPE_Category[]
  tags: TYPE_Category[]
  numberComments: number
}
export type TYPE_Cars = {
    id: number
    category: string
    code: string
    title: string
    description: string
    slug:string
    condition:string
    assembler:string
    transmission:string
    fuel:string
    motor:string
    ports:string
    direction:string
    endPlate:string
    color:string
    price: number
    salePrice: number
    registration:string
    km: number
    year:string
    thumbnailID: number
    thumbnail:string
    gallery: TYPE_Image[]
    video: string
    optionals: string[]
}
export type TYPE_CarTaxonomies = {
    assembler: TYPE_Taxonomy[]
    condition: TYPE_Taxonomy[]
    transmission: TYPE_Taxonomy[]
    fuel: TYPE_Taxonomy[]
    motor: TYPE_Taxonomy[]
    ports: TYPE_Taxonomy[]
    endPlate: TYPE_Taxonomy[]
    year: TYPE_Taxonomy[]
    color: TYPE_Taxonomy[]
    optional: TYPE_Taxonomy[]
    direction: TYPE_Taxonomy[]
}
export type TYPE_ContextProps = {
    config: TYPE_ConfigProps 
    page: string
    windowWidth: number
    windowHeight: Number
    position: Number
    searchTerms: string | undefined
    adminComponent: ReactElement
    users: TYPE_Users[]
    blog: TYPE_Posts[]
    blogCategories: TYPE_Taxonomy[]
    blogTags: TYPE_Taxonomy[]
    cars: TYPE_Cars[]
    carsTaxonomies: TYPE_CarTaxonomies
    infoBoxes: TYPE_InfoBox[]
    branches: TYPE_Branch[]
    jobs: TYPE_Jobs[]
    jobsTaxonomies: TYPE_Jobs_Taxonomies
    portfolios: TYPE_Portfolio[]
    tickets: TYPE_Tickets[]
    loading: boolean
    setConfig: Dispatch<TYPE_ConfigProps>
    setPosition: Dispatch<number>  
    setPage: Dispatch<string>
    setSearchTerms: Dispatch<string>
    setAdminComponent: Dispatch<ReactElement>
    setUsers: Dispatch<TYPE_Users[]>
    setBlog: Dispatch<TYPE_Posts[]>
    setBlogCategories: Dispatch<TYPE_Taxonomy[]>
    setBlogTags: Dispatch<TYPE_Taxonomy[]>
    setCars: Dispatch<TYPE_Cars[]>
    setCarsTaxonomies: Dispatch<TYPE_CarTaxonomies>
    setInfoBoxes: Dispatch<TYPE_InfoBox[]>
    setBranches: Dispatch<TYPE_Branch[]>
    setJobs: Dispatch<TYPE_Jobs[]>
    setJobsTaxonomies: Dispatch<TYPE_Jobs_Taxonomies>
    setPortfolios: Dispatch<TYPE_Portfolio[]>
    setTickets: Dispatch<TYPE_Tickets[]>
    setLoading: Dispatch<boolean>
}
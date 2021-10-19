import type { AppProps } from "next/app"
import Head from "next/head"
import ConfigContextProvider from "context"
import LoaderFullView from "components/loaders/loader-full-view"
import { useState } from "react"
import WhatsAppChat from "components/chat/whatsapp-chat"
import BackToTop2 from "components/back-to-top/back-to-top"
import CookieMessage from "components/cookies/cookie-message"
import TopBar from "components/top-bar/top-bar"
import Header from "components/header/header"
import Footer from "components/footer/footer"
import Copyright from "components/copyright/copyright"
import '../styles/global.css'

function MyApp({ Component, pageProps }: AppProps) {
  const { config } = pageProps
  const [adminArea, setAdminArea] = useState(false)

  return (
    <ConfigContextProvider>
      <Head>
        <title>{config && config.siteTitle}</title>
        <link rel="icon" href={config ? config.favIcon : ''} />
        <meta name="description" content={config && config.siteDescription}/>
        <script id="head-scripts"/>
      </Head>
      <div className={!adminArea ? 'container' : 'private-container'} >
        <LoaderFullView />
        {!adminArea && <TopBar  />}
        {!adminArea && <Header theme="light"/>}
        <Component {...pageProps} setAdminArea={setAdminArea} adminArea={adminArea} />
        {!adminArea && <Footer id={'contato'}/>}
        {!adminArea && <Copyright />}
        {!adminArea && <WhatsAppChat />}
        {!adminArea && <BackToTop2 />}
        {!adminArea && (config && config.lgpd.cookieEnabled) && <CookieMessage />}
      </div>
    </ConfigContextProvider>
  ) 
}
export default MyApp

import React from 'react'
import { useConfig } from 'context'
import AboutUsText from './about-us-text'
import SimpleSlide from 'components/slide-show/simple-slide'
import ContactForm from 'components/contact-form/contact-form-2'
import Styles from './about-us.module.css'

const AboutUs = () => {
    const { config } = useConfig()
    return (
        <section className={Styles.aboutUs}>
            <div className={Styles.container}>
                <div className={Styles.data}>
                    {/* <AboutUsImage /> */}
                    <AboutUsText /> 
                    {(config && config.structure && (config.structure.length > 0)) && (
                        <div className={Styles.structure}>
                            <h2>Estrutura</h2>
                            <p>Venha conheçer a estrutura que preparamos com carinho para te receber</p>
                            <SimpleSlide slides={config.structure.map(item => item.url)} />
                        </div>
                    )}
                </div>
                <ContactForm />
            </div> 
        </section>
    )
}

export default AboutUs

import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import {
  getInnerPageHero, getContentSection, getPageSeo,
  getOracleCapabilities, getOracleProductisedServices,
  getOracleDeliveryCapacity, getOracleServiceCarousel,
} from '@/lib/cms/public-data'

export async function generateMetadata() {
  return getPageSeo('oracle-hcm', {
    title: 'Oracle HCM - CHC',
    description: 'CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants.',
  })
}

export default async function OracleHCMPage() {
  const [hero, cs, capabilities, services, delivery, carousel] = await Promise.all([
    getInnerPageHero('oracle-hcm', {
      heading: 'Oracle HCM',
      subtitle: 'CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants.',
    }),
    getContentSection('oracle-hcm'),
    getOracleCapabilities(),
    getOracleProductisedServices(),
    getOracleDeliveryCapacity(),
    getOracleServiceCarousel(),
  ])

  return (
    <>
      <PageHero {...hero} />

      <ContentSection {...cs} />

      <section className="border-bottom border-color-extra-medium-gray half-section" data-anime='{ "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
        <div className="container-fluid px-5 lg-px-10">
          <div className="row">
            <div className="col-12 text-center mt-10px mb-30px">
              <div className="alt-font core-capabilities-heading text-dark-gray ls-minus-05px">Core Capabilities</div>
            </div>
          </div>
          <div className="row position-relative clients-style-08">
            <div className="col swiper text-center feather-shadow" data-slider-options='{ "slidesPerView": 2, "spaceBetween":0, "speed": 4000, "loop": true, "pagination": { "el": ".slider-four-slide-pagination-2", "clickable": false }, "allowTouchMove": false, "autoplay": { "delay":0, "disableOnInteraction": false }, "navigation": { "nextEl": ".slider-four-slide-next-2", "prevEl": ".slider-four-slide-prev-2" }, "keyboard": { "enabled": true, "onlyInViewport": true }, "breakpoints": { "1400": { "slidesPerView": 6 }, "1200": { "slidesPerView": 5 }, "768": { "slidesPerView": 3 } }, "effect": "slide" }'>
              <div className="swiper-wrapper marquee-slide">
                {capabilities.map((item) => (
                  <div className="swiper-slide" key={item.label}>
                    <a href="#"><img src={item.img} className="h-75px" alt="" /></a>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="position-relative">
        <div id="particles-03" data-particle="true" data-particle-options='{"particles":{"number":{"value":5,"density":{"enable":true,"value_area":1000}},"color":{"value":["#b7b9be","#dd6531"]},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"sync":false}},"size":{"value":8,"random":true,"anim":{"enable":false,"sync":true}},"move":{"enable":true,"speed":2,"direction":"right","random":false,"straight":false}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"repulse"},"onclick":{"enable":false,"mode":"push"},"resize":true}},"retina_detect":false}' className="position-absolute h-100 top-0 left-0 z-index-minus-1"></div>
        <div className="container-fluid px-5 lg-px-10">
          <div className="row justify-content-center mb-3">
            <div className="col-lg-7 text-center" data-anime='{ "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <span className="fw-600 ls-1px fs-16 alt-font mb-5px d-inline-block text-uppercase text-base-color">Oracle</span>
              <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">Productised Oracle Services</h2>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-lg-4 row-cols-sm-2 justify-content-center" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 800, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            {services.map((s) => (
              <div key={s.title} className="col text-center team-style-05 md-mb-40px">
                <div className="position-relative border-radius-6px overflow-hidden mb-30px last-paragraph-no-margin">
                  <img src={s.img} alt="" />
                  <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center p-40px lg-p-30px team-content bg-gradient-dark-orange-transparent">
                    <div className="social-icon fs-20"><p>{s.desc}</p></div>
                  </div>
                </div>
                <div className="alt-font fw-600 text-dark-gray lh-22 fs-18">{s.title}</div>
                <span>{s.cta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-very-light-gray position-relative">
        <div className="container-fluid px-5 lg-px-10">
          <div className="row align-items-center mb-5 sm-mb-30px text-center text-lg-start" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="col-lg-5 md-mb-30px">
              <h3 className="text-dark-gray fw-700 ls-minus-2px mb-0">{delivery.heading}</h3>
            </div>
            <div className="col-lg-7 last-paragraph-no-margin md-mb-30px">
              <p>{delivery.paragraph}</p>
            </div>
          </div>
          <div className="row align-items-center" data-anime='{ "opacity": [0,1], "duration": 600, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="col-12">
              <div className="outside-box-right-20 sm-outside-box-right-0">
                <div className="swiper magic-cursor slider-one-slide" data-slider-options='{ "slidesPerView": 1, "spaceBetween": 30, "loop": true, "autoplay": { "delay": 4000, "disableOnInteraction": false }, "keyboard": { "enabled": true, "onlyInViewport": true }, "breakpoints": { "1200": { "slidesPerView": 4 }, "992": { "slidesPerView": 3 }, "768": { "slidesPerView": 2 }, "320": { "slidesPerView": 1 } }, "effect": "slide" }'>
                  <div className="swiper-wrapper">
                    {carousel.map((service) => (
                      <div className="swiper-slide" key={service.title}>
                        <div className="services-box-style-03 last-paragraph-no-margin border-radius-6px overflow-hidden">
                          <div className="position-relative">
                            <a href="/services"><img src={service.img} alt="" /></a>
                          </div>
                          <div className="bg-white">
                            <div className="ps-65px pe-65px pt-30px pb-30px text-center">
                              <a href="/services" className="d-inline-block fs-18 fw-700 text-dark-gray mb-5px">{service.title}</a>
                              <p>{service.desc}</p>
                            </div>
                            <div className="d-flex justify-content-center border-top border-color-extra-medium-gray pt-20px pb-20px ps-50px pe-50px position-relative text-center">
                              <a href="/services" className="btn btn-link btn-hover-animation-switch btn-medium fw-700 text-dark-gray text-uppercase">
                                <span>
                                  <span className="btn-text">Explore services</span>
                                  <span className="btn-icon"><i className="fa-solid fa-arrow-right"></i></span>
                                  <span className="btn-icon"><i className="fa-solid fa-arrow-right"></i></span>
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

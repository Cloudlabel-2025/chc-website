import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import DeliveryCapacityCarousel from '@/components/DeliveryCapacityCarousel'
import CmsAdditionalSections from '@/components/CmsAdditionalSections'
import {
  getInnerPageHero, getContentSection, getPageSeo,
  getOracleProductisedServices, getOracleHeadings, getOracleCapabilities,
  getOracleDeliveryCapacity, getOracleServiceCarousel, getSectionHeading,
} from '@/lib/cms/public-data'

export const dynamic = 'force-dynamic'

const CORE_CAPABILITIES = [
  { img: '/images/core-hr-vec.png', label: 'Core HR' },
  { img: '/images/wfs.png', label: 'Workforce Structure' },
  { img: '/images/compensation-vector.png', label: 'Compensation' },
  { img: '/images/talent-vector.png', label: 'Talent' },
  { img: '/images/learning-vector.png', label: 'Learning' },
  { img: '/images/payroll-vector.png', label: 'Payroll' },
  { img: '/images/security-aor-vector.png', label: 'Security/AOR' },
  { img: '/images/approvals-vector.png', label: 'Approvals' },
  { img: '/images/journey-vector.png', label: 'Journey' },
  { img: '/images/hcm-extracts-vector.png', label: 'HCM Extracts' },
  { img: '/images/integrations-vector.png', label: 'Integrations' },
  { img: '/images/testing-vectot.png', label: 'Testing' },
]

const DELIVERY_CAPACITY = {
  heading: 'Looking for Oracle Delivery Capacity?',
  paragraph: 'CHC can operate as a specialist subcontracting and delivery partner for larger Oracle consultancies and implementation partners. We can take responsibility for defined work packages or provide supervised functional and technical delivery capacity under your program.',
}

const DELIVERY_CAROUSEL = [
  { img: '/images/config.png', title: 'Configuration', desc: 'Configure Oracle HCM Cloud to align with your organisation’s business processes, workforce structures, roles, approvals, and HR requirements.' },
  { img: '/images/testing.jpg', title: 'Testing', desc: 'Ensure reliable HCM implementations through functional, integration, regression, and user acceptance testing.' },
  { img: '/images/reporting.jpg', title: 'Reporting', desc: 'Build meaningful workforce insights with OTBI, BI Publisher, dashboards, and tailored reports.' },
  { img: '/images/data.jpg', title: 'Data', desc: 'Manage, validate, transform, and maintain workforce and organisational data accurately.' },
  { img: '/images/integration.jpg', title: 'Integrations', desc: 'Connect Oracle HCM with external applications and enterprise systems through dependable integrations.' },
  { img: '/images/vbcs.jpg', title: 'VBCS', desc: 'Develop modern, scalable business applications and extensions with Oracle Visual Builder Cloud Service.' },
  { img: '/images/support.jpg', title: 'Release Support', desc: 'Stay ahead of Oracle quarterly updates with impact analysis, testing, issue identification, and support.' },
  { img: '/images/manage-support.jpg', title: 'Managed Support', desc: 'Get continuous functional and technical support for Oracle HCM enhancements and operations.' },
]

export async function generateMetadata() {
  return getPageSeo('oracle-hcm', {
    title: 'Oracle HCM - CHC',
    description: 'CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants.',
  })
}

export default async function OracleHCMPage() {
  const [hero, cs, services, oHeadings, capabilities, deliveryCapacity, deliveryCarousel, capabilityHeading, productHeading, carouselHeading] = await Promise.all([
    getInnerPageHero('oracle-hcm', {
      heading: 'Oracle HCM',
      subtitle: 'CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants.',
    }),
    getContentSection('oracle-hcm'),
    getOracleProductisedServices(),
    getOracleHeadings(),
    getOracleCapabilities(),
    getOracleDeliveryCapacity(),
    getOracleServiceCarousel(),
    getSectionHeading('oracle-hcm', 'capabilityItem', ''),
    getSectionHeading('oracle-hcm', 'productisedService', ''),
    getSectionHeading('oracle-hcm', 'serviceCarouselItem', ''),
  ])

  return (
    <>
      <PageHero {...hero} />

      <ContentSection {...cs} />

      <section className="border-bottom border-color-extra-medium-gray half-section" data-chc-animate='{ "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
        <div className="container-fluid px-5 lg-px-10">
          <div className="row">
            <div className="col-12 text-center mt-10px mb-30px">
              <div className="alt-font core-capabilities-heading text-dark-gray ls-minus-05px">{capabilityHeading || oHeadings.capabilitiesHeading}</div>
            </div>
          </div>
          <div className="row position-relative clients-style-08">
            <div className="col text-center feather-shadow chc-core-capabilities-carousel">
              <div className="chc-core-capabilities-track" role="list" aria-label="Oracle HCM core capabilities">
                {[...capabilities, ...capabilities].map((item, index) => (
                  <div className="chc-core-capability" key={`${item.label}-${index}`} role="listitem" aria-hidden={index >= capabilities.length}>
                    <img src={item.img} className="h-75px" alt="" />
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
            <div className="col-lg-7 text-center" data-chc-animate='{ "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <span className="fw-600 ls-1px fs-16 alt-font mb-5px d-inline-block text-uppercase text-base-color">{oHeadings.servicesEyebrow}</span>
              <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">{productHeading || oHeadings.servicesHeading}</h2>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-lg-4 row-cols-sm-2 justify-content-center" data-chc-animate='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 800, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
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
          <div className="row align-items-center mb-5 sm-mb-30px text-center text-lg-start" data-chc-animate='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="col-lg-5 md-mb-30px">
              <h3 className="text-dark-gray fw-700 ls-minus-2px mb-0">{deliveryCapacity.heading}</h3>
            </div>
            <div className="col-lg-7 last-paragraph-no-margin md-mb-30px">
              <p>{deliveryCapacity.paragraph}</p>
            </div>
          </div>
          <div className="row align-items-center" data-chc-animate='{ "opacity": [0,1], "duration": 600, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="col-12">
              {carouselHeading && <h4 className="alt-font text-dark-gray fw-600 text-center mb-4">{carouselHeading}</h4>}
              <div className="outside-box-right-20 sm-outside-box-right-0">
                <DeliveryCapacityCarousel>
                  <div className="chc-delivery-carousel-track" role="list" aria-label="Oracle delivery services">
                    {[...deliveryCarousel, ...deliveryCarousel, ...deliveryCarousel].map((service, index) => (
                      <div className="chc-delivery-carousel-card" key={`${service.title}-${index}`} role="listitem" aria-hidden={index < deliveryCarousel.length || index >= deliveryCarousel.length * 2}>
                        <div className="services-box-style-03 last-paragraph-no-margin border-radius-6px overflow-hidden">
                            <div className="position-relative">
                            <a href={service.href || '/services'} className="force-magic-cursor"><img src={service.img} alt="" draggable="false" /></a>
                          </div>
                          <div className="bg-white">
                            <div className="ps-65px pe-65px pt-30px pb-30px text-center sm-ps-25px sm-pe-25px">
                              <a href={service.href || '/services'} className="d-inline-block fs-18 fw-700 text-dark-gray mb-5px force-magic-cursor">{service.title}</a>
                              <p>{service.desc}</p>
                            </div>
                            <div className="chc-carousel-link-row d-flex justify-content-center border-top border-color-extra-medium-gray pt-20px pb-20px ps-50px pe-50px position-relative text-center">
                              <a href={service.href || '/services'} className="chc-carousel-service-link force-magic-cursor">{oHeadings.exploreLabel} <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DeliveryCapacityCarousel>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CmsAdditionalSections slug="oracle-hcm" skipFirst={{ innerPageHero: 1, contentSection: 1, oracleHeadings: 1, capabilityItem: 1, deliveryCapacity: 1, productisedService: 1, serviceCarouselItem: 1 }} />
    </>
  )
}

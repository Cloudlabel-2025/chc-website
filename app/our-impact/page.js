import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import { getInnerPageHero, getContentSection, getImpactHeader, getImpactFooter, getPageSeo } from '@/lib/cms/public-data'

const IMPACT_SERVICES = [
  { title: 'Configuration', img: '/images/config.png', desc: 'Align Oracle HCM Cloud with the way your workforce and approvals operate.', href: '/oracle-hcm' },
  { title: 'Testing', img: '/images/testing.jpg', desc: 'Build confidence through functional, integration, regression, and user acceptance testing.', href: '/oracle-hcm' },
  { title: 'Reporting', img: '/images/reporting.jpg', desc: 'Create useful workforce insights with reports, dashboards, and tailored analytics.', href: '/oracle-hcm' },
  { title: 'Data', img: '/images/data.jpg', desc: 'Manage and maintain workforce data accurately throughout delivery and operations.', href: '/oracle-hcm' },
  { title: 'Integrations', img: '/images/integration.jpg', desc: 'Connect Oracle HCM to the systems your organisation relies on every day.', href: '/oracle-hcm' },
  { title: 'Application design', img: '/images/app-dev-home.jpg', desc: 'Develop practical technology solutions around real operational requirements.', href: '/applications' },
]

export async function generateMetadata() {
  return getPageSeo('our-impact', {
    title: 'Our Impact - CHC',
    description: 'We deliver smart solutions that help your business grow successfully.',
  })
}

export default async function OurImpactPage() {
  const [hero, cs, ih, iFooter] = await Promise.all([
    getInnerPageHero('our-impact', { heading: 'Our Impact', subtitle: 'We deliver smart solutions that help your business grow successfully.' }),
    getContentSection('our-impact'),
    getImpactHeader(),
    getImpactFooter(),
  ])

  return (
    <>
      <PageHero {...hero} />

      <ContentSection {...cs} />

      <section className="cover-background border-radius-10px overflow-visible" style={{ backgroundImage: "url('/images/demo-modern-business-services-bg-01.jpg')" }}>
        <div className="container-fluid overflow-hidden">
          <div className="row" data-chc-animate='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="col-12 text-center">
              <span className="ps-20px pe-20px pt-5px pb-5px mb-15px text-uppercase alt-font text-base-color fs-12 lh-26 fw-600 alt-font border-radius-100px bg-gradient-very-light-gray-transparent d-inline-flex">
                <i className="bi bi-box-seam fs-16 me-5px"></i>{ih.badge}
              </span>
              <h2 className="alt-font text-dark-gray fw-700 ls-minus-05px mb-30px sm-mb-0">{ih.heading}</h2>
            </div>
          </div>
          <div className="row mb-25px sm-mb-0" data-chc-animate='{ "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="col-md-12">
              <div className="outside-box-right-15 outside-box-left-15 sm-outside-box-right-0 sm-outside-box-left-0">
                <div className="swiper magic-cursor" data-slider-options='{ "slidesPerView": 1, "spaceBetween": 20, "loop": true, "autoplay": { "delay": 250000, "disableOnInteraction": false }, "pagination": { "el": ".slider-four-slide-pagination-1", "clickable": true }, "keyboard": { "enabled": true, "onlyInViewport": true }, "breakpoints": { "1600": { "slidesPerView": 6 }, "1400": { "slidesPerView": 5 }, "1200": { "slidesPerView": 4 }, "991": { "slidesPerView": 3 }, "768": { "slidesPerView": 2 } }, "effect": "slide" }'>
                  <div className="swiper-wrapper pt-30px pb-30px">
                    {IMPACT_SERVICES.map((slide, i) => (
                      <div className="swiper-slide box-shadow-extra-large" key={i}>
                        <div className="border-radius-10px bg-white pt-40px pb-40px ps-50px pe-50px xxl-p-30px justify-content-start text-start">
                          <a href={slide.href || '/'} className="text-center d-block mb-50px md-mb-30px">
                            <img src={slide.img} alt="" />
                          </a>
                          <div className="last-paragraph-no-margin text-center text-md-start">
                            <a href={slide.href || '/'} className="d-inline-block alt-font text-dark-gray fw-600 fs-20 mb-5px ls-minus-05px">{slide.title}</a>
                            <p>{slide.desc}</p>
                            <div className="chc-carousel-link-row mt-25px"><a href={slide.href || '/services'} className="chc-carousel-service-link">Explore services <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row" data-chc-animate='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="col-12 text-center">
              <i className="bi bi-window-fullscreen text-dark-gray d-inline-block align-middle icon-extra-medium me-5px md-m-5px"></i>
              <div className="fs-20 alt-font text-dark-gray d-inline-block align-middle fw-500 ls-minus-05px">{iFooter.note}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import CmsAdditionalSections from '@/components/CmsAdditionalSections'
import { getInnerPageHero, getContentSection, getServicesFeatureCards, getCtaBanner, getPageSeo, getSectionHeading } from '@/lib/cms/public-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return getPageSeo('services', {
    title: 'Services - CHC',
    description: 'We deliver smart solutions that help your business grow successfully.',
  })
}

export default async function ServicesPage() {
  const [hero, cs, cards, cta, cardsHeading] = await Promise.all([
    getInnerPageHero('services', { heading: 'Services', subtitle: 'We deliver smart solutions that help your business grow successfully.' }),
    getContentSection('services'),
    getServicesFeatureCards(),
    getCtaBanner('services'),
    getSectionHeading('services', 'featureCards', 'Our capabilities'),
  ])

  return (
    <>
      <PageHero {...hero} />

      <ContentSection {...cs} />

      <section className="position-relative">
        <div className="container-fluid px-5 lg-px-10">
          <div className="row justify-content-center mb-4"><div className="col-lg-8 text-center"><h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">{cardsHeading}</h2></div></div>
          <div className="row row-cols-1 row-cols-lg-3 row-cols-md-2" data-chc-animate='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            {cards.map((card) => (
              <div key={card.title} className="col icon-with-text-style-04 transition-inner-all mb-30px">
                <div className="feature-box border-radius-10px box-shadow-double-large-hover bg-gradient-top-very-light-gray pt-40px p-50px xl-p-35px last-paragraph-no-margin text-start">
                  <div className="feature-box-icon mb-50px">
                    <a href={card.href}><img src={card.img} alt="" /></a>
                  </div>
                  <div className="feature-box-content">
                    <a href={card.href} className="d-inline-block alt-font text-dark-gray fw-600 fs-20 mb-5px ls-minus-05px">{card.title}</a>
                    <p>{card.text}</p>
                  </div>
                  <div className="feature-box-overlay bg-white border-radius-10px"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="row mt-5 sm-mt-0" data-chc-animate='{ "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="col-12 text-center">
              <i className="bi bi-chat-text text-dark-gray d-inline-block align-middle icon-extra-medium me-5px md-m-5px"></i>
              <div className="fs-20 alt-font text-dark-gray d-inline-block align-middle fw-500 ls-minus-05px">
                {cta.heading} <a href={cta.buttonHref} className="text-dark-gray fw-600 text-decoration-line-bottom">{cta.buttonLabel}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CmsAdditionalSections slug="services" skipFirst={{ innerPageHero: 1, contentSection: 1, featureCards: 1, cta: 1 }} />
    </>
  )
}

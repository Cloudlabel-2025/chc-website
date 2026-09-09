import SlideLink from '@/components/SlideLink'
import CmsPageLayout from '@/components/CmsPageLayout'
import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import { getInnerPageHero, getContentSection, getServicesFeatureCards, getPageSeo, getSectionHeading } from '@/lib/cms/public-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return getPageSeo('services', {
    title: 'Services - CHC',
    description: 'We deliver smart solutions that help your business grow successfully.',
  })
}

export default async function ServicesPage() {
  const [hero, cs, cards, cardsHeading] = await Promise.all([
    getInnerPageHero('services', { heading: 'Services', subtitle: 'We deliver smart solutions that help your business grow successfully.' }),
    getContentSection('services'),
    getServicesFeatureCards(),
    getSectionHeading('services', 'featureCards', 'Our capabilities'),
  ])

  return (
    <CmsPageLayout slug="services">
      <PageHero data-cms-template="innerPageHero" {...hero} />

      <ContentSection data-cms-template="contentSection" {...cs} />

      <section data-cms-template="featureCards" className="position-relative">
        <div className="container-fluid px-5 lg-px-10">
          <div className="row justify-content-center mb-4"><div className="col-lg-8 text-center"><h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">{cardsHeading}</h2></div></div>
          <div className="row row-cols-1 row-cols-lg-3 row-cols-md-2" data-chc-animate='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            {cards.map((card) => (
              <div key={card.title} className="col icon-with-text-style-04 transition-inner-all mb-30px">
                <div className="feature-box border-radius-10px box-shadow-double-large-hover bg-gradient-top-very-light-gray pt-40px p-50px xl-p-35px last-paragraph-no-margin text-start">
                  <div className="feature-box-icon mb-50px">
                    <SlideLink href={card.href}><img src={card.img} alt="" /></SlideLink>
                  </div>
                  <div className="feature-box-content">
                    <SlideLink href={card.href} className="d-inline-block alt-font text-dark-gray fw-600 fs-20 mb-5px ls-minus-05px">{card.title}</SlideLink>
                    <p>{card.text}</p>
                  </div>
                  <div className="feature-box-overlay bg-white border-radius-10px"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </CmsPageLayout>
  )
}

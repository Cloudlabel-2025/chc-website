import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import LeadingExpertsCarousel from '@/components/LeadingExpertsCarousel'
import CmsAdditionalSections from '@/components/CmsAdditionalSections'
import { getInnerPageHero, getContentSection, getPeopleHeader, getPeopleData, getPageSeo, getSectionHeading } from '@/lib/cms/public-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return getPageSeo('our-people', {
    title: 'Our People - CHC',
    description: 'Meet the team behind CHC.',
  })
}

export default async function OurPeoplePage() {
  const [hero, cs, ph, people, peopleHeading] = await Promise.all([
    getInnerPageHero('our-people', { heading: 'Our People', subtitle: 'Meet the team behind CHC.' }),
    getContentSection('our-people'),
    getPeopleHeader(),
    getPeopleData(),
    getSectionHeading('our-people', 'teamMember', ''),
  ])

  return (
    <>
      <PageHero {...hero} />

      <ContentSection {...cs} />

      <section className="position-relative">
        <div id="particles-03" data-particle="true" data-particle-options='{"particles":{"number":{"value":5,"density":{"enable":true,"value_area":1000}},"color":{"value":["#b7b9be","#dd6531"]},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"sync":false}},"size":{"value":8,"random":true,"anim":{"enable":false,"sync":true}},"move":{"enable":true,"speed":2,"direction":"right","random":false,"straight":false}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"repulse"},"onclick":{"enable":false,"mode":"push"},"resize":true}},"retina_detect":false}' className="position-absolute h-100 top-0 left-0 z-index-minus-1"></div>
        <div className="container-fluid px-5 lg-px-10">
          <div className="row justify-content-center mb-3">
            <div className="col-lg-7 text-center" data-chc-animate='{ "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <span className="fw-600 ls-1px fs-16 alt-font mb-5px d-inline-block text-uppercase text-base-color">{ph.badge}</span>
              <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">{peopleHeading || ph.heading}</h2>
            </div>
          </div>
          <LeadingExpertsCarousel people={people} />
        </div>
      </section>
      <CmsAdditionalSections slug="our-people" skipFirst={{ innerPageHero: 1, contentSection: 1, peopleHeader: 1, teamMember: 1 }} />
    </>
  )
}

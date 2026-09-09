import CmsPageLayout from '@/components/CmsPageLayout'
import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import { GiveOneHourForm } from '@/components/CmsForms'
import { getInnerPageHero, getContentSection, getPageSeo, getSectionHeading } from '@/lib/cms/public-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return getPageSeo('give-one-hour', {
    title: 'Give One Hour - CHC',
    description: 'Share your expertise, shape a career.',
  })
}

export default async function GiveOneHourPage() {
  const [hero, cs, programmeHeading] = await Promise.all([
    getInnerPageHero('give-one-hour', {
      heading: 'Give One Hour',
      subtitle: 'CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants.',
    }),
    getContentSection('give-one-hour'),
    getSectionHeading('give-one-hour', 'giveOneHour', 'Share your expertise, shape a career.'),
  ])

  return (
    <CmsPageLayout slug="give-one-hour">
      <PageHero data-cms-template="innerPageHero" {...hero} />

      <ContentSection data-cms-template="contentSection" {...cs} />

      <section data-cms-template="giveOneHourForm" className="bg-very-light-gray">
        <div className="container-fluid px-5 lg-px-10">
          <div className="row justify-content-center">
            <div className="col-lg-7 text-center mb-2" data-chc-animate='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
              <span className="fw-600 ls-1px fs-16 alt-font d-inline-block text-uppercase mb-5px text-base-color">Give One Hour</span>
              <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">{programmeHeading}</h2>
            </div>
          </div>
          <div className="row justify-content-center" data-chc-animate='{ "translateY": [100, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
            <div className="col-xl-9 col-lg-11">
              <GiveOneHourForm />
            </div>
          </div>
        </div>
      </section>
    </CmsPageLayout>
  )
}

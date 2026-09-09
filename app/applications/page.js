import CmsPageLayout from '@/components/CmsPageLayout'
import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import StackCardGroup from '@/components/StackCardGroup'
import { getInnerPageHero, getContentSection, getApplicationsStackCards, getPageSeo, getSectionHeading } from '@/lib/cms/public-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return getPageSeo('applications', {
    title: 'Applications - CHC',
    description: 'We deliver smart solutions that help your business grow successfully.',
  })
}

export default async function ApplicationsPage() {
  const [hero, contentSection, cards, cardsHeading] = await Promise.all([
    getInnerPageHero('applications', { heading: 'Applications', subtitle: 'We deliver smart solutions that help your business grow successfully.' }),
    getContentSection('applications'),
    getApplicationsStackCards('stackCards1'),
    getSectionHeading('applications', 'stackCards1', 'Our approach'),
  ])

  return (
    <CmsPageLayout slug="applications">
      <PageHero data-cms-template="innerPageHero" {...hero} />

      <ContentSection data-cms-template="contentSection" {...contentSection} />
      <section data-cms-template="stackCards1">
        <div className="container-fluid px-5 lg-px-10">
          <div className="row justify-content-center mb-4"><div className="col-lg-8 text-center"><h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">{cardsHeading}</h2></div></div>
          <div className="row"><div className="col-12"><StackCardGroup cards={cards} /></div></div>
        </div>
      </section>
    </CmsPageLayout>
  )
}

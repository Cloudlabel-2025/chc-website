import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import StackCardGroup from '@/components/StackCardGroup'
import CmsAdditionalSections from '@/components/CmsAdditionalSections'
import { getInnerPageHero, getContentSection, getApplicationsStackCards, getPageSeo } from '@/lib/cms/public-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return getPageSeo('applications', {
    title: 'Applications - CHC',
    description: 'We deliver smart solutions that help your business grow successfully.',
  })
}

export default async function ApplicationsPage() {
  const [hero, contentSection, cards] = await Promise.all([
    getInnerPageHero('applications', { heading: 'Applications', subtitle: 'We deliver smart solutions that help your business grow successfully.' }),
    getContentSection('applications'),
    getApplicationsStackCards('stackCards1'),
  ])

  return (
    <>
      <PageHero {...hero} />

      <ContentSection {...contentSection} />
      <section>
        <div className="container-fluid px-5 lg-px-10">
          <div className="row"><div className="col-12"><StackCardGroup cards={cards} /></div></div>
        </div>
      </section>
      <CmsAdditionalSections slug="applications" skipFirst={{ innerPageHero: 1, contentSection: 1, stackCards1: 1 }} />
    </>
  )
}

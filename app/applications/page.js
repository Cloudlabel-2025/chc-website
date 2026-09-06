import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import StackCardGroup from '@/components/StackCardGroup'
import { getInnerPageHero, getContentSection, getApplicationsStackCards, getPageSeo } from '@/lib/cms/public-data'

export async function generateMetadata() {
  return getPageSeo('applications', {
    title: 'Applications - CHC',
    description: 'We deliver smart solutions that help your business grow successfully.',
  })
}

export default async function ApplicationsPage() {
  const [hero, cs1, cs2, cs3, cards1, cards2, cards3] = await Promise.all([
    getInnerPageHero('applications', { heading: 'Applications', subtitle: 'We deliver smart solutions that help your business grow successfully.' }),
    getContentSection('applications'),
    getContentSection('applications'),
    getContentSection('applications'),
    getApplicationsStackCards('stackCards1'),
    getApplicationsStackCards('stackCards2'),
    getApplicationsStackCards('stackCards3'),
  ])

  return (
    <>
      <PageHero {...hero} />

      <ContentSection {...cs1} />
      <section>
        <div className="container-fluid px-5 lg-px-10">
          <div className="row"><div className="col-12"><StackCardGroup cards={cards1} /></div></div>
        </div>
      </section>

      <ContentSection {...cs2} />
      <section>
        <div className="container-fluid px-5 lg-px-10">
          <div className="row"><div className="col-12"><StackCardGroup cards={cards2} /></div></div>
        </div>
      </section>

      <ContentSection {...cs3} />
      <section>
        <div className="container-fluid px-5 lg-px-10">
          <div className="row"><div className="col-12"><StackCardGroup cards={cards3} /></div></div>
        </div>
      </section>
    </>
  )
}

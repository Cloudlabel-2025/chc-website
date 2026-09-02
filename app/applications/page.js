import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import { getInnerPageHero, getContentSection, getApplicationsStackCards, getPageSeo } from '@/lib/cms/public-data'

export async function generateMetadata() {
  return getPageSeo('applications', {
    title: 'Applications - CHC',
    description: 'We deliver smart solutions that help your business grow successfully.',
  })
}

function StackCardGroup({ cards }) {
  return (
    <div className="stack-card cards" data-scale="true" data-top-space="35">
      {cards.map((card, i) => (
        <div className={`stack-item ${i < cards.length - 1 ? 'mb-50px' : ''}`} data-index={i} key={i}>
          <img src="/images/demo-modern-business-object-blur-01.jpg" className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
          <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
            <img src="/images/demo-modern-business-bg-01.png" alt="" className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom={`transform:rotate(${card.rotate}); filter: blur(${card.blur})`} />
            <div className="row z-index-9 position-relative align-items-center">
              <div className="col-xl-8 col-lg-6 md-mb-30px">
                <img src={card.img} className="w-100 h-100" style={{ aspectRatio: '674/452', objectFit: 'cover' }} alt="" />
              </div>
              <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
                <div className="icon-with-text-style-08 mb-20px">
                  <div className="feature-box feature-box-left-icon-middle">
                    <div className="feature-box-content">
                      <span className="d-inline-block fs-16 fw-500 text-dark-gray">{card.badge}</span>
                    </div>
                  </div>
                </div>
                <h2 className="alt-font text-dark-gray fw-700 mb-20px">{card.heading}</h2>
                <p className="text-medium-gray">{card.paragraph}</p>
                <a href="/" className="btn btn-large btn-dark-gray btn-switch-text btn-box-shadow btn-rounded text-transform-none left-icon">
                  <span>
                    <span><i className="feather icon-feather-edit"></i></span>
                    <span className="btn-double-text" data-text="Start exploring">Start exploring</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
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

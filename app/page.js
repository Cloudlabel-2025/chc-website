import { getHomeHero, getHomeIntro, getHomeWhatWeDo, getHomeWhyChc, getPageSeo, getSectionHeading } from '@/lib/cms/public-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return getPageSeo('home', {
    title: 'CHC - Technology Delivery with a Social Conscience',
    description: 'CHC provides cost-effective Oracle HCM, application development and technology delivery services through senior-led teams.',
  })
}

export default async function HomePage() {
  const [hero, intro, whatWeDo, whyChc, whatWeDoHeading, whyChcHeading] = await Promise.all([
    getHomeHero(), getHomeIntro(), getHomeWhatWeDo(), getHomeWhyChc(),
    getSectionHeading('home', 'whatWeDo', 'What we do'),
    getSectionHeading('home', 'whyChc', 'Why CHC?'),
  ])

  return (
    <>
      {/* Hero Section */}
      <section className="chc-home-hero cover-background full-screen ipad-top-space-margin py-0px md-h-750px sm-h-650px">
        <img
          src={hero.backgroundImage}
          alt=""
          className="chc-hero-background"
          fetchPriority="high"
          aria-hidden="true"
        />
        <div className="hero-overlay-animated"></div>
        <div className="shape-image-animation bottom-0 p-0 w-100 d-none d-md-block">
          <svg xmlns="http://www.w3.org/2000/svg" width="3000" height="400" viewBox="0 180 2500 200" fill="#ffffff">
            <path className="st1" d="M 0 250 C 1200 400 1200 50 3000 250 L 3000 550 L 0 550 L 0 250">
              <animate attributeName="d" dur="5s" values="M 0 250 C 1200 400 1200 50 3000 250 L 3000 550 L 0 550 L 0 250;M 0 250 C 400 50 400 400 3000 250 L 3000 550 L 0 550 L 0 250;M 0 250 C 1200 400 1200 50 3000 250 L 3000 550 L 0 550 L 0 250" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
        <div className="container-fluid h-100">
          <div className="row align-items-center h-100">
            <div className="col-xl-6 col-lg-8 col-md-10 position-relative z-index-1" data-chc-animate='{ "el": "childs", "translateY": [0, 0], "perspective": [1200,1200], "scale": [1.05, 1], "rotateX": [30, 0], "opacity": [0,1], "duration": 800, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <span className="ps-25px pe-25px pt-5px pb-5px mb-25px text-uppercase text-white fs-12 ls-1px fw-600 border-radius-100px bg-gradient-dark-gray-transparent d-flex w-70 sm-w-100">
                <i className="bi bi-megaphone text-white icon-small me-10px"></i>{hero.badge}
              </span>
              <h1 className="text-white fw-600 ls-minus-2px mb-25px">{hero.heading}</h1>
              <div><p className="fw-300 fs-18 w-85 sm-w-95 text-white opacity-6">{hero.paragraph}</p></div>
              <div className="chc-hero-ctas">
                <a href={hero.cta1Href} className="btn btn-extra-large btn-switch-text btn-gradient-purple-pink btn-rounded ls-0px home-marketplace">
                  <span><span className="btn-double-text" data-text={hero.cta1Label}>{hero.cta1Label}</span></span>
                </a>
                <a href={hero.cta2Href} className="btn btn-extra-large btn-switch-text btn-transparent-white-light btn-rounded border-1 ls-0px">
                  <span>
                    <span className="btn-double-text" data-text={hero.cta2Label}>{hero.cta2Label}</span>
                    <span><i className="fa-regular fa-envelope"></i></span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About/Intro Section */}
      <section className="chc-home-intro position-relative overflow-hidden">
        <img src="/images/demo-modern-business-elements-02.png" alt="" className="position-absolute right-10px top-70px lg-top-40px animation-rotation d-none d-md-block" />
        <div className="container-fluid px-5 lg-px-10">
          <div className="row align-items-center justify-content-center mb-5 sm-mb-0">
            <div className="col-lg-6 position-relative md-mb-15 sm-mb-25">
              <div className="w-70 xs-w-80" data-chc-animate style={{ aspectRatio: '470/566' }}>
                <img src={intro.leftImage} alt="" className="border-radius-10px w-100 h-100" style={{ objectFit: 'cover' }} />
                <div className="position-absolute left-60px bottom-minus-60px hero-spinner-wrap" style={{ width: '150px', height: '150px' }} aria-hidden="true">
                  <img src="/images/chc-spin-support.png" alt="" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: 'auto', borderRadius: '50%' }} />
                  <img src="/images/chc-spinner.png" alt="" className="animation-rotation" style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-75px', marginLeft: '-75px', width: '150px', height: 'auto' }} />
                </div>
              </div>
              <div className="w-50 overflow-hidden position-absolute right-20px xs-right-15px xs-w-60 bottom-minus-50px" data-chc-animate style={{ aspectRatio: '350/419' }}>
                <img src={intro.rightImage} alt="" className="border-radius-10px w-100 h-100 box-shadow-quadruple-large" style={{ objectFit: 'cover' }} />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 ps-6 md-ps-15px" data-chc-animate='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <span className="ps-20px pe-20px pt-5px pb-5px mb-20px text-uppercase alt-font text-base-color fs-12 lh-26 fw-600 alt-font border-radius-100px bg-gradient-very-light-gray-transparent d-inline-flex">
                <i className="bi bi-award fs-16 me-5px"></i>{intro.badge}
              </span>
              <h2 className="alt-font text-dark-gray fw-700 mb-20px md-w-90">{intro.heading}</h2>
              <p className="mb-35px sm-mb-25px w-85 md-w-90">{intro.paragraph}</p>
              <div className="progress-bar-style-02 w-90">
                <div className="d-inline-block">
                  <a href={intro.buttonHref} className="btn btn-medium btn-dark-gray btn-box-shadow me-25px btn-round-edge">{intro.buttonLabel}</a>
                  <a href={intro.linkHref} className="btn btn-link btn-large text-dark-gray xs-mt-15px xs-mb-15px">{intro.linkLabel}</a>
                </div>
                <div className="fs-14 lh-24 mt-15px text-dark-gray">{intro.note}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="section-what-we-do ps-7 pe-7 xxl-ps-3 xxl-pe-3 xs-px-0">
        <div className="container-fluid">
          <div className="row justify-content-center mb-3">
            <div className="col-xl-5 col-lg-7 col-md-8 text-center" data-chc-animate='{ "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <span className="fw-600 ls-1px fs-16 alt-font d-inline-block text-uppercase mb-5px text-base-color">Innovative solutions</span>
              <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">{whatWeDoHeading}</h2>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-xl-4 row-cols-md-2 row-cols-sm-2 justify-content-center" data-chc-animate='{ "el": "childs", "translateX": [30, 0], "opacity": [0,1], "duration": 800, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
            {whatWeDo.map((card, i) => (
              <div className="col interactive-banner-style-05 lg-mb-30px position-relative z-index-1" key={i}>
                <div className="atropos" data-atropos data-atropos-perspective="1450">
                  <a href={card.href} className="position-absolute z-index-1 top-0px left-0px h-100 w-100"></a>
                  <div className="atropos-scale"><div className="atropos-rotate"><div className="atropos-inner">
                    <figure className="m-0 hover-box border-radius-4px overflow-hidden position-relative" data-atropos-offset="3" style={{ aspectRatio: '600/815' }}>
                      <img className="w-100 h-100" src={card.image} alt="" style={{ objectFit: 'cover' }} />
                      <figcaption className="d-flex flex-column align-items-start justify-content-end position-absolute left-0px top-0px w-100 h-100 z-index-1 p-15 xl-p-12 last-paragraph-no-margin">
                        <span className="alt-font text-white fw-500 fs-26 sm-lh-26 xs-lh-28 sm-mb-5px">{card.title}</span>
                        <p className="text-white opacity-6 fs-18">{card.description}</p>
                        <div className="position-absolute left-0px top-0px w-100 h-100 bg-gradient-gray-light-dark-transparent z-index-minus-1 opacity-9"></div>
                        <div className="box-overlay bg-gradient-gray-light-dark-transparent z-index-minus-1"></div>
                      </figcaption>
                    </figure>
                  </div></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack Cards Section */}
      <section className="chc-why-section">
        <div className="container-fluid px-5 lg-px-10">
          <div className="row justify-content-center mb-3">
            <div className="col-xl-5 col-lg-7 col-md-8 text-center" data-chc-animate='{ "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">{whyChcHeading}</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="stack-card cards" data-scale="true" data-top-space="35">
                {whyChc.map((card, i) => (
                  <div className="stack-item mb-50px" data-index={i} key={i}>
                    <img src="/images/demo-modern-business-object-blur-01.jpg" className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
                    <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
                      <img src="/images/demo-modern-business-bg-01.png" alt="" className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom={`transform:rotate(${card.rotate}); filter: blur(${card.blur})`} />
                      <div className="row z-index-9 position-relative align-items-center">
                        <div className="col-xl-8 col-lg-6 md-mb-30px">
                          <img src={card.image} className="w-100 h-100" style={{ aspectRatio: '674/452', objectFit: 'cover' }} alt="" />
                        </div>
                        <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
                          <div className="icon-with-text-style-08 mb-20px"><div className="feature-box feature-box-left-icon-middle"></div></div>
                          <h2 className="alt-font text-dark-gray fw-700 mb-20px">{card.heading}</h2>
                          <p className="text-medium-gray">{card.paragraph}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

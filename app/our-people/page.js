import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import { getInnerPageHero, getContentSection, getPeopleData, getPeopleHeader, getPageSeo } from '@/lib/cms/public-data'

export async function generateMetadata() {
  return getPageSeo('our-people', {
    title: 'Our People - CHC',
    description: 'Meet the team behind CHC.',
  })
}

export default async function OurPeoplePage() {
  const [hero, cs, people, ph] = await Promise.all([
    getInnerPageHero('our-people', { heading: 'Our People', subtitle: 'Meet the team behind CHC.' }),
    getContentSection('our-people'),
    getPeopleData(),
    getPeopleHeader(),
  ])

  return (
    <>
      <PageHero {...hero} />

      <ContentSection {...cs} />

      <section className="position-relative">
        <div id="particles-03" data-particle="true" data-particle-options='{"particles":{"number":{"value":5,"density":{"enable":true,"value_area":1000}},"color":{"value":["#b7b9be","#dd6531"]},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"sync":false}},"size":{"value":8,"random":true,"anim":{"enable":false,"sync":true}},"move":{"enable":true,"speed":2,"direction":"right","random":false,"straight":false}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"repulse"},"onclick":{"enable":false,"mode":"push"},"resize":true}},"retina_detect":false}' className="position-absolute h-100 top-0 left-0 z-index-minus-1"></div>
        <div className="container-fluid px-5 lg-px-10">
          <div className="row justify-content-center mb-3">
            <div className="col-lg-7 text-center" data-anime='{ "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <span className="fw-600 ls-1px fs-16 alt-font mb-5px d-inline-block text-uppercase text-base-color">{ph.badge}</span>
              <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">{ph.heading}</h2>
            </div>
          </div>
          <div className="swiper team-people-carousel magic-cursor" data-slider-options='{ "slidesPerView": 3, "spaceBetween": 30, "loop": true, "autoplay": { "delay": 5000, "disableOnInteraction": false }, "effect": "coverflow", "coverflowEffect": { "rotate": 0, "stretch": 0, "depth": 100, "modifier": 2, "slideShadows": false }, "centeredSlides": true, "breakpoints": { "1200": { "slidesPerView": 3 }, "992": { "slidesPerView": 3 }, "768": { "slidesPerView": 2 }, "320": { "slidesPerView": 1 } } }'>
            <div className="swiper-wrapper">
              {people.map((person, i) => (
                <div className="swiper-slide" key={i}>
                  <div className="text-center team-style-05">
                    <div className="position-relative border-radius-4px overflow-hidden mb-30px last-paragraph-no-margin">
                      <img src={person.photo} alt={person.name} />
                      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center p-40px lg-p-30px team-content bg-gradient-dark-orange-transparent">
                        <div className="social-icon fs-20">
                          <p className="text-white">{person.name}</p>
                          <p className="text-white">{person.role}</p>
                          {person.capability    && <p className="text-white">{person.capability}</p>}
                          {person.learningFocus && <p className="text-white">{person.learningFocus}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="alt-font fw-600 text-dark-gray lh-22 fs-18">{person.name}</div>
                    <span>{person.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

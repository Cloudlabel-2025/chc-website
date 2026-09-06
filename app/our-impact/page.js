import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import { getInnerPageHero, getContentSection, getOurImpactSlides, getImpactHeader, getImpactFooter, getPageSeo } from '@/lib/cms/public-data'

export async function generateMetadata() {
  return getPageSeo('our-impact', {
    title: 'Our Impact - CHC',
    description: 'We deliver smart solutions that help your business grow successfully.',
  })
}

export default async function OurImpactPage() {
  const [hero, cs, slides, ih, iFooter] = await Promise.all([
    getInnerPageHero('our-impact', { heading: 'Our Impact', subtitle: 'We deliver smart solutions that help your business grow successfully.' }),
    getContentSection('our-impact'),
    getOurImpactSlides(),
    getImpactHeader(),
    getImpactFooter(),
  ])

  return (
    <>
      <PageHero {...hero} />

      <ContentSection {...cs} />

      <section className="cover-background border-radius-10px overflow-visible" style={{ backgroundImage: "url('/images/demo-modern-business-services-bg-01.jpg')" }}>
        <div className="container-fluid overflow-hidden">
          <div className="row" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="col-12 text-center">
              <span className="ps-20px pe-20px pt-5px pb-5px mb-15px text-uppercase alt-font text-base-color fs-12 lh-26 fw-600 alt-font border-radius-100px bg-gradient-very-light-gray-transparent d-inline-flex">
                <i className="bi bi-box-seam fs-16 me-5px"></i>{ih.badge}
              </span>
              <h2 className="alt-font text-dark-gray fw-700 ls-minus-05px mb-30px sm-mb-0">{ih.heading}</h2>
            </div>
          </div>
          <div className="row mb-25px sm-mb-0" data-anime='{ "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="col-md-12">
              <div className="outside-box-right-15 outside-box-left-15 sm-outside-box-right-0 sm-outside-box-left-0">
                <div className="swiper magic-cursor" data-slider-options='{ "slidesPerView": 1, "spaceBetween": 20, "loop": true, "autoplay": { "delay": 2500, "disableOnInteraction": false }, "pagination": { "el": ".slider-four-slide-pagination-1", "clickable": true }, "keyboard": { "enabled": true, "onlyInViewport": true }, "breakpoints": { "1600": { "slidesPerView": 6 }, "1400": { "slidesPerView": 5 }, "1200": { "slidesPerView": 4 }, "991": { "slidesPerView": 3 }, "768": { "slidesPerView": 2 } }, "effect": "slide" }'>
                  <div className="swiper-wrapper pt-30px pb-30px">
                    {slides.map((slide, i) => (
                      <div className="swiper-slide box-shadow-extra-large" key={i}>
                        <div className="border-radius-10px bg-white pt-40px pb-40px ps-50px pe-50px xxl-p-30px justify-content-start text-start">
                          <a href={slide.href || '/'} className="text-center d-block mb-50px md-mb-30px">
                            <img src={slide.img} alt="" />
                          </a>
                          <div className="last-paragraph-no-margin text-center text-md-start">
                            <a href={slide.href || '/'} className="d-inline-block alt-font text-dark-gray fw-600 fs-20 mb-5px ls-minus-05px">{slide.title}</a>
                            <p>{slide.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <div className="col-12 text-center">
              <i className="bi bi-window-fullscreen text-dark-gray d-inline-block align-middle icon-extra-medium me-5px md-m-5px"></i>
              <div className="fs-20 alt-font text-dark-gray d-inline-block align-middle fw-500 ls-minus-05px">{iFooter.note}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

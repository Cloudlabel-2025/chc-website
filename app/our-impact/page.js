import ContentSection from '@/components/ContentSection'

export const metadata = {
  title: 'Our Impact - CHC',
  description: 'We deliver smart solutions that help your business grow successfully.',
}

const slides = [
  { title: 'Development', img: '180x150', desc: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.' },
  { title: 'UX / UI Design', img: '160x150', desc: 'Expertise lies in scalable web solutions for both emerging startups and enterprise.' },
  { title: 'Marketing', img: '200x150', desc: 'We build real-world web solutions ideal for all project sizes and a range of requirements.' },
  { title: 'Content writing', img: '196x150', desc: 'Deliver web solutions designed to meet the evolving needs of startups alike.' },
  { title: 'Product design', img: '244x150', desc: 'Create scalable web solutions tailored for startups to enterprise-level project needs.' },
  { title: 'Development', img: '180x150', desc: 'We build flexible web solutions that grow from small startups to large-scale demands.' },
  { title: 'UX / UI Design', img: '160x150', desc: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.' },
  { title: 'Marketing', img: '200x150', desc: 'We deliver web solutions designed to meet the evolving needs of startups alike.' },
  { title: 'Content writing', img: '196x150', desc: 'We build real-world web solutions ideal for all project sizes and a range of requirements.' },
  { title: 'Product design', img: '244x150', desc: 'From startups to enterprises, we craft adaptable web solutions that scale with your business.' },
]

export default function OurImpactPage() {
  return (
    <>
      <section className="chc-page-hero cover-background full-screen ipad-top-space-margin py-0px md-h-750px sm-h-650px">
        <img src="/images/Oracle-hcm-hero.png" alt="" className="chc-hero-background" fetchPriority="high" aria-hidden="true" />
        <div className="hero-overlay-animated"></div>
        <div className="shape-image-animation bottom-0 p-0 w-100 d-none d-md-block">
          <svg xmlns="http://www.w3.org/2000/svg" width="3000" height="400" viewBox="0 180 2500 200" fill="#ffffff">
            <path className="st1" d="M 0 250 C 1200 400 1200 50 3000 250 L 3000 550 L 0 550 L 0 250">
              <animate attributeName="d" dur="5s" values="M 0 250 C 1200 400 1200 50 3000 250 L 3000 550 L 0 550 L 0 250;M 0 250 C 400 50 400 400 3000 250 L 3000 550 L 0 550 L 0 250;M 0 250 C 1200 400 1200 50 3000 250 L 3000 550 L 0 550 L 0 250" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
        <div className="row align-items-center justify-content-center position-relative z-index-1 h-350px sm-h-250px">
          <div className="col-md-6 text-center position-relative page-title-extra-large" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <h1 className="alt-font d-inline-block fw-700 ls-0px text-white mb-15px">Our Impact</h1>
            <p className="mx-auto w-50 xl-w-70 md-w-100 mb-0 text-white opacity-6">We deliver smart solutions that help your business grow successfully.</p>
          </div>
          <div className="down-section text-center" data-anime='{ "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <a href="#down-section" className="section-link">
              <div className="text-white"><i className="bi bi-arrow-down-short icon-very-medium animation-float"></i></div>
            </a>
          </div>
        </div>
      </section>
        <ContentSection />

        <section className="cover-background border-radius-10px overflow-visible" style={{ backgroundImage: "url('/images/demo-modern-business-services-bg-01.jpg')" }}>
          <div className="container-fluid overflow-hidden">
            <div className="row" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col-12 text-center">
                <span className="ps-20px pe-20px pt-5px pb-5px mb-15px text-uppercase alt-font text-base-color fs-12 lh-26 fw-600 alt-font border-radius-100px bg-gradient-very-light-gray-transparent d-inline-flex"><i className="bi bi-box-seam fs-16 me-5px"></i>Services and solutions</span>
                <h2 className="alt-font text-dark-gray fw-700 ls-minus-05px mb-30px sm-mb-0">Experienced services</h2>
              </div>
            </div>
            <div className="row mb-25px sm-mb-0" data-anime='{ "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col-md-12">
                <div className="outside-box-right-15 outside-box-left-15 sm-outside-box-right-0 sm-outside-box-left-0">
                  <div className="swiper magic-cursor" data-slider-options='{ "slidesPerView": 1, "spaceBetween": 20, "loop": true, "autoplay": { "delay": 250000, "disableOnInteraction": false }, "pagination": { "el": ".slider-four-slide-pagination-1", "clickable": true }, "keyboard": { "enabled": true, "onlyInViewport": true }, "breakpoints": { "1600": { "slidesPerView": 6 }, "1400": { "slidesPerView": 5 }, "1200": { "slidesPerView": 4 }, "991": { "slidesPerView": 3 }, "768": { "slidesPerView": 2 } }, "effect": "slide" }'>
                    <div className="swiper-wrapper pt-30px pb-30px">
                      {slides.map((slide, i) => (
                        <div className="swiper-slide box-shadow-extra-large" key={i}>
                          <div className="border-radius-10px bg-white pt-40px pb-40px ps-50px pe-50px xxl-p-30px justify-content-start text-start">
                            <a href="/" className="text-center d-block mb-50px md-mb-30px"><img src={`https://placehold.co/${slide.img}`} alt="" /></a>
                            <div className="last-paragraph-no-margin text-center text-md-start">
                              <a href="/" className="d-inline-block alt-font text-dark-gray fw-600 fs-20 mb-5px ls-minus-05px ls-minus-05px">{slide.title}</a>
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
                <div className="fs-20 alt-font text-dark-gray d-inline-block align-middle fw-500 ls-minus-05px">Create your own website in one time without any coding knowledge.</div>
              </div>
            </div>
          </div>
        </section>
    </>
  )
}

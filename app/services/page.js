import ContentSection from '@/components/ContentSection'

export const metadata = {
  title: 'Services - CHC',
  description: 'We deliver smart solutions that help your business grow successfully.',
}

export default function ServicesPage() {
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
            <h1 className="alt-font d-inline-block fw-700 ls-0px text-white mb-15px">Services</h1>
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

        <section className="position-relative">
          <div className="container-fluid px-5 lg-px-10">
            <div className="row row-cols-1 row-cols-lg-3 row-cols-md-2" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col icon-with-text-style-04 transition-inner-all mb-30px">
                <div className="feature-box border-radius-10px box-shadow-double-large-hover bg-gradient-top-very-light-gray pt-40px p-50px xl-p-35px last-paragraph-no-margin text-start">
                  <div className="feature-box-icon mb-50px">
                    <a href="/"><img src="https://placehold.co/180x150" alt="" /></a>
                  </div>
                  <div className="feature-box-content">
                    <a href="/" className="d-inline-block alt-font text-dark-gray fw-600 fs-20 mb-5px ls-minus-05px">Development</a>
                    <p>From startups to enterprises, we craft adaptable web solutions that scale with your business.</p>
                  </div>
                  <div className="feature-box-overlay bg-white border-radius-10px"></div>
                </div>
              </div>
              <div className="col icon-with-text-style-04 transition-inner-all mb-30px">
                <div className="feature-box border-radius-10px box-shadow-double-large-hover bg-gradient-top-very-light-gray pt-40px p-50px xl-p-35px last-paragraph-no-margin text-start">
                  <div className="feature-box-icon mb-50px">
                    <a href="/"><img src="https://placehold.co/160x150" alt="" /></a>
                  </div>
                  <div className="feature-box-content">
                    <a href="/" className="d-inline-block alt-font text-dark-gray fw-600 fs-20 mb-5px ls-minus-05px">UX / UI design</a>
                    <p>We build real-world web solutions ideal for all project sizes and a range of requirements.</p>
                  </div>
                  <div className="feature-box-overlay bg-white border-radius-10px"></div>
                </div>
              </div>
              <div className="col icon-with-text-style-04 transition-inner-all mb-30px">
                <div className="feature-box border-radius-10px box-shadow-double-large-hover bg-gradient-top-very-light-gray pt-40px p-50px xl-p-35px last-paragraph-no-margin text-start">
                  <div className="feature-box-icon mb-50px">
                    <a href="/"><img src="https://placehold.co/200x150" alt="" /></a>
                  </div>
                  <div className="feature-box-content">
                    <a href="/" className="d-inline-block alt-font text-dark-gray fw-600 fs-20 mb-5px ls-minus-05px">Marketing</a>
                    <p>We deliver web solutions designed to meet the evolving needs of startups alike.</p>
                  </div>
                  <div className="feature-box-overlay bg-white border-radius-10px"></div>
                </div>
              </div>
              <div className="col icon-with-text-style-04 transition-inner-all md-mb-30px">
                <div className="feature-box border-radius-10px box-shadow-double-large-hover bg-gradient-top-very-light-gray pt-40px p-50px xl-p-35px last-paragraph-no-margin text-start">
                  <div className="feature-box-icon mb-50px">
                    <a href="/"><img src="https://placehold.co/196x150" alt="" /></a>
                  </div>
                  <div className="feature-box-content">
                    <a href="/" className="d-inline-block alt-font text-dark-gray fw-600 fs-20 mb-5px ls-minus-05px">Content writing</a>
                    <p>From startups to enterprises, we craft adaptable web solutions that scale with your business.</p>
                  </div>
                  <div className="feature-box-overlay bg-white border-radius-10px"></div>
                </div>
              </div>
              <div className="col icon-with-text-style-04 transition-inner-all md-mb-30px">
                <div className="feature-box border-radius-10px box-shadow-double-large-hover bg-gradient-top-very-light-gray pt-40px p-50px xl-p-35px last-paragraph-no-margin text-start">
                  <div className="feature-box-icon mb-50px">
                    <a href="/"><img src="https://placehold.co/244x150" alt="" /></a>
                  </div>
                  <div className="feature-box-content">
                    <a href="/" className="d-inline-block alt-font text-dark-gray fw-600 fs-20 mb-5px ls-minus-05px">Product development</a>
                    <p>We build flexible web solutions that grow from small startups to large-scale demands.</p>
                  </div>
                  <div className="feature-box-overlay bg-white border-radius-10px"></div>
                </div>
              </div>
              <div className="col icon-with-text-style-04 transition-inner-all md-mb-30px">
                <div className="feature-box border-radius-10px box-shadow-double-large-hover bg-gradient-top-very-light-gray pt-40px p-50px xl-p-35px last-paragraph-no-margin text-start">
                  <div className="feature-box-icon mb-50px">
                    <a href="/"><img src="https://placehold.co/210x150" alt="" /></a>
                  </div>
                  <div className="feature-box-content">
                    <a href="/" className="d-inline-block alt-font text-dark-gray fw-600 fs-20 mb-5px ls-minus-05px">eCommerce solutions</a>
                    <p>Create scalable web solutions tailored for startups to enterprise-level project needs.</p>
                  </div>
                  <div className="feature-box-overlay bg-white border-radius-10px"></div>
                </div>
              </div>
            </div>
            <div className="row mt-5 sm-mt-0" data-anime='{ "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <div className="col-12 text-center">
                <i className="bi bi-chat-text text-dark-gray d-inline-block align-middle icon-extra-medium me-5px md-m-5px"></i>
                <div className="fs-20 alt-font text-dark-gray d-inline-block align-middle fw-500 ls-minus-05px">Let&apos;s make something great work together. <a href="/contact" className="text-dark-gray fw-600 text-decoration-line-bottom">Got a project in mind?</a></div>
              </div>
            </div>
          </div>
        </section>
    </>
  )
}

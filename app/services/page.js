import Hero from '@/components/Hero'
import ContentSection from '@/components/ContentSection'

export const metadata = {
  title: 'Services - CHC',
  description: 'We deliver smart solutions that help your business grow successfully.',
}

export default function ServicesPage() {
  return (
    <>
      <Hero title="Services" subtitle="We deliver smart solutions that help your business grow successfully." />

      <div className="box-layout">
        <ContentSection />

        <section className="position-relative">
          <div className="container">
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
      </div>
    </>
  )
}

import ContentSection from '@/components/ContentSection'

export const metadata = {
  title: 'Applications - CHC',
  description: 'We deliver smart solutions that help your business grow successfully.',
}

function StackCardGroup() {
  return (
    <div className="stack-card cards" data-scale="true" data-top-space="35">
      <div className="stack-item mb-50px" data-index="0">
        <img src="/images/demo-modern-business-object-blur-01.jpg" className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
        <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
          <img src="/images/demo-modern-business-bg-01.png" alt="" className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom="transform:rotate(-20deg); filter: blur(100px)" />
          <div className="row z-index-9 position-relative align-items-center">
            <div className="col-xl-8 col-lg-6 md-mb-30px">
              <img src="https://images.unsplash.com/photo-1511300636408-a63a89df3482?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFuZHNjYXBlJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww" />
            </div>
            <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
              <div className="icon-with-text-style-08 mb-20px">
                <div className="feature-box feature-box-left-icon-middle">
                  <div className="feature-box-icon feature-box-icon-rounded w-50px h-50px bg-base-transparent-light border-radius-100px me-10px">
                    <i className="bi bi-megaphone fs-22 text-base-color"></i>
                  </div>
                  <div className="feature-box-content">
                    <span className="d-inline-block fs-16 fw-500 text-dark-gray">Outstanding speed</span>
                  </div>
                </div>
              </div>
              <h2 className="alt-font text-dark-gray fw-700 mb-20px">Excellence framework.</h2>
              <p className="text-medium-gray">Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.</p>
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
      <div className="stack-item mb-50px" data-index="1">
        <img src="/images/demo-modern-business-object-blur-01.jpg" className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
        <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
          <img src="/images/demo-modern-business-bg-01.png" alt="" className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom="transform:rotate(-60deg); filter: blur(75px)" />
          <div className="row z-index-9 position-relative align-items-center">
            <div className="col-xl-8 col-lg-6 md-mb-30px">
              <img src="https://placehold.co/674x452" />
            </div>
            <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
              <div className="icon-with-text-style-08 mb-20px">
                <div className="feature-box feature-box-left-icon-middle">
                  <div className="feature-box-icon feature-box-icon-rounded w-50px h-50px bg-base-transparent-light border-radius-100px me-10px">
                    <i className="bi bi-speedometer2 fs-22 text-base-color"></i>
                  </div>
                  <div className="feature-box-content">
                    <span className="d-inline-block fs-16 fw-500 text-dark-gray">Performance playbook</span>
                  </div>
                </div>
              </div>
              <h2 className="alt-font text-dark-gray fw-700 mb-20px">Strategic performance.</h2>
              <p className="text-medium-gray">Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.</p>
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
      <div className="stack-item" data-index="2">
        <img src="/images/demo-modern-business-object-blur-01.jpg" className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
        <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
          <img src="/images/demo-modern-business-bg-01.png" alt="" className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom="transform:rotate(-10deg); filter: blur(20px)" />
          <div className="row z-index-9 position-relative align-items-center">
            <div className="col-xl-8 col-lg-6 md-mb-30px">
              <img src="https://placehold.co/674x452" />
            </div>
            <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
              <div className="icon-with-text-style-08 mb-20px">
                <div className="feature-box feature-box-left-icon-middle">
                  <div className="feature-box-icon feature-box-icon-rounded w-50px h-50px bg-base-transparent-light border-radius-100px me-10px">
                    <i className="bi bi-vector-pen fs-22 text-base-color"></i>
                  </div>
                  <div className="feature-box-content">
                    <span className="d-inline-block fs-16 fw-500 text-dark-gray">Performance power</span>
                  </div>
                </div>
              </div>
              <h2 className="alt-font text-dark-gray fw-700 mb-20px">Outcome accelerator.</h2>
              <p className="text-medium-gray">Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.</p>
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
    </div>
  )
}

export default function ApplicationsPage() {
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
            <h1 className="alt-font d-inline-block fw-700 ls-0px text-white mb-15px">Applications</h1>
            <p className="mx-auto w-50 xl-w-70 md-w-100 mb-0 text-white opacity-6">We deliver smart solutions that help your business grow successfully.</p>
          </div>
          <div className="down-section text-center" data-anime='{ "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <a href="#down-section" className="section-link">
              <div className="text-white"><i className="bi bi-arrow-down-short icon-very-medium animation-float"></i></div>
            </a>
          </div>
        </div>
      </section>
        {/* Group 1 */}
        <ContentSection />
        <section>
          <div className="container-fluid px-5 lg-px-10">
            <div className="row">
              <div className="col-12">
                <StackCardGroup />
              </div>
            </div>
          </div>
        </section>

        {/* Group 2 */}
        <ContentSection />
        <section>
          <div className="container-fluid px-5 lg-px-10">
            <div className="row">
              <div className="col-12">
                <StackCardGroup />
              </div>
            </div>
          </div>
        </section>

        {/* Group 3 */}
        <ContentSection />
        <section>
          <div className="container-fluid px-5 lg-px-10">
            <div className="row">
              <div className="col-12">
                <StackCardGroup />
              </div>
            </div>
          </div>
        </section>
    </>
  )
}

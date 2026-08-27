import Hero from '@/components/Hero'
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
      <Hero title="Applications" subtitle="We deliver smart solutions that help your business grow successfully." />
      <div className="box-layout">
        {/* Group 1 */}
        <ContentSection />
        <StackCardGroup />

        {/* Group 2 */}
        <ContentSection />
        <StackCardGroup />

        {/* Group 3 */}
        <ContentSection />
        <StackCardGroup />
      </div>
    </>
  )
}

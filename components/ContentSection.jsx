export default function ContentSection() {
  return (
    <section id="down-section" className="position-relative overflow-hidden">
      <img src="/images/demo-modern-business-elements-02.png" alt="" className="position-absolute right-20px top-70px animation-rotation d-none d-md-block" />
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xxl-7 col-lg-6 position-relative md-mb-15 sm-mb-20">
            <div className="w-70 lg-w-80" data-animation-delay="50" data-shadow-animation="true">
              <img src="/images/Oracle-hcm-content.jpg" alt="" className="border-radius-10px w-100" />
              <img src="/images/chc-spin-support.png" alt="" className="position-absolute left-60px bottom-minus-60px d-none d-md-block" style={{ width: '98px', height: 'auto', borderRadius: '50%', marginBottom: '26px', marginLeft: '28px' }} />
              <img src="/images/chc-spinner.png" alt="" className="position-absolute left-60px bottom-minus-60px animation-rotation d-none d-md-block" style={{ width: '150px', height: 'auto' }} />
            </div>
            <div className="w-50 overflow-hidden position-absolute right-90px lg-right-50px sm-right-15px xs-w-60 bottom-minus-50px" data-shadow-animation="true" data-animation-delay="250" data-bottom-top="transform: translateY(50px)" data-top-bottom="transform: translateY(-50px)">
              <img src="/images/oracle-hcm-content-02.jpg" alt="" className="border-radius-10px w-100 box-shadow-quadruple-large" />
            </div>
          </div>
          <div className="col-xxl-5 col-lg-6" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <span className="ps-20px pe-20px pt-5px pb-5px mb-20px text-uppercase alt-font text-base-color fs-12 lh-26 fw-600 alt-font border-radius-100px bg-gradient-very-light-gray-transparent d-inline-flex"><i className="bi bi-award fs-16 me-5px"></i>We are modern business agency</span>
            <h2 className="alt-font text-dark-gray fw-700 mb-20px md-w-80 sm-w-100">The leading agency for startup success.</h2>
            <p className="w-90 sm-w-100">We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements. We create compelling web designs, which are the right-fit for your target groups and also deliver optimized.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

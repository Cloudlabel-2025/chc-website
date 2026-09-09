import { cloudinaryUrl } from '@/lib/cms/cloudinary-url'

export default function ContentSection({
  id = 'down-section',
  leftImage  = '/images/Oracle-hcm-content.jpg',
  rightImage = '/images/oracle-hcm-content-02.jpg',
  badge      = 'We are modern business agency',
  heading    = 'The leading agency for startup success.',
  paragraph  = 'We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements. We create compelling web designs, which are the right-fit for your target groups and also deliver optimized.',
}) {
  return (
    <section id={id} className="chc-content-section position-relative overflow-hidden">
      <img src="/images/demo-modern-business-elements-02.png" alt="" data-no-retina className="position-absolute right-20px top-70px animation-rotation d-none d-md-block" />
      <div className="container-fluid px-5 lg-px-10">
        <div className="row align-items-center justify-content-center">
          <div className="col-xxl-7 col-lg-6 position-relative md-mb-15 sm-mb-20">
            <div className="w-70 lg-w-80" data-chc-animate>
              <img src={cloudinaryUrl(leftImage, 'contentLeft')} alt="" className="chc-content-image-left border-radius-10px w-100" width="750" height="800" />
              <img src="/images/chc-spin-support.png" alt="" data-no-retina className="position-absolute left-60px bottom-minus-60px d-none d-md-block" style={{ width: '98px', height: 'auto', borderRadius: '50%', marginBottom: '26px', marginLeft: '28px' }} />
              <img src="/images/chc-spinner.png" alt="" data-no-retina className="position-absolute left-60px bottom-minus-60px animation-rotation d-none d-md-block" style={{ width: '150px', height: 'auto' }} />
            </div>
            <div className="w-50 overflow-hidden position-absolute right-90px lg-right-50px sm-right-15px xs-w-60 bottom-minus-50px" data-chc-animate>
              <img src={cloudinaryUrl(rightImage, 'contentRight')} alt="" className="chc-content-image-right border-radius-10px w-100 box-shadow-quadruple-large" width="600" height="600" />
            </div>
          </div>
          <div className="col-xxl-5 col-lg-6" data-chc-animate='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <span className="ps-20px pe-20px pt-5px pb-5px mb-20px text-uppercase alt-font text-base-color fs-12 lh-26 fw-600 alt-font border-radius-100px bg-gradient-very-light-gray-transparent d-inline-flex">
              <i className="bi bi-award fs-16 me-5px"></i>{badge}
            </span>
            <h2 className="alt-font text-dark-gray fw-700 mb-20px md-w-80 sm-w-100">{heading}</h2>
            <p className="w-90 sm-w-100">{paragraph}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

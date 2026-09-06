import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import {
  getInnerPageHero, getContentSection, getPageSeo,
  getDeliveryModelProcessSteps, getDeliveryModelFaqs,
  getFaqHeader, getFaqFooter, getProcessHeader2,
} from '@/lib/cms/public-data'

export async function generateMetadata() {
  return getPageSeo('our-delivery-model', {
    title: 'Our Delivery Model - CHC',
    description: 'We deliver smart solutions that help your business grow successfully.',
  })
}

export default async function OurDeliveryModelPage() {
  const [hero, cs, steps1, steps2, faqs, fh, ff, ph2] = await Promise.all([
    getInnerPageHero('our-delivery-model', { heading: 'Our Delivery Model', subtitle: 'We deliver smart solutions that help your business grow successfully.' }),
    getContentSection('our-delivery-model'),
    getDeliveryModelProcessSteps('processSteps1'),
    getDeliveryModelProcessSteps('processSteps2'),
    getDeliveryModelFaqs(),
    getFaqHeader(),
    getFaqFooter(),
    getProcessHeader2(),
  ])

  return (
    <>
      <PageHero {...hero} />

      <ContentSection {...cs} />

      {/* Process Steps Grid #1 */}
      <div className="row row-cols-1 row-cols-lg-4 row-cols-sm-2 mt-7 md-mt-50px" style={{ padding: '0 15px' }} data-chc-animate='{ "el": "childs", "translateX": [-50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
        {steps1.map((step, i) => (
          <div key={i} className={`col text-center process-step-style-02 hover-box last-paragraph-no-margin ${i < 4 ? 'md-mb-50px' : ''}`}>
            <i className={`${step.icon} text-base-color icon-double-large mb-20px`}></i>
            <span className="d-block alt-font text-dark-gray mb-5px fs-20 fw-600">{step.label}</span>
            <p className="d-inline-block w-75 lg-w-85">{step.description}</p>
            <div className="process-step-icon-box position-relative mt-30px">
              {i < steps1.length - 1 && <span className="progress-step-separator bg-dark-gray opacity-1 w-55 separator-line-1px"></span>}
              <div className="process-step-icon d-flex justify-content-center align-items-center mx-auto bg-white h-80px w-80px fs-18 rounded-circle text-dark-gray box-shadow-double-large alt-font fw-500">
                <span className="number position-relative z-index-1 fw-600">{String(i + 1).padStart(2, '0')}</span>
                <div className="box-overlay bg-white rounded-circle"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <section className="bg-very-light-gray">
        <div className="container-fluid px-5 lg-px-10">
          <div className="row justify-content-center mb-3">
            <div className="col-lg-7 text-center" data-chc-animate='{ "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <span className="fw-600 ls-1px fs-16 alt-font d-inline-block text-uppercase mb-5px text-base-color">{fh.eyebrow}</span>
              <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">{fh.heading}</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="row row-cols-1 row-cols-md-2" data-chc-animate='{ "el": "childs", "perspective": [1200,1200], "willchange": "transform", "translateY": [0, 0], "scale": [1.1, 1], "rotateX": [50, 0], "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
                {faqs.map((faq, i) => (
                  <div key={i} className="col mb-30px last-paragraph-no-margin">
                    <div className="bg-white h-100 ps-50px pe-50px pt-40px pb-40px xs-p-30px box-shadow-quadruple-large border-radius-5px">
                      <span className="text-dark-gray mb-5px d-inline-block fs-20 fw-600">{faq.q}</span>
                      <p>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="row justify-content-center" data-chc-animate='{ "translateY": [0, 0], "opacity": [0,1], "duration": 600, "delay": 100, "staggervalue": 100, "easing": "easeOutQuad" }'>
            <div className="col-12 text-center mt-6">
              <h6 className="alt-font text-dark-gray ls-minus-1px mb-0">{ff.text} <a href={ff.href} className="text-decoration-line-bottom-medium text-dark-gray fw-600 d-inline-block">{ff.label}</a></h6>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps Grid #2 */}
      <section className="bg-very-light-gray big-section" id="down-section">
        <div className="container-fluid px-5 lg-px-10">
          <div className="row align-items-center justify-content-center text-center text-lg-start" data-chc-animate='{ "el": "childs", "translateX": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
            <div className="col-lg-5 col-md-10 md-mb-50px xs-mb-40px">
              <h2 className="fw-600 text-dark-gray ls-minus-2px mb-0">{ph2.heading}</h2>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-lg-4 row-cols-sm-2 mt-7 md-mt-50px" data-chc-animate='{ "el": "childs", "translateX": [-50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
            {steps2.map((step, i) => (
              <div key={i} className={`col text-center process-step-style-02 hover-box last-paragraph-no-margin ${i < 4 ? 'md-mb-50px' : i === 5 ? 'xs-mb-50px' : ''}`}>
                <i className={`${step.icon} text-base-color icon-double-large mb-20px`}></i>
                <span className="d-block alt-font text-dark-gray mb-5px fs-20 fw-600">{step.label}</span>
                <p className="d-inline-block w-75 lg-w-85">{step.description}</p>
                <div className="process-step-icon-box position-relative mt-30px">
                  {i < steps2.length - 1 && <span className="progress-step-separator bg-dark-gray opacity-1 w-55 separator-line-1px"></span>}
                  <div className="process-step-icon d-flex justify-content-center align-items-center mx-auto bg-white h-80px w-80px fs-18 rounded-circle text-dark-gray box-shadow-double-large alt-font fw-500">
                    <span className="number position-relative z-index-1 fw-600">{String(i + 1).padStart(2, '0')}</span>
                    <div className="box-overlay bg-white rounded-circle"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

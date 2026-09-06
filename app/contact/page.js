import PageHero from '@/components/PageHero'
import { getInnerPageHero, getContactData, getPageSeo } from '@/lib/cms/public-data'

export async function generateMetadata() {
  return getPageSeo('contact', {
    title: 'Contact - CHC',
    description: 'Get in touch with CHC.',
  })
}

export default async function ContactPage() {
  const [hero, contact] = await Promise.all([
    getInnerPageHero('contact', { heading: 'Contact', subtitle: 'Get in touch with CHC.' }),
    getContactData(),
  ])

  const mapOptions = JSON.stringify({
    lat: parseFloat(contact.mapLat),
    lng: parseFloat(contact.mapLng),
    style: 'Silver',
    marker: { type: 'HTML', color: '#dd6531' },
    popup: { defaultOpen: true, html: contact.mapPopupHtml },
  })

  return (
    <>
      <PageHero {...hero} />

      <section id="down-section">
        <div className="container-fluid px-5 lg-px-10">
          <div className="row row-cols-1 row-cols-md-3 row-cols-sm-2 justify-content-center" data-chc-animate='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
            <div className="col icon-with-text-style-04 sm-mb-40px">
              <div className="feature-box last-paragraph-no-margin">
                <div className="feature-box-icon">
                  <i className="line-icon-Geo2-Love icon-extra-large text-base-color mb-25px"></i>
                </div>
                <div className="feature-box-content last-paragraph-no-margin">
                  <span className="d-inline-block alt-font fw-600 text-dark-gray mb-5px fs-20">{contact.officeLabel}</span>
                  <p>{contact.officeAddress}</p>
                </div>
              </div>
            </div>
            <div className="col icon-with-text-style-04 sm-mb-40px">
              <div className="feature-box last-paragraph-no-margin">
                <div className="feature-box-icon">
                  <i className="line-icon-Headset icon-extra-large text-base-color mb-25px"></i>
                </div>
                <div className="feature-box-content last-paragraph-no-margin">
                  <span className="d-inline-block alt-font fw-600 text-dark-gray mb-5px fs-20">{contact.phoneLabel}</span>
                  <div className="w-100 d-block">
                    {contact.phone && <span className="d-block">Phone: <a href={`tel:${contact.phone.replace(/\D/g,'')}`} className="text-base-color-hover">{contact.phone}</a></span>}
                    {contact.fax   && <span className="d-block">{contact.faxLabel} {contact.fax}</span>}
                  </div>
                </div>
              </div>
            </div>
            <div className="col icon-with-text-style-04">
              <div className="feature-box last-paragraph-no-margin">
                <div className="feature-box-icon">
                  <i className="line-icon-Mail-Read icon-extra-large text-base-color mb-25px"></i>
                </div>
                <div className="feature-box-content last-paragraph-no-margin">
                  <span className="d-inline-block alt-font fw-600 text-dark-gray mb-5px fs-20">{contact.emailLabel}</span>
                  <div className="w-100 d-block">
                    {contact.email1 && <a href={`mailto:${contact.email1}`} className="d-block">{contact.email1}</a>}
                    {contact.email2 && <a href={`mailto:${contact.email2}`} className="d-block">{contact.email2}</a>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="p-0" id="location" data-chc-animate='{ "translateY": [0, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 p-0">
              <div id="map" className="map" data-map-options={mapOptions}></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-very-light-gray">
        <div className="container-fluid px-5 lg-px-10">
          <div className="row justify-content-center">
            <div className="col-lg-7 text-center mb-2" data-chc-animate='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
              <span className="fw-600 ls-1px fs-16 alt-font d-inline-block text-uppercase mb-5px text-base-color">Feel free to get in touch!</span>
              <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">How we can help you?</h2>
            </div>
          </div>
          <div className="row row-cols-md-1 justify-content-center" data-chc-animate='{ "translateY": [100, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
            <div className="col-xl-9 col-lg-11">
              <form action="/api/public/contact" method="post" className="row contact-form-style-02">
                <div className="col-md-6 mb-30px">
                  <input className="box-shadow-quadruple-large input-name form-control required" type="text" name="name" placeholder="Your name*" />
                </div>
                <div className="col-md-6 mb-30px">
                  <input className="box-shadow-quadruple-large form-control required" type="email" name="email" placeholder="Your email address*" />
                </div>
                <div className="col-md-6 mb-30px">
                  <input className="box-shadow-quadruple-large form-control" type="tel" name="phone" placeholder="Your phone" />
                </div>
                <div className="col-md-6 mb-30px">
                  <input className="box-shadow-quadruple-large form-control" type="text" name="subject" placeholder="Your subject" />
                </div>
                <div className="col-md-12 mb-30px">
                  <textarea className="box-shadow-quadruple-large form-control" cols="40" rows="4" name="comment" placeholder="Your message"></textarea>
                </div>
                <div className="col-md-7 last-paragraph-no-margin">
                  <p className="text-center text-md-start fs-16">We are committed to protecting your privacy. We will never collect information about you without your explicit consent.</p>
                </div>
                <div className="col-md-5 text-center text-md-end sm-mt-20px">
                  <button className="btn btn-medium btn-dark-gray btn-box-shadow btn-round-edge submit" type="submit">send message</button>
                </div>
                <div className="col-12">
                  <div className="form-results mt-20px d-none"></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

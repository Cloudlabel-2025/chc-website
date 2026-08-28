export const metadata = {
  title: 'Contact - CHC',
  description: 'Get in touch with CHC.',
}

export default function ContactPage() {
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
            <h1 className="alt-font d-inline-block fw-700 ls-0px text-white mb-15px">Contact</h1>
            <p className="mx-auto w-50 xl-w-70 md-w-100 mb-0 text-white opacity-6">We deliver smart solutions that help your business grow successfully.</p>
          </div>
          <div className="down-section text-center" data-anime='{ "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <a href="#down-section" className="section-link">
              <div className="text-white"><i className="bi bi-arrow-down-short icon-very-medium animation-float"></i></div>
            </a>
          </div>
        </div>
      </section>
        <section id="down-section">
          <div className="container-fluid px-5 lg-px-10">
            <div className="row row-cols-1 row-cols-md-3 row-cols-sm-2 justify-content-center" data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
              <div className="col icon-with-text-style-04 sm-mb-40px">
                <div className="feature-box last-paragraph-no-margin">
                  <div className="feature-box-icon">
                    <i className="line-icon-Geo2-Love icon-extra-large text-base-color mb-25px"></i>
                  </div>
                  <div className="feature-box-content last-paragraph-no-margin">
                    <span className="d-inline-block alt-font fw-600 text-dark-gray mb-5px fs-20">CHC office</span>
                    <p>401 Broadway, 24th Floor,<br /> Orchard View, London, UK</p>
                  </div>
                </div>
              </div>
              <div className="col icon-with-text-style-04 sm-mb-40px">
                <div className="feature-box last-paragraph-no-margin">
                  <div className="feature-box-icon">
                    <i className="line-icon-Headset icon-extra-large text-base-color mb-25px"></i>
                  </div>
                  <div className="feature-box-content last-paragraph-no-margin">
                    <span className="d-inline-block alt-font fw-600 text-dark-gray mb-5px fs-20">Call us directly</span>
                    <div className="w-100 d-block">
                      <span className="d-block">Phone: <a href="tel:1800222000" className="text-base-color-hover">1-800-222-000</a></span>
                      <span className="d-block">Fax: 1-800-222-002</span>
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
                    <span className="d-inline-block alt-font fw-600 text-dark-gray mb-5px fs-20">E-mail us</span>
                    <div className="w-100 d-block">
                      <a href="mailto:info@yourdomain.com" className="d-block">info@yourdomain.com</a>
                      <a href="mailto:hr@yourdomain.com" className="d-block">hr@yourdomain.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-0" id="location" data-anime='{ "translateY": [0, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12 p-0">
                <div id="map" className="map" data-map-options='{ "lat": -37.805688, "lng": 144.962312, "style": "Silver", "marker": { "type": "HTML", "color": "#dd6531" }, "popup": { "defaultOpen": true, "html": "<div class=infowindow><strong class=\"mb-3 d-inline-block alt-font\">CHC Consulting</strong><p class=\"alt-font\">16122 Collins street, Melbourne, Australia</p></div>" } }'></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-very-light-gray">
          <div className="container-fluid px-5 lg-px-10">
            <div className="row justify-content-center">
              <div className="col-lg-7 text-center mb-2" data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
                <span className="fw-600 ls-1px fs-16 alt-font d-inline-block text-uppercase mb-5px text-base-color">Feel free to get in touch!</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">How we can help you?</h2>
              </div>
            </div>
            <div className="row row-cols-md-1 justify-content-center" data-anime='{ "translateY": [100, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
              <div className="col-xl-9 col-lg-11">
                <form action="/api/contact" method="post" className="row contact-form-style-02">
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
                    <input type="hidden" name="redirect" value="" />
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

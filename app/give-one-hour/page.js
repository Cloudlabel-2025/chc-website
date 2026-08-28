import ContentSection from '@/components/ContentSection'

export const metadata = {
  title: 'Give One Hour - CHC',
  description: 'Share your expertise, shape a career.',
}

export default function GiveOneHourPage() {
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
            <h1 className="alt-font d-inline-block fw-700 ls-0px text-white mb-15px">Give One Hour</h1>
            <p className="mx-auto w-50 xl-w-70 md-w-100 mb-0 text-white opacity-6">CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants.</p>
          </div>
          <div className="down-section text-center" data-anime='{ "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
            <a href="#down-section" className="section-link">
              <div className="text-white"><i className="bi bi-arrow-down-short icon-very-medium animation-float"></i></div>
            </a>
          </div>
        </div>
      </section>
        <ContentSection />

        <section className="bg-very-light-gray">
          <div className="container-fluid px-5 lg-px-10">
            <div className="row justify-content-center">
              <div className="col-lg-7 text-center mb-2" data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
                <span className="fw-600 ls-1px fs-16 alt-font d-inline-block text-uppercase mb-5px text-base-color">Give One Hour</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">Share your expertise, shape a career.</h2>
              </div>
            </div>
            <div className="row justify-content-center" data-anime='{ "translateY": [100, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
              <div className="col-xl-9 col-lg-11">
                <form action="/api/give-one-hour" method="post" className="row contact-form-style-02">
                  <div className="col-md-6 mb-30px">
                    <input className="box-shadow-quadruple-large input-name form-control required" type="text" name="full_name" placeholder="Your full name*" />
                  </div>
                  <div className="col-md-6 mb-30px">
                    <input className="box-shadow-quadruple-large form-control required" type="url" name="linkedin" placeholder="LinkedIn profile URL*" />
                  </div>
                  <div className="col-md-6 mb-30px">
                    <input className="box-shadow-quadruple-large form-control required" type="text" name="organisation" placeholder="Your organisation*" />
                  </div>
                  <div className="col-md-6 mb-30px">
                    <input className="box-shadow-quadruple-large form-control required" type="text" name="role" placeholder="Your role*" />
                  </div>
                  <div className="col-md-12 mb-30px">
                    <input className="box-shadow-quadruple-large form-control required" type="text" name="expertise" placeholder="Area of expertise*" />
                  </div>
                  <div className="col-md-12 mb-30px">
                    <textarea className="box-shadow-quadruple-large form-control required" cols="40" rows="4" name="how_to_help" placeholder="How would you like to help?*"></textarea>
                  </div>
                  <div className="col-md-6 mb-30px">
                    <input className="box-shadow-quadruple-large form-control required" type="text" name="availability" placeholder="Preferred availability*" />
                  </div>
                  <div className="col-md-6 mb-30px">
                    <select className="box-shadow-quadruple-large form-control required form-select" name="format">
                      <option value="" disabled selected>Online / In person*</option>
                      <option value="online">Online</option>
                      <option value="in_person">In Person</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div className="col-md-12 mb-30px">
                    <textarea className="box-shadow-quadruple-large form-control" cols="40" rows="4" name="anything_else" placeholder="Anything you&apos;d like us to know?"></textarea>
                  </div>
                  <div className="col-md-12 mt-10px mb-10px">
                    <p className="text-center text-md-start fs-16">By submitting this form you agree to be contacted by CHC regarding volunteering opportunities.</p>
                  </div>
                  <div className="col-md-12 text-center">
                    <input type="hidden" name="redirect" value="" />
                    <button className="btn btn-medium btn-gradient-purple-pink btn-round-edge submit" type="submit">Give My One Hour</button>
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

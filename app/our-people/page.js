import ContentSection from '@/components/ContentSection'

export const metadata = {
  title: 'Our People - CHC',
  description: 'We deliver smart solutions that help your business grow successfully.',
}

export default function OurPeoplePage() {
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
            <h1 className="alt-font d-inline-block fw-700 ls-0px text-white mb-15px">Our People</h1>
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
        <div id="particles-03" data-particle="true" data-particle-options='{"particles": {"number": {"value": 5,"density": {"enable": true,"value_area": 1000}},"color":{"value":["#b7b9be", "#dd6531"]},"shape": {"type": "circle","stroke":{"width":0,"color":"#000000"}},"opacity": {"value": 0.5,"random": false,"anim": {"enable": false,"speed": 1,"sync": false}},"size": {"value": 8,"random": true,"anim": {"enable": false,"sync": true}},"move": {"enable": true,"speed":2,"direction": "right","random": false,"straight": false}},"interactivity": {"detect_on": "canvas","events": {"onhover": {"enable": false,"mode": "repulse"},"onclick": {"enable": false,"mode": "push"},"resize": true}},"retina_detect": false}' className="position-absolute h-100 top-0 left-0 z-index-minus-1"></div>
        <div className="container-fluid px-5 lg-px-10">
          <div className="row justify-content-center mb-3">
            <div className="col-lg-7 text-center" data-anime='{  "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
              <span className="fw-600 ls-1px fs-16 alt-font mb-5px d-inline-block text-uppercase text-base-color">Meet our people</span>
              <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">Leading experts</h2>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-lg-4 row-cols-sm-2 justify-content-center" data-anime='{ "el": "childs", "translateY": [30, 0], "opacity": [0,1], "duration": 800, "delay":0, "staggervalue": 300, "easing": "easeOutQuad" }'>
            {[
              { name: 'Bryan Jonhson', role: 'Director' },
              { name: 'Jeremy Dupont', role: 'Specialist' },
              { name: 'Matthew Taylor', role: 'Manager' },
              { name: 'Johncy Parker', role: 'Consultant' },
            ].map((person, i) => (
              <div className="col text-center team-style-05 md-mb-40px" key={i}>
                <div className="position-relative border-radius-4px overflow-hidden mb-30px last-paragraph-no-margin">
                  <img src="https://placehold.co/600x756" alt="" />
                  <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center p-40px lg-p-30px team-content bg-gradient-dark-orange-transparent">
                    <div className="social-icon fs-20">
                      <p className="text-white">Name</p>
                      <p className="text-white">Area</p>
                      <p className="text-white">Capability</p>
                      <p className="text-white">Current learning / delivery focus</p>
                    </div>
                  </div>
                </div>
                <div className="alt-font fw-600 text-dark-gray lh-22 fs-18">{person.name}</div>
                <span>{person.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

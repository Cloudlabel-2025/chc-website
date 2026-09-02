export default function PageHero({ backgroundImage, heading, subtitle }) {
  return (
    <section className="chc-page-hero cover-background full-screen ipad-top-space-margin py-0px md-h-750px sm-h-650px">
      <img src={backgroundImage} alt="" className="chc-hero-background" fetchPriority="high" aria-hidden="true" />
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
          <h1 className="alt-font d-inline-block fw-700 ls-0px text-white mb-15px">{heading}</h1>
          {subtitle && <p className="mx-auto w-50 xl-w-70 md-w-100 mb-0 text-white opacity-6">{subtitle}</p>}
        </div>
        <div className="down-section text-center" data-anime='{ "translateY": [30, 0], "opacity": [0,1], "duration": 600, "delay": 200, "staggervalue": 300, "easing": "easeOutQuad" }'>
          <a href="#down-section" className="section-link">
            <div className="text-white"><i className="bi bi-arrow-down-short icon-very-medium animation-float"></i></div>
          </a>
        </div>
      </div>
    </section>
  )
}

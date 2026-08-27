'use client'

export default function Header() {
  return (
    <header className="header-with-topbar">
      <nav className="navbar navbar-expand-lg header-light bg-transparent disable-fixed">
        <div className="container-fluid">
          <div className="col-auto col-lg-3 me-lg-0 me-auto">
            <a className="navbar-brand" href="/">
              <img src="/images/chc-logo.png" alt="" className="default-logo" />
            </a>
          </div>
          <div className="col-auto ms-auto md-ms-0 menu-order position-static">
            <button className="navbar-toggler float-start" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-label="Toggle navigation">
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item"><a href="/" className="nav-link">Home</a></li>
                <li className="nav-item"><a href="/oracle-hcm" className="nav-link">Oracle HCM</a></li>
                <li className="nav-item"><a href="/applications" className="nav-link">Applications</a></li>
                <li className="nav-item dropdown dropdown-with-icon">
                  <a href="/services" className="nav-link">Services <span className="label border-radius-100px bg-light-medium-gray fw-700 alt-font text-base-color text-uppercase">Hot</span></a>
                </li>
                <li className="nav-item dropdown dropdown-with-icon">
                  <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">What we do <i className="fa-solid fa-angle-down"></i></a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <li>
                      <a href="/our-delivery-model"><i className="bi bi-card-text"></i>
                        <div className="submenu-icon-content">
                          <span>Our Delivery Model</span>
                          <p>Telling your story with impact.</p>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="/our-impact"><i className="bi bi-send"></i>
                        <div className="submenu-icon-content">
                          <span>Our Impact</span>
                          <p>Strategies for lasting impact.</p>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="/our-people"><i className="bi bi-briefcase"></i>
                        <div className="submenu-icon-content">
                          <span>Our People</span>
                          <p>Turning concepts into products.</p>
                        </div>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item"><a href="/give-one-hour" className="nav-link">Give One Hour</a></li>
                <li className="nav-item"><a href="/about" className="nav-link">About</a></li>
                <li className="nav-item"><a href="/contact" className="nav-link">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="col-auto text-end d-none d-sm-flex">
            <div className="header-icon">
              <div className="header-search-icon icon">
                <a href="#" className="search-form-icon header-search-form h-45px w-45px d-flex align-items-center justify-content-center border border-color-extra-medium-gray text-center rounded-circle">
                  <i className="feather icon-feather-search text-base-color"></i>
                </a>
                <div className="search-form-wrapper">
                  <button title="Close" type="button" className="search-close"></button>
                  <form id="search-form" role="search" method="get" className="search-form text-left" action="/index2.html">
                    <div className="search-form-box">
                      <h2 className="text-dark-gray text-center fw-600 mb-4 ls-minus-2px">What are you looking for?</h2>
                      <input className="search-input" id="search-form-input5e219ef164995" placeholder="Enter your keywords..." name="s" value="" type="text" autoComplete="off" />
                      <button type="submit" className="search-button">
                        <i className="feather icon-feather-search" aria-hidden="true"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default function Footer() {
  return (
    <footer className="chc-site-footer cover-background pb-0 overflow-visible position-relative" style={{ backgroundImage: "url('/images/demo-modern-business-footer-bg.jpg')" }}>
      <div className="opacity-very-light bg-black"></div>
      <div className="position-absolute right-150px md-right-50px xs-right-20px top-minus-60px footer-spinner-wrap" style={{ width: '150px', height: '150px' }} aria-hidden="true">
        <img src="/images/chc-spin-support.png" alt="" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '98px', height: 'auto', borderRadius: '50%' }} />
        <img src="/images/chc-spinner.png" alt="" className="animation-rotation" style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-75px', marginLeft: '-75px', width: '150px', height: 'auto' }} />
      </div>

      <div className="container overflow-hidden">
        <div className="row position-relative z-index-9 chc-footer-grid">
          <div className="col-12 col-xl-3 col-md-6 d-flex flex-column lg-mb-30px sm-mb-20px order-1">
            <a href="/" className="footer-logo mb-25px xs-mb-20px d-inline-block">
              <img src="/images/chc-logo.png" alt="" />
            </a>
            <div className="elements-social social-text-style-01 mt-auto">
              <ul className="small-icon light">
                <li><a className="facebook" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
                <li><a className="instagram" href="http://www.instagram.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a></li>
                <li><a className="youtube" href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-youtube"></i></a></li>
                <li><a className="linkedin" href="http://www.linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a></li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-xl-3 col-md-6 last-paragraph-no-margin order-xl-2 order-3 sm-mb-20px">
            <p className="w-80 mb-20px md-w-100"><span className="text-white d-block">Crafto - Netherlands</span>Graaf florisstraat 22A, Netherlands - 1001</p>
            <p className="w-80 md-w-100"><span className="text-white d-block">Crafto - Barcelona</span>365 Grand via de coarts, Barcelona - 1002</p>
          </div>
          <div className="col-12 col-xl-3 col-md-6 last-paragraph-no-margin order-xl-3 order-4 sm-mb-30px">
            <p className="mb-0">Interested in working with us? </p>
            <a href="mailto:hello@yourdomain.com" className="text-white text-decoration-line-bottom mb-25px d-inline-block">hello@yourdomain.com</a>
            <p className="mb-0">Looking for a job opportunity?</p>
            <a href="mailto:hr@yourdomain.com" className="text-white text-decoration-line-bottom d-inline-block">hr@yourdomain.com</a>
          </div>
          <div className="col-12 col-xl-3 col-md-6 d-flex flex-column order-xl-4 order-2 lg-mb-30px sm-mb-20px">
            <span className="d-block text-white mb-15px">Sign up for the newsletter</span>
            <div className="d-inline-block w-100 newsletter-style-02 position-relative mb-10px">
              <form action="/api/subscribe" method="post" className="position-relative w-100">
                <input className="bg-transparent border-color-transparent-white-light w-100 form-control required" type="email" name="email" placeholder="Enter your email..." />
                <input type="hidden" name="redirect" value="" />
                <button type="submit" className="btn submit" aria-label="submit"><i className="icon bi bi-envelope icon-small text-white"></i></button>
                <div className="form-results border-radius-4px pt-5px pb-5px ps-15px pe-15px fs-14 lh-22 mt-10px w-100 text-center position-absolute d-none"></div>
              </form>
            </div>
            <p className="mt-auto mb-0">&copy; 2026 Crafto. Powered by <a href="https://www.themezaa.com/" target="_blank" rel="noopener noreferrer" className="fw-500 text-decoration-line-bottom text-medium-gray text-white-hover">ThemeZaa</a></p>
          </div>
        </div>
        <div className="row mb-minus-70px md-mb-minus-50px md-mb-minus-20px">
          <div className="col-12 text-center">
            <span className="text-base-color fs-300 xl-fs-250 lg-fs-200 sm-fs-150 xs-fs-100 fw-600 ls-minus-8px lg-ls-minus-4px w-100 opacity-6">Cloud</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

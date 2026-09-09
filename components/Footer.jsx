import SlideLink from '@/components/SlideLink'
const DEFAULTS = {
  address1Label: '',
  address1Text:  '',
  address2Label: '',
  address2Text:  '',
  ctaText:       'Interested in working with us?',
  ctaLinkText:   'cloudheard.org',
  ctaLinkHref:   'https://cloudheard.org',
  copyrightText: '© 2026 Cloudheard Consultancy.',
  facebookUrl:   'https://www.facebook.com/',
  instagramUrl:  'http://www.instagram.com',
  youtubeUrl:    'https://www.youtube.com/',
  linkedinUrl:   'http://www.linkedin.com',
}

export default function Footer({ footer = DEFAULTS }) {
  const f = { ...DEFAULTS, ...footer }

  return (
    <footer className="chc-site-footer cover-background pb-0 overflow-visible position-relative" style={{ backgroundImage: "url('/images/demo-modern-business-footer-bg.jpg')" }}>
      <div className="opacity-very-light bg-black"></div>
      <div className="position-absolute right-150px md-right-50px xs-right-20px top-minus-60px footer-spinner-wrap" style={{ width: '150px', height: '150px' }} aria-hidden="true">
        <img src="/images/chc-spin-support.png" alt="" data-no-retina style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '98px', height: 'auto', borderRadius: '50%' }} />
        <img src="/images/chc-spinner.png" alt="" data-no-retina className="animation-rotation" style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-75px', marginLeft: '-75px', width: '150px', height: 'auto' }} />
      </div>

      <div className="container overflow-hidden">
        <div className="row position-relative z-index-9 chc-footer-grid">
          <div className="col-12 col-xl-3 col-md-6 d-flex flex-column lg-mb-30px sm-mb-20px order-1">
            <a href="/" className="footer-logo mb-25px xs-mb-20px d-inline-block">
              <img src="/images/chc-logo.png" alt="" data-no-retina />
            </a>
            <div className="elements-social social-text-style-01 mt-auto">
              <ul className="small-icon light">
                {f.facebookUrl  && <li><SlideLink className="facebook"  href={f.facebookUrl}  target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></SlideLink></li>}
                {f.instagramUrl && <li><SlideLink className="instagram" href={f.instagramUrl} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></SlideLink></li>}
                {f.youtubeUrl   && <li><SlideLink className="youtube"   href={f.youtubeUrl}   target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-youtube"></i></SlideLink></li>}
                {f.linkedinUrl  && <li><SlideLink className="linkedin"  href={f.linkedinUrl}  target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></SlideLink></li>}
              </ul>
            </div>
          </div>

          {(f.address1Text || f.address2Text) && (
            <div className="col-12 col-xl-3 col-md-6 last-paragraph-no-margin order-xl-2 order-3 sm-mb-20px">
              {f.address1Text && <p className="w-80 mb-20px md-w-100"><span className="text-white d-block">{f.address1Label}</span>{f.address1Text}</p>}
              {f.address2Text && <p className="w-80 md-w-100"><span className="text-white d-block">{f.address2Label}</span>{f.address2Text}</p>}
            </div>
          )}

          {(f.ctaText || f.ctaLinkText) && (
            <div className="col-12 col-xl-3 col-md-6 last-paragraph-no-margin order-xl-3 order-4 sm-mb-30px">
              {f.ctaText     && <p className="mb-0">{f.ctaText}</p>}
              {f.ctaLinkText && <SlideLink href={f.ctaLinkHref} className="text-white text-decoration-line-bottom d-inline-block">{f.ctaLinkText}</SlideLink>}
            </div>
          )}

          <div className="col-12 col-xl-3 col-md-6 d-flex flex-column order-xl-4 order-2 lg-mb-30px sm-mb-20px">
            {f.copyrightText && <p className="mt-auto mb-0">{f.copyrightText}</p>}
          </div>
        </div>
        <div className="row chc-footer-signature">
          <div className="col-12 text-center">
            <span className="chc-footer-wordmark text-base-color fw-600 opacity-6">Cloudheard</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

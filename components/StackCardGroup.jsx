export default function StackCardGroup({ cards, showButton = true }) {
  const decorations = [
    { rotate: '-20deg', blur: '100px' },
    { rotate: '-60deg', blur: '75px' },
    { rotate: '-10deg', blur: '20px' },
  ]

  return (
    <div className="stack-card cards" data-scale="true" data-top-space="35">
      {cards.map((card, i) => {
        const decoration = decorations[i % decorations.length]
        const rotate = card.rotate ?? decoration.rotate
        const blur = card.blur ?? decoration.blur
        return (
        <div className={`stack-item ${i < cards.length - 1 ? 'mb-50px' : ''}`} data-index={i} key={i}>
          <img src="/images/demo-modern-business-object-blur-01.jpg" data-no-retina className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
          <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
            <img src="/images/demo-modern-business-bg-01.png" alt="" data-no-retina className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom={`transform:rotate(${rotate}); filter: blur(${blur})`} />
            <div className="row z-index-9 position-relative align-items-center">
              <div className="col-xl-8 col-lg-6 md-mb-30px">
                <img src={card.img} className="w-100 h-100" style={{ aspectRatio: '674/452', objectFit: 'cover' }} alt="" />
              </div>
              <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
                {card.badge && (
                  <div className="icon-with-text-style-08 mb-20px">
                    <div className="feature-box feature-box-left-icon-middle">
                      <div className="feature-box-content">
                        <span className="d-inline-block fs-16 fw-500 text-dark-gray">{card.badge}</span>
                      </div>
                    </div>
                  </div>
                )}
                <h2 className="alt-font text-dark-gray fw-700 mb-20px">{card.heading}</h2>
                <p className="text-medium-gray">{card.paragraph}</p>
                {showButton && (
                  <a href="/" className="btn btn-large btn-dark-gray btn-switch-text btn-box-shadow btn-rounded text-transform-none left-icon">
                    <span>
                      <span><i className="feather icon-feather-edit"></i></span>
                      <span className="btn-double-text" data-text="Start exploring">Start exploring</span>
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        )
      })}
    </div>
  )
}

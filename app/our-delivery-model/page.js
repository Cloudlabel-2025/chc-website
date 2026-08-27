import Hero from '@/components/Hero'
import ContentSection from '@/components/ContentSection'

export const metadata = {
  title: 'Our Delivery Model - CHC',
  description: 'We deliver smart solutions that help your business grow successfully.',
}

export default function OurDeliveryModelPage() {
  return (
    <>
      <Hero title="Our Delivery Model" subtitle="We deliver smart solutions that help your business grow successfully." />
      <div className="box-layout">
        <ContentSection />

        {/* Process Steps Grid #1 */}
        <div className="row row-cols-1 row-cols-lg-4 row-cols-sm-2 mt-7 md-mt-50px" style={{ padding: '0 15px' }} data-anime='{ "el": "childs", "translateX": [-50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
          <div className="col text-center process-step-style-02 hover-box last-paragraph-no-margin md-mb-50px">
            <i className="line-icon-Idea-5 text-base-color icon-double-large mb-20px"></i>
            <span className="d-block alt-font text-dark-gray mb-5px fs-20 fw-600">Research</span>
            <p className="d-inline-block w-75 lg-w-85">Lorem ipsum is simply text the printing.</p>
            <div className="process-step-icon-box position-relative mt-30px">
              <span className="progress-step-separator bg-dark-gray opacity-1 w-55 separator-line-1px"></span>
              <div className="process-step-icon d-flex justify-content-center align-items-center mx-auto bg-white h-80px w-80px fs-18 rounded-circle text-dark-gray box-shadow-double-large alt-font fw-500">
                <span className="number position-relative z-index-1 fw-600">01</span>
                <div className="box-overlay bg-white rounded-circle"></div>
              </div>
            </div>
          </div>
          <div className="col text-center process-step-style-02 hover-box last-paragraph-no-margin md-mb-50px">
            <i className="line-icon-Fountain-Pen text-base-color icon-double-large mb-20px"></i>
            <span className="d-block alt-font text-dark-gray mb-5px fs-20 fw-600">Sketches</span>
            <p className="d-inline-block w-75 lg-w-85">Lorem ipsum is simply text the printing.</p>
            <div className="process-step-icon-box position-relative mt-30px">
              <span className="progress-step-separator bg-dark-gray opacity-1 w-55 separator-line-1px"></span>
              <div className="process-step-icon d-flex justify-content-center align-items-center mx-auto bg-white h-80px w-80px fs-18 rounded-circle text-dark-gray box-shadow-double-large alt-font fw-500">
                <span className="number position-relative z-index-1 fw-600">02</span>
                <div className="box-overlay bg-white rounded-circle"></div>
              </div>
            </div>
          </div>
          <div className="col text-center process-step-style-02 hover-box last-paragraph-no-margin xs-mb-50px">
            <i className="line-icon-Loading-2 text-base-color icon-double-large mb-20px"></i>
            <span className="d-block alt-font text-dark-gray mb-5px fs-20 fw-600">Concept</span>
            <p className="d-inline-block w-75 lg-w-85">Lorem ipsum is simply text the printing.</p>
            <div className="process-step-icon-box position-relative mt-30px">
              <span className="progress-step-separator bg-dark-gray opacity-1 w-55 separator-line-1px"></span>
              <div className="process-step-icon d-flex justify-content-center align-items-center mx-auto bg-white h-80px w-80px fs-18 rounded-circle text-dark-gray box-shadow-double-large alt-font fw-500">
                <span className="number position-relative z-index-1 fw-600">03</span>
                <div className="box-overlay bg-white rounded-circle"></div>
              </div>
            </div>
          </div>
          <div className="col text-center process-step-style-02 hover-box last-paragraph-no-margin">
            <i className="line-icon-Juice text-base-color icon-double-large mb-20px"></i>
            <span className="d-block alt-font text-dark-gray mb-5px fs-20 fw-600">Presentation</span>
            <p className="d-inline-block w-75 lg-w-85">Lorem ipsum is simply text the printing.</p>
            <div className="process-step-icon-box position-relative mt-30px">
              <div className="process-step-icon d-flex justify-content-center align-items-center mx-auto bg-white h-80px w-80px fs-18 rounded-circle text-dark-gray box-shadow-double-large alt-font fw-500">
                <span className="number position-relative z-index-1 fw-600">04</span>
                <div className="box-overlay bg-white rounded-circle"></div>
              </div>
            </div>
          </div>
          <div className="col text-center process-step-style-02 hover-box last-paragraph-no-margin md-mb-50px">
            <i className="line-icon-Idea-5 text-base-color icon-double-large mb-20px"></i>
            <span className="d-block alt-font text-dark-gray mb-5px fs-20 fw-600">Research</span>
            <p className="d-inline-block w-75 lg-w-85">Lorem ipsum is simply text the printing.</p>
            <div className="process-step-icon-box position-relative mt-30px">
              <span className="progress-step-separator bg-dark-gray opacity-1 w-55 separator-line-1px"></span>
              <div className="process-step-icon d-flex justify-content-center align-items-center mx-auto bg-white h-80px w-80px fs-18 rounded-circle text-dark-gray box-shadow-double-large alt-font fw-500">
                <span className="number position-relative z-index-1 fw-600">05</span>
                <div className="box-overlay bg-white rounded-circle"></div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-very-light-gray">
          <div className="container">
            <div className="row justify-content-center mb-3">
              <div className="col-lg-7 text-center" data-anime='{ "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
                <span className="fw-600 ls-1px fs-16 alt-font d-inline-block text-uppercase mb-5px text-base-color">Frequently asked questions</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px">How can we help?</h2>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-xl-10">
                <div className="row row-cols-1 row-cols-md-2" data-anime='{ "el": "childs", "perspective": [1200,1200], "willchange": "transform", "translateY": [0, 0], "scale": [1.1, 1], "rotateX": [50, 0], "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
                  <div className="col mb-30px last-paragraph-no-margin">
                    <div className="bg-white h-100 ps-50px pe-50px pt-40px pb-40px xs-p-30px box-shadow-quadruple-large border-radius-5px">
                      <span className="text-dark-gray mb-5px d-inline-block fs-20 fw-600">Can you help us raise money?</span>
                      <p>Lorem ipsum is simply dummy text of the printing typesetting industry.</p>
                    </div>
                  </div>
                  <div className="col mb-30px last-paragraph-no-margin">
                    <div className="bg-white h-100 ps-50px pe-50px pt-40px pb-40px xs-p-30px box-shadow-quadruple-large border-radius-5px">
                      <span className="text-dark-gray mb-5px d-inline-block fs-20 fw-600">Do we really need a business plan?</span>
                      <p>Lorem ipsum is simply dummy text of the printing typesetting industry.</p>
                    </div>
                  </div>
                  <div className="col sm-mb-30px last-paragraph-no-margin">
                    <div className="bg-white h-100 ps-50px pe-50px pt-40px pb-40px xs-p-30px box-shadow-quadruple-large border-radius-5px">
                      <span className="text-dark-gray mb-5px d-inline-block fs-20 fw-600">Will you sign a agreement?</span>
                      <p>Lorem ipsum is simply dummy text of the printing typesetting industry.</p>
                    </div>
                  </div>
                  <div className="col last-paragraph-no-margin">
                    <div className="bg-white h-100 ps-50px pe-50px pt-40px pb-40px xs-p-30px box-shadow-quadruple-large border-radius-5px">
                      <span className="text-dark-gray mb-5px d-inline-block fs-20 fw-600">Can you send us samples of work?</span>
                      <p>Lorem ipsum is simply dummy text of the printing typesetting industry.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center" data-anime='{ "translateY": [0, 0], "opacity": [0,1], "duration": 600, "delay": 100, "staggervalue": 100, "easing": "easeOutQuad" }'>
              <div className="col-12 text-center mt-6">
                <h6 className="alt-font text-dark-gray ls-minus-1px mb-0">Didn&apos;t find the right response? <a href="/" className="text-decoration-line-bottom-medium text-dark-gray fw-600 d-inline-block">view more from here</a></h6>
              </div>
            </div>
          </div>
        </section>

        {/* Explore the Simple Business Process */}
        <section className="bg-very-light-gray big-section" id="down-section">
          <div className="container">
            <div className="row align-items-center justify-content-center text-center text-lg-start" data-anime='{ "el": "childs", "translateX": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
              <div className="col-lg-5 col-md-10 md-mb-50px xs-mb-40px">
                <h2 className="fw-600 text-dark-gray ls-minus-2px mb-0">Explore the simple business process.</h2>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-lg-4 row-cols-sm-2 mt-7 md-mt-50px" data-anime='{ "el": "childs", "translateX": [-50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 100, "easing": "easeOutQuad" }'>
              {[
                { icon: 'line-icon-Idea-5', label: 'Research', num: '01', hasSep: true },
                { icon: 'line-icon-Fountain-Pen', label: 'Sketches', num: '02', hasSep: true },
                { icon: 'line-icon-Loading-2', label: 'Concept', num: '03', hasSep: true },
                { icon: 'line-icon-Juice', label: 'Presentation', num: '04', hasSep: false },
                { icon: 'line-icon-Fountain-Pen', label: 'Sketches', num: '05', hasSep: true },
                { icon: 'line-icon-Loading-2', label: 'Concept', num: '06', hasSep: true },
                { icon: 'line-icon-Juice', label: 'Presentation', num: '07', hasSep: false },
                { icon: 'line-icon-Idea-5', label: 'Research', num: '08', hasSep: true },
              ].map((step, i) => (
                <div className={`col text-center process-step-style-02 hover-box last-paragraph-no-margin ${i < 4 ? 'md-mb-50px' : i === 5 ? 'xs-mb-50px' : ''}`} key={i}>
                  <i className={`${step.icon} text-base-color icon-double-large mb-20px`}></i>
                  <span className="d-block alt-font text-dark-gray mb-5px fs-20 fw-600">{step.label}</span>
                  <p className="d-inline-block w-75 lg-w-85">Lorem ipsum is simply text the printing.</p>
                  <div className="process-step-icon-box position-relative mt-30px">
                    {step.hasSep && <span className="progress-step-separator bg-dark-gray opacity-1 w-55 separator-line-1px"></span>}
                    <div className="process-step-icon d-flex justify-content-center align-items-center mx-auto bg-white h-80px w-80px fs-18 rounded-circle text-dark-gray box-shadow-double-large alt-font fw-500">
                      <span className="number position-relative z-index-1 fw-600">{step.num}</span>
                      <div className="box-overlay bg-white rounded-circle"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stack Cards #1 */}
        <section>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="stack-card cards" data-scale="true" data-top-space="35">
                  <div className="stack-item mb-50px" data-index="0">
                    <img src="/images/demo-modern-business-object-blur-01.jpg" className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
                    <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
                      <img src="/images/demo-modern-business-bg-01.png" alt="" className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom="transform:rotate(-20deg); filter: blur(100px)" />
                      <div className="row z-index-9 position-relative align-items-center">
                        <div className="col-xl-8 col-lg-6 md-mb-30px">
                          <img src="https://images.unsplash.com/photo-1511300636408-a63a89df3482?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFuZHNjYXBlJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww" className="w-100 h-100" style={{ aspectRatio: '674/452', objectFit: 'cover' }} />
                        </div>
                        <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
                          <div className="icon-with-text-style-08 mb-20px">
                            <div className="feature-box feature-box-left-icon-middle">
                              <div className="feature-box-icon feature-box-icon-rounded w-50px h-50px bg-base-transparent-light border-radius-100px me-10px">
                                <i className="bi bi-megaphone fs-22 text-base-color"></i>
                              </div>
                              <div className="feature-box-content">
                                <span className="d-inline-block fs-16 fw-500 text-dark-gray">Outstanding speed</span>
                              </div>
                            </div>
                          </div>
                          <h2 className="alt-font text-dark-gray fw-700 mb-20px">Excellence framework.</h2>
                          <p className="text-medium-gray">Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.</p>
                          <a href="/" className="btn btn-large btn-dark-gray btn-switch-text btn-box-shadow btn-rounded text-transform-none left-icon">
                            <span>
                              <span><i className="feather icon-feather-edit"></i></span>
                              <span className="btn-double-text" data-text="Start exploring">Start exploring</span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stack-item mb-50px" data-index="1">
                    <img src="/images/demo-modern-business-object-blur-01.jpg" className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
                    <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
                      <img src="/images/demo-modern-business-bg-01.png" alt="" className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom="transform:rotate(-60deg); filter: blur(75px)" />
                      <div className="row z-index-9 position-relative align-items-center">
                        <div className="col-xl-8 col-lg-6 md-mb-30px">
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCe1g9uvU42rE9SIONJj-nL4Miz--Z6cMrBGpKVaPIwA&s" className="w-100 h-100" style={{ aspectRatio: '674/452', objectFit: 'cover' }} />
                        </div>
                        <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
                          <div className="icon-with-text-style-08 mb-20px">
                            <div className="feature-box feature-box-left-icon-middle">
                              <div className="feature-box-icon feature-box-icon-rounded w-50px h-50px bg-base-transparent-light border-radius-100px me-10px">
                                <i className="bi bi-speedometer2 fs-22 text-base-color"></i>
                              </div>
                              <div className="feature-box-content">
                                <span className="d-inline-block fs-16 fw-500 text-dark-gray">Performance playbook</span>
                              </div>
                            </div>
                          </div>
                          <h2 className="alt-font text-dark-gray fw-700 mb-20px">Strategic performance.</h2>
                          <p className="text-medium-gray">Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.</p>
                          <a href="/" className="btn btn-large btn-dark-gray btn-switch-text btn-box-shadow btn-rounded text-transform-none left-icon">
                            <span>
                              <span><i className="feather icon-feather-edit"></i></span>
                              <span className="btn-double-text" data-text="Start exploring">Start exploring</span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stack-item" data-index="2">
                    <img src="/images/demo-modern-business-object-blur-01.jpg" className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
                    <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
                      <img src="/images/demo-modern-business-bg-01.png" alt="" className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom="transform:rotate(-10deg); filter: blur(20px)" />
                      <div className="row z-index-9 position-relative align-items-center">
                        <div className="col-xl-8 col-lg-6 md-mb-30px">
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt6J7tIA6qmhGEKqFB_d1S9p5NwlUbMCrmemuma1HnpsIdRev9wSxqW30&s=10" className="w-100 h-100" style={{ aspectRatio: '674/452', objectFit: 'cover' }} />
                        </div>
                        <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
                          <div className="icon-with-text-style-08 mb-20px">
                            <div className="feature-box feature-box-left-icon-middle">
                              <div className="feature-box-icon feature-box-icon-rounded w-50px h-50px bg-base-transparent-light border-radius-100px me-10px">
                                <i className="bi bi-vector-pen fs-22 text-base-color"></i>
                              </div>
                              <div className="feature-box-content">
                                <span className="d-inline-block fs-16 fw-500 text-dark-gray">Performance power</span>
                              </div>
                            </div>
                          </div>
                          <h2 className="alt-font text-dark-gray fw-700 mb-20px">Outcome accelerator.</h2>
                          <p className="text-medium-gray">Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.</p>
                          <a href="/" className="btn btn-large btn-dark-gray btn-switch-text btn-box-shadow btn-rounded text-transform-none left-icon">
                            <span>
                              <span><i className="feather icon-feather-edit"></i></span>
                              <span className="btn-double-text" data-text="Start exploring">Start exploring</span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stack Cards #2 */}
                <div className="stack-card cards" data-scale="true" data-top-space="35">
                  <div className="stack-item mb-50px" data-index="0">
                    <img src="/images/demo-modern-business-object-blur-01.jpg" className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
                    <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
                      <img src="/images/demo-modern-business-bg-01.png" alt="" className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom="transform:rotate(-20deg); filter: blur(100px)" />
                      <div className="row z-index-9 position-relative align-items-center">
                        <div className="col-xl-8 col-lg-6 md-mb-30px">
                          <img src="https://images.unsplash.com/photo-1511300636408-a63a89df3482?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFuZHNjYXBlJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww" className="w-100 h-100" style={{ aspectRatio: '674/452', objectFit: 'cover' }} />
                        </div>
                        <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
                          <div className="icon-with-text-style-08 mb-20px">
                            <div className="feature-box feature-box-left-icon-middle">
                              <div className="feature-box-icon feature-box-icon-rounded w-50px h-50px bg-base-transparent-light border-radius-100px me-10px">
                                <i className="bi bi-megaphone fs-22 text-base-color"></i>
                              </div>
                              <div className="feature-box-content">
                                <span className="d-inline-block fs-16 fw-500 text-dark-gray">Outstanding speed</span>
                              </div>
                            </div>
                          </div>
                          <h2 className="alt-font text-dark-gray fw-700 mb-20px">Excellence framework.</h2>
                          <p className="text-medium-gray">Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.</p>
                          <a href="/" className="btn btn-large btn-dark-gray btn-switch-text btn-box-shadow btn-rounded text-transform-none left-icon">
                            <span>
                              <span><i className="feather icon-feather-edit"></i></span>
                              <span className="btn-double-text" data-text="Start exploring">Start exploring</span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stack-item mb-50px" data-index="1">
                    <img src="/images/demo-modern-business-object-blur-01.jpg" className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
                    <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
                      <img src="/images/demo-modern-business-bg-01.png" alt="" className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom="transform:rotate(-60deg); filter: blur(75px)" />
                      <div className="row z-index-9 position-relative align-items-center">
                        <div className="col-xl-8 col-lg-6 md-mb-30px">
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCe1g9uvU42rE9SIONJj-nL4Miz--Z6cMrBGpKVaPIwA&s" className="w-100 h-100" style={{ aspectRatio: '674/452', objectFit: 'cover' }} />
                        </div>
                        <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
                          <div className="icon-with-text-style-08 mb-20px">
                            <div className="feature-box feature-box-left-icon-middle">
                              <div className="feature-box-icon feature-box-icon-rounded w-50px h-50px bg-base-transparent-light border-radius-100px me-10px">
                                <i className="bi bi-speedometer2 fs-22 text-base-color"></i>
                              </div>
                              <div className="feature-box-content">
                                <span className="d-inline-block fs-16 fw-500 text-dark-gray">Performance playbook</span>
                              </div>
                            </div>
                          </div>
                          <h2 className="alt-font text-dark-gray fw-700 mb-20px">Strategic performance.</h2>
                          <p className="text-medium-gray">Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.</p>
                          <a href="/" className="btn btn-large btn-dark-gray btn-switch-text btn-box-shadow btn-rounded text-transform-none left-icon">
                            <span>
                              <span><i className="feather icon-feather-edit"></i></span>
                              <span className="btn-double-text" data-text="Start exploring">Start exploring</span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stack-item" data-index="2">
                    <img src="/images/demo-modern-business-object-blur-01.jpg" className="position-absolute left-minus-100px bottom-minus-80px sm-bottom-minus-30px" alt="" />
                    <div className="stack-card-item p-70px xl-p-50px sm-p-30px cover-background" style={{ backgroundImage: "url('/images/demo-modern-business-gradient-bg-01.jpg')" }}>
                      <img src="/images/demo-modern-business-bg-01.png" alt="" className="position-absolute z-index-1 left-0px top-0px h-100 d-none d-lg-block" data-bottom-top="transform:rotate(0deg); filter: blur(0px)" data-top-bottom="transform:rotate(-10deg); filter: blur(20px)" />
                      <div className="row z-index-9 position-relative align-items-center">
                        <div className="col-xl-8 col-lg-6 md-mb-30px">
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt6J7tIA6qmhGEKqFB_d1S9p5NwlUbMCrmemuma1HnpsIdRev9wSxqW30&s=10" className="w-100 h-100" style={{ aspectRatio: '674/452', objectFit: 'cover' }} />
                        </div>
                        <div className="col-xl-4 col-lg-6 pt-6 pb-6 xl-py-0">
                          <div className="icon-with-text-style-08 mb-20px">
                            <div className="feature-box feature-box-left-icon-middle">
                              <div className="feature-box-icon feature-box-icon-rounded w-50px h-50px bg-base-transparent-light border-radius-100px me-10px">
                                <i className="bi bi-vector-pen fs-22 text-base-color"></i>
                              </div>
                              <div className="feature-box-content">
                                <span className="d-inline-block fs-16 fw-500 text-dark-gray">Performance power</span>
                              </div>
                            </div>
                          </div>
                          <h2 className="alt-font text-dark-gray fw-700 mb-20px">Outcome accelerator.</h2>
                          <p className="text-medium-gray">Our excellence framework is a strategic approach that ensures quality and continuous improvement across all operations.</p>
                          <a href="/" className="btn btn-large btn-dark-gray btn-switch-text btn-box-shadow btn-rounded text-transform-none left-icon">
                            <span>
                              <span><i className="feather icon-feather-edit"></i></span>
                              <span className="btn-double-text" data-text="Start exploring">Start exploring</span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

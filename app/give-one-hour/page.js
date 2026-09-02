import PageHero from '@/components/PageHero'
import ContentSection from '@/components/ContentSection'
import { getInnerPageHero, getContentSection, getPageSeo } from '@/lib/cms/public-data'

export async function generateMetadata() {
  return getPageSeo('give-one-hour', {
    title: 'Give One Hour - CHC',
    description: 'Share your expertise, shape a career.',
  })
}

export default async function GiveOneHourPage() {
  const [hero, cs] = await Promise.all([
    getInnerPageHero('give-one-hour', {
      heading: 'Give One Hour',
      subtitle: 'CHC provides senior-led Oracle HCM delivery supported by trained functional and technical consultants.',
    }),
    getContentSection('give-one-hour'),
  ])

  return (
    <>
      <PageHero {...hero} />

      <ContentSection {...cs} />

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
              <form action="/api/public/give-one-hour" method="post" className="row contact-form-style-02">
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
                  <select className="box-shadow-quadruple-large form-control required form-select" name="format" defaultValue="">
                    <option value="" disabled>Online / In person*</option>
                    <option value="online">Online</option>
                    <option value="in_person">In Person</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="col-md-12 mb-30px">
                  <textarea className="box-shadow-quadruple-large form-control" cols="40" rows="4" name="anything_else" placeholder="Anything you'd like us to know?"></textarea>
                </div>
                <div className="col-md-12 mt-10px mb-10px">
                  <p className="text-center text-md-start fs-16">By submitting this form you agree to be contacted by CHC regarding volunteering opportunities.</p>
                </div>
                <div className="col-md-12 text-center">
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

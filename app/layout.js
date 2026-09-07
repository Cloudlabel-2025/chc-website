import Script from 'next/script'
import { headers } from 'next/headers'
import './globals.css'
import 'swiper/css/bundle'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RouteReload from '@/components/RouteReload'
import CarouselInitializer from '@/components/CarouselInitializer'
import { getNavData, getWhatWeDoNav, getFooterData } from '@/lib/cms/public-data'

export const metadata = {
  title: 'CHC - Technology Delivery with a Social Conscience',
  description: 'CHC provides cost-effective Oracle HCM, application development and technology delivery services through senior-led teams.',
}

export default async function RootLayout({ children }) {
  const isAdmin = (await headers()).get('x-admin-route') === '1'
  const [navItems, whatWeDoItems, footer] = isAdmin
    ? [[], [], null]
    : await Promise.all([getNavData(), getWhatWeDoNav(), getFooterData()])

  return (
    <html lang="en" className="no-js">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/chc-logo.png" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/images/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/images/apple-touch-icon-114x114.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/css/vendors.min.css" />
        <link rel="stylesheet" href="/css/icon.min.css" />
        <link rel="stylesheet" href="/css/style.min.css" />
        <link rel="stylesheet" href="/css/responsive.min.css" />
        <link rel="stylesheet" href="/demos/modern-business/modern-business.css" />
        <link rel="stylesheet" href="/page-styles.css" />
      </head>
      <body data-mobile-nav-style="classic" className="background-position-center-top">
        {!isAdmin && <RouteReload />}
        {!isAdmin && <CarouselInitializer />}
        {!isAdmin && <a className="chc-skip-link" href="#main-content">Skip to main content</a>}
        {!isAdmin && <div className="box-layout"><Header navItems={navItems} whatWeDoItems={whatWeDoItems} /></div>}
        {!isAdmin && <div id="chc-header-scroll-sentinel" aria-hidden="true" />}
        <main id="main-content" className="chc-page-content">
          {children}
        </main>
        {!isAdmin && <Footer footer={footer} />}
        {!isAdmin && <div className="crafto-progressive-blur crafto-progressive-blur-bottom" blur-bottom="yes" style={{ '--progressive-blur-height': '15vh' }}></div>}
        {!isAdmin && <Script src="/js/jquery.js" strategy="beforeInteractive" />}
        {!isAdmin && <Script src="/js/vendors.min.js" strategy="beforeInteractive" />}
        {!isAdmin && <Script id="disable-retina" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `try{if(window.Retina){Retina.isRetina=function(){return false;};} if(window.Retina&&window.RetinaImage&&RetinaImage.prototype){RetinaImage.prototype.check_2x_variant=function(cb){cb(false);};} }catch(e){}` }} />}
        {!isAdmin && <Script src="/js/chc-animations.js" strategy="afterInteractive" />}
        {!isAdmin && <Script src="/js/chc-header-state.js" strategy="beforeInteractive" />}
      </body>
    </html>
  )
}

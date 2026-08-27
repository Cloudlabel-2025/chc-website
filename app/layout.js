import Script from 'next/script'
import './globals.css'
import './page-styles.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'CHC - Technology Delivery with a Social Conscience',
  description: 'CHC provides cost-effective Oracle HCM, application development and technology delivery services through senior-led teams.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="no-js">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/favicon.png" />
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
      </head>
      <body data-mobile-nav-style="classic" className="background-position-center-top">
        <div className="box-layout">
          <Header />
        </div>
        {children}
        <Footer />
        <div className="crafto-progressive-blur crafto-progressive-blur-bottom" blur-bottom="yes" style={{ '--progressive-blur-height': '15vh' }}></div>
        <Script src="/js/jquery.js" strategy="beforeInteractive" />
        <Script src="/js/vendors.min.js" strategy="beforeInteractive" />
        <Script src="/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}

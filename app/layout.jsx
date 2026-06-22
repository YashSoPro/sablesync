import './globals.css'

export const metadata = {
  title: 'SableSync',
  description: 'The platform that actually listens.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'SableSync',
    description: 'The platform that actually listens.',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e0e12',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-sable-bg text-sable-text antialiased">
        <div id="app-root">
          {children}
        </div>
        <div id="modal-root" />
        <div id="tooltip-root" />
      </body>
    </html>
  )
}

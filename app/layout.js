import './globals.css'

export const metadata = {
  title: 'Resume DApp - On-Chain Professional Profile',
  description: 'Store your professional resume on the blockchain',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}

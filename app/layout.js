import './globals.css'
import { Web3ModalProvider } from './context/Web3Modal'

export const metadata = {
  title: 'Resume DApp - On-Chain Professional Profile',
  description: 'Store your professional resume on the blockchain',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        <Web3ModalProvider>
          {children}
        </Web3ModalProvider>
      </body>
    </html>
  )
}

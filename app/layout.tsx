import './globals.css'
import { Web3ModalProvider } from './context/Web3Modal'
import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'Resume DApp - On-Chain Professional Profile',
    description: 'Store your professional resume on the blockchain',
}

interface RootLayoutProps {
    children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
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

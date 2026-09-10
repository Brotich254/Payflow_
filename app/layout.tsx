import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PayFlow - Invoice & Payment Platform',
  description: 'Premium invoice management and payment processing platform',
  keywords: ['invoicing', 'payments', 'billing', 'fintech'],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'SwiftConnect',
  description: 'SwiftConnect user dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

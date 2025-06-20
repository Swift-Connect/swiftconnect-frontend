import { Poppins } from 'next/font/google'
import '../globals.css'
import Footer from './components/Footer'
import Image from 'next/image'

const poppins = Poppins({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
  adjustFontFallback: true
})

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout ({ children }) {
  return (
    <div className={`${poppins.className} antialiased`}>
      {/* Logo */}
      <div className='w-full items-center justify-center p-4 flex m-auto'>
        <Image
          src='/logo.svg'
          alt='Swift Connect'
          width={280}
          height={100}
          className=''
        />
      </div>
      <div className=''>{children}</div>
    </div>
  )
}

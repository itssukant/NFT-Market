import '../styles/globals.css'
import './main.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return(
    <div className="navbody">
    <nav className="navmain">
      <div className="navbodyflex">
      
      <div className="navtitle">
    
         <p className="navmaintext">Expecies NFT Market</p>
    
        </div>
        
        <div className="navop">
        
          <Link href="/">
            <a className="navoption">
              Home
            </a>
          </Link>
          <div className="navoption">
          <a href="http://localhost:1776/">Sell Digital Asset</a>
        </div>
          <Link href="/my-assets">
            <a className="navoption">
              My Digital Assets
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="navoption">
              Creator Dashboard
            </a>
          </Link>
        </div>
        </div>
      </nav>
    
    <Component {...pageProps} />
  </div>
  ) 
}

export default MyApp

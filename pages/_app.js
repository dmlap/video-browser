import { useState } from 'react'
import { RouterContext } from '../components/vlink'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

  return (<RouterContext path="home">
            <Component {...pageProps} />
          </RouterContext>)
}

export default MyApp

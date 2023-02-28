import { useState } from 'react';

import { RouterContext } from '../components/vlink';
import { DNav } from '../components/dnav';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <RouterContext path="home">
      <DNav>
        <Component {...pageProps} />
      </DNav>
    </RouterContext>
  );
}

export default MyApp;

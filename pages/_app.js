import Layout from '../components/layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => {
    return (<Layout>{page}</Layout>)
  })

  return getLayout(<Component {...pageProps} />)
}

export default MyApp

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import "antd/dist/antd.css";
import { Provider } from 'react-redux'
import { store } from '../reducer/store'

function MyApp({ Component, pageProps }: AppProps) {
  return <Provider store={store}><Component {...pageProps} /></Provider>
}

export default MyApp
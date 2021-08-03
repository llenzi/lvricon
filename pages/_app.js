import 'tailwindcss/tailwind.css'
import '../styles.css'
import { useEffect } from 'react';
import { auth, database } from '../utils/firebase';

function MyApp({ Component, pageProps }) {

  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'production') {
  //     auth();
  //     database();
  //   }
  // }, [])

  return <Component {...pageProps} />
}

export default MyApp

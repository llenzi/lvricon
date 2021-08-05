import Head from 'next/head'
import firebase from "firebase/app";
import config from "../../config";
import "firebase/auth";
import {
    FirebaseAuthProvider,
} from "@react-firebase/auth";
import "firebase/database";
import Footer from '@/components/footer';
import Header from '@/components/header';
import ListLottie from '@/components/list/lottie';

const Lottie = () => {


  return (
    <FirebaseAuthProvider firebase={firebase} {...config}>
      <>
        <Head>
          <title>LVR Icon Viewer - Lottie</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div className="mx-auto">
          <Header />
          <ListLottie canAdd={true} />
          <Footer />
        </div>
      </>
    </FirebaseAuthProvider>
  );
}

export default Lottie;
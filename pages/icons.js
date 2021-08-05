import Head from 'next/head'
import firebase from "firebase/app";
import config from "../config";
import "firebase/auth";
import "firebase/database";
import {
  FirebaseAuthProvider,
  IfFirebaseAuthedAnd
} from "@react-firebase/auth";
import Footer from '@/components/footer';
import Header from '@/components/header';
import ListIcons from '@/components/list/icons';

const Home = () => {


  return (
    <FirebaseAuthProvider firebase={firebase} {...config}>
      <>
        <Head>
          <title>LVR Icon Viewer</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div className="mx-auto">
          <Header />
          <ListIcons canAdd={false} />
          <Footer />

        </div>
      </>
    </FirebaseAuthProvider>
  );
}

export default Home;
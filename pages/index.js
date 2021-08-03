import Head from 'next/head'
import { useState } from 'react';
import firebase from "firebase/app";
import config from "../config";
import "firebase/auth";
import "firebase/database";
import {
  FirebaseAuthProvider,
} from "@react-firebase/auth";
import {
  FirebaseDatabaseProvider,
  FirebaseDatabaseNode
} from "@react-firebase/database";
import Footer from '../components/footer';
import Header from '../components/header';
import Icon from '../components/icon';
import PopUp from '../components/popup';
import Add from '../components/add';

const Home = () => {

  const [showPopUp, setShowPopUp] = useState(false);
  const [selectIcon, setSelectIcon] = useState(null);

  const onClickIcon = ({ name, value }) => {
    setShowPopUp(true);
    setSelectIcon({ name, value })
  };

  return (
    <FirebaseAuthProvider firebase={firebase} {...config}>
      <>
        <Head>
          <title>LVR Icon Viewer</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        {showPopUp && <PopUp>
          <div className="overlay h-full w-full bg-black opacity-50 absolute inset-0 z-20"></div>
          <div className="absolute rounded inset-0 flex flex-col align-middle justify-center content-center h-full z-30">
            <Icon
              onClose={() => { setShowPopUp(false); }}
              layout='full'
              name={selectIcon.name}
              value={selectIcon.value}
            />
          </div>
        </PopUp>}
        <div className="mx-auto">
          <Header />
          <section className="flex flex-row">
            <FirebaseDatabaseProvider firebase={firebase} {...config}>
              <FirebaseDatabaseNode
                path="icons/"
                orderByKey
              // orderByValue={"created_on"}
              >
                {({ value }) => {
                  if (value === null || typeof value === "undefined") return null;
                  const keys = Object.keys(value);
                  const values = Object.values(value);
                  console.log({ keys, values });
                  // return <div />
                  return values.map((val, i) => {
                    const { name, code } = val || {}
                    if (!!name) {
                      return <Icon
                        key={name}
                        name={name}
                        value={code}
                        onButtonClick={onClickIcon}
                      />
                    }
                  });
                }}
              </FirebaseDatabaseNode>
              <Add />
            </FirebaseDatabaseProvider>

          </section>
          <Footer />

        </div>
      </>
    </FirebaseAuthProvider>
  );
}

export default Home;
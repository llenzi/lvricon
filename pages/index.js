import Head from 'next/head'
import dynamic from 'next/dynamic'
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

const DynamicComponentWithNoSSR = dynamic(
  () => {
    import('../firebase/auth');
    import('../firebase/database');
  },
  { ssr: false }
)

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
        <Head />
        <DynamicComponentWithNoSSR />
        {showPopUp && <PopUp>
          <div className="absolute rounded inset-0 flex flex-col align-middle justify-center content-center h-full">
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
                limitToFirst={3}
              // orderByValue={"created_on"}
              >
                {({ value }) => {
                  if (value === null || typeof value === "undefined") return null;
                  const keys = Object.keys(value);
                  const values = Object.values(value);
                  return values.map((val, i) => (
                    <Icon
                      key={keys[i]}
                      name={keys[i]}
                      value={val}
                      onButtonClick={onClickIcon}
                    />
                  ));
                }}
              </FirebaseDatabaseNode>
            </FirebaseDatabaseProvider>
          </section>
          <Footer />

        </div>
      </>
    </FirebaseAuthProvider>
  );
}

export default Home;
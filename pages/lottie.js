import Head from 'next/head'
import { useState } from 'react';
import firebase from "firebase/app";
import config from "../config";
import "firebase/auth";
import {
    FirebaseAuthProvider,
} from "@react-firebase/auth";
import "firebase/database";
import {
    FirebaseDatabaseProvider,
    FirebaseDatabaseNode
} from "@react-firebase/database";
import Footer from '../components/footer';
import Header from '../components/header';
import LottiePlayer from '../components/lottie';
import PopUp from '../components/popup';

const Lottie = () => {
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
                {showPopUp && <PopUp>
                    <div className="absolute rounded inset-0 flex flex-col align-middle justify-center content-center h-full">
                        <LottiePlayer
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
                                path="lottie/"
                                orderByKey
                                limitToFirst={3}
                            // orderByValue={"created_on"}
                            >
                                {({ value }) => {
                                    if (value === null || typeof value === "undefined") return null;
                                    const keys = Object.keys(value);
                                    // const values = Object.values(value);
                                    // console.log(JSON.stringify({ value }, null, 2));
                                    return keys.map((key, i) => (
                                        <LottiePlayer
                                            key={key}
                                            name={key}
                                            value={value[key]}
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

export default Lottie;
import { useState } from "react";
import Head from 'next/head'
import firebase from "firebase/app";
import config from "../../config";
import "firebase/auth";
import "firebase/database";
import {
    FirebaseAuthProvider,
    IfFirebaseAuthedAnd
} from "@react-firebase/auth";
import Footer from '@/components/footer';
import Header from '@/components/header';
import ListIcons from '@/components/list/icons';
import EditSwitch from '@/components/edit/editSwitch';

const WebIcons = () => {

    const [canAdd, setCanAdd] = useState(false);

    return (
        <FirebaseAuthProvider firebase={firebase} {...config}>
            <>
                <Head>
                    <title>LVR Icon Viewer</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <div className="mx-auto">
                    <Header />
                    <div className='m-4'>
                        <EditSwitch label="Edit" onChange={() => { setCanAdd(!canAdd) }} />
                    </div>
                    <ListIcons path='web/icons/' canAdd={canAdd} />
                    <Footer />

                </div>
            </>
        </FirebaseAuthProvider>
    );
}

export default WebIcons;
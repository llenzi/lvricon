import firebase from "firebase/app";
import "firebase/auth";
import {
    FirebaseAuthConsumer,
} from "@react-firebase/auth";
import Menu from '../menu';
import UserMenu from "./userMenu";
import Image from 'next/image';
import lvr from '../../public/lvr.svg';
import Link from 'next/link'

const Header = props => {
    return <header className="bg-gray-50 flex flex-row justify-between items-center space-x-4 py-6 px-6 border-b-2">
        <Link href="/">
            <a className="block">
                <span className="sr-only">LVR Icon viewer</span>
                <span className="h-8 w-8 block">
                    <Image src={lvr} alt="LVR Icon viewer" />
                </span>
            </a>
        </Link>
        <div className="menucontainer">
            <Menu />
        </div>
        <div className="signin flex content-center">
            <FirebaseAuthConsumer>
                {({ isSignedIn, user, providerId }) => {
                    console.log({ user });
                    return (
                        <>
                            <UserMenu
                                isSignedIn={isSignedIn}
                                onSignIn={() => {
                                    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                                    firebase.auth().signInWithPopup(googleAuthProvider);
                                }}
                                onSignOut={() => {
                                    firebase.auth().signOut();
                                }}
                                user={!!user ? user : {}}
                            />
                        </>
                    );
                }}
            </FirebaseAuthConsumer>
        </div>
    </header>
}

export default Header
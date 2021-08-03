import "firebase/auth";
import {
  FirebaseAuthConsumer,
} from "@react-firebase/auth";
import Menu from '../menu';

const Header = props => {
    return <header className="bg-blue-200 p-4 flex flex-row justify-between content-center h-20">
        <div className="logo flex content-center">
            <span>LVR Icon viewer</span>
        </div>
        <div className="menucontainer">
            <Menu />
        </div>
        <div className="signin flex content-center">
            <FirebaseAuthConsumer>
                {({ isSignedIn, user, providerId }) => {
                    return (
                        <>
                            {!isSignedIn && <div className="btn-container">
                                <button
                                    onClick={() => {
                                        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                                        firebase.auth().signInWithPopup(googleAuthProvider);
                                    }}
                                >
                                    Sign In with Google
                                </button>
                            </div>}
                            {isSignedIn && <div>
                                <div>
                                    Ciao {user.displayName}
                                </div>
                                <div className="btn-container">
                                    <button
                                        onClick={() => {
                                            firebase.auth().signOut();
                                        }}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>}
                        </>
                    );
                }}
            </FirebaseAuthConsumer>
        </div>
    </header>
}

export default Header
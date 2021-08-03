import firebase from "firebase/app";
import 'firebase/analytics';
import firebaseConfig from "../config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth;
const database = firebase.database;

export { firebase, auth, database };
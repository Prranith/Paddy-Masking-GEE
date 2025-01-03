import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "your_api key",
  authDomain: "---",
  projectId: "----",
  storageBucket: "---",
  messagingSenderId: "62665875649",
  appId: "---",
  measurementId: "---",
};

// Initialize Firebase if it hasn't been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { auth, firebase, firestore };

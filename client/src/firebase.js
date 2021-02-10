import firebase from 'firebase';

const config={
    apiKey: process.env.REACT_APP_FIREBASE_API,
    authDomain: "plan2train-11243.firebaseapp.com",
    projectId: "plan2train-11243",
    storageBucket: "plan2train-11243.appspot.com",
    messagingSenderId: "173877303497",
    appId: "1:173877303497:web:4600a820f197b781b41518",
    measurementId: "G-LMGWXZLQS0"
}

firebase.initializeApp(config)
firebase.analytics();
export default firebase
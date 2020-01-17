import firebase from 'firebase'


var firebaseConfig = {
    apiKey: "AIzaSyDYfioyfnXejAddpWMU5hxttJVqZXJM0xY",
    authDomain: "vodenje-zooloski.firebaseapp.com",
    databaseURL: "https://vodenje-zooloski.firebaseio.com",
    projectId: "vodenje-zooloski",
    storageBucket: "vodenje-zooloski.appspot.com",
    messagingSenderId: "250913986552",
    appId: "1:250913986552:web:6c8e991dcb08d5dfa7280d"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);


  export default firebaseApp.firestore()



import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB-WUabbRYlQeVAiS27WVAVOm7WdgNOgQ4",
    authDomain: "bus-ticket-system-86868.firebaseapp.com",
    projectId: "bus-ticket-system-86868",
    storageBucket: "bus-ticket-system-86868.appspot.com",
    messagingSenderId: "144139539276",
    appId: "1:144139539276:web:4f997d3ab381b6c33635e9"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export default firebase;

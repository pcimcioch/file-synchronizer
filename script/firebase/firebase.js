import {firestorePlugin} from '../thirdparty/vuefire.esm.js';

Vue.use(firestorePlugin);

// !TODO api key from indexDb
const firebaseConfig = {
  apiKey: "AIzaSyBMaZ1t_aK6rVLz0OfvNrG__aq5j7i0Eec",
  authDomain: "web-synchronizer.firebaseapp.com",
  databaseURL: "https://web-synchronizer.firebaseio.com",
  projectId: "web-synchronizer",
  storageBucket: "web-synchronizer.appspot.com",
  messagingSenderId: "115749313047",
  appId: "1:115749313047:web:c636181bd90f5df5fbda52",
  measurementId: "G-TEGVWGXWWE"
};

export const db = firebase.initializeApp(firebaseConfig).firestore();
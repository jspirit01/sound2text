import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAKc_f7W5scM4vZVFtlVgMPLjlkREILY2k",
    authDomain: "sound2text-2bc70.firebaseapp.com",
    projectId: "sound2text-2bc70",
    storageBucket: "sound2text-2bc70.appspot.com",
    messagingSenderId: "581048224666",
    appId: "1:581048224666:web:8dc25b1c2bc8afa5f8c823",
};

// init firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

const cors = require('cors')({
    origin: ['http://localhost:8080'],
    credentials: true
  });
  

export {db, auth, storage, cors};

// export 

// export default storage


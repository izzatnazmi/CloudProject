
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration provided by the user for CourtSync
const firebaseConfig = {
  apiKey: "AIzaSyDXaedu_1VdQe-yCslJiB18bdiR8jet9yc",              //nanti buat backend ubah la 
  authDomain: "courtsynccc.firebaseapp.com",                      //nanti buat backend ubah la 
  projectId: "courtsynccc",                                        //nanti buat backend ubah la 
  storageBucket: "courtsynccc.firebasestorage.app",             //nanti buat backend ubah la 
  messagingSenderId: "638527259990",                            //nanti buat backend ubah la 
  appId: "1:638527259990:web:51b47c63f9df9ab16b42f7",             //nanti buat backend ubah la 
  measurementId: "G-3CET2038DD"                                    //nanti buat backend ubah la 
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

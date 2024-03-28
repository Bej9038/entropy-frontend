import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import {Auth, getAuth, User, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@angular/fire/auth";
import {FirebaseApp} from "@angular/fire/app";


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  // firebaseConfig = {
  //   apiKey: "AIzaSyAiWFiU9YsUoHgUvjlXcxKuvFS6rH4yfp0",
  //   authDomain: "entropy-413416.firebaseapp.com",
  //   databaseURL: "https://entropy-413416-default-rtdb.firebaseio.com",
  //   projectId: "entropy-413416",
  //   storageBucket: "entropy-413416.appspot.com",
  //   messagingSenderId: "258339538727",
  //   appId: "1:258339538727:web:af059ca999220afb340b02",
  //   measurementId: "G-F3H0KERXES"
  // };

  db = getFirestore(this.app);
  auth = getAuth(this.app)

  constructor(private app: FirebaseApp) {
  }

  createUser()
  {
    createUserWithEmailAndPassword(this.auth, "bej9@cornell.edu", "Highlandj710!")
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });
  }

  signInUser() {
    signInWithEmailAndPassword(this.auth, "bej9@cornell.edu", "Highlandj710!")
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });
  }

  async storePreferenceData() {
    console.log("writing preference data")
    try {
      const docRef = await addDoc(collection(this.db, "preference_data"), {
        prompt: "x",
        audio0: "x",
        audio1: "x",
        reward: 1.0
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}

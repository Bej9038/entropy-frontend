import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, Auth } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any | undefined = undefined;

  constructor(private auth: AngularFireAuth){
    this.auth.authState.subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }

  async register(email: string, password: string) {
    return await this.auth.createUserWithEmailAndPassword(email, password);
  }

  async login(email: string, password: string) {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  async signOut() {
    return await this.auth.signOut();
  }

  // get user() {
  //   return this.auth.authState;
  // }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return this.auth.signInWithPopup(provider);
    // return this.auth.signInWithRedirect(provider);
  }
}

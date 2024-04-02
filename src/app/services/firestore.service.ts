import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  currentUser: any | undefined = undefined;

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }

  storePrompt(req: any)
  {
    const data = {
      "prompt": req.input.text,
      "duration": req.input.duration,
      "entropy": req.input.entropy,
      "user": this.currentUser.email
    }
    this.firestore.collection("prompts").add(data)
  }
}

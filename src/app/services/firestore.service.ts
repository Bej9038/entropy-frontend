import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import { finalize, Observable } from 'rxjs';
import {StateService} from "./state.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  currentUser: any | undefined = undefined;
  userCredits: number = 0;
  dir: string = "preference_data/"
  functionsEndpoint = "https://us-central1-entropy-413416.cloudfunctions.net/helloWorld"

  constructor(private firestore: AngularFirestore,
              private auth: AngularFireAuth,
              private storage: AngularFireStorage,
              private stateService: StateService,
              private http: HttpClient) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
        // console.log("hi")
        // this.http.get(this.functionsEndpoint, { responseType: 'text' })
        //   .toPromise().then(response => console.log(response))
        // this.initCredits()
      } else {
        this.currentUser = null;
      }
    });
  }

  async initCredits() {
    const docRef = this.firestore.collection("credits").doc(this.currentUser.uid)
    docRef.get().subscribe(doc => {
      if (!doc.exists) {
        const data = {
          "num_credits": 25,
          "email": this.currentUser.email
        }
        this.firestore.collection("credits").doc(this.currentUser.uid).set(data)
      }
    })
    docRef.valueChanges().subscribe(doc => {
      // @ts-ignore
      this.userCredits = doc["num_credits"]
    })
  }

  consumeCredits(credits: number) {
    const data = {
      "num_credits": this.userCredits - credits
    }
    this.firestore.collection("credits").doc(this.currentUser.uid).update(data)
  }

  getCredits() {
    return this.userCredits
  }

  storePreferenceAudio(audio: Blob, prompt: string){
    const time = new Date().getTime()
    const filename = time + "_" + prompt
    const fp = this.dir + filename
    this.storage.upload(fp, audio);
    this.stateService.print("upload started")
    return filename
  }

  storePreferenceData(filenames: string[], selected: number) {
    let len = filenames.length
    const data = {
      "af1": filenames[0],
      "af2": filenames[1],
      "af3": len >= 3 ? filenames[2] : "",
      "af4": len >= 4 ? filenames[3] : "",
      "selected_index": selected
    }
    this.firestore.collection("preference_scores").add(data)
  }

  storePrompt(req: any) {
    const data = {
      "prompt": req.input.text,
      "duration": req.input.duration,
      "entropy": req.input.entropy,
      "user": this.currentUser.email
    }
    this.firestore.collection("prompts").add(data)
  }

  accessGopher(gopher: any) {
    this.firestore.collection("gopher")
      .doc("N23bBnhGNa2Ei0Wa1wBb")
      .get().subscribe(doc => {
        gopher.data = doc.data()
      })
  }
}

import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {StateService} from "./state.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  currentUser: any | undefined = undefined;
  userCredits: number = 0;
  pref_data_storage_dir: string = "preference_data/"

  constructor(private firestore: AngularFirestore,
              private auth: AngularFireAuth,
              private storage: AngularFireStorage,
              private stateService: StateService) {

    this.auth.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.readCredits()
      } else {
        this.currentUser = null;
      }
    });
  }

  readCredits() {
    const docRef = this.firestore.collection("credits").doc(this.currentUser.uid)
    docRef.valueChanges().subscribe(doc => {
      // @ts-ignore
      this.userCredits = doc.num_credits
    });
  }

  // async consumeCredits(credits: number) {
  //   const url = "https://us-central1-entropy-413416.cloudfunctions.net/consumeCredit"
  //   const body = { credits: credits };
  //   const id = await this.currentUser.getIdToken()
  //   const headers = {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${id}` };
  //   this.http.post(url, body, { headers: headers }).subscribe();
  // }

  getCredits() {
    return this.userCredits
  }

  storePreferenceAudio(audio: Blob, prompt: string){
    const time = new Date().getTime()
    const filename = time + "_" + prompt
    const fp = this.pref_data_storage_dir + filename
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
}

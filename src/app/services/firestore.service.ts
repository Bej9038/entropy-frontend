import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  currentUser: any | undefined = undefined;
  gopher: any | undefined = undefined;
  dir: string = "preference_data/"

  constructor(private firestore: AngularFirestore,
              private auth: AngularFireAuth,
              private storage: AngularFireStorage) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }

  storePreferenceAudio(audio: Blob, prompt: string){
    const time = new Date().getTime()
    const filename = time + "_" + prompt
    const fp = this.dir + filename
    this.storage.upload(fp, audio);
    console.log("upload started")
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

  accessGopher()
  {
    this.firestore.collection("gopher")
      .doc("N23bBnhGNa2Ei0Wa1wBb")
      .get().subscribe(doc => {
        // @ts-ignore
      this.gopher = doc.data()["value"]
      })
  }
}

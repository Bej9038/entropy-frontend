import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FirestoreService} from "../../services/firestore.service";
import {StateService} from "../../services/state.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  signedIn = false

  constructor(private auth: AngularFireAuth,
              private stateService: StateService) {
  }

  ngOnInit() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.stateService.print("User is signed in");
        this.signedIn = true
      } else {
        this.stateService.print("No user is signed in");
        this.signedIn = false
      }
    });
  }

  onSignIn() {
    this.signedIn = true;
  }

}

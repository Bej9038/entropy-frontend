import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  signedIn = false

  constructor(private auth: AngularFireAuth) {
  }

  ngOnInit() {
    this.auth.authState.subscribe(user => {
      if (user) {
        console.log("User is signed in");
        this.signedIn = true
      } else {
        console.log("No user is signed in");
        this.signedIn = false
      }
    });
  }

  onSignIn() {
    this.signedIn = true;
  }

}

import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {StateService} from "../services/state.service";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  signedIn = false;

  constructor(private auth: AngularFireAuth,
              public router: Router,
              private stateService: StateService) { }

  ngOnInit(): void {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.signedIn = true
      } else {
        this.signedIn = false
      }
    });
  }

  openMenu() {

  }

  signOut(): void {
    this.auth.signOut().then(() => {
      this.stateService.print("User signed out successfully");
    });
  }
}

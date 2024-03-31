import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  signOut(): void {
    this.auth.signOut().then(() => {
      console.log("User signed out successfully");
    });
  }
}

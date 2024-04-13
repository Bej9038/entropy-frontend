import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {StateService} from "../services/state.service";
import {ReqService} from "../services/req.service";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  signedIn = false
  menuButtons = true
  menuSettings = false

  constructor(private auth: AngularFireAuth,
              public router: Router,
              private stateService: StateService,
              public reqService: ReqService) { }

  ngOnInit(): void {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.signedIn = true
      } else {
        this.signedIn = false
      }
    });
  }

  openQuickSettings(event: any) {
    event.stopPropagation();
    this.menuSettings = true
    this.menuButtons = false
  }

  updateWaveboxes(value: number) {
    this.reqService.updateNumAudio(value)
  }

  signOut(): void {
    this.auth.signOut().then(() => {
      this.stateService.print("User signed out successfully");
    });
  }
}

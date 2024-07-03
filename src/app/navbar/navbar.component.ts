import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {StateService} from "../services/state.service";
import {ReqService} from "../services/req.service";
import {FirestoreService} from "../services/firestore.service";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  signedIn = false
  settingsMenu = true
  audioSettings = false
  creditsMenu = false

  constructor(private auth: AngularFireAuth,
              public router: Router,
              private stateService: StateService,
              public reqService: ReqService,
              public firestore: FirestoreService) { }

  ngOnInit(): void {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.signedIn = true
      } else {
        this.signedIn = false
      }
    });
  }

  openAudioSettings(event: any) {
    event.stopPropagation()
    this.audioSettings = true
    this.settingsMenu = false
  }

  openCreditsMenu(event: any) {
    event.stopPropagation()
    this.creditsMenu = true
    this.settingsMenu = false
  }

  returnToSettingsMenu(event: any) {
    event.stopPropagation();
    this.audioSettings = false
    this.creditsMenu = false
    this.settingsMenu = true
  }

  updateWaveboxes(value: number) {
    if(this.reqService.numAudio.value != value) {
      this.reqService.updateNumAudio(value)
    }
  }

  signOut(): void {
    this.auth.signOut().then(() => {
      this.stateService.print("User signed out successfully");
    });
  }
}

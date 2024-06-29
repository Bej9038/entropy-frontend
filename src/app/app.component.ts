import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'entropy-frontend';
  private intervalId: any;
  runsync: string = "https://api.runpod.ai/v2/y4bhqyz247xbh2/runsync";

  // authConfig: AuthConfig = {
  //   issuer: 'https://accounts.google.com',
  //   redirectUri: window.location.origin,
  //   clientId: '258339538727-1o90t8a1p24levr40c5u750rvlj005ot.apps.googleusercontent.com',
  //   scope: 'openid profile email',
  //   showDebugInformation: true,
  // };

  // @ts-ignore
  @ViewChild("navbar", { read: ElementRef }) navbarElement: ElementRef;
  // @ts-ignore
  @ViewChild("interface", { read: ElementRef }) interfaceElement: ElementRef;


  constructor(private http: HttpClient) {
    this.login()
  }



  login() {
  }

  ngOnInit(): void {
    // this.startPeriodicRequest()
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // startPeriodicRequest(): void {
  //   this.intervalId = setInterval(() => {
  //     this.sendAPIRequest();
  //   }, 8000); // every 10 seconds
  // }
  //
  // sendAPIRequest(): void {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${this.,f}`
  //   });
  //   const req = {
  //     "input": {
  //       "text": "",
  //       "entropy": 0,
  //       "duration": 0,
  //       "stereo": 0,
  //       "ping": 1
  //     }
  //   }
  //   this.http.post<any>(this.runsync, req, { headers })
  //     .subscribe(response =>
  //     {
  //       console.log(response)
  //     });
  // }
}

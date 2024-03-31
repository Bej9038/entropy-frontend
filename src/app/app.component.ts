import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthConfig, OAuthModule, OAuthService} from 'angular-oauth2-oidc';
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'entropy-frontend';
  private intervalId: any;
  apiKey = "JZTOUADUXNL7BBELM84Y6INBGDHANBEOR81NU5TF";
  runsync: string = "https://api.runpod.ai/v2/y4bhqyz247xbh2/runsync";

  authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    redirectUri: window.location.origin,
    clientId: '258339538727-1o90t8a1p24levr40c5u750rvlj005ot.apps.googleusercontent.com',
    scope: 'openid profile email',
    showDebugInformation: true,
  };

  // @ts-ignore
  @ViewChild("navbar", { read: ElementRef }) navbarElement: ElementRef;
  // @ts-ignore
  @ViewChild("interface", { read: ElementRef }) interfaceElement: ElementRef;


  constructor(private http: HttpClient, private oauthService: OAuthService) {
    this.oauthService.configure(this.authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin()
    this.login()

    //   .then(() => {
    //   if (this.oauthService.hasValidAccessToken()) {
    //     let claims = this.oauthService.getIdentityClaims();
    //     if (claims) {
    //       console.log(claims);
    //     }
    //   }
    //   else {
    //     this.oauthService.initImplicitFlow();
    //   }
    // });
  }



  login() {
    this.oauthService.initImplicitFlow();
  }

  ngOnInit(): void {
    // this.startPeriodicRequest()
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startPeriodicRequest(): void {
    this.intervalId = setInterval(() => {
      this.sendAPIRequest();
    }, 8000); // every 10 seconds
  }

  sendAPIRequest(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
    const req = {
      "input": {
        "text": "",
        "entropy": 0,
        "duration": 0,
        "stereo": 0,
        "ping": 1
      }
    }
    this.http.post<any>(this.runsync, req, { headers })
      .subscribe(response =>
      {
        console.log(response)
      });
  }

  // ngAfterViewInit(): void {
  //   this.checkOverlap()
  // }
  //
  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   this.checkOverlap();
  // }
  //
  // @HostListener('window:resize', ['$event'])
  // onResize() {
  //   this.checkOverlap();
  // }
  //
  // checkOverlap() {
  //   let navbar = this.navbarElement.nativeElement
  //   let inter = this.interfaceElement.nativeElement
  //
  //   if (navbar.offsetTop + navbar.offsetHeight > inter.offsetTop) {
  //     console.log("overlap")
  //     navbar.classList.add('invisible');
  //     navbar.classList.remove('opaque');
  //   }
  //   else if(navbar.offsetTop + navbar.offsetHeight < inter.offsetTop){
  //     navbar.classList.add('opaque');
  //     navbar.classList.remove('invisible');
  //   }
  // }

}

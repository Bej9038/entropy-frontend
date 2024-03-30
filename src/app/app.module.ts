import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http';
import { InterfaceComponent } from './interface/interface.component';
import { AppComponent } from './app.component';
import { MatCardModule} from '@angular/material/card';
import { MatInputModule} from "@angular/material/input";
import { MatSliderModule} from "@angular/material/slider";
import { MatButtonToggleModule} from "@angular/material/button-toggle";
import { MatButtonModule} from "@angular/material/button";
import { MatGridListModule} from "@angular/material/grid-list";
import { NavbarComponent } from './navbar/navbar.component';
import { MatToolbarModule} from "@angular/material/toolbar";
import { MatProgressBarModule} from "@angular/material/progress-bar";
import { KeySelectComponent } from './key-select/key-select.component';
import { BpmSelectComponent } from './bpm-select/bpm-select.component';
import { SliderComponent } from './slider/slider.component';
import { MatRippleModule} from "@angular/material/core";
import { MatIconModule} from "@angular/material/icon";
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatMenuModule } from "@angular/material/menu";
import { provideOAuthClient } from "angular-oauth2-oidc";
import { AngularFireModule} from "@angular/fire/compat";
import { MatSnackBarModule} from "@angular/material/snack-bar";
import { firebase, firebaseui, FirebaseUIModule} from 'firebaseui-angular';
import { environment} from "../environments/environment";
import { AngularFireAuthModule} from "@angular/fire/compat/auth";
import {HomePageComponent} from "./home-page/home-page.component";
import {AppPageComponent} from "./app-page/app-page.component";
import {provideRouter, RouterLink, RouterOutlet} from "@angular/router";
import routeConfig from "./routes";

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};

@NgModule({
  declarations: [
    AppComponent,
    InterfaceComponent,
    NavbarComponent,
    KeySelectComponent,
    BpmSelectComponent,
    SliderComponent,
    AppPageComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatGridListModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    RouterOutlet,
    RouterLink,
  ],
  providers: [
    provideAnimations(),
    provideOAuthClient(),
    provideRouter(routeConfig)
  ],
  exports: [
    NavbarComponent,
    InterfaceComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

import {importProvidersFrom, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http';
import { InterfaceComponent } from './interface/interface.component';
import { AppComponent } from './app.component';
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacySliderModule as MatSliderModule} from "@angular/material/legacy-slider";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatGridListModule} from "@angular/material/grid-list";
import { NavbarComponent } from './navbar/navbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatLegacyProgressBarModule as MatProgressBarModule} from "@angular/material/legacy-progress-bar";
import { KeySelectComponent } from './key-select/key-select.component';
import { BpmSelectComponent } from './bpm-select/bpm-select.component';
import { SliderComponent } from './slider/slider.component';
import {MatRippleModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import { provideAnimations } from '@angular/platform-browser/animations';
import {MatLegacyMenuModule as MatMenuModule} from "@angular/material/legacy-menu";
import {provideOAuthClient} from "angular-oauth2-oidc";
import {MatLegacySnackBar as MatSnackBar, matLegacySnackBarAnimations as matSnackBarAnimations, MatLegacySnackBarModule as MatSnackBarModule} from "@angular/material/legacy-snack-bar";
// import {provideFirebaseApp} from "@angular/fire/app";
// import {AuthModule, provideAuth} from "@angular/fire/auth";
// import {initializeApp} from "firebase/app";
// import {Auth, getAuth} from "firebase/auth";
// import {provideFirestore} from "@angular/fire/firestore";
// import {getFirestore} from "firebase/firestore";
import {environment} from "../environments/environment.prod";
@NgModule({
  declarations: [
    AppComponent,
    InterfaceComponent,
    NavbarComponent,
    KeySelectComponent,
    BpmSelectComponent,
    SliderComponent,
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
    // provideFirebaseApp(() => initializeApp({
    //   apiKey: "AIzaSyAiWFiU9YsUoHgUvjlXcxKuvFS6rH4yfp0",
    //   authDomain: "entropy-413416.firebaseapp.com",
    //   databaseURL: "https://entropy-413416-default-rtdb.firebaseio.com",
    //   projectId: "entropy-413416",
    //   storageBucket: "entropy-413416.appspot.com",
    //   messagingSenderId: "258339538727",
    //   appId: "1:258339538727:web:af059ca999220afb340b02",
    //   measurementId: "G-F3H0KERXES"
    // })),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore())
  ],
  providers: [
    provideAnimations(),
    provideOAuthClient(),

    ],
  bootstrap: [AppComponent]
})
export class AppModule {}

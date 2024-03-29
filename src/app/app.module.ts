import {importProvidersFrom, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http';
import { InterfaceComponent } from './interface/interface.component';
import { AppComponent } from './app.component';
import { MatCardModule } from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import { NavbarComponent } from './navbar/navbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { KeySelectComponent } from './key-select/key-select.component';
import { BpmSelectComponent } from './bpm-select/bpm-select.component';
import { SliderComponent } from './slider/slider.component';
import {MatRippleModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import { provideAnimations } from '@angular/platform-browser/animations';
import {MatMenuModule} from "@angular/material/menu";
import {provideOAuthClient} from "angular-oauth2-oidc";
import {MatSnackBar, matSnackBarAnimations, MatSnackBarModule} from "@angular/material/snack-bar";
import {provideFirebaseApp} from "@angular/fire/app";
import {provideAuth} from "@angular/fire/auth";
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {provideFirestore} from "@angular/fire/firestore";
import {getFirestore} from "firebase/firestore";
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
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyAiWFiU9YsUoHgUvjlXcxKuvFS6rH4yfp0",
      authDomain: "entropy-413416.firebaseapp.com",
      databaseURL: "https://entropy-413416-default-rtdb.firebaseio.com",
      projectId: "entropy-413416",
      storageBucket: "entropy-413416.appspot.com",
      messagingSenderId: "258339538727",
      appId: "1:258339538727:web:af059ca999220afb340b02",
      measurementId: "G-F3H0KERXES"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [
    provideAnimations(),
    provideOAuthClient(),

    ],
  bootstrap: [AppComponent]
})
export class AppModule {}

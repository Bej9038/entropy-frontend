import {NgModule, isDevMode} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'; // Import FormsModule
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
import { AngularFireModule } from "@angular/fire/compat";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { AppPageComponent } from "./pages/app-page/app-page.component";
import { PreloadAllModules, provideRouter, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import { routeConfig, firebaseConfig } from "./configs";
import { MatTab, MatTabGroup} from "@angular/material/tabs";
import {
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import { WaveboxComponent } from "./wavebox/wavebox.component";
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {BottomLinksComponent} from "./bottom-links/bottom-links.component";

// const firebaseUiAuthConfig: firebaseui.auth.Config = {
//   signInFlow: 'popup',
//     signInOptions: [
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     firebase.auth.EmailAuthProvider.PROVIDER_ID
//   ],
//     tosUrl: '<your-tos-link>',
//     privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
//     credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
// };

@NgModule({ declarations: [
        AppComponent,
        InterfaceComponent,
        NavbarComponent,
        KeySelectComponent,
        BpmSelectComponent,
        SliderComponent,
        AppPageComponent,
        HomePageComponent,
        WaveboxComponent
    ],
    exports: [
        NavbarComponent,
        InterfaceComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        FormsModule,
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
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule,
        // FirebaseUIModule.forRoot(firebaseUiAuthConfig),
        RouterModule.forRoot(routeConfig, {preloadingStrategy: PreloadAllModules}), // Use PreloadAllModules here
        RouterOutlet,
        RouterLink,
        MatTabGroup,
        MatTab,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        MatExpansionPanelDescription,
        MatExpansionModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }), BottomLinksComponent], providers: [
        provideAnimations(),
        // provideOAuthClient(),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
    ] })
export class AppModule {}

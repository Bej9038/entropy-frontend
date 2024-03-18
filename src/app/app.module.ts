import { NgModule } from '@angular/core';
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
        MatIconModule
    ],
  providers: [provideAnimations()],
  bootstrap: [AppComponent]
})
export class AppModule {}

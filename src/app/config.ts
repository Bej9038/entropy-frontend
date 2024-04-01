import {Routes} from "@angular/router";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {AppPageComponent} from "./pages/app-page/app-page.component";
import {MissionPageComponent} from "./pages/mission-page/mission-page.component";
import {TechPageComponent} from "./pages/tech-page/tech-page.component";
import {NewsPageComponent} from "./pages/news-page/news-page.component";

export const routeConfig: Routes = [
  {
    path: "",
    component: HomePageComponent,
    title: "Entropy"
  },
  {
    path: "entropy",
    component: AppPageComponent,
    title: "Entropy"
  },
  {
    path: "mission",
    component: MissionPageComponent,
    title: "Mission"
  },
  {
    path: "tech",
    component: TechPageComponent,
    title: "Tech"
  },
  {
    path: "news",
    component: NewsPageComponent,
    title: "News"
  }
];

export const firebaseConfig = {
  apiKey: "AIzaSyAiWFiU9YsUoHgUvjlXcxKuvFS6rH4yfp0",
    authDomain: "entropy-413416.firebaseapp.com",
    databaseURL: "https://entropy-413416-default-rtdb.firebaseio.com",
    projectId: "entropy-413416",
    storageBucket: "entropy-413416.appspot.com",
    messagingSenderId: "258339538727",
    appId: "1:258339538727:web:af059ca999220afb340b02",
    measurementId: "G-F3H0KERXES"
};

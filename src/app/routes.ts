import {Routes} from "@angular/router";
import {HomePageComponent} from "./home-page/home-page.component";
import {AppPageComponent} from "./app-page/app-page.component";

const routeConfig: Routes = [
  {
    path: "entropy",
    component: AppPageComponent,
    title: "Entropy"
  },
  {
    path: "",
    component: HomePageComponent,
    title: "Entropy Audio"
  }
]
export default routeConfig;

import {Routes} from "@angular/router";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {AppPageComponent} from "./pages/app-page/app-page.component";
import {MissionPageComponent} from "./pages/mission-page/mission-page.component";
import {TechPageComponent} from "./pages/tech-page/tech-page.component";
import {NewsPageComponent} from "./pages/news-page/news-page.component";

const routeConfig: Routes = [
  {
    path: "",
    component: HomePageComponent,
    title: "Entropy AI"
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
]

export default routeConfig;

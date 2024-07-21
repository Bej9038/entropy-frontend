import { Component } from '@angular/core';
import {BottomLinksComponent} from "../../bottom-links/bottom-links.component";

@Component({
  selector: 'app-tech-page',
  standalone: true,
  imports: [
    BottomLinksComponent
  ],
  templateUrl: './tech-page.component.html',
  styleUrl: './tech-page.component.css'
})
export class TechPageComponent {

}

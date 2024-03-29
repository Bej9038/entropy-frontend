import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../firebase.service";

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent implements OnInit {

  constructor(private firebase: FirebaseService) { }

  ngOnInit(): void {

  }

}

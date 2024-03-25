import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../firebase.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public firebase: FirebaseService) { }

  ngOnInit(): void {
  }

}

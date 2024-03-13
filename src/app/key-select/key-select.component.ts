import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-key-select',
  templateUrl: './key-select.component.html',
  styleUrls: ['./key-select.component.css']
})
export class KeySelectComponent implements OnInit {

  selectedKeyId: number = 3;
  sharpSelected = false;

  constructor() { }

  ngOnInit(): void {
  }

  selectButton(id: number): void {
    this.selectedKeyId = id;
    if(id == 7)
    {
        this.sharpSelected = false;
    }
  }

  toggleSharp(): void {
    if(this.selectedKeyId != 7)
    {
      this.sharpSelected = !this.sharpSelected;
    }
  }
}

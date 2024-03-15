import { Component, OnInit } from '@angular/core';
import {ReqService} from "../req.service";

@Component({
  selector: 'app-key-select',
  templateUrl: './key-select.component.html',
  styleUrls: ['./key-select.component.css']
})
export class KeySelectComponent implements OnInit {
  selectedKeyId: number = 5;
  sharpSelected = false;
  idKeyMap: Map<number, string> = new Map<number, string>();

  constructor(public reqService: ReqService) { }

  ngOnInit(): void {
    this.idKeyMap.set(0, "c")
    this.idKeyMap.set(1, "d")
    this.idKeyMap.set(2, "e")
    this.idKeyMap.set(3, "f")
    this.idKeyMap.set(4, "g")
    this.idKeyMap.set(5, "a")
    this.idKeyMap.set(6, "b")
    this.idKeyMap.set(7, "")
  }

  selectButton(id: number): void {
    this.selectedKeyId = id;
    if(id == 7)
    {
        this.sharpSelected = false;
        this.reqService.key = "";
    }
    else {
        this.reqService.key = this.idKeyMap.get(id);
        if(this.sharpSelected)
        {
            this.reqService.key += "#"
        }
    }
  }

  toggleSharp(): void {
    if(this.selectedKeyId != 7)
    {
      this.sharpSelected = !this.sharpSelected;
      if(this.sharpSelected)
      {
        this.reqService.key += "#"
      }
      else {
        this.reqService.key = this.reqService.key?.slice(0, -1)
      }
    }
  }
}

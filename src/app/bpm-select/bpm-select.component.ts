import { Component, OnInit } from '@angular/core';
import {PromptService} from "../prompt.service";

@Component({
  selector: 'app-bpm-select',
  templateUrl: './bpm-select.component.html',
  styleUrls: ['./bpm-select.component.css']
})
export class BpmSelectComponent implements OnInit {
  bpm: number = 120
  bpmLimit: number = 60
  BPMSelected: boolean = true

  constructor(public promptService: PromptService) { }

  ngOnInit(): void {
  }

  getBPM() {
    if(this.bpm >= 60)
    {
      return String(this.bpm);
    }
    else {
      return "";
    }
  }

  toggleBPM()
  {
    this.BPMSelected = !this.BPMSelected;
  }
}

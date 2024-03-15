import { Component, OnInit } from '@angular/core';
import {ReqService} from "../req.service";
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-bpm-select',
  templateUrl: './bpm-select.component.html',
  styleUrls: ['./bpm-select.component.css']
})
export class BpmSelectComponent implements OnInit {
  BPMSelected: boolean = true
  bpm: string = this.reqService.bpm
  numberInputControl= new FormControl('', [
    Validators.pattern('^[0-9]+$'),
    Validators.min(60),
    Validators.max(200),
  ]);

  dummyControl= new FormControl({value: '', disabled: true});

  constructor(public reqService: ReqService) { }

  ngOnInit(): void {
  }

  updateBPM()
  {
    this.reqService.bpm = this.bpm
  }

  toggleBPM()
  {
    this.BPMSelected = !this.BPMSelected;
    if(!this.BPMSelected)
    {
      this.reqService.bpm = ""
    }
    else {
      this.reqService.bpm = this.bpm
    }
  }
}

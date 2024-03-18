import { Component, OnInit } from '@angular/core';
import {ReqService} from "../req.service";
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-bpm-select',
  templateUrl: './bpm-select.component.html',
  styleUrls: ['./bpm-select.component.css']
})
export class BpmSelectComponent implements OnInit {
  BPMSelected: boolean = false
  bpm: string = this.reqService.bpm
  numberInputControl= new FormControl('', [
    Validators.pattern('^[0-9]+$'),
    Validators.min(60),
    Validators.max(200),
  ]);

  dummyControl= new FormControl({value: '', disabled: true});

  constructor(public reqService: ReqService) { }

  selectPlaceholder() {
    this.reqService.bpm = "120"
    this.bpm = "120"
  }

  ngOnInit(): void {
  }

  updateBPM()
  {
    this.reqService.bpm = this.bpm
    this.reqService.disableGeneration = this.numberInputControl.hasError('min') || this.numberInputControl.hasError('max') || this.numberInputControl.hasError('pattern');
  }

  toggleBPM()
  {
    this.BPMSelected = !this.BPMSelected;
    if(!this.BPMSelected)
    {
      this.reqService.bpm = ""
      if(this.reqService.disableGeneration)
      {
        this.reqService.disableGeneration = false
      }
    }
    else {
      this.reqService.bpm = this.bpm
      if((this.numberInputControl.hasError('min') ||
        this.numberInputControl.hasError('max') ||
        this.numberInputControl.hasError('pattern')) && !this.reqService.disableGeneration)
      {
        this.reqService.disableGeneration = true
      }
    }
  }
}

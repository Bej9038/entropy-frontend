import {Component, Inject, OnInit} from '@angular/core';
import {ReqService} from "../req.service";
import { FormControl, Validators } from '@angular/forms';
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-bpm-select',
  templateUrl: './bpm-select.component.html',
  styleUrls: ['./bpm-select.component.css']
})
export class BpmSelectComponent implements OnInit {
  loopSelected: boolean = false
  bpm: string = this.reqService.bpm
  numberInputControl= new FormControl('', [
    Validators.pattern('^[0-9]+$'),
    Validators.min(60),
    Validators.max(200),
  ]);
  rootStyle = getComputedStyle(this.document.documentElement);
  dummyControl= new FormControl({value: '', disabled: true});

  constructor(public reqService: ReqService, @Inject(DOCUMENT) private document: Document) { }

  selectPlaceholder() {
    this.reqService.bpm = "120"
    this.bpm = "120"
    this.checkRipple()
  }

  ngOnInit(): void {
  }

  updateBPM()
  {
    this.reqService.bpm = this.bpm
    this.reqService.disableGeneration = this.numberInputControl.hasError('min') || this.numberInputControl.hasError('max') || this.numberInputControl.hasError('pattern');
    this.checkRipple()
  }

  checkRipple(){
    if(this.reqService.bpm != "")
    {
      const whiteValue = this.rootStyle.getPropertyValue('--white').trim();
      this.document.documentElement.style.setProperty('--ripple2', whiteValue);
    }
    else {
      const dark = this.rootStyle.getPropertyValue('--transluscent-dark').trim();
      this.document.documentElement.style.setProperty('--ripple2', dark);
    }
  }

  toggleBPM()
  {
    this.loopSelected = !this.loopSelected;
    if(!this.loopSelected)
    {
      this.reqService.bpm = ""
      this.checkRipple()
      if(this.reqService.disableGeneration)
      {
        this.reqService.disableGeneration = false
      }
    }
    else {
      if(this.bpm == "")
      {
        this.bpm = "120"
      }
      this.reqService.bpm = this.bpm
      this.checkRipple()
      if((this.numberInputControl.hasError('min') ||
        this.numberInputControl.hasError('max') ||
        this.numberInputControl.hasError('pattern')) && !this.reqService.disableGeneration)
      {
        this.reqService.disableGeneration = true
      }
    }
  }
}

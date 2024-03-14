import { Component, OnInit } from '@angular/core';
import {PromptService} from "../prompt.service";
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-bpm-select',
  templateUrl: './bpm-select.component.html',
  styleUrls: ['./bpm-select.component.css']
})
export class BpmSelectComponent implements OnInit {
  bpm: number = 120
  bpmLimit: number = 60
  BPMSelected: boolean = true
  numberInputControl= new FormControl('', [
    Validators.pattern('^[0-9]+$'),
    Validators.min(60),
    Validators.max(200),
  ]);

  dummyControl= new FormControl('', [
  ]);

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

  numberValidator(control: FormControl): { [key: string]: any } | null {
    const isNumber = typeof control.value == 'number'
    return isNumber ? { 'notANumber': { value: control.value } } : null;
  }
}

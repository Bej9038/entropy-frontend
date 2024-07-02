import {Component, Inject, OnInit} from '@angular/core';
import {ReqService} from "../services/req.service";
import {FormControl, Validators} from '@angular/forms';
import {DOCUMENT} from "@angular/common";
import {GenerationState, StateService} from "../services/state.service";

@Component({
  selector: 'app-bpm-select',
  templateUrl: './bpm-select.component.html',
  styleUrls: ['./bpm-select.component.css']
})
export class BpmSelectComponent implements OnInit {
  loopSelected: boolean = false
  bpm: string = this.reqService.bpm
  min = 60
  max = 200
  numberInputControl= new FormControl('', [
    Validators.pattern('^[0-9]+$'),
    Validators.min(60),
    Validators.max(200),
  ]);
  bpm_input_focus = false
  rootStyle = getComputedStyle(this.document.documentElement);
  dummyControl= new FormControl({value: '', disabled: true});

  constructor(public reqService: ReqService,
              public stateService: StateService,
              @Inject(DOCUMENT) private document: Document) { }

  selectPlaceholder() {
    this.reqService.bpm = ""
    this.bpm = ""
    // this.checkRipple()
  }

  ngOnInit(): void {
  }

  incrementUp() {
    if(parseInt(this.bpm) < 200 && parseInt(this.bpm) >= 60) {
      this.bpm = (parseInt(this.bpm) + 1).toString()
      this.updateBPM()
    }
  }
  incrementDown() {
    if(parseInt(this.bpm) > 60 && parseInt(this.bpm) <= 200) {
      this.bpm = (parseInt(this.bpm) - 1).toString()
      this.updateBPM()
    }
  }

  onScroll(event: WheelEvent): void {
    if (event.deltaY < 0) {
      this.incrementUp()
    } else {
      this.incrementDown()
    }
  }

  updateBPM() {
    this.reqService.bpm = this.bpm
    if(this.numberInputControl.hasError('min') || this.numberInputControl.hasError('max') || this.numberInputControl.hasError('pattern')) {
      this.stateService.setState(GenerationState.Error)
    }
    else if(this.stateService.getCurrentState() == GenerationState.Error) {
      this.stateService.setState(this.stateService.getPreviousState());
    }
    // this.checkRipple()
  }

  toggleLoop()
  {
    this.loopSelected = !this.loopSelected;
    if(!this.loopSelected)
    {
        this.reqService.bpm = ""
        // this.checkRipple()
      if(this.stateService.getCurrentState() == GenerationState.Error) {
        this.stateService.setState(this.stateService.getPreviousState());
      }
      this.reqService.loop = false
    }
    else
    {
      this.bpm = ""
      this.reqService.bpm = this.bpm
      // this.checkRipple()
      if((this.numberInputControl.hasError('min') ||
          this.numberInputControl.hasError('max') ||
          this.numberInputControl.hasError('pattern')) && this.stateService.getCurrentState() != GenerationState.Error) {
        this.stateService.setState(GenerationState.Error)
      }
      this.reqService.loop = true
    }
  }

  protected readonly GenerationState = GenerationState;
}

import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
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
  prev: string = "128"
  min = 60
  max = 200
  numberInputControl= new FormControl('', [
    Validators.pattern('^[0-9]+$'),
    Validators.min(60),
    Validators.max(200),
  ]);
  bpm_input_focus = false
  dummyControl= new FormControl({value: '', disabled: true});

  // @ts-ignore
  @ViewChild('bpmForm') bpmForm: ElementRef;

  constructor(public reqService: ReqService,
              public stateService: StateService,
              @Inject(DOCUMENT) private document: Document) { }

  selectPlaceholder() {
    this.reqService.bpm = ""
  }

  ngOnInit(): void {
  }

  incrementUp() {
    if(parseInt(this.reqService.bpm) < 200 && parseInt(this.reqService.bpm) >= 60) {
      this.reqService.bpm = (parseInt(this.reqService.bpm) + 1).toString()
      this.updateBPM()
    }
  }

  incrementDown() {
    if(parseInt(this.reqService.bpm) > 60 && parseInt(this.reqService.bpm) <= 200) {
      this.reqService.bpm = (parseInt(this.reqService.bpm) - 1).toString()
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
    if(this.numberInputControl.hasError('min') || this.numberInputControl.hasError('max') || this.numberInputControl.hasError('pattern')) {
      this.stateService.setState(GenerationState.Error)
    }
    else if(this.stateService.getCurrentState() == GenerationState.Error) {
      this.stateService.setState(this.stateService.getPreviousState());
    }
  }

  toggleLoop()
  {
    this.loopSelected = !this.loopSelected;
    if(!this.loopSelected) {
      // Turning loop off
      this.prev = this.reqService.bpm
      this.reqService.bpm = ""
      if(this.stateService.getCurrentState() == GenerationState.Error) {
        this.stateService.setState(this.stateService.getPreviousState());
      }
      this.reqService.loop = false
    }
    else {
      // Turning loop on
      this.reqService.bpm = this.prev
      if((this.numberInputControl.hasError('min') ||
          this.numberInputControl.hasError('max') ||
          this.numberInputControl.hasError('pattern')) && this.stateService.getCurrentState() != GenerationState.Error) {
        this.stateService.setState(GenerationState.Error)
      }
      this.reqService.loop = true
      this.bpmForm.nativeElement.focus();
    }
  }

  protected readonly GenerationState = GenerationState;
}

import {Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {AudioService} from "../services/audio.service";
import {ProgressBarMode} from "@angular/material/progress-bar";
import WaveSurfer from "wavesurfer.js";
import {DOCUMENT} from "@angular/common";
import {GenerationState, StateService} from "../services/state.service";
import {InterfaceComponent} from "../interface/interface.component";


@Component({
  selector: 'app-wavebox',
  templateUrl: './wavebox.component.html',
  styleUrl: './wavebox.component.css'
})
export class WaveboxComponent implements OnInit {
  @Input() audioID = 0;
  // @ts-ignore
  @Input() parent: InterfaceComponent;
  // @ts-ignore
  @ViewChild('waveform') waveform: ElementRef;
  wavesurfer: WaveSurfer | undefined
  focused = false
  progressBarMode: ProgressBarMode = "indeterminate"
  grabbing = false
  filename: string = ""
  rootStyle = getComputedStyle(this.document.documentElement);
  grey = this.rootStyle.getPropertyValue("--translucent-grey-2").trim()
  white = this.rootStyle.getPropertyValue("--white").trim()
  dark = this.rootStyle.getPropertyValue("--translucent-dark").trim()
  noColor = this.rootStyle.getPropertyValue("--none").trim()

  constructor(public audioService: AudioService,
              public stateService: StateService,
              @Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {

  }

  onFocus() {
    this.focused = true;
  }

  unFocus() {
    this.focused = false;
    if(this.wavesurfer) {
      this.wavesurfer.setOptions({cursorColor: this.grey})
    }
  }

  onMouseDown() {
    if(this.stateService.getCurrentState() == GenerationState.Displaying || this.stateService.getCurrentState() == GenerationState.Selected) {
      this.grabbing = true
    }
  }

  onMouseUp() {
    if(this.stateService.getCurrentState() == GenerationState.Displaying || this.stateService.getCurrentState() == GenerationState.Selected) {
      this.grabbing = false
    }
  }

  initialize() {
    this.wavesurfer?.destroy()
  }

  selectWavebox()
  {
    if(this.stateService.getCurrentState() == GenerationState.Displaying)
    {
      this.stateService.setState(GenerationState.Selected)
      this.parent.storePreferenceData(this.audioID)
      this.parent.hideWaveboxesExcept(this.audioID)
    }
    else if(this.stateService.getCurrentState() == GenerationState.Selected)
    {
      this.audioService.downloadAudio(this.audioID)
      this.stateService.setState(GenerationState.Idle)
      this.parent.resetWaveboxes()
    }
  }

  initWaveSurfer(src: any, debug:boolean)
  {
    if(this.stateService.getCurrentState() != GenerationState.Displaying) {
      let height = 72
      let interact = false
      let cursorWidth = 2
      this.wavesurfer = WaveSurfer.create(
        {
          container: this.waveform.nativeElement,
          waveColor: this.dark,
          progressColor: this.noColor,
          cursorWidth: 0,
          interact: interact,
          fillParent: true,
          sampleRate: 48000,
          height: height,
          dragToSeek: true,
          autoScroll: true
        }
      )
      if (debug) {
        this.wavesurfer.load("assets/KSHMR_Full_Orchestra_Loop_07_124_Am.wav");
      } else {
        this.wavesurfer.load((src as any).changingThisBreaksApplicationSecurity);
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    if(this.wavesurfer)
    {
      this.wavesurfer.setOptions({})
    }
  }

  protected readonly GenerationState = GenerationState;
}

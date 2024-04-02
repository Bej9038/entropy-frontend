import {Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {AudioService} from "../services/audio.service";
import {ProgressBarMode} from "@angular/material/progress-bar";
import WaveSurfer from "wavesurfer.js";
import {DOCUMENT} from "@angular/common";


@Component({
  selector: 'app-wavebox',
  templateUrl: './wavebox.component.html',
  styleUrl: './wavebox.component.css'
})
export class WaveboxComponent implements OnInit {
  @Input() audioID = 0;
  @Input() enabled = false;
  // @ts-ignore
  @ViewChild('waveform') waveform: ElementRef;
  wavesurfer: WaveSurfer | undefined;
  focused = false;
  showProgressBar = false;
  progressBarMode: ProgressBarMode = "indeterminate";

  rootStyle = getComputedStyle(this.document.documentElement);
  grey = this.rootStyle.getPropertyValue("--translucent-grey-2").trim()
  white = this.rootStyle.getPropertyValue("--white").trim()
  dark = this.rootStyle.getPropertyValue("--translucent-dark").trim()
  noColor = this.rootStyle.getPropertyValue("--none").trim()

  constructor(public audioService: AudioService, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {}

  onFocus() {
    this.focused = true;
  }

  unFocus() {
    this.focused = false;
    if(this.wavesurfer) {
      this.wavesurfer.setOptions({cursorColor: this.grey})
    }
  }

  enable(enable: boolean) {
    this.enabled = enable
  }

  init() {
    this.wavesurfer = undefined;
    this.showProgressBar = true;
  }

  cancelGen()
  {
    this.wavesurfer = undefined;
    this.showProgressBar = false;
  }

  initWaveSurfer(src: any, debug:boolean)
  {
    if(this.wavesurfer)
    {
      console.log("preventing duplicate waveform generation")
      return
    }
    this.showProgressBar = false;
    let height = 72;
    let interact = false;
    let cursorWidth = 2;
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
    if(debug)
    {
      this.wavesurfer.load("assets/KSHMR_Full_Orchestra_Loop_07_124_Am.wav");
    }
    else {
      this.wavesurfer.load((src as any).changingThisBreaksApplicationSecurity);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    if(this.wavesurfer)
    {
      this.wavesurfer.setOptions({})
    }
  }
}

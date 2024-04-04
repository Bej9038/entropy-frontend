import {Component, ElementRef, HostListener, Inject, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AudioService} from "../services/audio.service";
import {ProgressBarMode} from "@angular/material/progress-bar";
import WaveSurfer from "wavesurfer.js";
import {DOCUMENT} from "@angular/common";
import {GenerationState, StateService} from "../services/state.service";


@Component({
  selector: 'app-wavebox',
  templateUrl: './wavebox.component.html',
  styleUrl: './wavebox.component.css'
})
export class WaveboxComponent implements OnInit {
  @Input() audioID = 0;
  // @ts-ignore
  @ViewChild('waveform') waveform: ElementRef;
  wavesurfer: WaveSurfer | undefined;
  focused = false;
  progressBarMode: ProgressBarMode = "indeterminate";
  grabbing = false;

  rootStyle = getComputedStyle(this.document.documentElement);
  grey = this.rootStyle.getPropertyValue("--translucent-grey-2").trim()
  white = this.rootStyle.getPropertyValue("--white").trim()
  dark = this.rootStyle.getPropertyValue("--translucent-dark").trim()
  noColor = this.rootStyle.getPropertyValue("--none").trim()

  constructor(public audioService: AudioService,
              public stateService: StateService,
              @Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2,) {}

  ngOnInit() {

  }

  ngAfterViewInit()
  {

  }

  onFocus() {
    this.focused = true;
  }

  onMouseDown()
  {
    // this.grabbing = true;
    console.log("hi")
    // let style = document.createElement( 'style' )
    // style.innerHTML = ':host .progress { pointer-events: auto !important }'
    // let innerDiv = this.waveform.nativeElement.childNodes[0]
    // console.log(innerDiv.shadowRoot.childNodes[1])
    // innerDiv.shadowRoot.childNodes[1].innerHTML = ":host {min-width: 1px} :host audio {display: block;width: 100%;}:host .scroll {overflow-x: auto;overflow-y: hidden;width: 100%;position: relative;}:host .noScrollbar {scrollbar-color: transparent;scrollbar-width: none;}:host .noScrollbar::-webkit-scrollbar {display: none; -webkit-appearance: none;}:host .wrapper {position: relative;overflow: visible;z-index: 0;}:host .canvases {min-height: 72px;}:host .canvases > div {position: relative;}:host canvas {display: block;position: absolute;top: 0;image-rendering: pixelated;}:host .progress {position: absolute;z-index: 0;top: 0;left: 0;width: 0;height: 100%;overflow: hidden;}:host .progress > div {position: relative;}:host .cursor {position: absolute;z-index: 0;top: 0;left: 0;height: 100%;border-radius: 2px;}"
    // innerDiv.shadowRoot.childNodes[1].innerHTML = ":host {z-index: -1 !important; pointer-events: auto!important;}:host .scroll {overflow: hidden; z-index: -1 !important;}"
  }

  onMouseUp()
  {
    this.grabbing = false;
  }

  unFocus() {
    this.focused = false;
    if(this.wavesurfer) {
      this.wavesurfer.setOptions({cursorColor: this.grey})
    }
  }

  initialize() {
    this.wavesurfer?.destroy()
  }

  selectWavebox()
  {

  }

  initWaveSurfer(src: any, debug:boolean)
  {
    if(this.stateService.getCurrentState() != GenerationState.Displaying) {
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

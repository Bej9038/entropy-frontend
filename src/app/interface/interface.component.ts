import {Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AudioService} from "../audio.service";
import {SafeUrl} from "@angular/platform-browser";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {ReqService} from "../req.service";
import WaveSurfer from "wavesurfer.js";
import {MatRipple} from "@angular/material/core";


@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  apiKey = "JZTOUADUXNL7BBELM84Y6INBGDHANBEOR81NU5TF";
  run_async: string = "https://api.runpod.ai/v2/5aiuk1jqxasy3v/run";
  status: string = "https://api.runpod.ai/v2/5aiuk1jqxasy3v/status/";
  cancel: string = "https://api.runpod.ai/v2/5aiuk1jqxasy3v/cancel/";
  audioSrc1: SafeUrl | undefined;
  audioSrc2: SafeUrl | undefined;
  progressBarMode: ProgressBarMode = "determinate";
  showProgressBar: boolean = false;
  generating: boolean = false;
  showAudio: boolean = false;
  // showAudio: boolean = true;
  style = getComputedStyle(this.elementRef.nativeElement);
  placeholders: string[] = ["jazz trumpet",
    "hip-hop snare drum",
    "pulsing chords loop",
    "dramatic piano melody",
    "cinematic impact",
    "kick drum",
    "violin melody", "hi-hat top loop",
    "sustained electronic synth arp",
    "distorted neuro reese bass loop" +
    ""
  ];
  current_id: string = "";
  missing_id: boolean = false;
  placeholder: string = this.placeholders[0]

  debug = true
  // debug = false

  wavesurfer1: WaveSurfer | undefined;
  wavesurfer2: WaveSurfer | undefined;

  // @ts-ignore
  @ViewChild('waveform1') waveform1Element: ElementRef;
  // @ts-ignore
  @ViewChild('waveform2') waveform2Element: ElementRef;
  // @ts-ignore
  @ViewChild(MatRipple) ripple: MatRipple;
  // @ts-ignore
  @ViewChild('outline') textOutline: ElementRef;
  // @ts-ignore
  @ViewChild('slider') sliderElement: ElementRef;
  // @ts-ignore
  @ViewChild('key') keyElement: ElementRef;
  // @ts-ignore
  @ViewChild('bpm') bpmElement: ElementRef;
  // @ts-ignore
  @ViewChild('label', { read: ElementRef }) textLabel: ElementRef;

  ngOnInit() {
    if(this.debug)
    {
      this.showAudio = true
      this.showProgressBar = false
    }
  }

  ngAfterViewInit(): void {
    let i = Math.floor(Math.random() * this.placeholders.length)
    let seconds = 10
    let self = this
    this.textLabel.nativeElement.style.opacity = 0;
    this.textLabel.nativeElement.style.transition="opacity 500ms cubic-bezier(0.25, 0.8, 0.25, 1)"
    setTimeout(function() {
      self.textLabel.nativeElement.style.opacity = 1;
      setInterval(() => {
        self.textLabel.nativeElement.style.opacity = 0;
        setTimeout(function() {
          self.placeholder = self.placeholders[i];
          self.textLabel.nativeElement.style.opacity = 1;
        }, 500);

        // let x = -1
        // while(x == i)
        // {
          i = Math.floor(Math.random() * self.placeholders.length)
        // }
        // i = x
        // console.log(i)
      }, seconds * 1000);
    }, 300);
    if(this.debug)
    {
      this.initWaveSurfer()
    }
  }

  constructor(private elementRef: ElementRef, private http: HttpClient, public audioService: AudioService, public reqService: ReqService) {}

  generateSetup()
  {
    this.showAudio = false
    // this.reqService.description = "";
    this.audioSrc1 = undefined;
    this.audioSrc2 = undefined;
    this.progressBarMode = "indeterminate";
    this.showProgressBar = true;
    this.generating = true;
  }

  generateTeardown()
  {
    this.reqService.description = "";
    this.reqService.disableGeneration = false;
    this.showProgressBar = false;
    this.generating = false;
    this.progressBarMode = "determinate";
    this.current_id = "";
  }

  selectPlaceholder() {
    this.reqService.description = this.placeholder
  }

  generate(){
    const rippleConfig = {
      centered: true,
      radius: 800,
    };
    this.ripple.launch(0, 0, rippleConfig)
    if(!this.generating)
    {
      if(this.debug)
      {
        this.generateSetup();
      }
      else {
        this.sendReq()
      }
    }
    else
    {
      this.sendCancelReq()
    }
  }

  sendCancelReq()
  {
    this.missing_id = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
    console.log("cancelling request")
    let req = {"input": {}}
    console.log(this.current_id)
    this.http.post<any>(this.cancel + this.current_id, req, { headers })
      .subscribe(response =>
      {
        this.current_id = response["id"];
        this.missing_id = false;
      });
    this.generateTeardown()
  }

  sendReq()
  {
    const req = this.reqService.getReq()
    this.generateSetup();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
    console.log("sending request to server")
    this.http.post<any>(this.run_async, req, { headers })
      .subscribe(response =>
      {
        this.current_id = response["id"];
      });

    let intervalRef = setInterval(() => {
      console.log("checking status")
      this.http.post<any>(this.status + this.current_id, req, { headers })
        .subscribe(async response => {
          if (response["status"] == "COMPLETED") {
            console.log("request complete")
            let base641 = response["output"][0]
            let base642 = response["output"][1]
            this.audioSrc1 = await this.audioService.decodeBase64ToAudioURL(base641, 1)
            this.audioSrc2 = await this.audioService.decodeBase64ToAudioURL(base642, 2)
            this.showAudio = true;
            this.waitForElementsAndInitWaveSurfer(intervalRef)
          } else if (response["status"] == "CANCELLED") {
            clearInterval(intervalRef);
          }
        });
    }, 1000);
  }

  initWaveSurfer()
  {
    let color = this.style.getPropertyValue("--translucent-dark").trim()
    let cursorColor = this.style.getPropertyValue("--white").trim()
    let height = 72;
    let interact = true
    this.wavesurfer1 = WaveSurfer.create(
      {
        container: this.waveform1Element.nativeElement,
        waveColor: color,
        progressColor: "none",
        cursorWidth: 2,
        cursorColor: cursorColor,
        interact: interact,
        fillParent: true,
        sampleRate: 48000,
        height: height,
        dragToSeek: true,
        autoScroll: true
      }
    )
    if(this.debug)
    {
      this.wavesurfer1.load("assets/KSHMR_Full_Orchestra_Loop_07_124_Am.wav");
    }
    else {
      this.wavesurfer1.load((this.audioSrc1 as any).changingThisBreaksApplicationSecurity);
    }
    this.wavesurfer2 = WaveSurfer.create(
      {
        container: this.waveform2Element.nativeElement,
        waveColor: color,
        progressColor: "none",
        cursorWidth: 2,
        cursorColor: cursorColor,
        interact: interact,
        fillParent: true,
        sampleRate: 48000,
        height: height,
        dragToSeek: true,
        autoScroll: true
      }
    )
    if(this.debug)
    {
      this.wavesurfer2.load("assets/KSHMR Electric Guitar Chords 01 (75, Bm).wav");
    }
    else {
      this.wavesurfer2.load((this.audioSrc2 as any).changingThisBreaksApplicationSecurity);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    if(this.wavesurfer1 && this.wavesurfer2)
    {
      this.wavesurfer1.setOptions({})
      this.wavesurfer2.setOptions({})
    }
  }

  waitForElementsAndInitWaveSurfer(intervalRef: any) {
    const checkAndInit = () => {
      if (this.waveform1Element && this.waveform1Element.nativeElement &&
        this.waveform2Element && this.waveform2Element.nativeElement) {
        this.initWaveSurfer()
        this.generateTeardown()
        clearInterval(intervalRef);
      } else {
        setTimeout(checkAndInit, 50);
      }
    };
    checkAndInit();
  }
}

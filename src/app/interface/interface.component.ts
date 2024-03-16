import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AudioService} from "../audio.service";
import {SafeUrl} from "@angular/platform-browser";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {ReqService} from "../req.service";
import WaveSurfer from "wavesurfer.js";
import {state, transition, trigger, style, animate} from "@angular/animations";
import {MatRipple} from "@angular/material/core";
import {MatCard} from "@angular/material/card";


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
  placeholders: string[] = ["jazz trumpet solo",
    "hip hop snare drum",
    "dubstep bass loop",
    "erie piano atmosphere",
    "cinematic drum loop"];
  current_id: string = "";
  missing_id: boolean = false;
  placeholder: string = this.placeholders[0]

  // @ts-ignore
  @ViewChild('waveform1') waveform1Element: ElementRef;
  // @ts-ignore
  @ViewChild('waveform2') waveform2Element: ElementRef;
  // @ts-ignore
  @ViewChild(MatRipple) ripple: MatRipple;

  ngOnInit(): void {
    let i = Math.floor(Math.random() * this.placeholders.length)
    console.log(i)
    let seconds = 10
    setInterval(() => {
      this.placeholder = this.placeholders[i];
      i = Math.floor(Math.random() * this.placeholders.length)
    }, seconds * 1000);
  }

  constructor(private elementRef: ElementRef, private http: HttpClient, private audioService: AudioService, public reqService: ReqService) {}

  generateSetup()
  {
    console.log(this.reqService.getReq())
    // this.reqService.description = "";
    this.audioSrc1 = undefined;
    this.audioSrc2 = undefined;
    this.progressBarMode = "indeterminate";
    this.showProgressBar = true;
    this.generating = true;
  }

  generateTeardown()
  {
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
      this.generateSetup();
      // this.sendReq()
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
        .subscribe(response => {
          if(response["status"] == "COMPLETED")
          {
            console.log("request complete")
            let base641 = response["output"][0]
            let base642 = response["output"][1]
            this.audioSrc1 = this.audioService.decodeBase64ToAudioURL(base641)
            this.audioSrc2 = this.audioService.decodeBase64ToAudioURL(base642)
            this.showAudio = true;
            this.waitForElementsAndInitWaveSurfer(intervalRef)
          }
          else if(response["status"] == "CANCELLED")
          {
            // this.generateTeardown()
            clearInterval(intervalRef);
          }
        });
    }, 1000);
  }

  initWaveSurfer()
  {
    let wavesurfer1 = WaveSurfer.create(
      {
        container: this.waveform1Element.nativeElement,
        waveColor: this.style.getPropertyValue("--translucent-accent").trim(),
        progressColor: '#ECEFF1',
        cursorWidth: 0,
        interact: false
      }
    )
    wavesurfer1.load((this.audioSrc1 as any).changingThisBreaksApplicationSecurity);

    let wavesurfer2 = WaveSurfer.create(
      {
        container: this.waveform2Element.nativeElement,
        waveColor: this.style.getPropertyValue("--translucent-accent").trim(),
        progressColor: '#ECEFF1',
        cursorWidth: 0,
        interact: false
      }
    )
    wavesurfer2.load((this.audioSrc2 as any).changingThisBreaksApplicationSecurity);
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

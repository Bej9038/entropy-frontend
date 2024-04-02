import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AudioService} from "../services/audio.service";
import {SafeUrl} from "@angular/platform-browser";
import {ReqService} from "../services/req.service";
import {MatRipple} from "@angular/material/core";
import {DOCUMENT} from "@angular/common";
import {WaveboxComponent} from "../wavebox/wavebox.component";
import {FirestoreService} from "../services/firestore.service";


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
  audioSrc0: SafeUrl | undefined;
  audioSrc1: SafeUrl | undefined;
  generating: boolean = false;
  showAudio: boolean = false;
  placeholders: string[] = [
    "acoustic hi-hat top loop",
    "trap snare drum",
    "pulsing synth chords",
    "kick drum",
    "distorted cinematic drum loop",
    "sustained electronic arp",
  ];
  current_id: string = "";
  missing_id: boolean = false;
  placeholder: string = this.placeholders[0]
  phInterval: any = undefined;
  debug = false
  // debug = true
  rootStyle = getComputedStyle(this.document.documentElement);
  white = this.rootStyle.getPropertyValue("--white").trim()
  dark = this.rootStyle.getPropertyValue("--translucent-dark").trim()

  // @ts-ignore
  @ViewChild('wavebox0') wavebox0: WaveboxComponent
  // @ts-ignore
  @ViewChild('wavebox1') wavebox1: WaveboxComponent;
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

  constructor(private elementRef: ElementRef,
              private http: HttpClient,
              public audioService: AudioService,
              public reqService: ReqService,
              @Inject(DOCUMENT) private document: Document,
              private firestore: FirestoreService) {}

  ngOnInit() {
    if(this.debug)
    {
      this.showAudio = true
    }
  }

  ngAfterViewInit(): void {
    this.nextPlaceholder()
    if(this.debug)
    {
      this.wavebox0.initWaveSurfer(undefined, this.debug);
      this.wavebox1.initWaveSurfer(undefined, this.debug);
    }
  }

  nextPlaceholder() {
    let i = Math.floor(Math.random() * this.placeholders.length)
    let seconds = 10
    let self = this
    this.textLabel.nativeElement.style.opacity = 0;
    this.textLabel.nativeElement.style.transition="opacity 500ms cubic-bezier(0.25, 0.8, 0.25, 1)"
    setTimeout(function() {
      self.textLabel.nativeElement.style.opacity = 1;
      self.phInterval = setInterval(() => {
        self.textLabel.nativeElement.style.opacity = 0;
        setTimeout(function() {
          self.placeholder = self.placeholders[i];
          self.textLabel.nativeElement.style.opacity = 1;
        }, 500);
        i = Math.floor(Math.random() * self.placeholders.length)
      }, seconds * 1000);

    }, 300);
  }

  generateSetup()
  {
    this.wavebox0.init()
    this.wavebox1.init()
    this.showAudio = false
    this.audioSrc0 = undefined;
    this.audioSrc1 = undefined;
    this.generating = true;
  }

  generateTeardown()
  {
    this.wavebox0.cancelGen();
    this.wavebox1.cancelGen();
    this.reqService.description = "";
    this.reqService.disableGeneration = false;
    this.generating = false;
    this.current_id = "";
  }

  selectPlaceholder() {
    this.reqService.description = this.placeholder
    this.checkRipple()
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
        this.reqService.getReq();
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
    this.firestore.storePrompt(req)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    console.log("sending request to server")

    // get confirmation with request id

    this.http.post<any>(this.run_async, req, { headers })
      .subscribe(response =>
      {
        this.current_id = response["id"];
      });

    // send request and wait for

    let intervalRef = setInterval(() => {
      console.log("checking status")
      this.http.post<any>(this.status + this.current_id, req, { headers })
        .subscribe(async response => {
          if (response["status"] == "COMPLETED") {
            console.log("request complete")
            let base64_0 = response["output"][0]
            let base64_1 = response["output"][1]
            this.audioSrc0 = await this.audioService.decodeBase64ToAudioURL(base64_0, 0, this.reqService.description)
            this.audioSrc1 = await this.audioService.decodeBase64ToAudioURL(base64_1, 1, this.reqService.description)
            this.showAudio = true;
            this.waitForElementsAndInitWaveSurfer(intervalRef)
          } else if (response["status"] == "CANCELLED") {
            clearInterval(intervalRef);
          }
        });
    }, 1000);
  }

  waitForElementsAndInitWaveSurfer(intervalRef: any) {
    // const checkAndInit = () => {
    //   if (this.wavebox0 && this.wavebox1) {
        this.wavebox0.initWaveSurfer(this.audioSrc0, this.debug)
        this.wavebox1.initWaveSurfer(this.audioSrc1, this.debug)
        this.generateTeardown()
        clearInterval(intervalRef);
      // } else {
      //   setTimeout(checkAndInit, 50);
      // }
    // };
    // checkAndInit();
  }

  checkRipple(){
    if(this.reqService.description != "")
    {
      this.document.documentElement.style.setProperty('--ripple', this.white);
    }
    else {
      this.document.documentElement.style.setProperty('--ripple', this.dark);
    }
  }
}

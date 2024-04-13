import {Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren,} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AudioService} from "../services/audio.service";
import {ReqService} from "../services/req.service";
import {MatRipple} from "@angular/material/core";
import {DOCUMENT} from "@angular/common";
import {WaveboxComponent} from "../wavebox/wavebox.component";
import {FirestoreService} from "../services/firestore.service";
import {DebugState, GenerationState, StateService} from "../services/state.service";
import {animate, query, style, transition, trigger} from "@angular/animations";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':leave', [
          animate('.5s ease-out', style({ opacity: 0, width: '0%'}))
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, width: 0}),
          animate('.5s ease-out', style({ opacity: 1, width: "*"}))
        ], { optional: true }),
      ]),
    ])
  ]
})
export class InterfaceComponent implements OnInit {
  placeholders: string[] = [
    "acoustic hi-hat top loop",
    "trap snare drum",
    "pulsing synth chords",
    "kick drum",
    "distorted cinematic drum loop",
    "sustained electronic arp",
  ];
  // @ts-ignore
  num_wavebox_subscription: Subscription;
  wavebox_ids: number[] = [];
  currentReqId: string = "";
  placeholder: string = this.placeholders[0]
  placeholderIntervalRef: any = undefined;
  rootStyle = getComputedStyle(this.document.documentElement);
  white = this.rootStyle.getPropertyValue("--white").trim()
  dark = this.rootStyle.getPropertyValue("--translucent-dark").trim()
  cancel_url = "https://us-central1-entropy-413416.cloudfunctions.net/cancelReq"
  send_url = "https://us-central1-entropy-413416.cloudfunctions.net/sendGenReq"
  check_url = "https://us-central1-entropy-413416.cloudfunctions.net/checkReq"

  // @ts-ignore
  @ViewChildren("wavebox") waveboxes: QueryList<WaveboxComponent>;
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
              public firestore: FirestoreService,
              public stateService: StateService
  ) {}

  ngOnInit() {
    this.num_wavebox_subscription = this.reqService.numAudioObsv.subscribe(newValue => {
      this.setNumWaveboxes()
    })
    this.stateService.setState(GenerationState.Idle)
  }

  ngAfterViewInit() {
    this.nextPlaceholder()
    if(this.stateService.debug == DebugState.Debug)
    {
      this.waveboxes.forEach(wb => {
        wb.initWaveSurfer(undefined)
      })
      this.stateService.setState(GenerationState.Displaying);
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
      self.placeholderIntervalRef = setInterval(() => {
        self.textLabel.nativeElement.style.opacity = 0;
        setTimeout(function() {
          self.placeholder = self.placeholders[i];
          self.textLabel.nativeElement.style.opacity = 1;
        }, 500);
        i = Math.floor(Math.random() * self.placeholders.length)
      }, seconds * 1000);

    }, 300);
  }

  selectPlaceholder() {
    this.reqService.description = this.placeholder
    this.checkRipple()
  }

  clearWaveboxVisuals() {
    this.waveboxes.forEach(wb => {
      wb.initialize()
    })
  }

  setNumWaveboxes() {
    this.wavebox_ids = []
    setTimeout(() => {
      for(let i = 0; i < this.reqService.numAudio.value; i++) {
        this.wavebox_ids.push(i)
      }
    }, 1000)
  }

  resetWaveboxes() {
    this.setNumWaveboxes()
    this.clearWaveboxVisuals()
  }

  hideWaveboxesExcept(id: number) {
    this.wavebox_ids = this.wavebox_ids.filter(number => id == number)
  }

  storePreferenceData(id: number) {
    let filenames: string[] = []
    this.waveboxes.forEach(wb => {
      filenames.push(wb.filename)
    })
    this.firestore.storePreferenceData(filenames, id)
  }

  generate(){
    if(this.firestore.getCredits() <= 0) {
      this.stateService.print("user ran out of credits")
      return
    }
    const rippleConfig = {
      centered: true,
      radius: 800,
    };
    this.ripple.launch(0, 0, rippleConfig)
    if(this.stateService.getCurrentState() != GenerationState.Generating)
    {
      if(this.stateService.debug == DebugState.Debug) {
        this.clearWaveboxVisuals()
        this.reqService.getReq()
      }
      else {
        this.stateService.setState(GenerationState.Generating)
        this.sendReq()
      }
    }
    else
    {
      this.stateService.setState(GenerationState.Idle)
      this.sendCancelReq()
    }
  }

  async sendCancelReq()
  {
    this.stateService.print("cancelling request")
    const body = { reqId: this.currentReqId };
    const id = await this.firestore.currentUser.getIdToken()
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${id}`
    };
    this.http.post(this.cancel_url, body, { headers: headers }).subscribe()
    this.currentReqId = "";
  }

  async sendReq()
  {
    this.stateService.print("sending request to server")
    const req = this.reqService.getReq()
    this.clearWaveboxVisuals();

    // Call SendGenReq

    const body = {req: req, credits: 1};
    const id = await this.firestore.currentUser.getIdToken()
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${id}` };

    this.http.post(this.send_url, body, { headers: headers }).subscribe((response: any) => {
      this.stateService.print(response.currentReqId)
      this.currentReqId = response.currentReqId
    })

    // Check Status

    let intervalRef = setInterval(async() => {
      this.stateService.print("checking status")
      const body = { reqId: this.currentReqId };
      this.http.post(this.check_url, body, { headers: headers }).subscribe(async (response: any) => {
        this.stateService.print(response)
        if (response["status"] == "COMPLETED") {
          if(this.stateService.getCurrentState() != GenerationState.Displaying){
            this.stateService.print("request complete")
            for(let i = 0; i < this.wavebox_ids.length; i++) {
              let wb = this.waveboxes.toArray()[i]
              let base64 = response["output"][i]
              let res = await this.audioService.decodeBase64ToAudioURL(base64, i, req.input.text)
              wb.initWaveSurfer(res["url"])
              wb.filename = res["filename"]
            }
            this.stateService.setState(GenerationState.Displaying);
            clearInterval(intervalRef);
            this.currentReqId = ""
          }
        } else if (response["status"] == "CANCELLED") {
          clearInterval(intervalRef);
        }
      });
    }, 1000);
  }

  checkRipple() {
    if(this.reqService.description != "") {
      this.document.documentElement.style.setProperty('--ripple', this.white);
    }
    else {
      this.document.documentElement.style.setProperty('--ripple', this.dark);
    }
  }

  protected readonly GenerationState = GenerationState;
}

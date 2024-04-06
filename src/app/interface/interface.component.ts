import {Component, ElementRef, Inject, OnInit, QueryList, Renderer2, ViewChild, ViewChildren,} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AudioService} from "../services/audio.service";
import {SafeUrl} from "@angular/platform-browser";
import {ReqService} from "../services/req.service";
import {MatRipple} from "@angular/material/core";
import {DOCUMENT} from "@angular/common";
import {WaveboxComponent} from "../wavebox/wavebox.component";
import {FirestoreService} from "../services/firestore.service";
import {GenerationState, StateService} from "../services/state.service";
import {animate, transition, style, stagger, query, trigger} from "@angular/animations";


@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':leave', [
            animate('.5s ease-out', style({ opacity: 0, height: 0, width: '0%', padding: "0", margin: "0"}))
        ], { optional: true }),

      ])
    ]),
    // trigger('centerBox', [
    //   transition('* => *', [
    //     query(':leave', [
    //       animate('1s ease-out', style({ width: '80%'}))
    //     ], { optional: true })
    //   ])
    // ])
  ],
})
export class InterfaceComponent implements OnInit {
  run_async: string = "https://api.runpod.ai/v2/5aiuk1jqxasy3v/run";
  status: string = "https://api.runpod.ai/v2/5aiuk1jqxasy3v/status/";
  cancel: string = "https://api.runpod.ai/v2/5aiuk1jqxasy3v/cancel/";
  placeholders: string[] = [
    "acoustic hi-hat top loop",
    "trap snare drum",
    "pulsing synth chords",
    "kick drum",
    "distorted cinematic drum loop",
    "sustained electronic arp",
  ];
  num_waveboxes = 2;
  wavebox_ids: number[] = [];
  currentReqId: string = "";
  missing_id: boolean = false;
  placeholder: string = this.placeholders[0]
  phInterval: any = undefined;
  debug = false
  // debug = true
  rootStyle = getComputedStyle(this.document.documentElement);
  white = this.rootStyle.getPropertyValue("--white").trim()
  dark = this.rootStyle.getPropertyValue("--translucent-dark").trim()

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
              private firestore: FirestoreService,
              public stateService: StateService,
              private renderer: Renderer2) {
    this.setNumWaveboxes()
  }

  ngOnInit() {
    this.firestore.accessGopher()
    this.stateService.setState(GenerationState.Idle)
  }

  ngAfterViewInit() {
    this.nextPlaceholder()
    if(this.debug)
    {
      this.waveboxes.forEach(wb => {
        wb.initWaveSurfer(undefined, this.debug)
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

  selectPlaceholder() {
    this.reqService.description = this.placeholder
    this.checkRipple()
  }

  clearWaveboxeVisuals() {
    this.waveboxes.forEach(wb => {
      wb.initialize()
    })
  }

  setNumWaveboxes() {
    this.wavebox_ids = []
    for(let i = 0; i < this.num_waveboxes; i++) {
      this.wavebox_ids.push(i)
    }
  }

  resetWaveboxes() {
    this.setNumWaveboxes()
    this.clearWaveboxeVisuals()
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
    const rippleConfig = {
      centered: true,
      radius: 800,
    };
    this.ripple.launch(0, 0, rippleConfig)
    if(this.stateService.getCurrentState() != GenerationState.Generating)
    {
      if(this.debug)
      {
        this.clearWaveboxeVisuals();
        this.reqService.getReq();
      }
      else {
        this.stateService.setState(GenerationState.Generating);
        this.sendReq()
      }
    }
    else
    {
      this.stateService.setState(GenerationState.Idle);
      this.sendCancelReq()
    }
  }

  sendCancelReq()
  {
    this.missing_id = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer JZTOUADUXNL7BBELM84Y6INBGDHANBEOR81NU5TF`
    });
    console.log("cancelling request")
    let req = {"input": {}}
    console.log(this.currentReqId)
    this.http.post<any>(this.cancel + this.currentReqId, req, { headers })
      .subscribe(response =>
      {
        this.currentReqId = response["id"];
        this.missing_id = false;
      });
    this.currentReqId = "";
  }

  sendReq()
  {
    const req = this.reqService.getReq()
    this.clearWaveboxeVisuals();
    this.firestore.storePrompt(req)
    // console.log(this.firestore.gopher)
    const x = this.firestore.gopher

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer JZTOUADUXNL7BBELM84Y6INBGDHANBEOR81NU5TF`
    });

    console.log("sending request to server")

    // get confirmation with request id

    this.http.post<any>(this.run_async, req, { headers })
      .subscribe(response =>
      {
        this.currentReqId = response["id"];
      });

    // send request and wait for

    let intervalRef = setInterval(() => {
      console.log("checking status")
      this.http.post<any>(this.status + this.currentReqId, req, { headers })
        .subscribe(async response => {
          if (response["status"] == "COMPLETED") {
            if(this.stateService.getCurrentState() != GenerationState.Displaying){
              console.log("request complete")
              for(let i = 0; i < this.wavebox_ids.length; i++)
              {
                let wb = this.waveboxes.toArray()[i]
                let base64 = response["output"][i]
                let res = await this.audioService.decodeBase64ToAudioURL(base64, i, this.reqService.description)
                wb.initWaveSurfer(res["url"], this.debug)
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
    }, 2000);
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

  protected readonly GenerationState = GenerationState;
}

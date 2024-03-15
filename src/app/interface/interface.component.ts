import {Component, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AudioService} from "../audio.service";
import {SafeUrl} from "@angular/platform-browser";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {ReqService} from "../req.service";

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  duration = 5;
  stereo = true;
  entropy = 0.9;
  apiKey = "JZTOUADUXNL7BBELM84Y6INBGDHANBEOR81NU5TF";
  run_async_url: string = "https://api.runpod.ai/v2/y4bhqyz247xbh2/run";
  status_url: string = "https://api.runpod.ai/v2/y4bhqyz247xbh2/status/";
  audioSrc1: SafeUrl | undefined;
  audioSrc2: SafeUrl | undefined;
  progressBarMode: ProgressBarMode = "determinate";
  showProgressBar: boolean = false;
  showGenerate: boolean = true;
  showAudio: boolean = false;
  suggestionDescriptions: string[] = ["jazz trumpet solo",
    "hip hop snare drum",
    "dubstep bass loop",
    "erie piano atmosphere",
    "cinematic drum loop"];

  ngOnInit(): void {}
  constructor(private http: HttpClient, private audioService: AudioService, public reqService: ReqService) {}

  formatLabel(value: number): string {
    return `${value}`;
  }

  generateSetup()
  {
    this.reqService.description = "";
    this.audioSrc1 = undefined;
    this.audioSrc2 = undefined;
    this.progressBarMode = "indeterminate";
    this.showProgressBar = true;
    this.showGenerate = false;
  }

  generateTeardown()
  {
    this.showProgressBar = false;
    this.showGenerate = false;
    this.showAudio = true;
    this.progressBarMode = "determinate";
  }

  generate(){
    console.log(this.reqService.getReq())
    // this.generateSetup();
    // this.sendReq()
  }

  sendReq()
  {
    let id: string = "";
    const req = this.reqService.getReq()
    this.generateSetup();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
    console.log("sending request to server")
    console.log(this.entropy)
    this.http.post<any>(this.run_async_url, req, { headers })
      .subscribe(response =>
      {
        id = response["id"];
      });

    let intervalRef = setInterval(() => {
      console.log("checking status")
      this.http.post<any>(this.status_url + id, req, { headers })
        .subscribe(response => {
          if(response["status"] == "COMPLETED")
          {
            console.log("request complete")
            let base641 = response["output"][0]
            let base642 = response["output"][1]
            this.audioSrc1 = this.audioService.decodeBase64ToAudioURL(base641)
            this.audioSrc2 = this.audioService.decodeBase64ToAudioURL(base642)
            this.generateTeardown()
            clearInterval(intervalRef);
          }
        });
    }, 1000);
  }
}

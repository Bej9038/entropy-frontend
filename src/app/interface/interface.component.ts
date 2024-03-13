import {Component, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AudioService} from "../audio.service";
import {SafeUrl} from "@angular/platform-browser";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {PromptService} from "../prompt.service";

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  duration = 5;
  stereo = true;
  entropy = 0.9;
  apiKey = "IP9F71H42CBD1KR6V3REJKLWUODX904XTKKPVPLG";
  run_async_url: string = "https://api.runpod.ai/v2/y4bhqyz247xbh2/run";
  status_url: string = "https://api.runpod.ai/v2/y4bhqyz247xbh2/status/";
  audioSrc: SafeUrl | undefined;
  progressBarMode: ProgressBarMode = "determinate";
  showProgressBar: boolean = false;
  showGenerate: boolean = true;
  showAudio: boolean = false;

  ngOnInit(): void {}
  constructor(private http: HttpClient, private audioService: AudioService, public promptService: PromptService) {}

  formatLabel(value: number): string {
    return `${value}`;
  }

  generateSetup()
  {
    this.promptService.prompt = "";
    this.audioSrc = undefined;
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
    console.log(this.promptService.getCurrentPrompt())
    // this.generateSetup();
    this.sendReq()
  }

  sendReq()
  {
    let id: string = "";
    const request = {
      "input": {
        "text": this.promptService.getCurrentPrompt(),
        "entropy": this.entropy,
        "duration": this.duration,
        "stereo": this.stereo
      }
    }
    this.generateSetup();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
    console.log("sending request to server")
    console.log(this.entropy)
    this.http.post<any>(this.run_async_url, request, { headers })
      .subscribe(response =>
      {
        id = response["id"];
      });

    let intervalRef = setInterval(() => {
      console.log("checking status")
      this.http.post<any>(this.status_url + id, request, { headers })
        .subscribe(response => {
          if(response["status"] == "COMPLETED")
          {
            console.log("request complete")
            let base64 = response["output"]
            this.audioSrc = this.audioService.decodeBase64ToAudioURL(base64)
            this.generateTeardown()
            clearInterval(intervalRef);
          }
        });
    }, 1000);
  }
}

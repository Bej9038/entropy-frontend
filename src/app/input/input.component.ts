import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { NgZone } from '@angular/core';

interface InitialResponse {
  "id": string,
  "status": string
}

@Component({
  selector: 'app-root',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  textPrompt = '';
  duration = 5;
  stereo = true;
  entropy = 0.5;
  apiKey = "IP9F71H42CBD1KR6V3REJKLWUODX904XTKKPVPLG";
  ctx = new AudioContext()
  sampleRate = 44100

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  toggleStereo() {
    this.stereo = !this.stereo;
  }

  generate(){
    const run_async_url: string = "https://api.runpod.ai/v2/y4bhqyz247xbh2/run";
    const status_url: string = "https://api.runpod.ai/v2/y4bhqyz247xbh2/status/";
    let id: string = "";
    const request = {
      "input": {
        "text": this.textPrompt,
        "entropy": this.entropy,
        "duration": this.duration,
        "stereo": this.stereo
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    console.log("sending request to server")
    this.http.post<any>(run_async_url, request, { headers })
      .subscribe(response =>
      {
        id = response["id"];
      });

    let intervalRef = setInterval(() => {
      console.log("checking status")
          this.http.post<any>(status_url + id, request, { headers })
            .subscribe(response => {
              if(response["status"] == "COMPLETED")
              {
                console.log("request complete")
                console.log(response)
                clearInterval(intervalRef);
              }
            });
      }, 1000);
  }
}

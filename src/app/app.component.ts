import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AudioService} from "./audio.service";
import {ReqService} from "./req.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'entropy-frontend';
  private intervalId: any;
  apiKey = "JZTOUADUXNL7BBELM84Y6INBGDHANBEOR81NU5TF";
  runsync: string = "https://api.runpod.ai/v2/y4bhqyz247xbh2/runsync";

  constructor(private http: HttpClient) {}


  ngOnInit(): void {
    // this.startPeriodicRequest()
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startPeriodicRequest(): void {
    this.intervalId = setInterval(() => {
      this.sendAPIRequest();
    }, 8000); // every 10 seconds
  }

  sendAPIRequest(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });
    const req = {
      "input": {
        "text": "",
        "entropy": 0,
        "duration": 0,
        "stereo": 0,
        "ping": 1
      }
    }
    this.http.post<any>(this.runsync, req, { headers })
      .subscribe(response =>
      {
        console.log(response)
      });
  }


}

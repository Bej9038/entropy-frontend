import {Injectable} from '@angular/core';
import {StateService} from "./state.service";

@Injectable({
  providedIn: 'root'
})
export class ReqService {
  description: string = ""
  bpm: string = ""
  key: string | undefined = ""
  entropy: number = 0.9
  duration: number = 5
  loop: boolean = false;

  constructor(private stateService: StateService) { }

  formatDescription()
  {
    let text = this.description.replace(new RegExp('[-]', 'g'), " ");
    text = text.replace(new RegExp('[,.]', 'g'), "");

    if(this.loop && !text.includes("loop"))
    {
      text += " loop";
    }

    if(this.bpm)
    {
      text += " " + this.bpm + " bpm"
    }

    if(this.key != "")
    {
      text += " " + this.key
    }
    this.stateService.print(text)
    return text.toLowerCase()
  }

  getReq()
  {
    this.stateService.print(this.duration);
    this.stateService.print(this.entropy);
    return {
      "input": {
        "text":  this.formatDescription(),
        "entropy": this.entropy,
        "duration": this.duration,
        "stereo": 1,
        "ping": 0
      }
    };
  }
}

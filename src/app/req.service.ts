import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReqService {
  description: string = ""
  bpm: string = ""
  key: string | undefined = ""
  entropy: number = 0.9
  duration: number = 5
  disableGeneration: boolean = false
  loop: boolean = false;

  constructor() { }

  reformatDescription()
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
    console.log(text)
    return text
  }

  getReq()
  {
    return {
      "input": {
        "text":  this.reformatDescription(),
        "entropy": this.entropy,
        "duration": this.duration,
        "stereo": 1,
        "ping": 0
      }
    }
  }
}

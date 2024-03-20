import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReqService {
  description: string = ""
  bpm: string = ""
  key: string | undefined = ""
  entropy: number = 1.1
  duration: number = 6
  disableGeneration: boolean = false
  // loop: False;

  constructor() { }

  getReq()
  {
    let text = this.description.replace(new RegExp('[-]', 'g'), " ");
    text = text.replace(new RegExp('[,.]', 'g'), "");
    if(this.bpm)
    {
      if(text != "")
      {
        text += " "
      }
      if(!text.includes("loop"))
      {
        text += "loop "
      }
      text += this.bpm + " bpm"
    }

    if(this.key != "")
    {
      if(text != "")
      {
        text += " "
      }
      text += this.key
    }
    console.log(text)
    return {
      "input": {
        "text":  text,
        "entropy": this.entropy,
        "duration": this.duration,
        "stereo": 1,
        "ping": 0
      }
    }
  }
}

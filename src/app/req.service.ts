import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReqService {
  description: string = ""
  bpm: string = ""
  key: string | undefined = "a"
  entropy: number = 1.1
  duration: number = 6
  disableGeneration: boolean = false

  constructor() { }

  getReq()
  {
    let text = this.description
    if(this.bpm)
    {
      if(text != "")
      {
        text += " "
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

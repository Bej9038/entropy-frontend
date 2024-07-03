import {Injectable} from '@angular/core';
import {StateService} from "./state.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReqService {
  description: string = ""
  bpm: string = ""
  key: string | undefined = ""
  entropy: number = 0.9
  duration: number = 5
  numAudio = new BehaviorSubject<number>(2)
  numAudioObsv = this.numAudio.asObservable();
  loop: boolean = false;
  halfStepDownMap: Map<string, string> = new Map<string, string>();

  constructor(private stateService: StateService) {
    this.halfStepDownMap.set("c", "b")
    this.halfStepDownMap.set("c#", "c")
    this.halfStepDownMap.set("d", "c#")
    this.halfStepDownMap.set("d#", "d")
    this.halfStepDownMap.set("e", "d#")
    this.halfStepDownMap.set("f", "e")
    this.halfStepDownMap.set("f#", "f")
    this.halfStepDownMap.set("g", "f#")
    this.halfStepDownMap.set("g#", "g")
    this.halfStepDownMap.set("a", "g#")
    this.halfStepDownMap.set("a#", "a")
    this.halfStepDownMap.set("b", "a#")
    this.halfStepDownMap.set("", "")
  }

  updateNumAudio(value: number) {
    this.numAudio.next(value)
  }

  formatDescription() {
    let text = this.description.replace(new RegExp('[-]', 'g'), " ");
    text = text.replace(new RegExp('[,.]', 'g'), "");

    if(this.loop && !text.includes("loop")) {
      text += " loop";
    }

    if(this.bpm) {
      text += " " + this.bpm + " bpm"
    }

    if(this.key != "") {
      text += " " + this.halfStepDownMap.get(<string>this.key)
    }
    return text.toLowerCase()
  }

  getReq()
  {
    this.stateService.print(this.duration);
    this.stateService.print(this.entropy);
    this.stateService.print(this.formatDescription())
    this.stateService.print(this.numAudio.value/2)
    return {
      "input": {
        "text":  this.formatDescription(),
        "entropy": this.entropy,
        "duration": this.duration,
        "stereo": 1,
        "ping": 0,
        "num_audio": this.numAudio.value
      }
    };
  }
}

import {Injectable} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import WaveSurfer from "wavesurfer.js";
import {ReqService} from "./req.service";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioContext = new AudioContext();

  // @ts-ignore
  buffer0: AudioBuffer;
  // @ts-ignore
  buffer1: AudioBuffer;

  src0 = this.audioContext.createBufferSource()
  src1 = this.audioContext.createBufferSource()

  url0: undefined | SafeUrl = undefined
  url1: undefined | SafeUrl = undefined

  src0_isPlaying = false
  src1_isPlaying = false

  current_prompt = ""

  src0_time = 0
  src1_time = 0

  constructor(private sanitizer: DomSanitizer, private reqService: ReqService) {
    this.src0.connect(this.audioContext.destination)
    this.src1.connect(this.audioContext.destination)
  }

  init_new_buffer_src() {
    this.src0 = this.audioContext.createBufferSource()
    this.src1 = this.audioContext.createBufferSource()
    this.src0.connect(this.audioContext.destination)
    this.src1.connect(this.audioContext.destination)
    this.src0.buffer = this.buffer0
    this.src1.buffer = this.buffer1
  }

  playOrPause(audioId: number) {
    if(audioId == 0)
    {
      this.src0_isPlaying ? this.pauseAudio(0) : this.playAudio(0)
    }
    else if(audioId == 1)
    {
      this.src1_isPlaying ? this.pauseAudio(1) : this.playAudio(1)
    }
  }

  playAudio(audioId: number): void
  {
    this.init_new_buffer_src()
    if(audioId == 0)
    {
      console.log("playing 0")
      this.src0_isPlaying = true
      this.src0.start()
    }
    else if(audioId == 1) {
      this.src1_isPlaying = true
      this.src1.start()
    }
  }

  pauseAudio(audioId: number) {
    if(audioId == 0)
    {
      this.src0_isPlaying = false
      this.src0.stop()
    }
    else if(audioId == 1) {
      this.src1_isPlaying = false
      this.src1.stop()
    }
  }

  downloadAudio(audioId:number)
  {
    if(audioId == 0) {
      this.downloadBlob(this.url0, this.current_prompt)
    }
    else if(audioId == 1) {
      this.downloadBlob(this.url1, this.current_prompt)
    }
  }

  downloadBlob(url: SafeUrl | undefined, filename: string) {
    const a = document.createElement('a');
    a.href = (url as any).changingThisBreaksApplicationSecurity;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  assignbuffer(audioId: number, buffer: any, url: any)
  {
    if(audioId == 0) {
      this.url0 = url
      this.buffer0 = buffer
    }
    else if(audioId == 1) {
      this.url1 = url
      this.buffer1 = buffer
    }
  }

  async decodeBase64ToAudioURL(base64: string, audioId: number, description: string) {
    console.log("decoding audio")
    this.current_prompt = description
    const byteArray = this.convertBase64FileToRaw(base64)
    const audioBlob = new Blob([byteArray], { type: 'audio/wav' });
    const url = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(audioBlob))
    this.assignbuffer(audioId, await this.audioContext.decodeAudioData(byteArray.buffer), url)
    return url;
  }

  convertBase64FileToRaw(base64: string)
  {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  }
}

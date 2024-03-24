import {Injectable} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import WaveSurfer from "wavesurfer.js";
import {ReqService} from "./req.service";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  sampleRate = 48000
  audioContext = new AudioContext();
  // audioContext = new OfflineAudioContext({
  //   numberOfChannels: 2,
  //   length: 10 * this.sampleRate,
  //   sampleRate: this.sampleRate
  // });

  // @ts-ignore
  buffer1: AudioBuffer;
  // @ts-ignore
  buffer2: AudioBuffer;

  src1 = this.audioContext.createBufferSource()
  src2 = this.audioContext.createBufferSource()

  url1: undefined | SafeUrl = undefined
  url2: undefined | SafeUrl = undefined

  src1_isPlaying = false
  src2_isPlaying = false

  current_prompt = ""

  src1_time = 0
  src2_time = 0

  constructor(private sanitizer: DomSanitizer, private reqService: ReqService) {
    this.src1.connect(this.audioContext.destination)
    this.src2.connect(this.audioContext.destination)
  }

  init_new_buffer_src() {
    this.src1 = this.audioContext.createBufferSource()
    this.src2 = this.audioContext.createBufferSource()
    this.src1.connect(this.audioContext.destination)
    this.src2.connect(this.audioContext.destination)
    this.src1.buffer = this.buffer1
    this.src2.buffer = this.buffer2
  }

  playOrPause(audioId: number) {
    if(audioId == 1)
    {
      this.src1_isPlaying ? this.pauseAudio(1) : this.playAudio(1)
    }
    else if(audioId == 2)
    {
      this.src2_isPlaying ? this.pauseAudio(2) : this.playAudio(2)
    }
  }

  playAudio(audioId: number): void
  {
    this.init_new_buffer_src()
    if(audioId == 1)
    {
      this.src1_isPlaying = true
      if(this.src2_isPlaying) {
        this.pauseAudio(2)
      }
      this.src1.start()
    }
    else if(audioId == 2) {
      this.src2_isPlaying = true
      if(this.src1_isPlaying) {
        this.pauseAudio(1)
      }
      this.src2.start()
    }
  }

  pauseAudio(audioId: number) {
    if(audioId == 1)
    {
      this.src1_isPlaying = false
      this.src1.stop()
    }
    else if(audioId == 2) {
      this.src2_isPlaying = false
      this.src2.stop()
    }
  }

  downloadAudio(audioId:number)
  {
    if(audioId == 1) {
      this.downloadBlob(this.url1, this.current_prompt)
    }
    else if(audioId == 2) {
      this.downloadBlob(this.url2, this.current_prompt)
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

  async decodeBase64ToAudioURL(base64: string, audioId: number, description: string) {
    console.log("decoding audio")
    this.current_prompt = description
    const byteArray = this.convertBase64FileToRaw(base64)
    const audioBlob = new Blob([byteArray], { type: 'audio/wav' });
    const url = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(audioBlob))
    if(audioId == 1) {
      this.url1 = url
      this.buffer1 = await this.audioContext.decodeAudioData(byteArray.buffer);
    }
    else if(audioId == 2) {
      this.url2 = url
      this.buffer2 = await this.audioContext.decodeAudioData(byteArray.buffer);
    }
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

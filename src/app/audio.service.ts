import {Injectable} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import WaveSurfer from "wavesurfer.js";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioContext = new AudioContext();
  src1 = this.audioContext.createBufferSource()
  src2 = this.audioContext.createBufferSource()

  constructor(private sanitizer: DomSanitizer) {
    this.src1.connect(this.audioContext.destination)
    this.src2.connect(this.audioContext.destination)
  }

  playAudio(audioId: number): void
  {
    if(audioId == 1)
    {
      this.src1.start()
    }
    else if(audioId == 2) {
      this.src2.start()
    }
  }

  decodeBase64ToAudioURL(base64String: string, audioId: number) {
    console.log("decoding audio")
    const buffer = new AudioBuffer(2, )
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const audioBlob = new Blob([byteArray], { type: 'audio/wav' });

    if(audioId == 1)
    {
      this.src1.buffer = await this.audioContext.decodeAudioData(byteArray.buffer);
    }
    else if(audioId == 2)
    {
    //   this.src2.buffer = await this.audioContext.decodeAudioData(byteArray.buffer);
    // }
    console.log("returning url")
    // console.log(URL.createObjectURL(audioBlob))
    return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(audioBlob));
  }
}

import {Injectable} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  // add ctx options + sr
  audioContext = new AudioContext();
  sampleRate = 44100;

  constructor(private sanitizer: DomSanitizer) { }

  displayAudio(data: number[][])
  {
    console.log("attempting to display audio")
    let audioBuffer = this.audioContext.createBuffer(data.length, data[0].length, this.sampleRate);

    for(let channel = 0; channel < data.length; channel++)
    {
      let buffering = audioBuffer.getChannelData(channel);
      for(let i = 0; i < data[0].length; i++)
      {
        buffering[i] = data[channel][i];
      }
    }

    let src = this.audioContext.createBufferSource()
    src.buffer = audioBuffer
    src.connect(this.audioContext.destination)
    src.loop = true
    src.start()
  }

  decodeBase64ToAudioURL(base64String: string) {
    console.log("decoding audio")
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const audioBlob = new Blob([byteArray], { type: 'audio/wav' });
    console.log("returning audio url")
    let url = URL.createObjectURL(audioBlob)
    console.log(url)
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

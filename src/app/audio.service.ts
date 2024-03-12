import {Injectable} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import WaveSurfer from "wavesurfer.js";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  // add ctx options + sr
  audioContext = new AudioContext();
  sampleRate = 44100;

  constructor(private sanitizer: DomSanitizer) { }

  displayAudio(url: string)
  {
    let wavesurfer = WaveSurfer.create(
      {
        container: '#waveform',
        waveColor: '#ECEFF1',
        progressColor: '#ECEFF1',
        cursorWidth: 0,
        interact: false
      }
    )
    wavesurfer.load(url);
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
    // this.displayAudio(url)
    console.log(url)
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

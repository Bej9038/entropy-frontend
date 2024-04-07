import {Injectable} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {ReqService} from "./req.service";
import {FirestoreService} from "./firestore.service";
import {StateService} from "./state.service";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioContext = new AudioContext();
  current_prompt = ""
  num_sources = 4

  buffers: Map<number, AudioBuffer> = new Map<number, AudioBuffer>();
  srcs: Map<number, AudioBufferSourceNode> = new Map<number, AudioBufferSourceNode>();
  urls: Map<number, SafeUrl> = new Map<number, SafeUrl>();
  isPlaying: Map<number, boolean> = new Map<number, boolean>([[0,false], [1,false], [2,false], [3,false]]);

  constructor(private sanitizer: DomSanitizer,
              private firestore: FirestoreService,
              private stateService: StateService) {
  }

  initBufferSources() {
    for(let i = 0; i < this.num_sources; i++) {
      this.srcs.set(i, this.audioContext.createBufferSource())
      // @ts-ignore
      this.srcs.get(i).connect(this.audioContext.destination)
      // @ts-ignore
      this.srcs.get(i).buffer = this.buffers.get(i)
    }
  }

  pauseAndPlay(audioId: number) {
    if(this.isPlaying.get(audioId)) {
      this.pauseAudio()
    } else {
      this.pauseAudio()
      this.playAudio(audioId)
    }
  }

  playAudio(audioId: number): void {
    this.initBufferSources()
    this.isPlaying.set(audioId, true)
    this.srcs.get(audioId)?.start()
  }

  pauseAudio() {
    for(let i = 0; i < this.num_sources; i++) {
      if(this.isPlaying.get(i)) {
        this.isPlaying.set(i, false)
        this.srcs.get(i)?.stop()
      }
    }
  }

  downloadAudio(audioId:number) {
    this.downloadBlob(this.urls.get(audioId), this.current_prompt)
  }

  downloadBlob(url: SafeUrl | undefined, filename: string) {
    const a = document.createElement('a');
    a.href = (url as any).changingThisBreaksApplicationSecurity;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  assignBufferUrl(audioId: number, buffer: any, url: any) {
    this.urls.set(audioId, url)
    this.buffers.set(audioId, buffer)
  }

  async decodeBase64ToAudioURL(base64: string, audioId: number, prompt: string) {
    this.stateService.print("decoding audio")
    this.current_prompt = prompt
    const byteArray = this.convertBase64FileToRaw(base64)
    const audioBlob = new Blob([byteArray], { type: 'audio/wav' });
    const filename = this.firestore.storePreferenceAudio(audioBlob, prompt)
    const url = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(audioBlob))

    this.assignBufferUrl(audioId, await this.audioContext.decodeAudioData(byteArray.buffer), url)

    return {
      "url": url,
      "filename": filename
    }
  }

  convertBase64FileToRaw(base64: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  }
}

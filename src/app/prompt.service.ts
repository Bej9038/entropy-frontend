import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  prompt: string = ""
  bpm: string = ""
  key: string = ""

  constructor() { }

  getCurrentPrompt()
  {
    return this.prompt + " " + this.bpm + " " + this.key
  }
}

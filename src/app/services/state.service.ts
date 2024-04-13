import { Injectable } from '@angular/core';

export enum GenerationState {
  Idle,
  Generating,
  Displaying,
  Selected,
  // Transition,
  Error,
}

export enum DebugState {
  Debug,
  Info,
  Prod
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state = GenerationState.Idle
  prev = GenerationState.Idle
  // debug = DebugState.Debug
  debug = DebugState.Info
  // debug = DebugState.Prod


  constructor() { }

  getCurrentState(): GenerationState {
    return this.state
  }

  getPreviousState(): GenerationState {
    return this.prev
  }

  setState(state: GenerationState) {
    if(this.state != state)
    {
      this.prev = this.state
      this.state = state;
      this.print("entering state: " + GenerationState[this.state])
    }
  }

  getDebugState() {
    return this.debug
  }

  print(text: any) {
    if(this.debug == DebugState.Debug || this.debug == DebugState.Info) {
      console.log(text)
    }
  }
}

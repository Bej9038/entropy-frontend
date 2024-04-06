import { Injectable } from '@angular/core';

export enum GenerationState {
  Idle,
  Generating,
  Displaying,
  Selected,
  Error,
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state = GenerationState.Idle;
  prev = GenerationState.Idle;
  debug = true;
  // debug = false;

  constructor() { }

  getCurrentState(): GenerationState {
    return this.state;
  }

  getPreviousState(): GenerationState {
    return this.prev
  }

  setState(state: GenerationState) {
    if(this.state != state)
    {
      this.prev = this.state
      this.state = state;
      console.log("entering state: " + GenerationState[this.state])
    }
  }

  isDebug() {
    return this.debug
  }
}

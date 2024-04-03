import { Injectable } from '@angular/core';

export enum GenerationState {
  Idle,
  Generating,
  Displaying,
  Error
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state = GenerationState.Idle;

  constructor() { }

  getCurrentState(): GenerationState {
    return this.state;
  }

  setState(state: GenerationState) {
    this.state = state;
    console.log("State: " + GenerationState[this.state])
  }
}

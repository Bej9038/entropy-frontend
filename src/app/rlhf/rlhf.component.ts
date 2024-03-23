import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rlhf',
  templateUrl: './rlhf.component.html',
  styleUrls: ['./rlhf.component.css']
})
export class RlhfComponent implements OnInit {
  rhsUp = false;
  lhsUp = false;

  constructor() { }

  ngOnInit(): void {
  }

  onRhs()
  {
    this.rhsUp = true
    this.lhsUp = false
  }
  onLhs()
  {
    this.rhsUp = false
    this.lhsUp = true
  }

  reset() {
    this.rhsUp = false
    this.lhsUp = false
  }
}

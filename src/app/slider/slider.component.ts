import {Component, Input, OnInit} from '@angular/core';
import {ReqService} from "../req.service";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  @Input() name: string = "";
  @Input() min: number = 0;
  @Input() max: number = 0;
  @Input() step: number = 1;
  @Input() default: number = this.min;
  value: number = 0;

  constructor(public reqService: ReqService) { }

  ngOnInit(): void {
    this.value = this.name == "entropy" ? this.reqService.entropy : this.reqService.duration;
  }

  sliderChange(): void {
    if(this.name == "entropy")
    {
      this.reqService.entropy = this.value;
    }
    else {
      this.reqService.duration = this.value;
    }
  }
}

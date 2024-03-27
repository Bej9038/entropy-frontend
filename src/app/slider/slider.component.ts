import {Component, Input, OnInit} from '@angular/core';
import {ReqService} from "../req.service";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit {
  @Input() name: string = "";
  @Input() min: number = 0;
  @Input() max: number = 0;
  @Input() step: number = 1;
  @Input() default: number = this.min;
  value: number = 0;
  entropyWarning: boolean = false;

  constructor(public reqService: ReqService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.value = this.name == "entropy" ? this.reqService.entropy : this.reqService.duration;
  }

  sliderChange(): void {
    if(this.name == "entropy")
    {
      this.reqService.entropy = this.value;
      if(!this.entropyWarning) {
        let msg = "Warning. Altering the system's entropy may yield unexpected results. Use with caution."
        this.snackbar.open(msg, "ok")
        this.entropyWarning = true;
      }
    }
    else {
      this.reqService.duration = this.value;
    }
  }
}

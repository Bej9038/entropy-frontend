import {Component, Input, OnInit} from '@angular/core';
import {ReqService} from "../services/req.service";
import {MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSliderModule} from "@angular/material/slider";

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
  value: number = 0;
  entropyWarning: boolean = false;

  constructor(public reqService: ReqService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.value = this.name == 'entropy' ? this.reqService.entropy : this.reqService.duration
  }

  sliderChange(): void {
    if(this.name == "entropy")
    {
      this.reqService.entropy = this.value;
      // if(!this.entropyWarning) {
      //   let msg = "warning: altering the system's entropy may yield unexpected results"
      //   this.snackbar.open(msg, "ok", {panelClass: 'my-custom-snackbar'})
      //   this.entropyWarning = true;
      // }
    }
    else {
      this.reqService.duration = this.value;
    }
  }

  sliderValue()
  {
    return `${this.value}`;
  }
}

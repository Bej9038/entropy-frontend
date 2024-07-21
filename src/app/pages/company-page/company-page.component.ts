import {
  Component,
  ElementRef,
  Inject,
  ViewChild,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import WaveSurfer from "wavesurfer.js";
import {DOCUMENT} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {BottomLinksComponent} from "../../bottom-links/bottom-links.component";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-company-page',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    BottomLinksComponent,
    MatCard,
  ],
  templateUrl: './company-page.component.html',
  styleUrl: './company-page.component.css'
})
export class CompanyPageComponent implements AfterViewInit {
  // @ts-ignore
  @ViewChild('input') input: ElementRef;
  // @ts-ignore
  @ViewChild('waveform') waveform: ElementRef;
  wavesurfer: WaveSurfer | undefined
  rootStyle = getComputedStyle(this.document.documentElement);
  grey = this.rootStyle.getPropertyValue("--translucent-grey-2").trim()
  white = this.rootStyle.getPropertyValue("--white").trim()
  dark = this.rootStyle.getPropertyValue("--translucent-dark-1").trim()
  noColor = this.rootStyle.getPropertyValue("--none").trim()
  accent = this.rootStyle.getPropertyValue("--color-accent").trim()
  constructor(@Inject(DOCUMENT) private document: Document,
              private cd: ChangeDetectorRef) {}

  ngOnInit(){}

  ngAfterViewInit() {
    let height = 72
    let interact = false
    let cursorWidth = 0
    this.wavesurfer = WaveSurfer.create(
      {
        container: this.waveform.nativeElement,
        waveColor: this.accent,
        progressColor: this.noColor,
        cursorWidth: cursorWidth,
        barGap: 0,
        interact: interact,
        fillParent: true,
        sampleRate: 48000,
        height: height,
        dragToSeek: true,
        autoScroll: true
      }
    )
    this.wavesurfer.load("assets/company-page-waveform.wav")
    this.keepFocus()
  }

  keepFocus() {
    this.input.nativeElement.focus({ preventScroll: true })
    this.cd.detectChanges()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    if(this.wavesurfer)
    {
      this.wavesurfer.setOptions({})
    }
  }
}

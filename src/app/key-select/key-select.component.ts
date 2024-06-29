import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ReqService} from "../services/req.service";

interface Key {
  id: number;
  label: string;
}

@Component({
  selector: 'app-key-select',
  templateUrl: './key-select.component.html',
  styleUrls: ['./key-select.component.css']
})
export class KeySelectComponent implements OnInit {
  selectedKeyId: number = 7;
  sharpSelected = false;
  idKeyMap: Map<number, string> = new Map<number, string>();

  row1_large: Key[] = [
    { id: 0, label: 'C' },
    { id: 1, label: 'D' },
    { id: 2, label: 'E' },
    { id: 3, label: 'F' },
  ];
  row2_large: Key[] = [
    { id: 4, label: 'G' },
    { id: 5, label: 'A' },
    { id: 6, label: 'B' },
  ];
  row3_large: Key[] = [
    { id: 7, label: '_' },
  ];

  // row1_large: Key[] = [
  //   { id: 0, label: 'c' },
  //   { id: 1, label: 'd' },
  //   { id: 2, label: 'e' },
  //   { id: 3, label: 'f' },
  // ];
  // row2_large: Key[] = [
  //   { id: 4, label: 'g' },
  //   { id: 5, label: 'a' },
  //   { id: 6, label: 'b' },
  // ];
  // row3_large: Key[] = [
  //   { id: 7, label: '_' },
  // ];

  // row1_small: Key[] = [
  //   { id: 0, label: 'C' },
  //   { id: 1, label: 'D' },
  //   { id: 2, label: 'E' },
  // ];
  //
  // row2_small: Key[] = [
  //   { id: 3, label: 'F' },
  //   { id: 4, label: 'G' },
  //   { id: 5, label: 'A' },
  // ];
  //
  // row3_small: Key[] = [
  //   { id: 6, label: 'B' },
  //   { id: 7, label: 'B' },
  // ];

  row1 = this.row1_large
  row2 = this.row2_large
  row3 = this.row3_large

  // @ts-ignore
  @ViewChild("keyContainer", {read: ElementRef}) keyContainer: ElementRef;

  constructor(public reqService: ReqService) { }

  ngOnInit(): void {
    this.idKeyMap.set(0, "c")
    this.idKeyMap.set(1, "d")
    this.idKeyMap.set(2, "e")
    this.idKeyMap.set(3, "f")
    this.idKeyMap.set(4, "g")
    this.idKeyMap.set(5, "a")
    this.idKeyMap.set(6, "b")
    this.idKeyMap.set(7, "")
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event: Event): void {
  //   this.checkKeyContainerSize();
  // }
  // checkKeyContainerSize(): void {
  //   // const width = this.keyContainer.nativeElement.offsetWidth;
  //   // const minWidthThreshold = 296;
  //   // if (width < 296 && this.row1 == this.row1_large) {
  //   //   this.row1 = this.row1_small
  //   //   this.row2 = this.row2_small
  //   //   this.row3 = this.row3_small
  //   // }
  //   // else if (width >= 222 && this.row1 == this.row1_small) {
  //   //   this.row1 = this.row1_large
  //   //   this.row2 = this.row2_large
  //   //   this.row3 = this.row3_large
  //   // }
  // }


  selectButton(id: number): void {
    this.selectedKeyId = id;
    if(id == 7)
    {
        this.sharpSelected = false;
        this.reqService.key = "";
    }
    else {
        this.reqService.key = this.idKeyMap.get(id);
        if(this.sharpSelected) {
            if(id == 2 || id == 6) {
              this.sharpSelected = !this.sharpSelected;
            }
            else {
              this.reqService.key += "#"
            }
        }
    }
  }

  toggleSharp(): void {
    if(this.selectedKeyId != 7 && this.selectedKeyId != 2 && this.selectedKeyId != 6)
    {
      this.sharpSelected = !this.sharpSelected;
      if(this.sharpSelected) {
        this.reqService.key += "#"
      }
      else {
        this.reqService.key = this.reqService.key?.slice(0, -1)
      }
    }
  }
}

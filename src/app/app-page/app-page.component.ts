import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-app-page',
  templateUrl: './app-page.component.html',
  styleUrl: './app-page.component.css'
})
export class AppPageComponent implements OnInit{
  // @ts-ignore
  @ViewChild("navbar", { read: ElementRef }) navbarElement: ElementRef;
  // @ts-ignore
  @ViewChild("interface", { read: ElementRef }) interfaceElement: ElementRef;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.checkOverlap()
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkOverlap();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkOverlap();
  }

  checkOverlap() {
    let navbar = this.navbarElement.nativeElement
    let inter = this.interfaceElement.nativeElement

    if (navbar.offsetTop + navbar.offsetHeight > inter.offsetTop) {
      console.log("overlap")
      navbar.classList.add('invisible');
      navbar.classList.remove('opaque');
    }
    else if(navbar.offsetTop + navbar.offsetHeight < inter.offsetTop){
      navbar.classList.add('opaque');
      navbar.classList.remove('invisible');
    }
  }
}

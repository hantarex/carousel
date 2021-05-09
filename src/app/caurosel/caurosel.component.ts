import { Component, OnInit } from '@angular/core';
import {CarouselAnimation} from "./caurosel-animation";
import {of} from "rxjs";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-caurosel',
  templateUrl: './caurosel.component.html',
  styleUrls: ['./caurosel.component.sass'],
  animations: [
    CarouselAnimation
  ],
})
export class CauroselComponent implements OnInit {
  display: number[] = [0,1,2];

  slides = [
      1,
      2,
      3,
      4
  ];

  stop = false;

  constructor() {
    this.display = this.initView();
  }

  ngOnInit(): void {
  }


  sss(){
    this.stop = !this.stop;
    if(!this.stop) {
      this.test();
    }
  }

  test() {
    const max = this.slides.length;
    this.display = this.display.map(v => {
      const val = v + 1;
      if(val >= max){
        return 0;
      }
      return val;
    });
    console.log(this.display);
  }

  private initView():number[] {
    const len = this.slides.length;
    return [0, 1, 2];
  }

  checkInArray(array: number[], i: number) {
    return array.indexOf(i) !== -1;
  }

  getOrder(display: number[], number: number) {
    return this.slides.length - display.indexOf(number) -1;
  }

  animateDone($event) {
    of([]).pipe(
        delay(1)
    ).subscribe(() => {
      if(!this.stop) {
        this.test();
      }
    });
    console.log($event);
  }
}

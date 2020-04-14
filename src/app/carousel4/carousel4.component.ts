import { Component, OnInit } from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {concatMap, delay, flatMap, retry} from "rxjs/operators";
interface Carousel {
  val: any;
  position: number
}
@Component({
  selector: 'app-carousel4',
  templateUrl: './carousel4.component.html',
  styleUrls: ['./carousel4.component.sass']
})
export class Carousel4Component implements OnInit {
  slides = [
    0,
    1,
    2,
    3
  ];
  offset = 300; // Длинна карусели
  carouselLength = 50;
  stepMax = 30;
  step = this.stepMax;
  when_certain_condition = false;
  forcePosition$: Observable<null>;
  carousel: Carousel[] = [];
  stop$: Observable<null>;
  constructor() {
    this.init();
    this.forcePosition$ = of([]).pipe(
        concatMap( item => of(item).pipe ( delay( 1000 ) )),
        flatMap(v => {
          this.reCalcCarousel();
          if (!this.when_certain_condition) {
            return throwError('retry');
          } else {
            return null;
          }
        }),
        retry(),
    );
  }

  init(){
    for(let i = 0; i < this.carouselLength; i++){
      this.carousel.push({
        val: this.slides[i % this.slides.length],
        position: this.calcPosition(this.offset / this.carouselLength * i),
      });
    }
  }

  reCalcCarousel(){
    this.carousel.map(val => {
      val.position = this.calcPosition(val.position);
    })
  }

  calcPosition(position: number){
    position = position + this.step;
    if(position > 100 + (this.offset - 100) / 2){
      position = position - this.offset;
    }
    return position;
  }

  ngOnInit(): void {
  }

  stop() {
    this.stop$ = of([]).pipe(
        concatMap( item => of(item).pipe ( delay( 1000 ) )),
        flatMap(v => {
          if (this.step != 0) {
            this.step -= 1;
            return throwError('retry');
          } else {
            return null;
          }
        }),
        retry(),
    );
  }

  start() {
    this.step = 30;
  }

  setProperties(div: HTMLElement, from: any, to: any) {
    console.log(div.style.setProperty('--from', from + 'px'));
    console.log(div.style.setProperty('--to', to + 'px'));
  }
}

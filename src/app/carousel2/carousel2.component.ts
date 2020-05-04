import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit, QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {concatMap, delay, flatMap, retry, tap} from "rxjs/operators";

interface Carousel {
  val: any;
  position: number
}

@Component({
  selector: 'app-carousel2',
  templateUrl: './carousel2.component.html',
  styleUrls: ['./carousel2.component.sass']
})

export class Carousel2Component implements OnInit, AfterViewInit {
  slides = [
    0,
    1,
    2,
    3
  ];
  offset = 300; // Длинна карусели
  test$: Observable<null>;
  carouselLength = 50;
  stepMax = 30;
  step = this.stepMax;
  when_certain_condition = false;
  forcePosition$: Observable<null>;
  carousel: Carousel[] = [];
  stop$: Observable<null>;

  constructor(
      private cdr: ChangeDetectorRef,
  ) {

    this.init();
    this.forcePosition$ = of([]).pipe(
        concatMap( item => of(item).pipe ( delay( 1000 ) )),
        flatMap(v => {
          // this.reCalcCarousel();
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
    // this.carousel.map(val => {
    //   val.position = this.calcPosition(val.position);
    // })
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
    // this.stop$ = of([]).pipe(
        // concatMap( item => of(item).pipe ( delay( 1000 ) )),
        // flatMap(v => {
        //   if (this.step != 0) {
        //     this.step -= 1;
        //     return throwError('retry');
        //   } else {
        //     return null;
        //   }
        // }),
        // retry(),
    // );
  }

  fn(index, item){
    return index;
  }

  start() {
    this.step = 30;
  }

    log() {
        console.log("ok");
    }

  ngAfterViewInit(): void {
  }
}

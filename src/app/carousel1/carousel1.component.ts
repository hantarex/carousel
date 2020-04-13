import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {buffer, bufferCount, concatMap, delay, flatMap, map, retry, tap} from "rxjs/operators";
import {CarouselAnimation1} from "../caurosel/caurosel-animation";

@Component({
  selector: 'app-carousel1',
  templateUrl: './carousel1.component.html',
  styleUrls: ['./carousel1.component.sass'],
  animations: [
    CarouselAnimation1
  ],
})
export class Carousel1Component implements OnInit {

  startPosition = 0;
  slides = [
    0,
    1,
    2,
    3
  ];

  currentSlide = null;

  forcePosition$: Observable<null>;

  when_certain_condition = false;
  currentEmit$ = new BehaviorSubject([0, 1, 2, 3, 4]);

  slides$: Observable<number>;

  constructor() {
    this.forcePosition$ = of([]).pipe(
        concatMap( item => of(item).pipe ( delay( 1000 ) )),
        flatMap(v => {
          this.startPosition = (this.startPosition + 100 / 5) % 100;
          // const val = this.currentEmit$.value;
          // val.push(v);
          // val.shift();
          // this.currentEmit$.next(val);
          if (!this.when_certain_condition) {
            return throwError('retry');
          } else {
            return null;
          }
        }),
        retry(),
    );
    this.slides$ = of(...this.slides).pipe(
        concatMap( item => of(item).pipe ( delay( 1000 ) )),
        flatMap(v => {
          // const val = this.currentEmit$.value;
          // val.push(v);
          // val.shift();
          // this.currentEmit$.next(val);
          if (this.when_certain_condition || v === this.slides[this.slides.length-1]) {
            return throwError('retry');
          } else {
            return of(v);
          }
        }),
        retry(),
    );
  }

  ngOnInit(): void {
  }

  test() {

  }

  getPosition(index){
    return Math.round(  index * (100/5) + this.startPosition);
  }

  setCurrentSlide(slide: any){
    this.currentSlide = slide;
  }
}

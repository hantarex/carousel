import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of, throwError} from "rxjs";
import {testAnimation} from "../caurosel/caurosel-animation";
import {Linear, TimelineMax, Bounce, TweenLite, TimelineLite, Power4, TweenMax} from "gsap";
import {concatMap, delay, filter, first, flatMap, retry, tap} from "rxjs/operators";
import "gsap/dist/gsap.min";
import {CustomEase} from "gsap/CustomEase.js";

interface Carousel {
  val: any;
  position: number
}

@Component({
  selector: 'app-carousel5',
  templateUrl: './carousel5.component.html',
  styleUrls: ['./carousel5.component.sass'],
  animations: [
    testAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Carousel5Component implements OnInit {
  slides = [];
  target = 1;
  startCountdown = false;
  beginCountdown = false;
  tl: TimelineLite;
  offset = 300; // Длинна карусели
  carouselLength: number;
  currentValue: {val: any} = {val: null};
  stepMax = 30;
  speed = 5;
  startCountDown$ = new BehaviorSubject<boolean>(false);
  carouselSlowStop$: Observable<null>;
  step = this.stepMax;
  when_certain_condition = false;
  forcePosition$: Observable<null>;
  carousel: Carousel[] = [];
  carouselBatch$ = new BehaviorSubject<Carousel[][]>([]);
  stop$: Observable<null>;
  start$: Observable<null>;
  width: number;
  timeScale = 1;
  delay = 500;
  initAnim = false;
  widthStep: number = 1;
  s = null;
  startCarousel$ = new BehaviorSubject(null);
  runCarousel$: Observable<null>;
  counter = 0;
  @ViewChild('container', {static: true}) container: ElementRef<HTMLDivElement>;
  @ViewChild('batch', {static: true}) batch: ElementRef<HTMLDivElement>;
  private stopVar = false;
  private startFrom: number;
  constructor(
      private cdr:ChangeDetectorRef,
  ) {
    let start$ = of([]).pipe(
        concatMap( item => of(item).pipe ( delay( 100 ) )),
        flatMap(v => {
          if (this.tl.timeScale() < 0.98) {
            this.timeScale+=0.01;
            this.tl.timeScale(this.timeScale);
            return throwError('retry');
          } else {
            this.timeScale = 1;
            this.tl.timeScale(this.timeScale);
            return of(null);
          }
        }),
        retry(),
    );
    let stop$ = this.startCountDown$.pipe(
        filter(val => val),
        tap(() => {
          if(this.timeScale === 1){
            this.timeScale-=0.01;
            this.tl.timeScale(this.timeScale);
            console.log("aaaa");
          }
        }),
        concatMap( item => of(item).pipe ( delay( this.delay ) )),
        flatMap(v => {
          if (this.timeScale > 0.03) {
            this.timeScale-=0.01;
            this.tl.timeScale(this.timeScale);
            return throwError('retry');
          } else {
            this.stopVar = true;
            return of(null);
          }
        }),
        retry(),
    );

    this.runCarousel$ = this.startCarousel$.pipe(
        filter(val => val !== null),
        tap(val => {
          this.timeScale = 0;
          console.log("new start ", val, this.tl.timeScale());
        }),
      concatMap(() => {
        this.stopVar = false;
        this.startCountdown = false;
        this.startCountDown$.next(false);
        return start$;
      }),
      delay(1000),
      tap(() => {
        this.startCountdown = true;
      }),
      concatMap(() => {
        this.startCountdown = true;
        return stop$;
      })
    );

    for(let i = 0; i < 5; i ++){
      this.slides.push(i);
    }
    this.carouselLength = this.slides.length < 20 ? Math.ceil(20 / this.slides.length) * this.slides.length : this.slides.length; // кол-во элементов
    this.tl = new TimelineLite(
        {repeat: -1}
        );
    // this.carouselSlowStop$ = this.startCountDown$.pipe(
    //     filter(val => val),
    //     tap(() => {
    //       if(this.timeScale === 1){
    //         this.timeScale-=0.01;
    //         this.tl.timeScale(this.timeScale);
    //         console.log("aaaa");
    //       }
    //     }),
    //     concatMap( item => of(item).pipe ( delay( this.delay ) )),
    //     flatMap(v => {
    //       if (this.timeScale > 0.03) {
    //         this.timeScale-=0.01;
    //         this.tl.timeScale(this.timeScale);
    //         return throwError('retry');
    //       } else {
    //         this.stopVar = true;
    //         return of(null);
    //       }
    //     }),
    //     retry(),
    // );
    let v0 = (this.carouselLength * 2) / (this.speed * 2);
    let a = ((v0 - v0 * 0.01) - v0) / (this.delay / 1000);
    this.s = Math.floor(v0 * (this.delay / 1000) * 97 + a * Math.pow ((this.delay / 1000) * 97, 2) / 2);
    let startKey = this.carouselLength - this.s % (this.carouselLength * 2);
    this.startFrom = ((this.carouselLength + this.target + 1) - startKey - 2) % this.carouselLength;
    console.log(this.carouselLength, v0, a, this.s, startKey, this.startFrom);
  }

  fnSlow(x:number){
    console.log(x, x*x);
    return x*x;
  }

  init(){
    // this.width = this.container.nativeElement.offsetWidth;
    // this.widthStep = Math.round((this.width - (this.carouselLength * 100)) / (this.carouselLength - 1));
    this.width = this.carouselLength  * (this.widthStep + 5) - this.widthStep;
    for(let i = 0; i < this.carouselLength; i++){
      this.carousel.push({
        val: this.slides[i % this.slides.length],
        position: (5 + this.widthStep) * i,
      });
    }

    for(let i = 0; i < 2; i++){
      // let c = this.carousel.map((val, index) => {
      //   val.val = this.carousel[(index + i) % this.carousel.length].val;
      //   return {...val};
      // });
      // console.log(c);
      this.carouselBatch$.next([
        ...this.carouselBatch$.value,
        [...this.carousel]
      ]);
    }

    // this.tl.addLabel('val' + (this.carousel[(this.carousel.length - 1) / 2]), 0);
    // this.tl.addLabel('val1', 0);
    // this.tl.addLabel('val2', 0.3);
    // this.tl.addLabel('val3', 0.6);
    // this.tl.addLabel('val4', 1);
    // for (let i = 0; i < this.carousel.length; i++ ){
    //   this.tl.addLabel('run' + i, this.speed / this.carousel.length * i);
    // }
    // //
    // for (let i = 0; i < this.carousel.length; i++ ){
    //   this.tl.call(() => {
    //     console.log("aa");
    //   }, [], 'run' + i);
    // }

  }

  reCalcCarousel(){
    this.carousel.map(val => {
      val.position = this.calcPosition(val.position);
    })
  }

  calcPosition(position: number){
    position = position + this.widthStep + 100;
    // if(position > 100 + (this.offset - 100) / 2){
    //   position = position - this.offset;
    // }
    this.animate();
    return position;
  }

  ngOnInit(): void {
    this.init();
    // this.forcePosition$ = of([]).pipe(
    //     concatMap( item => of(item).pipe ( delay( 1000 ) )),
    //     flatMap(v => {
    //       // this.reCalcCarousel();
    //       this.animate(this.widthStep + 100);
    //       if (!this.when_certain_condition) {
    //         return throwError('retry');
    //       } else {
    //         return null;
    //       }
    //     }),
    //     // retry(),
    // );
  }

  stop() {
    this.startCountdown = true;
    // this.stop$ = of([]).pipe(
    //     concatMap( item => of(item).pipe ( delay( 100 ) )),
    //     flatMap(v => {
    //       if (this.tl.timeScale() > 0.1) {
    //         this.tl.timeScale(this.tl.timeScale() - 0.01);
    //         return throwError('retry');
    //       } else {
    //         this.stopVar = true;
    //         return of(null);
    //       }
    //     }),
    //     retry(),
    // );
  }

  start() {
    this.stopVar = false;
    this.startCountdown = false;
    this.startCountDown$.next(false);
    this.tl.play();
    this.start$ = of([]).pipe(
        concatMap( item => of(item).pipe ( delay( 100 ) )),
        flatMap(v => {
          if (this.tl.timeScale() < 0.98) {
            this.timeScale+=0.01;
            this.tl.timeScale(this.timeScale);
            return throwError('retry');
          } else {
            this.timeScale = 1;
            this.tl.timeScale(this.timeScale);
            return of(null);
          }
        }),
        retry(),
    );
  }

  trackBy(index, item){
    return index;
  }

  animate(position = this.widthStep + 100) {
    if(this.initAnim){
      return;
    }
    let menuItems = this.container.nativeElement.querySelectorAll(".batch");
    let cells: NodeListOf<HTMLDivElement> = this.container.nativeElement.querySelectorAll(".batch > .div");
    // cells.forEach(r => console.log(r));
    let l = this.batch.nativeElement.offsetWidth;
    cells[0].style.display = "inline-block";
    let w_c = cells[0].offsetWidth;
    let cel =  this.tl
        .set(cells[0], {x: 0, scale: 1}, 0)
        .to(cells[0], this.speed,{ x: l - w_c, ease: Power1.easeInOut}, 0)
        .to(cells[0], this.speed, {scale: 2,  duration: 1}, 0)
        .to(cells[0], 2.5, {scale: 1, duration: 2.5}, 2.5);
    // this.tl
    //     .add("zero")
    //     .set(menuItems[0], {x: 0}, "zero")
    //     .set(menuItems[0], {opacity: 0}, "zero")
    //     .add("test")
    //     .to(menuItems[0], this.speed, {x:  this.width + this.widthStep + 'vw', ease: Linear.easeNone}, "test")
    //     .to(menuItems[0], this.speed, {opacity: 1, ease:
    //           CustomEase.create("custom", "M0,0 C0.218,0 0.033,0.212 0.25,0.212 0.424,0.212 0.304,0 0.45,0 0.596,0 0.956,0.001 1,0 ")
    //     }, "test")
    //     .add("one");

        // .set(menuItems[1], {x: 0}, 0)
        // .to(menuItems[1], this.speed * 2, {x:  2 * this.width + 2 * this.widthStep + 'vw', ease: Linear.easeNone}, 0)

        // .set(menuItems[0], {x: - (this.width + this.widthStep) + 'vw'}, "one")
        // .to(menuItems[0], this.speed, {display: 'block', x:  0, ease: Linear.easeNone}, "one")
        // .to(menuItems[0], this.speed, {opacity: 0, ease: Linear.easeNone}, "one");

    // let tl =TweenLite.to(this.tl, 5, {timeScale:0, ease: Linear.easeNone});


    // for (let i = 0; i < this.carousel.length * 2; i++ ){
    //   this.tl.call((position) => {
    //     // console.log((this.carousel.length * 2 - i + 7) % (this.carousel.length))
    //     this.currentValue.val = this.carousel[(this.carousel.length * 2 - i + 8) % (this.carousel.length)].val;
    //     if(this.startCountdown && !this.startCountDown$.value){
    //       // let startVal = Math.ceil(99 / 2 / 4) % this.target * 2;
    //       // let startVal = parseInt(this.s) / Math.ceil(this.carouselLength * 2);
    //       if(this.currentValue.val === this.carousel[this.startFrom].val) {
    //         console.log("start ", this.currentValue.val);
    //         this.startCountDown$.next(true);
    //       }
    //     }
    //     if(this.timeScale < 100 && this.timeScale > 0.02 && this.startCountDown$.value){
    //       this.counter++;
    //       console.log(this.counter, this.currentValue.val);
    //     }
    //     if(this.stopVar && this.currentValue.val === this.target){
    //       this.timeScale = 0;
    //       this.tl.timeScale(this.timeScale);
    //     }
    //     this.cdr.detectChanges();
    //     // console.log(this.carousel[i % this.carousel.length]);
    //   }, [this.speed / this.carousel.length * i],  this.speed / this.carousel.length * i);
    // }
    this.initAnim = true;
    //
    // for (let i = 0; i < this.carousel.length; i++ ){
    //   this.tl.call(() => {
    //     console.log("aa");
    //   }, [], 'run' + i);
    // }

  }

  testRun(test: HTMLDivElement) {
    // TweenLite.to(test, 1, {x: 100});
    let tl = new TimelineMax({delay:0.5, repeat:3, repeatDelay:2});
    tl.to([test], 1, {x:250})
  }

  log() {
    console.log("log ", this.tl.timeScale());
  }

  newStart() {
    this.startCarousel$.next(1);
  }
}

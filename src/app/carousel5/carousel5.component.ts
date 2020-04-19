import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of, throwError} from "rxjs";
import {testAnimation} from "../caurosel/caurosel-animation";
import {Linear, TimelineMax} from "gsap";
import {concatMap, delay, filter, flatMap, retry, tap} from "rxjs/operators";
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
  slides = [
      0,
      1,
      2,
      3,
      4,
      // 5,
      // 6,
      // 7,
      // 8,
      // 9,
      // 10,
      // 11,
      // 12,
      // 13,
      // 14,
      // 15,
      // 16,
      // 17,
      // 18,
      // 19,
      // 20,
      // 21,
  ];
  startCountdown = false;
  beginCountdown = false;
  tl: TimelineMax;
  offset = 300; // Длинна карусели
  carouselLength = this.slides.length < 20 ? Math.ceil(20 / this.slides.length) * this.slides.length : this.slides.length; // кол-во элементов
  currentValue: {val: any} = {val: null};
  stepMax = 30;
  speed = 2;
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
  initAnim = false;
  widthStep: number = 1;
  @ViewChild('container', {static: true}) container: ElementRef;
  private stopVar = false;
  constructor(
      private cdr:ChangeDetectorRef,
  ) {
    this.tl = new TimelineMax(
        {repeat: -1}
        );
    this.carouselSlowStop$ = this.startCountDown$.pipe(
        filter(val => val),
        tap(() => {console.log("start slow stop")}),
        concatMap( item => of(item).pipe ( delay( 500 ) )),
        flatMap(v => {
          if (this.tl.timeScale() > 0.03) {
            this.tl.timeScale(this.tl.timeScale()-0.01);
            return throwError('retry');
          } else {
            this.stopVar = true;
            return of(null);
          }
        }),
        retry(),
    )
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
          if (this.tl.timeScale() < 1) {
            this.tl.timeScale(this.tl.timeScale() + 0.01);
            return throwError('retry');
          } else {
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
    console.log("anim");
    let menuItems = this.container.nativeElement.querySelectorAll(".batch");

    this.tl.set(menuItems[0], {x: 0});
    this.tl.to(menuItems[0], this.speed, {display: 'block', x:  this.width + this.widthStep + 'vw', ease: Linear.easeNone});

    this.tl.set(menuItems[1], {x: 0}, '-=' + this.speed);
    this.tl.to(menuItems[1], this.speed * 2, {display: 'block', x:  2 * this.width + 2 * this.widthStep + 'vw', ease: Linear.easeNone}, '-=' + this.speed);

    this.tl.set(menuItems[0], {x: - (this.width + this.widthStep) + 'vw'}, '-=' + this.speed);
    this.tl.to(menuItems[0], this.speed, {display: 'block', x:  0, ease: Linear.easeNone}, '-=' + this.speed);

    for (let i = 0; i < this.carousel.length * 2; i++ ){
      this.tl.call((position) => {

        // console.log((this.carousel.length * 2 - i + 7) % (this.carousel.length))
        this.currentValue.val = this.carousel[(this.carousel.length * 2 - i + 8) % (this.carousel.length)].val;
        if(this.startCountdown && !this.startCountDown$.value){
          let startVal = Math.ceil(105 * 5 / this.carousel.length * 2) % 3;
          if(this.currentValue.val === startVal)
            this.startCountDown$.next(true);
        }
        if(this.stopVar && this.currentValue.val === 3){
          this.tl.timeScale(0);
        }
        this.cdr.detectChanges();
        // console.log(this.carousel[i % this.carousel.length]);
      }, [this.speed / this.carousel.length * i],  this.speed / this.carousel.length * i);
    }
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
    console.log("log");
  }
}

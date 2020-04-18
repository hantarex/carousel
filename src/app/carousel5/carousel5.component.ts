import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {testAnimation} from "../caurosel/caurosel-animation";
import {Linear, TimelineMax} from "gsap";
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
  ];
  tl: TimelineMax;
  offset = 300; // Длинна карусели
  carouselLength = this.slides.length < 20 ? 20 : this.slides.length; // кол-во элементов
  currentValue = null;
  stepMax = 30;
  speed = 6;
  step = this.stepMax;
  when_certain_condition = false;
  forcePosition$: Observable<null>;
  carousel: Carousel[] = [];
  carouselBatch$ = new BehaviorSubject<Carousel[][]>([]);
  stop$: Observable<null>;
  width: number;
  widthStep: number = 1;
  @ViewChild('container', {static: true}) container: ElementRef;
  constructor() {
    this.tl = new TimelineMax(
        {repeat: -1}
        );
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
    // this.tl.add(() => {
    //   console.log("val1")
    // }, "val1");
    // this.tl.add(() => {
    //   console.log("val2")
    // }, "val2");
    // this.tl.add(() => {
    //   console.log("val3")
    // }, "val3");
    // this.tl.add(() => {
    //   console.log("val4")
    // }, "val4");
  }

  start() {
    this.tl.timeScale(this.tl.timeScale() + 0.1);
  }

  trackBy(index, item){
    return index;
  }

  animate(position = this.widthStep + 100) {
    console.log("anim");
    let menuItems = this.container.nativeElement.querySelectorAll(".batch");

    this.tl.set(menuItems[0], {x: 0});
    this.tl.to(menuItems[0], this.speed, {display: 'block', x:  this.width + this.widthStep + 'vw', ease: Linear.easeNone});

    this.tl.set(menuItems[1], {x: 0}, '-=' + this.speed);
    this.tl.to(menuItems[1], this.speed * 2, {display: 'block', x:  2 * this.width + 2 * this.widthStep + 'vw', ease: Linear.easeNone}, '-=' + this.speed);

    this.tl.set(menuItems[0], {x: - (this.width + this.widthStep) + 'vw'}, '-=' + this.speed);
    this.tl.to(menuItems[0], this.speed, {display: 'block', x:  0, ease: Linear.easeNone}, '-=' + this.speed);

    for (let i = 0; i < this.carousel.length * 2; i++ ){
      this.tl.call(() => {
        this.currentValue = this.carousel[i % this.carousel.length].val;
        console.log(this.carousel[i % this.carousel.length]);
      }, [],  this.speed / this.carousel.length * i);
    }
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

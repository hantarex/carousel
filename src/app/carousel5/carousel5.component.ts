import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {concatMap, delay, flatMap, retry} from "rxjs/operators";
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
    3
  ];
  tl: TimelineMax;
  offset = 300; // Длинна карусели
  carouselLength = 9; // кол-во элементов
  stepMax = 30;
  speed = 4;
  step = this.stepMax;
  when_certain_condition = false;
  forcePosition$: Observable<null>;
  carousel: Carousel[] = [];
  carouselBatch: Carousel[][] = [];
  stop$: Observable<null>;
  width: number;
  widthStep: number;
  @ViewChild('container', {static: true}) container: ElementRef;
  constructor() {
    this.tl = new TimelineMax(
        {repeat: -1}
        );
  }

  init(){
    this.width = this.container.nativeElement.offsetWidth;
    this.widthStep = Math.round((this.width - (this.carouselLength * 100)) / (this.carouselLength - 1));
    console.log(this.widthStep);
    for(let i = 0; i < this.carouselLength; i++){
      this.carousel.push({
        val: this.slides[i % this.slides.length],
        position: (100 + this.widthStep) * i,
      });
    }
    for(let i = 0; i < 2; i++){
      this.carouselBatch.push(this.carousel);
    }

    // this.tl.addLabel('val' + (this.carousel[(this.carousel.length - 1) / 2]), 0);
    // this.tl.addLabel('val1', 0);
    // this.tl.addLabel('val2', 0.3);
    // this.tl.addLabel('val3', 0.6);
    // this.tl.addLabel('val4', 1);
    for (let i = 0; i < this.carousel.length; i++ ){
      this.tl.addLabel('run' + i, this.speed / this.carousel.length * i);
    }
    //
    // for (let i = 0; i < this.carousel.length; i++ ){
    //   this.tl.addCallback(() => {}, 0);
    // }

  }

  currentValue(value: any){
    console.log(value);
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
    this.forcePosition$ = of([]).pipe(
        concatMap( item => of(item).pipe ( delay( 1000 ) )),
        flatMap(v => {
          // this.reCalcCarousel();
          this.animate(this.widthStep + 100);
          if (!this.when_certain_condition) {
            return throwError('retry');
          } else {
            return null;
          }
        }),
        // retry(),
    );
  }

  trackBy(index, item: Carousel){
    return item.val;
  }

  stop() {
    this.tl.add(() => {
      console.log("val1")
    }, "val1");
    this.tl.add(() => {
      console.log("val2")
    }, "val2");
    this.tl.add(() => {
      console.log("val3")
    }, "val3");
    this.tl.add(() => {
      console.log("val4")
    }, "val4");
  }

  start() {
    this.tl.timeScale(this.tl.timeScale() + 0.1);
  }


  animate(position = this.widthStep + 100) {
    let menuItems = this.container.nativeElement.querySelectorAll(".batch");

    this.tl.set(menuItems[0], {x: 0});
    this.tl.to(menuItems[0], this.speed, {display: 'block', x:  this.width + this.widthStep, ease: Linear.easeNone});

    this.tl.set(menuItems[1], {x: 0}, '-=' + this.speed);
    this.tl.to(menuItems[1], this.speed * 2, {display: 'block', x:  2 * this.width + 2 * this.widthStep, ease: Linear.easeNone}, '-=' + this.speed);

    this.tl.set(menuItems[0], {x: - (this.width + this.widthStep)}, '-=' + this.speed);
    this.tl.to(menuItems[0], this.speed, {display: 'block', x:  0, ease: Linear.easeNone}, '-=' + this.speed);

  }

  testRun(test: HTMLDivElement) {
    // TweenLite.to(test, 1, {x: 100});
    let tl = new TimelineMax({delay:0.5, repeat:3, repeatDelay:2});
    tl.to([test], 1, {x:250})
  }
}

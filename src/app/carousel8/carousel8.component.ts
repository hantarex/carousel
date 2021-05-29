import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Linear, TimelineMax, Bounce, TweenLite, TimelineLite, Power4, TweenMax, gsap, Back, Power0} from "gsap";
import "gsap/dist/gsap.min";
import {of, throwError} from "rxjs";
import {concatMap, delay, flatMap, retry} from "rxjs/operators";

@Component({
  selector: 'app-carousel8',
  templateUrl: './carousel8.component.html',
  styleUrls: ['./carousel8.component.scss']
})
export class Carousel8Component implements OnInit {
  @ViewChild("input") input: ElementRef<HTMLInputElement>;
  rawSequence: gsap.core.Timeline;
  seamlessLoop: gsap.core.Timeline;
  total = 31;
  target = 15;
  stopFrom = 5;
  scrub: gsap.core.Tween;
  trigger:any;
  iteration = 0;
  spacing = 0.5;
  speed = 5;
  snap: (snapConfig: number) => number = gsap.utils.snap(this.spacing);
  stop: boolean = null;
  stopped: boolean = null;
  trueSeq = false;

  constructor() {

  }

  ngOnInit(): void {
    const cards = gsap.utils.toArray('.cards li');
    this.seamlessLoop = this.buildSeamlessLoop(cards, this.spacing);
    // this.scrub = gsap.to(this.seamlessLoop, { // we reuse this tween to smoothly scrub the playhead on the seamlessLoop
    //   totalTime: 0,
    //   duration: this.speed,
    //   ease: "power3",
    //   paused: false
    // });
    // let start$ = of([]).pipe(
    //     concatMap( item => of(item).pipe ( delay( 100 ) )),
    //     flatMap(v => {
    //       if(this.stop === true) {
    //         return of(null);
    //       }
    //       this.seamlessLoop.tweenTo('label' + (this.iteration % 31), {duration: 0.1});
    //       this.iteration++;
    //       // this.iteration ++;
    //       // this.scrub.vars.totalTime = this.snap(this.iteration);
    //       // this.scrub.invalidate().restart();
    //       return throwError('retry');
    //     }),
    //     retry(),
    // );
    // start$.subscribe();
    // this.trigger = ScrollTrigger.create({
    //   start: 0,
    //   onUpdate: self => {
    //     // console.log(self.progress, self.direction, self.wrapping);
    //     if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
    //       this.wrapForward(self);
    //     } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
    //       this.wrapBackward(self);
    //     } else {
    //       this.scrub.vars.totalTime = this.snap((this.iteration + self.progress) * this.seamlessLoop.duration());
    //       this.scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween. No need for overwrites or creating a new tween on each update.
    //       self.wrapping = false;
    //     }
    //   },
    //   end: "+=3000",
    //   pin: ".gallery"
    // })
  }

  // wrapForward(trigger) { // when the ScrollTrigger reaches the end, loop back to the beginning seamlessly
  //   this.iteration++;
  //   trigger.wrapping = true;
  //   trigger.scroll(trigger.start + 1);
  // }

  // wrapBackward(trigger) { // when the ScrollTrigger reaches the start again (in reverse), loop back to the end seamlessly
  //   this.iteration--;
  //   if (this.iteration < 0) { // to keep the playhead from stopping at the beginning, we jump ahead 10 iterations
  //     this.iteration = 9;
  //     this.seamlessLoop.totalTime(this.seamlessLoop.totalTime() + this.seamlessLoop.duration() * 10);
  //     this.scrub.pause(); // otherwise it may update the totalTime right before the trigger updates, making the starting value different than what we just set above.
  //   }
  //   trigger.wrapping = true;
  //   trigger.scroll(trigger.end - 1);
  // }

  buildSeamlessLoop(items, spacing) {
    let overlap = Math.ceil(1 / spacing), // number of EXTRA animations on either side of the start/end to accommodate the seamless looping 10
        startTime = items.length * spacing + 0.5, // время когда карусель по анимации инициализированна
        loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the start Time 5.1
        l = items.length + overlap * 2,
        time = 0,
        i, index, item;
      this.rawSequence = gsap.timeline({
        paused: true,
        onStart() {
          console.log("start");
        },
        onComplete() {
          console.log("onComplete");
        },
      }); // Анимация увеличения и перехода
      const self = this;
      this.seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the raw Sequence so that it appears to seamlessly loop
          paused: false,
          repeat: -1, // to accommodate infinite scrolling/looping
          onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
            console.log("repeat");
            this._time === this._dur && (this._tTime += this._dur - 0.01);
          },
        });

    // set initial state of items
    gsap.set(items, {xPercent: 400, opacity: 0,	scale: 0});

    // now loop through and create all the animations in a staggered fashion. Remember, we must create EXTRA animations at the end to accommodate the seamless looping.
    for (i = 0; i < l; i++) {
      index = i % items.length;
      item = items[index];
      time = i * spacing;
      this.rawSequence.fromTo(item, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, zIndex: 100, duration: this.speed / 4, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false}, time)
          .fromTo(item, {xPercent: 400}, {xPercent: -400, duration: this.speed / 2, ease: "none", immediateRender: false}, time).call(this.callback, [(index+5) % items.length, time, item]);
      i <= items.length && this.seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
    }
    //
    // // here's where we set up the scrubbing of the playhead to make it appear seamless.
    this.rawSequence.time(startTime, true);
    this.seamlessLoop
        .to(this.rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: "none",
          onStart: () => {
            console.log("start");
            this.trueSeq = true;
          },
          onRepeat: () => {
            console.log("onRepeat1");
            this.trueSeq = false;
          },
    })
        .fromTo(this.rawSequence, {time: overlap * spacing + 1}, {
      time: startTime,
      duration: startTime - (overlap * spacing + 1),
          onStart: () => {
            console.log("start1");
            this.trueSeq = true;
          },
          onComplete: () => {
            console.log("finish1");
            this.trueSeq = false;
          },
          onRepeat: () => {
            console.log("onRepeat1");
            this.trueSeq = false;
          },
      ease: "none"
    });
    return this.seamlessLoop;
  }

  callback = (i: number, time: number, item: unknown) => {
    this.trueSeq && console.log(this.stopFrom, i, this.target);
    if(this.stopFrom === i && this.stop && this.stopped === null && this.trueSeq) {
      console.log('stop');
      this.seamlessLoop.tweenTo('label' + this.target, {duration: 2, ease: "Power0.easeNone"});
      this.stopped = true;
    }
    // console.log(i, time, this.seamlessLoop.timeScale());
    return true;
  }

  // scrubTo(totalTime) { // moves the scroll position to the place that corresponds to the totalTime value of the seamlessLoop, and wraps if necessary.
  //   let progress = (totalTime - this.seamlessLoop.duration() * this.iteration) / this.seamlessLoop.duration();
  //   if (progress > 1) {
  //     this.wrapForward(this.trigger);
  //   } else if (progress < 0) {
  //     this.wrapBackward(this.trigger);
  //   } else {
  //     this.trigger.scroll(this.trigger.start + progress * (this.trigger.end - this.trigger.start));
  //   }
  // }
  //
  test() {
    this.stop = true;
    // test.to(this.seamlessLoop, {time:3.1, ease:Quad.easeOut, duration: 4})
    // this.seamlessLoop.tweenTo('label31', {duration: 2, ease: "Power0.easeNone"})
  }
  //
  // prev() {
  //   // console.log( this.scrub.vars.totalTime);
  //   const totalTime = this.scrub.vars.totalTime + this.spacing;
  //   let progress = (totalTime - this.seamlessLoop.duration() * this.iteration) / this.seamlessLoop.duration();
  //   this.scrub.vars.totalTime = this.snap((this.iteration + progress) * this.seamlessLoop.duration());
  //   this.scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween. No need for overwrites or creating a new tween on each update.
  //   this.iteration++;
  //   // this.scrubTo(this.scrub.vars.totalTime - this.spacing)
  // }
  //
  // next() {
  //   this.scrubTo(this.scrub.vars.totalTime + this.spacing)
  // }
  to() {
    console.log(this.input.nativeElement.value);
    this.seamlessLoop.tweenTo('label' + this.input.nativeElement.value, {duration: 2, ease: "Power0.easeNone"});
  }

  onRepeat = () => {
    console.log(this.trueSeq);
    this.trueSeq = false;
  }
}

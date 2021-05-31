import { Component, OnInit } from '@angular/core';
import {Linear, TimelineMax, Bounce, TweenLite, TimelineLite, Power4, TweenMax, gsap, Back} from "gsap";
import "gsap/dist/gsap.min";

@Component({
  selector: 'app-carousel8',
  templateUrl: './carousel8.component.html',
  styleUrls: ['./carousel8.component.scss']
})
export class Carousel8Component implements OnInit {

  rawSequence: gsap.core.Timeline;
  seamlessLoop: gsap.core.Timeline;
  scrub: gsap.core.Tween;
  spacing = 0.1;
  speed = 2;
  onRepeat: boolean = false;
  target = 30;
  startFrom = 29;
  stopped = false;

  constructor() {

  }

  ngOnInit(): void {
    const cards = gsap.utils.toArray('.cards li');
    this.seamlessLoop = this.buildSeamlessLoop(cards, this.spacing);
    this.scrub = gsap.to(this.seamlessLoop, { // we reuse this tween to smoothly scrub the playhead on the seamlessLoop
      totalTime: 0,
      duration: this.speed,
      ease: "power3",
      paused: true
    });
  }


  buildSeamlessLoop(items, spacing) {
    let overlap = Math.ceil(1 / spacing), // number of EXTRA animations on either side of the start/end to accommodate the seamless looping 10
        startTime = items.length * spacing, // the time on the raw Sequence at which we'll start the seamless loop 3.6
        loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the start Time 5.1
        l = items.length + overlap * 2,
        time = 0,
        i, index, item;
      const self = this;
      this.rawSequence = gsap.timeline({paused: true}); // this is where all the "real" animations live
      this.seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the raw Sequence so that it appears to seamlessly loop
          paused: false,
          repeat: 2, // to accommodate infinite scrolling/looping
          onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
            this._time === this._dur && (this._tTime += this._dur - 0.01);
            console.log("onRepeat");
            self.onRepeat = true;
          },
        });

    // set initial state of items
    gsap.set(items, {xPercent: 400, opacity: 0,	scale: 0});
    console.log((this.speed / 2) / spacing);
    // now loop through and create all the animations in a staggered fashion. Remember, we must create EXTRA animations at the end to accommodate the seamless looping.
    for (i = 0; i < l; i++) {
      index = i % items.length;
      item = items[index];
      time = i * spacing;
      // console.log((index+5) % items.length, time + this.speed / 2);
      this.rawSequence.fromTo(item, {scale: 1, opacity: 1}, {scale: 1, opacity: 1, zIndex: 100, duration: this.speed / 4, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false}, time)
          .fromTo(item, {xPercent: 400}, {
            xPercent: -400, duration: this.speed / 2, ease: "none", immediateRender: false,
            // onStart: self.callback,
            // onStartParams: [(index+5) % items.length, time]
          }, time)
          .call(this.callback, [(index - Math.floor(((this.speed / 2) / spacing) / 2) + items.length) % items.length, time], time);
      i <= items.length && this.seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
    }
    //
    // // here's where we set up the scrubbing of the playhead to make it appear seamless.
    this.rawSequence.time(startTime, true);
    // console.log(loopTime, startTime, overlap * spacing + 1);
    // this.seamlessLoop
    //     .call(() => {
    //       this.onRepeat = false;
    //       console.log("start");
    //     })
    //     .to(this.rawSequence, {
    //       time: loopTime,
    //       duration: loopTime - startTime,
    //       ease: "none",
    //     })
    //     .call(() => {
    //       this.rawSequence.time(overlap * spacing + 1, true);
    //       // this.seamlessLoop.pause();
    //     })
    //     // .to(this.rawSequence, {
    //     //   time: overlap * spacing + 1,
    //     //   duration: loopTime - startTime,
    //     //   immediateRender: false,
    //     // })
    //     .fromTo(this.rawSequence, {time: overlap * spacing + 1}, {
    //       time: startTime,
    //       duration: startTime - (overlap * spacing + 1),
    //       immediateRender: false,
    //       ease: "none"
    //     });

    this.seamlessLoop.tweenTo('label0', {
      duration: 3,
      ease: "Expo.easeOut",
      onComplete: () => {
        console.log(self.seamlessLoop.time());
      }
    });
    return this.seamlessLoop;
  }

  callback = (i: number, time: number) => {
    if(this.onRepeat === false) {
      console.log(i, time, this.onRepeat);
      if(this.stopped === true && i === this.startFrom) {
        this.seamlessLoop.tweenTo('label' + this.target, {duration: 3, ease: "Expo.easeOut"})
      }
    }
    return true;
  };

  test() {
    this.stopped = true;
    // this.seamlessLoop.tweenTo('label3')
  }

}

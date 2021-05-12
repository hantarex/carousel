import { Component, OnInit } from '@angular/core';
import {Linear, TimelineMax, Bounce, TweenLite, TimelineLite, Power4, TweenMax, gsap, Back} from "gsap";

@Component({
  selector: 'app-carousel8',
  templateUrl: './carousel8.component.html',
  styleUrls: ['./carousel8.component.scss']
})
export class Carousel8Component implements OnInit {

  constructor() {

  }

  ngOnInit(): void {
    const spacing = 0.1,
        snap = gsap.utils.snap(spacing),
        cards = gsap.utils.toArray('.cards li'),
        seamlessLoop = this.buildSeamlessLoop(cards, spacing);
  }

  buildSeamlessLoop(items, spacing) {
    let overlap = Math.ceil(1 / spacing), // number of EXTRA animations on either side of the start/end to accommodate the seamless looping 10
        startTime = items.length * spacing + 0.5, // the time on the raw Sequence at which we'll start the seamless loop 3.6
        loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the start Time 5.1
        rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live
        seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the raw Sequence so that it appears to seamlessly loop
          paused: false,
          repeat: -1, // to accommodate infinite scrolling/looping
          onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
            this._time === this._dur && (this._tTime += this._dur - 0.01);
          }
        }),
        l = items.length + overlap * 2,
        time = 0,
        i, index, item;
    // set initial state of items
    gsap.set(items, {xPercent: 400, opacity: 0,	scale: 0});

    // now loop through and create all the animations in a staggered fashion. Remember, we must create EXTRA animations at the end to accommodate the seamless looping.
    for (i = 0; i < l; i++) {
      index = i % items.length;
      item = items[index];
      time = i * spacing;
      rawSequence.fromTo(item, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false}, time)
          .fromTo(item, {xPercent: 400}, {xPercent: -400, duration: 1, ease: "none", immediateRender: false}, time);
      i <= items.length && seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
    }
    //
    // // here's where we set up the scrubbing of the playhead to make it appear seamless.
    rawSequence.time(startTime);
    seamlessLoop
        .to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: "none"
    })
        .fromTo(rawSequence, {time: overlap * spacing + 1}, {
      time: startTime,
      duration: startTime - (overlap * spacing + 1),
      immediateRender: false,
      ease: "none"
    });
    return seamlessLoop;
  }

}

import { Component, OnInit } from '@angular/core';
import {gsap} from "gsap";
import "gsap/dist/gsap.min";
@Component({
  selector: 'app-carousel7',
  templateUrl: './carousel7.component.html',
  styleUrls: ['./carousel7.component.sass']
})
export class Carousel7Component implements OnInit {
  tl: gsap.core.Timeline;
  startFrom = 6;
  target = 1;
  stopped: boolean = false;

  constructor() {
    this.tl = gsap.timeline(
        {repeat: -1}
    );
  }

  ngOnInit(): void {
    const speed = 2;
    const padding = 100;
    const self = this;
    const cards = gsap.utils.toArray('.boxes .box');
    console.log(cards.length);
    this.tl
        .set(".box", {
          x: function(i) {
            self.tl.call(self.callback, [((cards.length - i)+5) % cards.length + 1], (speed / cards.length)*i + speed + 0.001);
            self.tl.add("label" + [((cards.length - i)+5) % cards.length + 1], (speed / cards.length)*i + speed + 0.001);
            return i * (50 + padding);
          },
          opacity: 0,
          scale: 1
        })
        // .to(".box", {
        //   ease: "none",
        //   x: "+=" + ((50 + padding)* cards.length), //move each box 500px to right
        //   modifiers: {
        //     x: (x, t:HTMLElement) => {
        //       return gsap.utils.unitize((x:string) => parseFloat(x) % ((50 + padding)* cards.length))(x);
        //     },
        //   },
        //   duration: speed,
        //   onRepeat: () => {
        //     console.log("repeat");
        //     this.tl.time(speed + 0.001, true);
        //   },
        //   repeat: -1,
        // })
        .to(".box", {
          scale: 3,
          opacity: 1,
          ease: "power1.in",
          stagger: {
            amount: speed - speed / cards.length,
            from: "end",
            repeat: -1,
            yoyo: true
          },
          duration: speed / 2,
        }, speed / cards.length);
    let item;
    for(let i = 0; i < cards.length; i++) {
      item = cards[i];
      this.tl.to(item, {

      })
    }

    this.tl.time(speed, true);
    this.tl.play();
  }

  callback = (i) => {
    if(this.stopped && i === this.startFrom) {
      this.tl.tweenTo("label" + this.target, {duration: 7, ease: "Expo.easeOut"});
    }
    console.log(i)
  }

  test() {
    this.stopped = true;
  }
}

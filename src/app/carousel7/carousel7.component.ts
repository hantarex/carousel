import { Component, OnInit } from '@angular/core';
import {Linear, TimelineMax, Bounce, TweenLite, TimelineLite, Power4, TweenMax, gsap, Back} from "gsap";
import {log} from "util";
@Component({
  selector: 'app-carousel7',
  templateUrl: './carousel7.component.html',
  styleUrls: ['./carousel7.component.sass']
})
export class Carousel7Component implements OnInit {
  tl: TimelineLite;
  constructor() {
    this.tl = new TimelineLite(
        {repeat: -1}
    );
  }

  ngOnInit(): void {
    this.tl
        .set(".box", {
          x: function(i) {
            return i * 70;
          },
        })
        .to(".box", 10, {
          ease: Linear.easeNone,
          x: "+=500", //move each box 500px to right
          // modifiers: {
          //   x: (x, t:HTMLElement) => {
          //     if((parseFloat(x) % 500) <= 2) {
          //       console.log(t.getBoundingClientRect());
          //     }
          //     return gsap.utils.unitize((x:string) => parseFloat(x) % 500)(x);
          //   },
          // },
          repeat: -1,
        })
        .to(".box", 10, {scale: 2, ease: Back.easeOut.config(10)}, 0)

    this.tl.play();
  }
}

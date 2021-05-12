import { Component, OnInit } from '@angular/core';
import {Linear, TimelineMax, Bounce, TweenLite, TimelineLite, Power4, TweenMax, gsap, Back} from "gsap";
import "gsap/dist/gsap.min";
import {CustomEase} from "gsap/CustomEase.js";
@Component({
  selector: 'app-carousel7',
  templateUrl: './carousel7.component.html',
  styleUrls: ['./carousel7.component.sass']
})
export class Carousel7Component implements OnInit {
  tl: TimelineLite;
  tlScale: TimelineLite;
  constructor() {
    this.tl = new TimelineLite(
        {repeat: -1}
    );
    this.tlScale = new TimelineLite(
        {repeat: -1}
    );
  }

  ngOnInit(): void {
    let cells = [];
    const speed = 1;
    const padding = 100;
    for (let i = 10; i >= 1; i--) {
      cells.push(".box-" + i);
    }
    this.tl
        .set(".box", {
          x: function(i) {
            return i * (50 + padding);
          },
        })
        .to(".box", speed, {
          ease: Linear.easeNone,
          x: "+=" + ((50 + padding)* 10), //move each box 500px to right
          modifiers: {
            x: (x, t:HTMLElement) => {
              return gsap.utils.unitize((x:string) => parseFloat(x) % ((50 + padding)* 10))(x);
            },
          },
          repeat: -1,
        })
        .to(".box", speed, {
          scale: 2,
          ease: CustomEase.create("custom", "M0,0 C0.126,0.382 0.283,1 0.5,1 0.686,1 0.9,0.346 1,0 "),
          stagger: {
            amount: speed - speed / 10,
            from: "end",
            repeat: -1,
          },
        }, speed / 10);
    // this.tl.staggerTo(cells, 10, {
    //   scale: 2,
    //   ease: CustomEase.create("custom", "M0,0 C0.126,0.382 0.283,1 0.5,1 0.686,1 0.9,0.346 1,0 "),
    //   repeat: -1,
    // }, 1, 1);

    this.tl.play();
  }
}

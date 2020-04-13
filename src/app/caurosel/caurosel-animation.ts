import {animate, group, keyframes, query, stagger, style, transition, trigger} from "@angular/animations";

export const CarouselAnimation =
    trigger('CarouselAnimation', [
        transition('* <=> *', [
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                })
            ],{ optional: true }),
            query(':enter', [
                style({
                    left: 0,
                })
            ],{ optional: true }),
            group([
                query(':enter', [
                    animate('5s', style({left: '25%'}))
                ],{ optional: true }),
                query(':leave', [
                    animate('5s', style({left: '100%'}))
                ],{ optional: true }),
            ])
        ]),
    ]);

export const CarouselAnimation1 =
    trigger('CarouselAnimation1', [
        transition('* <=> *', [
            query('.div', [
                animate('0.5s', style({left: '25%'}))
            ],{ optional: true }),
        ]),
    ]);
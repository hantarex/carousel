import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Carousel7RoutingModule } from './carousel7-routing.module';
import { Carousel7Component } from './carousel7.component';


@NgModule({
  declarations: [Carousel7Component],
  imports: [
    CommonModule,
    Carousel7RoutingModule
  ]
})
export class Carousel7Module { }

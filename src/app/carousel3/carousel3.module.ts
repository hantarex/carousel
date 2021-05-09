import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Carousel3RoutingModule } from './carousel3-routing.module';
import { Carousel3Component } from './carousel3.component';


@NgModule({
  declarations: [Carousel3Component],
  imports: [
    CommonModule,
    Carousel3RoutingModule
  ]
})
export class Carousel3Module { }

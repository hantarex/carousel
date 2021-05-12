import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Carousel8RoutingModule } from './carousel8-routing.module';
import { Carousel8Component } from './carousel8.component';


@NgModule({
  declarations: [Carousel8Component],
  imports: [
    CommonModule,
    Carousel8RoutingModule
  ]
})
export class Carousel8Module { }

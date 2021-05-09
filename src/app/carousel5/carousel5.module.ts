import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Carousel5RoutingModule } from './carousel5-routing.module';
import { Carousel5Component } from './carousel5.component';


@NgModule({
  declarations: [Carousel5Component],
  imports: [
    CommonModule,
    Carousel5RoutingModule
  ]
})
export class Carousel5Module { }

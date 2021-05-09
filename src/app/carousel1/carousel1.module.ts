import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Carousel1RoutingModule } from './carousel1-routing.module';
import { Carousel1Component } from './carousel1.component';


@NgModule({
  declarations: [Carousel1Component],
  imports: [
    CommonModule,
    Carousel1RoutingModule
  ]
})
export class Carousel1Module { }

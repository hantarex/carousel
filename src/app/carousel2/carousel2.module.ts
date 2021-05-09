import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Carousel2RoutingModule } from './carousel2-routing.module';
import { Carousel2Component } from './carousel2.component';


@NgModule({
  declarations: [Carousel2Component],
  imports: [
    CommonModule,
    Carousel2RoutingModule
  ]
})
export class Carousel2Module { }

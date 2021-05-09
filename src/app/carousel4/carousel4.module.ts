import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Carousel4RoutingModule } from './carousel4-routing.module';
import { Carousel4Component } from './carousel4.component';


@NgModule({
  declarations: [Carousel4Component],
  imports: [
    CommonModule,
    Carousel4RoutingModule
  ]
})
export class Carousel4Module { }

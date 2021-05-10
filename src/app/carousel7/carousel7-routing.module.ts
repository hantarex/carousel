import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Carousel7Component } from './carousel7.component';

const routes: Routes = [{ path: '', component: Carousel7Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Carousel7RoutingModule { }

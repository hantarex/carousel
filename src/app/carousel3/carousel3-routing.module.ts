import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Carousel3Component } from './carousel3.component';

const routes: Routes = [{ path: '', component: Carousel3Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Carousel3RoutingModule { }

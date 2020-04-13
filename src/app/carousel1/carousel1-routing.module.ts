import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Carousel1Component } from './carousel1.component';

const routes: Routes = [{ path: '', component: Carousel1Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Carousel1RoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Carousel8Component } from './carousel8.component';

const routes: Routes = [{ path: '', component: Carousel8Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Carousel8RoutingModule { }

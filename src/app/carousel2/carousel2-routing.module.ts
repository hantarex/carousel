import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Carousel2Component } from './carousel2.component';

const routes: Routes = [{ path: '', component: Carousel2Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Carousel2RoutingModule { }

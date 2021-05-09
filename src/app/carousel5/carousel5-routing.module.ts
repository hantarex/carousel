import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Carousel5Component } from './carousel5.component';

const routes: Routes = [{ path: '', component: Carousel5Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Carousel5RoutingModule { }

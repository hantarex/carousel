import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Carousel4Component } from './carousel4.component';

const routes: Routes = [{ path: '', component: Carousel4Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Carousel4RoutingModule { }

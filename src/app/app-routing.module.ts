import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    { path: 'carousel1', loadChildren: () => import('./caurosel/caurosel.module').then(m => m.CauroselModule) },
    { path: 'carousel2', loadChildren: () => import('./carousel1/carousel1.module').then(m => m.Carousel1Module) },
    { path: 'carousel3', loadChildren: () => import('./carousel2/carousel2.module').then(m => m.Carousel2Module) }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

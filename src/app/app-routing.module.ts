import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    { path: 'carousel1', loadChildren: () => import('./caurosel/caurosel.module').then(m => m.CauroselModule) },
    { path: 'carousel2', loadChildren: () => import('./carousel1/carousel1.module').then(m => m.Carousel1Module) },
    { path: 'carousel3', loadChildren: () => import('./carousel2/carousel2.module').then(m => m.Carousel2Module) },
    { path: 'carousel4', loadChildren: () => import('./carousel3/carousel3.module').then(m => m.Carousel3Module) },
    { path: 'carousel5', loadChildren: () => import('./carousel4/carousel4.module').then(m => m.Carousel4Module) },
    { path: 'carousel6', loadChildren: () => import('./carousel5/carousel5.module').then(m => m.Carousel5Module) },
    { path: 'carousel7', loadChildren: () => import('./carousel7/carousel7.module').then(m => m.Carousel7Module) },
    { path: 'carousel8', loadChildren: () => import('./carousel8/carousel8.module').then(m => m.Carousel8Module) },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

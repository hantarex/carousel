import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CauroselComponent } from './caurosel.component';

const routes: Routes = [{ path: '', component: CauroselComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CauroselRoutingModule { }

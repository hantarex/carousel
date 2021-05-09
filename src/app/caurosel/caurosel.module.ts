import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CauroselRoutingModule } from './caurosel-routing.module';
import { CauroselComponent } from './caurosel.component';
import {CarouselModule} from "angular-bootstrap-md";


@NgModule({
  declarations: [CauroselComponent],
    imports: [
        CommonModule,
        CauroselRoutingModule,
        CarouselModule
    ]
})
export class CauroselModule { }

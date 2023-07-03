import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FichaEventoPageRoutingModule } from './ficha-evento-routing.module';

import { FichaEventoPage } from './ficha-evento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FichaEventoPageRoutingModule
  ],
  declarations: [FichaEventoPage]
})
export class FichaEventoPageModule {}

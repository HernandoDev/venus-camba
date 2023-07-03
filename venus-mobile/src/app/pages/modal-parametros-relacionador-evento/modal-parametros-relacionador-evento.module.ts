import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalParametrosRelacionadorEventoPageRoutingModule } from './modal-parametros-relacionador-evento-routing.module';

import { ModalParametrosRelacionadorEventoPage } from './modal-parametros-relacionador-evento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalParametrosRelacionadorEventoPageRoutingModule
  ],
  declarations: [ModalParametrosRelacionadorEventoPage]
})
export class ModalParametrosRelacionadorEventoPageModule {}

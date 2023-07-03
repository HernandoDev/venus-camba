import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalUsuarioQrEventoPageRoutingModule } from './modal-usuario-qr-evento-routing.module';

import { ModalUsuarioQrEventoPage } from './modal-usuario-qr-evento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalUsuarioQrEventoPageRoutingModule
  ],
  declarations: [ModalUsuarioQrEventoPage]
})
export class ModalUsuarioQrEventoPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAgregarInvitadoPageRoutingModule } from './modal-agregar-invitado-routing.module';

import { ModalAgregarInvitadoPage } from './modal-agregar-invitado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAgregarInvitadoPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ModalAgregarInvitadoPage]
})
export class ModalAgregarInvitadoPageModule {}

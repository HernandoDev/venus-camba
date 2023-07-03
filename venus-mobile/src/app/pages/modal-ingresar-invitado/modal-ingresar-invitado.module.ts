import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalIngresarInvitadoPageRoutingModule } from './modal-ingresar-invitado-routing.module';

import { ModalIngresarInvitadoPage } from './modal-ingresar-invitado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalIngresarInvitadoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalIngresarInvitadoPage]
})
export class ModalIngresarInvitadoPageModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalIngresarInvitadoPage } from './modal-ingresar-invitado.page';

const routes: Routes = [
  {
    path: '',
    component: ModalIngresarInvitadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalIngresarInvitadoPageRoutingModule {}

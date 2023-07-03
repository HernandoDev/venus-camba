import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalUsuarioQrEventoPage } from './modal-usuario-qr-evento.page';

const routes: Routes = [
  {
    path: '',
    component: ModalUsuarioQrEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalUsuarioQrEventoPageRoutingModule {}

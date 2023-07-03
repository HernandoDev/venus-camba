import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalParametrosRelacionadorEventoPage } from './modal-parametros-relacionador-evento.page';

const routes: Routes = [
  {
    path: '',
    component: ModalParametrosRelacionadorEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalParametrosRelacionadorEventoPageRoutingModule {}

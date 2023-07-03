import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaInvitadosPage } from './lista-invitados.page';

const routes: Routes = [
  {
    path: '',
    component: ListaInvitadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaInvitadosPageRoutingModule {}

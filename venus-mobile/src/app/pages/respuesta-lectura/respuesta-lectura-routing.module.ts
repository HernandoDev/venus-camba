import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RespuestaLecturaPage } from './respuesta-lectura.page';

const routes: Routes = [
  {
    path: '',
    component: RespuestaLecturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RespuestaLecturaPageRoutingModule {}

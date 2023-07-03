import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FichaEventoPage } from './ficha-evento.page';

const routes: Routes = [
  {
    path: '',
    component: FichaEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FichaEventoPageRoutingModule {}

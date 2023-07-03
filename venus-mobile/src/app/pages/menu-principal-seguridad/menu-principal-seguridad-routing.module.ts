import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPrincipalSeguridadPage } from './menu-principal-seguridad.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPrincipalSeguridadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPrincipalSeguridadPageRoutingModule {}

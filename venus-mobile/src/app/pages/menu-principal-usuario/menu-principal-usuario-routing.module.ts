import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPrincipalUsuarioPage } from './menu-principal-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPrincipalUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPrincipalUsuarioPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeGuardiaPage } from './home-guardia.page';

const routes: Routes = [
  {
    path: '',
    component: HomeGuardiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeGuardiaPageRoutingModule {}

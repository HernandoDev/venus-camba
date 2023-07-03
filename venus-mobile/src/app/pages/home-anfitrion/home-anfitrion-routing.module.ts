import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeAnfitrionPage } from './home-anfitrion.page';

const routes: Routes = [
  {
    path: '',
    component: HomeAnfitrionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeAnfitrionPageRoutingModule {}

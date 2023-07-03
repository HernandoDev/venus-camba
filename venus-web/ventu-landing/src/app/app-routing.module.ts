import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuyProntoComponent } from './shared/pages/muy-pronto/muy-pronto.component';

const routes: Routes = [

  {
    path: '',
    loadChildren: () =>
      import('./modules/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '**',
    loadChildren: () =>
    import('./modules/landing/landing.module').then((m) => m.LandingModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppNotfoundComponent} from './pages/app.notfound.component';
import {AppErrorComponent} from './pages/app.error.component';
import {AppAccessdeniedComponent} from './pages/app.accessdenied.component';
import {AppLoginComponent} from './pages/app.login.component';

const routes: Routes = [
    {
        path: 'host',
        loadChildren: () => import('./modules/host/host.module').then(m => m.HostModule)
    },
    {
        path: '',
        component: AppLoginComponent
    },
    {
        path: 'notfound',
        component: AppNotfoundComponent
    },
    {
        path: 'error',
        component: AppErrorComponent
    },
    {
        path: 'accessdenied',
        component: AppAccessdeniedComponent
    },
    {
        path: '**',
        redirectTo: '/notfound'
    }
  ];
@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

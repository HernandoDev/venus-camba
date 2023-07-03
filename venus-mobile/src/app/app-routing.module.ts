/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'menu-principal-seguridad',
    loadChildren: () => import('./pages/menu-principal-seguridad/menu-principal-seguridad.module').then( m => m.MenuPrincipalSeguridadPageModule)
  },
  {
    path: 'menu-principal-usuario',
    loadChildren: () => import('./pages/menu-principal-usuario/menu-principal-usuario.module').then( m => m.MenuPrincipalUsuarioPageModule)
  },
  {
    path: 'respuesta-lectura',
    loadChildren: () => import('./pages/respuesta-lectura/respuesta-lectura.module').then( m => m.RespuestaLecturaPageModule)
  },
  {
    path: 'lista-eventos',
    loadChildren: () => import('./pages/lista-eventos/lista-eventos.module').then( m => m.ListaEventosPageModule)
  },
  {
    path: 'ficha-evento',
    loadChildren: () => import('./pages/ficha-evento/ficha-evento.module').then( m => m.FichaEventoPageModule)
  },
  {
    path: 'lista-invitados',
    loadChildren: () => import('./pages/lista-invitados/lista-invitados.module').then( m => m.ListaInvitadosPageModule)
  },
  {
    path: 'modal-agregar-invitado',
    loadChildren: () => import('./pages/modal-agregar-invitado/modal-agregar-invitado.module').then( m => m.ModalAgregarInvitadoPageModule)
  },  {
    path: 'modal-ingresar-invitado',
    loadChildren: () => import('./pages/modal-ingresar-invitado/modal-ingresar-invitado.module').then( m => m.ModalIngresarInvitadoPageModule)
  },
  {
    path: 'modal-usuario-qr-evento',
    loadChildren: () => import('./pages/modal-usuario-qr-evento/modal-usuario-qr-evento.module').then( m => m.ModalUsuarioQrEventoPageModule)
  },
  {
    path: 'editar-evento',
    loadChildren: () => import('./pages/editar-evento/editar-evento.module').then( m => m.EditarEventoPageModule)
  },
  {
    path: 'home-anfitrion',
    loadChildren: () => import('./pages/home-anfitrion/home-anfitrion.module').then( m => m.HomeAnfitrionPageModule)
  },
  {
    path: 'home-guardia',
    loadChildren: () => import('./pages/home-guardia/home-guardia.module').then( m => m.HomeGuardiaPageModule)
  },
  {
    path: 'modal-parametros-relacionador-evento',
    loadChildren: () => import('./pages/modal-parametros-relacionador-evento/modal-parametros-relacionador-evento.module').then( m => m.ModalParametrosRelacionadorEventoPageModule)
  },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPrincipalUsuarioPageRoutingModule } from './menu-principal-usuario-routing.module';

import { MenuPrincipalUsuarioPage } from './menu-principal-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPrincipalUsuarioPageRoutingModule
  ],
  declarations: [MenuPrincipalUsuarioPage]
})
export class MenuPrincipalUsuarioPageModule {}

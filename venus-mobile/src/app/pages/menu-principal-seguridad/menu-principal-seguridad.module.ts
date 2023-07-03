import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPrincipalSeguridadPageRoutingModule } from './menu-principal-seguridad-routing.module';

import { MenuPrincipalSeguridadPage } from './menu-principal-seguridad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPrincipalSeguridadPageRoutingModule
  ],
  declarations: [MenuPrincipalSeguridadPage]
})
export class MenuPrincipalSeguridadPageModule {}

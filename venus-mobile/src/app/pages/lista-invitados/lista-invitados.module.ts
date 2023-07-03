import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaInvitadosPageRoutingModule } from './lista-invitados-routing.module';

import { ListaInvitadosPage } from './lista-invitados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaInvitadosPageRoutingModule
  ],
  declarations: [ListaInvitadosPage]
})
export class ListaInvitadosPageModule {}

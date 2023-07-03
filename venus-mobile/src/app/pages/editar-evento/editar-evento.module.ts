import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarEventoPageRoutingModule } from './editar-evento-routing.module';

import { EditarEventoPage } from './editar-evento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarEventoPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EditarEventoPage]
})
export class EditarEventoPageModule {}

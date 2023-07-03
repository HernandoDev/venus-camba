import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RespuestaLecturaPageRoutingModule } from './respuesta-lectura-routing.module';

import { RespuestaLecturaPage } from './respuesta-lectura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RespuestaLecturaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RespuestaLecturaPage]
})
export class RespuestaLecturaPageModule {}

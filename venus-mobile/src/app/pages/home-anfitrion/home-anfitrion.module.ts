import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeAnfitrionPageRoutingModule } from './home-anfitrion-routing.module';

import { HomeAnfitrionPage } from './home-anfitrion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeAnfitrionPageRoutingModule
  ],
  declarations: [HomeAnfitrionPage]
})
export class HomeAnfitrionPageModule {}

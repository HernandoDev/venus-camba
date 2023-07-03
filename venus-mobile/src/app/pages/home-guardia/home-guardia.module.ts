import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeGuardiaPageRoutingModule } from './home-guardia-routing.module';

import { HomeGuardiaPage } from './home-guardia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeGuardiaPageRoutingModule
  ],
  declarations: [HomeGuardiaPage]
})
export class HomeGuardiaPageModule {}

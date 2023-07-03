import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuyProntoComponent } from './pages/muy-pronto/muy-pronto.component';
import { EjemplosComponent } from './pages/ejemplos/ejemplos.component';
import { HeaderComponent } from './layout/header/header.component';
import { BodyComponent } from './layout/body/body.component';



@NgModule({
  declarations: [
    MuyProntoComponent,
    EjemplosComponent,
    HeaderComponent,
    BodyComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
  
    HeaderComponent,
       BodyComponent
  ]
})
export class SharedModule { }

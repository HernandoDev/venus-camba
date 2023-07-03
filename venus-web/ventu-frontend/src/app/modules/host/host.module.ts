import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './pages/home/home.component';
import { DetalleEventoComponent } from './pages/detalle-evento/detalle-evento.component';
import { HostRoutingModule } from './host-routing.module';
import { ListaEventosComponent } from './pages/lista-eventos/lista-eventos.component';
import { PersonalComponent } from './pages/personal/personal.component';



@NgModule({
  declarations: [
    HomeComponent,
    DetalleEventoComponent,
    ListaEventosComponent,
    PersonalComponent
  ],
  imports: [
    SharedModule,
    HostRoutingModule,
  ],
})
export class HostModule { }

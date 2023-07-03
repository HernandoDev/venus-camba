import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookedEventComponent } from './pages/booked-event/booked-event.component';
import { CreateEventComponent } from './pages/create-event/create-event.component';
import { LandingComponent } from './pages/landing/landing.component';
import { PaymentComponent } from './pages/payment/payment.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'crear-evento',
    component: CreateEventComponent,
  },
  {
    path: 'pago',
    component: PaymentComponent
  },
  {
    path: 'evento_reservado',
    component: BookedEventComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}

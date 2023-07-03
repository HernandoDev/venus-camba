import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './pages/landing/landing.component';
import { MobileScreenshotComponent } from './components/landing/mobile-screenshot/mobile-screenshot.component';
import { YourBestAllyComponent } from './components/landing/your-best-ally/your-best-ally.component';
import { ServiceCardsComponent } from './components/landing/service-cards/service-cards.component';
import { ContactFormComponent } from './components/landing/contact-form/contact-form.component';
import { CreateYourEventComponent } from './components/landing/create-your-event/create-your-event.component';
import { PricingComponent } from './components/landing/pricing/pricing.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NavbarComponent } from './components/navbar/navbar.component';
import { CreateEventComponent } from './pages/create-event/create-event.component';
import { StepsComponent } from './components/create-event/steps/steps.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ResumeComponent } from './components/payment/resume/resume.component';
import { PaymentMethodsComponent } from './components/payment/payment-methods/payment-methods.component';
import { BookedEventComponent } from './pages/booked-event/booked-event.component';
@NgModule({
  declarations: [
    LandingComponent,
    NavbarComponent,
    MobileScreenshotComponent,
    YourBestAllyComponent,
    ServiceCardsComponent,
    ContactFormComponent,
    CreateYourEventComponent,
    PricingComponent,
    FooterComponent,
    CreateEventComponent,
    StepsComponent,
    PaymentComponent,
    ResumeComponent,
    PaymentMethodsComponent,
    BookedEventComponent,
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ]
})
export class LandingModule { }

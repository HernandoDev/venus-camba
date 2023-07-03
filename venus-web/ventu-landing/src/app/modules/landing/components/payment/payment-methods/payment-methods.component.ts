import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LandingService } from 'src/app/data/services/api/landing.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css'],
})
export class PaymentMethodsComponent implements OnInit {
  @ViewChild('selectMetodoPago') selectMetodoPago: any;
  constructor(
    private toastService: ToastService,
    private landingService: LandingService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  evento: any;
  cuenta: any;
  imagen: any;
  logo: any;
  ngOnInit(): void {
    this.evento = this.obtenerEventoLocalStorage();
    this.cuenta = this.obtenerCuentaLocalStorage();
    this.imagen = this.obtenerImagenLocalStorage();
    this.logo = this.obtenerLogoLocalStorage();
  }
  obtenerEventoLocalStorage() {
    let evento = JSON.parse(localStorage.getItem('evento') || '{}');
    evento.privacidad = evento.privacidad === 'Público' ? 0 : 1;
    evento.fechaInicio = this.formatearFecha(evento.fechaInicio);
    evento.fechaFin = this.formatearFecha(evento.fechaFin);
    return evento;
  }
  obtenerCuentaLocalStorage() {
    return JSON.parse(localStorage.getItem('cuenta') || '{}');
  }
  obtenerImagenLocalStorage() {
    return localStorage.getItem('imagen64');
  }
  obtenerLogoLocalStorage() {
    let logo = localStorage.getItem('logo64');
    if (logo === 'sin logo') {
      logo = '';
    }
    return logo;
  }
  obtenerValorSelect() {
    if(this.evento.plan === 'Free') return;
    return this.selectMetodoPago.nativeElement.value;
  }
  confirmarPago() {
    if (
      (this.obtenerValorSelect() === '' ||
      this.obtenerValorSelect() === null ||
      this.obtenerValorSelect() === undefined) && 
      this.evento.plan !== 'Free'
    ) {
      this.toastService.mostrarToastError(
        '',
        'Por favor, seleccione un método de pago'
      );
      return;
    }
    this.spinner.show();
    this.landingService
      .agregarCuentaEvento(this.cuenta, this.evento, this.logo, this.imagen)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.spinner.hide();
          if (res.success) {
            this.toastService.mostrarToastSuccess(
              '',
              'Su cuenta y su evento han sido creados exitosamente'
            );
            this.router.navigate(['/evento_reservado']);
            //localStorage.clear();
          } else {
            this.toastService.mostrarToastError('', res.message);
          }
        },
        (error: any) => {
          this.spinner.hide();
          this.toastService.mostrarToastError(
            '',
            'Ha ocurrido un error al crear su cuenta'
          );
        }
      );
  }
  formatearFecha(fecha: any) {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy');
  }
}

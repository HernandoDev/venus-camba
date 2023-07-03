import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
})
export class ResumeComponent implements OnInit {
  @Input('pagina') pagina: string = '';
  @ViewChild('resumen') resumen: any;
  cuenta: any;
  evento: any;
  logo64: any;
  imagen64: any;

  constructor(private router: Router, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.cuenta = this.obtenerCuenta();
    this.evento = this.obtenerEvento();
    this.logo64 = this.obtenerLogo();
    this.imagen64 = this.obtenerImagen();
    this.verificarLocalStorage();
    setTimeout(() => {
      this.borrarBorderBottom();
    }, 100);
  }
  borrarBorderBottom(){
    if(this.pagina == 'evento_reservado'){
    this.resumen.nativeElement.style.borderBottom = 'none';
    this.borrarLocalStorage();
    } else {
      this.resumen.nativeElement.style.borderBottom = '1px solid gray';
    }
  }
  borrarLocalStorage(){
    localStorage.clear();
  }
  obtenerCuenta() {
    return JSON.parse(localStorage.getItem('cuenta') || '{}');
  }
  obtenerEvento() {
    let evento = JSON.parse(localStorage.getItem('evento') || '{}');
    evento.fechaInicio = this.formatearFecha(evento.fechaInicio);
    evento.fechaFin = this.formatearFecha(evento.fechaFin);
    if (evento.plan == 'Free') {
      evento.plan = 'Plan Free';
    } else if (evento.plan == 'Silver') {
      evento.plan = 'Plan Silver';
    } else if (evento.plan == 'Gold') {
      evento.plan = 'Plan Gold';
    }
    return evento;
  }
  obtenerLogo() {
    if (localStorage.getItem('logo64') == 'sin logo') {
      return 'assets/images/V.png';
    } else {
      return localStorage.getItem('logo64');
    }
  }
  obtenerImagen() {
    return localStorage.getItem('imagen64');
  }
  verificarLocalStorage() {
    if (
      Object.keys(this.cuenta).length === 0 ||
      Object.keys(this.evento).length === 0 
    ) {
      this.router.navigate(['/']);
    }
  }
  irCrearEvento() {
    this.router.navigate(['/crear-evento']);
  }
  formatearFecha(fecha: any) {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy');
  }
}

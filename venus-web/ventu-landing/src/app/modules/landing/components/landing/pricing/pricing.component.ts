import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  @Input() pagina: string = '';
  @Input() privacidad: string = '';
  constructor(private router: Router, private toastService: ToastService) { }

  ngOnInit(): void {

  }
  irCrearEvento(){
    setTimeout(() => {
      // borrar local storage
      localStorage.clear();
      this.router.navigate(['/crear-evento']);
    }, 300);
  }
  escogerPlanFree(){
    if(this.privacidad != 'Público'){
      let evento = JSON.parse(localStorage.getItem('evento') || '{}');
      evento.plan = 'Free';
      localStorage.setItem('evento', JSON.stringify(evento));
      this.irPago();
    } else {
      this.toastService.mostrarToastWarning('', 'No puedes crear un evento público con el plan Free');
    }

  }
  escogerPlanSilver(){
    let evento = JSON.parse(localStorage.getItem('evento') || '{}');
    evento.plan = 'Silver';
    localStorage.setItem('evento', JSON.stringify(evento));
    this.irPago();
  }
  
  escogerPlanGold(){
    let evento = JSON.parse(localStorage.getItem('evento') || '{}');
    evento.plan = 'Gold';
    localStorage.setItem('evento', JSON.stringify(evento));
    this.irPago();
  }
  irPago(){
    setTimeout(() => {
      this.router.navigate(['/pago']);
    }, 300);
  }
  


}

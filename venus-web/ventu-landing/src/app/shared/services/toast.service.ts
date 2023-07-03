import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}
  mostrarToastSuccess(titulo: string, mensaje: string) {
    this.toastr.success(mensaje, titulo, {
      positionClass: 'toast-bottom-right',
      closeButton: true,
      timeOut: 2000,
    });
  }
  mostrarToastError(titulo: string, mensaje: string) {
    this.toastr.error(mensaje, titulo, {
      positionClass: 'toast-bottom-right',
      closeButton: true,
      timeOut: 2000,
    });
  }
  mostrarToastWarning(titulo: string, mensaje: string) {
    this.toastr.warning(mensaje, titulo, {
      positionClass: 'toast-bottom-right',
      closeButton: true,
      timeOut: 2000,
    });
  }
}

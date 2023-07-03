import { Component, OnInit } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LandingService } from 'src/app/data/services/api/landing.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private api: LandingService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}
  formularioContacto = this.formBuilder.group({
    nombreCompleto: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
    correo: ['', [Validators.required, Validators.email]],
    consulta: ['', [Validators.required, Validators.maxLength(300)]],
  });
  enviarFormulario() {
    this.spinner.show();
    if (this.formularioContacto.valid){
      this.api.enviarCorreo(this.formularioContacto.value).subscribe(
        (res: any) => {
          if(res.success){
            this.spinner.hide();
            this.toastService.mostrarToastSuccess('', 'Correo enviado correctamente');
            this.formularioContacto.reset();
          }
        }, (error: any) => {
          this.spinner.hide();
          this.toastService.mostrarToastError('Error de servidor', 'Por favor, intente más tarde');
        }
      )
    } else {
      this.spinner.hide();
      this.formularioContacto.markAllAsTouched();
      this.toastService.mostrarToastError('', 'Por favor, ingrese datos válidos');
    }
  }
  validarTelefono(event: any) {
    let caracteresValidos = "1234567890+ ";
    if (caracteresValidos.includes(event.key)) {
      return true;
    } else {
      return false;
    }
  }
}

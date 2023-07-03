import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CountriesService } from 'src/app/data/services/countries.service';
import { ToastService } from 'src/app/shared/services/toast.service';
@Component({
  selector: 'app-create-your-event',
  templateUrl: './create-your-event.component.html',
  styleUrls: ['./create-your-event.component.css'],
})
export class CreateYourEventComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private countriesSerive: CountriesService
  ) {}
  listaPaises: string[] = [];
  formularioCuenta = this.formBuilder.group({
    nombres: ['', [Validators.required, Validators.maxLength(50)]],
    apellidos: ['', [Validators.required, Validators.maxLength(50)]],
    telefono: ['', [Validators.required, Validators.maxLength(15)]],
    correo: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(50)],
    ],
    pais: ['', [Validators.required, Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    this.listaPaises = this.countriesSerive.obtenerPaises();
  }

  enviarFormulario() {
    this.spinner.show();
    if (this.formularioCuenta.valid) {
      this.spinner.hide();
      setTimeout(() => {
        // guardar los datos en el local storage
        localStorage.clear();
        localStorage.setItem(
          'cuenta',
          JSON.stringify(this.formularioCuenta.value)
        );
        this.router.navigate(['/crear-evento']);
      }, 300);
    } else {
      this.spinner.hide();
      this.formularioCuenta.markAllAsTouched();
      this.toastService.mostrarToastError(
        '',
        'Por favor, ingrese datos válidos'
      );
    }
  }
  validarTelefono(event: any) {
    let caracteresValidos = '1234567890+ ';
    if (caracteresValidos.includes(event.key)) {
      return true;
    } else {
      return false;
    }
  }
}

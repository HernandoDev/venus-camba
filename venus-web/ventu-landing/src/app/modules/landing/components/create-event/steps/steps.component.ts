import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { dateValidator } from 'src/app/data/custom-validators/date-validator';
import { imageValidator } from 'src/app/data/custom-validators/imagesize-validator';
import { logoValidator } from 'src/app/data/custom-validators/logosize-validator';
import { timeValidator } from 'src/app/data/custom-validators/time-validator';
import { CountriesService } from 'src/app/data/services/countries.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css'],
})
export class StepsComponent implements OnInit {
  @ViewChild('primerPaso') primerPaso!: ElementRef;
  @ViewChild('segundoPaso') segundoPaso!: ElementRef;
  @ViewChild('tercerPaso') tercerPaso!: ElementRef;
  @ViewChild('inputLogo') inputLogo!: ElementRef;
  @ViewChild('inputImagen') inputImagen!: ElementRef;
  @ViewChild('inputBoletin') inputBoletin!: ElementRef;
  @ViewChild('inputFechaInicio') inputFechaInicio!: ElementRef;
  @ViewChild('inputFechaFin') inputFechaFin!: ElementRef;
  @ViewChild('inputHoraInicio') inputHoraInicio!: ElementRef;
  @ViewChild('inputHoraFin') inputHoraFin!: ElementRef;
  @ViewChild('colLogo') logo!: ElementRef;
  @ViewChild('colImagen') imagen!: ElementRef;
  parametrosCuenta: any;
  parametrosEvento: any;
  urlLogo: any;
  urlImagen: any;
  invalido = false;
  listaPaises: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private toastServie: ToastService,
    private countriesSerive: CountriesService
  ) {}


  ngOnInit(): void {
    this.asignarValoresCuenta();
    this.asignarValoresEvento();
    this.listaPaises = this.countriesSerive.obtenerPaises();
  }

  formularioCuenta = this.formBuilder.group(
    {
      nombres: ['', [Validators.required, Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.maxLength(15)]],
      correo: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
      pais: ['', [Validators.required]],
      logo: ['', []],
    },
    { validators: [logoValidator] }
  );
  formularioCrearEvento = this.formBuilder.group(
    {
      nombreEvento: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(350)]],
      tipo: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      privacidad: ['', [Validators.required]],
      nombreLugar: ['', [Validators.maxLength(100)]],
      direccion: ['', [Validators.maxLength(100)]],
      linkMaps: ['', [Validators.maxLength(100)]],
      fechaInicio: ['', [Validators.required]],
      horaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      horaFin: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
    },
    { validators: [dateValidator, timeValidator, imageValidator] }
  );

  asignarValoresCuenta() {
    // obtener cuenta de local storage
    this.parametrosCuenta = JSON.parse(localStorage.getItem('cuenta') || '{}');
    if (Object.keys(this.parametrosCuenta).length > 0) {
      this.formularioCuenta
        .get('nombres')
        ?.setValue(this.parametrosCuenta.nombres);
      this.formularioCuenta
        .get('apellidos')
        ?.setValue(this.parametrosCuenta.apellidos);
      this.formularioCuenta
        .get('telefono')
        ?.setValue(this.parametrosCuenta.telefono);
      this.formularioCuenta
        .get('correo')
        ?.setValue(this.parametrosCuenta.correo);
      this.formularioCuenta.get('pais')?.setValue(this.parametrosCuenta.pais);
      setTimeout(() => {
        this.inputBoletin.nativeElement.checked = this.parametrosCuenta.boletin;
        this.inputBoletin.nativeElement.value = this.parametrosCuenta.boletin;
      }, 100);
    }
  }
  asignarValoresEvento() {
    // obtener evento de local storage
    this.parametrosEvento = JSON.parse(localStorage.getItem('evento') || '{}');
    // obtener imagen64 local storage
    this.urlImagen = localStorage.getItem('imagen64');
    this.urlLogo = localStorage.getItem('logo64');

    if (Object.keys(this.parametrosEvento).length > 0) {
      this.formularioCrearEvento
        .get('nombreEvento')
        ?.setValue(this.parametrosEvento.nombreEvento);
      this.formularioCrearEvento
        .get('descripcion')
        ?.setValue(this.parametrosEvento.descripcion);
      this.formularioCrearEvento
        .get('tipo')
        ?.setValue(this.parametrosEvento.tipo);
      this.formularioCrearEvento
        .get('pais')
        ?.setValue(this.parametrosEvento.pais);
      this.formularioCrearEvento
        .get('privacidad')
        ?.setValue(this.parametrosEvento.privacidad);
      this.formularioCrearEvento
        .get('nombreLugar')
        ?.setValue(this.parametrosEvento.nombreLugar);
      this.formularioCrearEvento
        .get('direccion')
        ?.setValue(this.parametrosEvento.direccion);
      this.formularioCrearEvento
        .get('linkMaps')
        ?.setValue(this.parametrosEvento.linkMaps);
      this.formularioCrearEvento
        .get('fechaInicio')
        ?.setValue(this.parametrosEvento.fechaInicio);
      this.formularioCrearEvento
        .get('horaInicio')
        ?.setValue(this.parametrosEvento.horaInicio);
      this.formularioCrearEvento
        .get('fechaFin')
        ?.setValue(this.parametrosEvento.fechaFin);
      this.formularioCrearEvento
        .get('horaFin')
        ?.setValue(this.parametrosEvento.horaFin);
      this.formularioCrearEvento
        .get('logo')
        ?.setValue(this.parametrosEvento.imagen);
    }
  }

  // validar si el formulario es válido y pasar el segundo paso
  irSegundoPaso() {
    if (this.formularioCuenta.valid) {
      this.guardarCuentaLocalStorage();
      // ocultar el primer paso y mostrar el segundo
      this.animateCSS('.primerpaso', 'fadeOut').then((message) => {
        this.primerPaso.nativeElement.style.display = 'none';
        this.segundoPaso.nativeElement.style.display = 'block';
        this.animateCSS('.segundopaso', 'fadeIn');
      });
    } else {
      this.toastServie.mostrarToastError(
        '',
        'Por favor, ingrese datos válidos'
      );
      this.formularioCuenta.markAllAsTouched();
    }
  }

  irTercerPaso() {
    if(this.urlImagen == null){
      this.formularioCrearEvento.get('imagen')?.setErrors({required: true});
      this.toastServie.mostrarToastError('','Por favor, ingrese una imagen');
      this.formularioCrearEvento.markAllAsTouched();
      return;
    }

    if (this.formularioCrearEvento.valid) {
      this.guardarEventoLocalStorage();
      // ocultar el segundo paso y mostrar el tercero
      this.animateCSS('.segundopaso', 'fadeOut').then((message) => {
        this.segundoPaso.nativeElement.style.display = 'none';
        this.tercerPaso.nativeElement.style.display = 'block';
        this.animateCSS('.tercerpaso', 'fadeIn');
      });
    } else {
      if (
        this.formularioCrearEvento.get('imagen')?.invalid &&
        localStorage.getItem('imagen64') != null
      ) {
        this.ponerFormularioValido();
        this.animateCSS('.segundopaso', 'fadeOut').then((message) => {
          this.segundoPaso.nativeElement.style.display = 'none';
          this.tercerPaso.nativeElement.style.display = 'block';
          this.animateCSS('.tercerpaso', 'fadeIn');
        });
      } else {
        this.toastServie.mostrarToastError(
          '',
          'Por favor, ingrese datos válidos'
        );
        this.formularioCrearEvento.markAllAsTouched();
      }
    }
  }
  // volver al primer paso desde el segundo
  volverPrimerPaso() {
    //ocultar el segundo paso y mostrar el primero
    this.animateCSS('.segundopaso', 'fadeOut').then((message) => {
      this.segundoPaso.nativeElement.style.display = 'none';
      this.primerPaso.nativeElement.style.display = 'block';
      this.animateCSS('.primerpaso', 'fadeIn');
    });
    this.formularioCrearEvento.markAsUntouched();
  }
  // volver al segundo paso desde el tercero
  volverSegundoPaso() {
    //ocultar el tercer paso y mostrar el segundo
    this.animateCSS('.tercerpaso', 'fadeOut').then((message) => {
      this.tercerPaso.nativeElement.style.display = 'none';
      this.segundoPaso.nativeElement.style.display = 'block';
      this.animateCSS('.segundopaso', 'fadeIn');
    });
  }

  animateCSS = (element: any, animation: any, prefix = 'animate__') =>
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = document.querySelector(element);

      node.classList.add(`${prefix}animated`, animationName);

      function handleAnimationEnd(event: any) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }

      node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });

  guardarCuentaLocalStorage() {
    let valoresCuenta = {
      nombres: this.formularioCuenta.get('nombres')?.value,
      apellidos: this.formularioCuenta.get('apellidos')?.value,
      telefono: this.formularioCuenta.get('telefono')?.value,
      correo: this.formularioCuenta.get('correo')?.value,
      pais: this.formularioCuenta.get('pais')?.value,
      boletin: this.inputBoletin.nativeElement.checked,
    };
    localStorage.setItem('cuenta', JSON.stringify(valoresCuenta));
    this.subirLogoLocalStorage();
  }
  subirLogoLocalStorage() {
    if (
      localStorage.getItem('logo64') == null ||
      localStorage.getItem('logo64') == 'sin logo'
    ) {
      if (this.inputLogo.nativeElement.files[0] !== undefined) {
        localStorage.setItem('logo64', this.urlLogo);
      } else {
        localStorage.setItem('logo64', 'sin logo');
      }
    } else {
      localStorage.setItem('logo64', this.urlLogo);
    }
  }
  subirImagenLocalStorage() {
    localStorage.setItem('imagen64', this.urlImagen);
  }
  guardarEventoLocalStorage() {
    let valoresEvento = {
      nombreEvento: this.formularioCrearEvento.get('nombreEvento')?.value,
      descripcion: this.formularioCrearEvento.get('descripcion')?.value,
      tipo: this.formularioCrearEvento.get('tipo')?.value,
      pais: this.formularioCrearEvento.get('pais')?.value,
      privacidad: this.formularioCrearEvento.get('privacidad')?.value,
      nombreLugar: this.formularioCrearEvento.get('nombreLugar')?.value,
      direccion: this.formularioCrearEvento.get('direccion')?.value,
      linkMaps: this.formularioCrearEvento.get('linkMaps')?.value,
      fechaInicio: this.formularioCrearEvento.get('fechaInicio')?.value,
      horaInicio: this.formularioCrearEvento.get('horaInicio')?.value,
      fechaFin: this.formularioCrearEvento.get('fechaFin')?.value,
      horaFin: this.formularioCrearEvento.get('horaFin')?.value,
    };
    localStorage.setItem('evento', JSON.stringify(valoresEvento));
    this.subirImagenLocalStorage();
  }
  asignarBoletin() {
    let boletin = this.inputBoletin.nativeElement.checked;
    let cuenta = JSON.parse(localStorage.getItem('cuenta') || '{}');
    cuenta.boletin = boletin;
    localStorage.setItem('cuenta', JSON.stringify(cuenta));
  }
  cargarLogo(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      if(file.size > 5000000){
        this.formularioCuenta.get('logo')?.setValue(file.size);
        this.logo.nativeElement.style.display = 'none';
        this.invalido = true;
        return;
      } else {
        this.invalido = false;
      }
      this.formularioCuenta.get('logo')?.setValue(file.size);
      const reader = new FileReader();
      reader.readAsDataURL(this.inputLogo.nativeElement.files[0]);
      reader.onload = () => {
        this.urlLogo = reader.result;
        this.logo.nativeElement.style.display = 'block';
      };
    }
  }
  cargarImagen(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      if(file.size > 5000000){
        this.invalido = true;
        this.formularioCrearEvento.get('imagen')?.setValue(file.size);
        this.imagen.nativeElement.style.display = 'none';
        return;
      } else {
        this.invalido = false;
      }
      this.formularioCrearEvento.get('imagen')?.setValue(file.size);
      const reader = new FileReader();
      reader.readAsDataURL(this.inputImagen.nativeElement.files[0]);
      reader.onload = () => {
        this.urlImagen = reader.result;
        this.imagen.nativeElement.style.display = 'block';

      };
    }
  }
  ponerFormularioValido() {
    // set form to valid

    Object.keys(this.formularioCrearEvento.controls).forEach((key) => {
      // set control valid
      this.formularioCrearEvento.controls[key].setErrors(null);
    });
  }
  obtenerFechaActual() {
    let fecha = new Date();
    return fecha;
  }
  borrarLogo() {
    this.animateCSS('.col-logo', 'fadeOut').then((message) => {
      this.logo.nativeElement.style.display = 'none';
      this.inputLogo.nativeElement.value = '';
      localStorage.setItem('logo64', 'sin logo');
      this.urlLogo = undefined;
    });
  }
  borrarImagen() {
    this.animateCSS('.col-imagen', 'fadeOut').then((message) => {
      this.imagen.nativeElement.style.display = 'none';
      this.inputImagen.nativeElement.value = '';
      localStorage.removeItem('imagen64');
      this.urlImagen = null;
    });
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

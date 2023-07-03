/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Evento } from '../../models/Evento';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { CamaraService } from '../../services/camara.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.page.html',
  styleUrls: ['./editar-evento.page.scss'],
})
export class EditarEventoPage implements OnInit {
  idEvento: number;
  evento: Evento = {};
  listaInvitados = [];
  formularioEvento: FormGroup;
  imagenString;
  imagenCambiada = false;

  fechaInicio;
  fechaFin;

  token;

  disabled = true;

  private URL = environment.API_URL;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private navController: NavController,
    private eventosService: EventosService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertcontroller: AlertController,
    private toastController: ToastController,
    private camaraService: CamaraService,
    private tokenService: TokenService,)
    {
      this.formularioEvento = this.formBuilder.group({
        nombre: new FormControl('', Validators.required),
        fecha_inicio: new FormControl('', Validators.required),
        hora_inicio: new FormControl('', Validators.required),
        fecha_fin: new FormControl('', Validators.required),
        hora_fin: new FormControl('', Validators.required),
      });
    }

  ngOnInit() {
    this.idEvento = this.route.snapshot.params.idEvento;
    this.obtenerDetallesEvento();
  }

  async obtenerToken() {
    await this.tokenService.obtenerTokenDesdeStorage().then((value) => {
        this.token = value;
    });
  }

  async obtenerDetallesEvento() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    await loading.present();
    await this.obtenerToken();
    this.eventosService.obtenerEventoPorId(this.idEvento, this.token).subscribe((res: any) => {
      if (res.success) {
        this.evento = res.data;
        this.listaInvitados = this.evento.invitados;
        this.fechaInicio = new Date(this.evento.fecha_inicio);
        this.fechaInicio = moment(this.evento.fecha_inicio).format('YYYY-MM-DD');
        this.fechaFin = new Date(this.evento.fecha_fin);
        this.fechaFin = moment(this.evento.fecha_fin).format('YYYY-MM-DD');
        loading.dismiss();
      } else {
        this.mostrarToast(res.message);
        loading.dismiss();
      }
    }, error => {
      console.log(error);
      loading.dismiss();
    });
  }

  back() {
    this.navController.back();
  }

  obtenerImagenEvento(imagen: any) {
    if (this.imagenCambiada) {
      return 'data:image/jpeg;base64,' + this.imagenString;
    } else {
      return this.URL+imagen;
    }
  }

  obtenerImagen(imagen: any) {
    return 'data:image/jpeg;base64,' + imagen;
  }

  limpiarFormulario() {
    this.formularioEvento.controls.nombre.setValue('');
    this.formularioEvento.controls.fecha_inicio.setValue('');
    this.formularioEvento.controls.hora_inicio.setValue('');
    this.formularioEvento.controls.fecha_fin.setValue('');
    this.formularioEvento.controls.hora_fin.setValue('');
  }

  async confirmar(){
    const formularioValores = this.formularioEvento.value;

    const valido = this.validarHoraInicioFin(formularioValores);

    if (valido === 'valido') {
      const evento = {
        id: this.idEvento,
        nombre: formularioValores.nombre,
        fecha_inicio: formularioValores.fecha_inicio,
        hora_inicio: formularioValores.hora_inicio,
        fecha_fin: formularioValores.fecha_fin,
        hora_fin: formularioValores.hora_fin,
      };
      const loading = await this.loadingController.create({
        spinner: 'crescent',
        translucent: false,
      });
      await loading.present();
      this.eventosService.editarEvento(evento, this.imagenCambiada, this.obtenerImagen(this.imagenString), this.token).subscribe(async result => {
        if(result.success) {
          loading.dismiss();
          setTimeout(() => {
            this.navController.back();
            this.limpiarFormulario();
            this.mostrarToast('Evento editado correctamente');
          }, 200);
        } else {
          loading.dismiss();
          this.mostrarAlerta('Error', result.message);
        }
      }, error => {
        loading.dismiss();
        this.mostrarToast('Hubo un error, por favor intenta de nuevo.');
      });
    } else if (valido === 'horasInvalidas'){
      this.mostrarToast('La hora de inicio del evento no puede ser mayor a la hora de finalización.');
    } else if (valido === 'horasVacias') {
      this.mostrarToast('Las horas no pueden estar vacías.');
    } else if (valido === 'horaInicioVacia') {
      this.mostrarToast('La hora de inicio del evento no puede estar vacía.');
    } else if (valido === 'horaFinVacia') {
      this.mostrarToast('Las hora de finalización del evento no puede estar vacío');
    }
  }

  validarHoraInicioFin(formularioValores) {
    if (formularioValores.hora_inicio === '' && formularioValores.hora_fin === '') {
      return 'horasVacias';
    } else if (formularioValores.hora_inicio === '') {
      return 'horaInicioVacia';
    } else if (formularioValores.hora_fin === '') {
      return 'horaFinVacia';
    } else if (formularioValores.fecha_inicio === formularioValores.fecha_fin) {
      if (formularioValores.hora_inicio < formularioValores.hora_fin) {
        return 'valido';
      } else {
        return 'horasInvalidas';
      }
    } else {
      return 'valido';
    }
  }

  async mostrarToast(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1000
    });
    toast.present();
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertcontroller.create({
      cssClass: '',
      header: titulo,
      message: mensaje,
      buttons: [{
        text: 'ACEPTAR',
        cssClass: '',
        id: 'btn-confirmar',
        handler: () => {
          //
        }
      }]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
  }

  menuOpcionesSubidaImagen(){
    this.camaraService.menuOpcionesSubidaImagen().then((imageData: any) => {
      this.imagenString = imageData;
      this.imagenCambiada = true;
      this.evento.imagen = imageData;
    }).catch((error) => {
      console.log('Error al obtener imagen:' + error);
      this.mostrarToast('Error al obtener imagen');
      // this.utilService.toast(error);
    });
  }

}

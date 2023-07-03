/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { Evento } from '../../models/Evento';
import { InvitadosService } from '../../services/invitados.service';
import { LecturaQRService } from '../../services/lectura-qr.service';
import {
  AlertController,
  ToastController,
  NavController,
  Platform,
  ModalController,
  LoadingController,
  IonItemSliding,
} from '@ionic/angular';
import { ModalAgregarInvitadoPage } from '../modal-agregar-invitado/modal-agregar-invitado.page';
import { ModalIngresarInvitadoPage } from '../modal-ingresar-invitado/modal-ingresar-invitado.page';
import { TokenService } from '../../services/token.service';
import { ModalUsuarioQrEventoPage } from '../modal-usuario-qr-evento/modal-usuario-qr-evento.page';
import { Storage } from '@capacitor/storage';
import moment from 'moment';

@Component({
  selector: 'app-lista-invitados',
  templateUrl: './lista-invitados.page.html',
  styleUrls: ['./lista-invitados.page.scss'],
})
export class ListaInvitadosPage implements OnInit {
  idEvento: number;
  listaInvitados: any;
  evento: Evento = {};
  graficas: boolean;
  cantidadEstandar = 0;
  resultadoCategorias:any;
  total_registrado :any;
  total_ingresados :any;
  public bufferTotal = 0.06;
  public progressTotal = 0;
  ingresosEstandar = 0;
  cantidadVip = 0;
  ingresosVip = 0;
  categorias: any;
  barra2: any;
  barra3: any;
  barra4: any;
  buscador: string;
  cantidadSuperVip = 0;
  ingresosSuperVip = 0;
  buscando = false;
  ingresaron = 0;
  listaBusqueda = [];
  portero;
  intervalo: any;
  token;
  contadorInvitados = 0;
  backgroundBar1: any = '';
  porcentajeAsistencia = 0;
  usuarioDatos: any;
  eventoActivo = false;
  barra1: any;
  manual: any = false;
  constructor(
    public route: ActivatedRoute,
    private eventosService: EventosService,
    private invitadosService: InvitadosService,
    private alertController: AlertController,
    private toastController: ToastController,
    private navController: NavController,
    private platform: Platform,
    public lecturaQRService: LecturaQRService,
    private router: Router,
    private modalController: ModalController,
    private tokenService: TokenService,
    private loadingController: LoadingController
  ) {
    this.barra1 = '0%';
    this.backgroundBar1 = 'background: #8DFEFC;border-radius: 360px;width:100%';
    this.graficas = false;
    this.route.paramMap.subscribe((params) => {
      this.idEvento = parseInt(params.get('idEvento'), 10);
      this.portero = params.get('portero');
      this.manual = params.get('manual');
      this.buscando = false;
      this.listaBusqueda = [];
      if (this.portero == null) {
        this.obtenerDetallesEvento();
        this.obtenerCategorias();
      } else {
        if (!this.manual) {
          this.listaInvitados = JSON.parse(params.get('invitados'));
          this.evento = JSON.parse(params.get('evento'));
        } else {
          this.obtenerDetallesEvento();
          this.obtenerCategorias();

        }
      }
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.back();
      });
    });

    this.intervalo = setInterval(() => {
      this.obtenerDetallesEvento();
    }, 120000);
    this.platform.pause.subscribe(() => {
      // La aplicación pasa a segundo plano
      this.detenerIntervalo();
    });
  }
  async actualizarDatos(event) {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    await loading.present();
    await this.obtenerToken();
    this.eventosService.obtenerEventoPorId(this.idEvento, this.token).subscribe(
      (res: any) => {
        if (res.success) {
          this.evento = res.data;
          this.listaInvitados = this.evento.invitados;
          this.contadorInvitados = this.obtenerCantidadInvitados();
          this.obtenerKPIsV2();
          // this.porcentajeAsistencia = this.obtenerPorcentaje();
          this.barra1 = this.porcentajeAsistencia + '%';
          this.verificarEventoActivo();
          loading.dismiss();
        } else {
          this.mostrarToast(res.message);
          loading.dismiss();
        }
        event.target.complete();
      },
      (error) => {
        event.target.complete();
        console.log(error);
        loading.dismiss();
      }
    );
    setTimeout(() => {}, 500);
  }
  ngOnInit() {
    this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
      this.usuarioDatos = JSON.parse(value);
      console.log(this.usuarioDatos);
    });

    this.route.paramMap.subscribe((params) => {
      this.idEvento = parseInt(params.get('idEvento'), 10);
    });
    // this.obtenerToken();
  }
  detenerIntervalo() {
    clearInterval(this.intervalo);
  }
  async obtenerToken() {
    await this.tokenService.obtenerTokenDesdeStorage().then((value) => {
      this.token = value;
    });
  }

  ionViewDidEnter() {

    // this.obtenerDetallesEvento();
  }

  back() {
    if (this.graficas) {
      this.graficas = false;
    } else {
      clearInterval(this.intervalo);
      if (this.portero === 'true') {
        this.navController.navigateBack(['/home-guardia']);
      } else {
        this.navController.back();
      }
    }
  }

  async obtenerDetallesEvento() {
    if (this.graficas === false) {
      this.buscando = false;
      this.listaBusqueda = [];
      this.buscador = '';
      const loading = await this.loadingController.create({
        spinner: 'crescent',
        translucent: false,
      });
      await loading.present();
      await this.obtenerToken();
      this.eventosService
        .obtenerEventoPorId(this.idEvento, this.token)
        .subscribe(
          (res: any) => {
            if (res.success) {
              this.evento = res.data;
              this.listaInvitados = this.evento.invitados;
              console.log(this.listaInvitados);

              this.contadorInvitados = this.obtenerCantidadInvitados();
              this.obtenerKPIsV2();
              // this.porcentajeAsistencia = this.obtenerPorcentaje();
              this.barra1 = this.porcentajeAsistencia + '%';
              this.verificarEventoActivo();
              loading.dismiss();
            } else {
              this.mostrarToast(res.message);
              loading.dismiss();
            }
          },
          (error) => {
            console.log(error);
            loading.dismiss();
          }
        );
    }

  }

  obtenerCantidadInvitados() {
    let cantidad = 0;
    this.listaInvitados.forEach((invitado) => {
      cantidad += invitado.acompanhantes + 1;
    });
    return cantidad;
  }
  obtenerKPIs() {
    // if (this.listaInvitados.length > 0) {
    //   this.listaInvitados.forEach(invitado => {
    //   });
    // }
  }
  obtenerKPIsV2() {
    let total_registrado = 0;
    let total_ingresados = 0;
    this.categorias.forEach((categoria) => {
      let cantidad = 0;
      let total = 0;
      this.listaInvitados.forEach((usuario) => {
        if (usuario.CategoriaInvitado.id === categoria.id) {
          cantidad += usuario.acompanhantes + 1;
          total += usuario.ingresos;
        }
      });
      categoria.progress=0
      categoria.total_registrado = cantidad;
      categoria.total_ingresados = total;
      total_registrado += cantidad;
      total_ingresados += total;
      let porcentaje = 0;
      if (cantidad > 0) {
        porcentaje = total / cantidad;
      }
      categoria.porcentaje_ingresados = porcentaje;
    });
    this.total_registrado = total_registrado;
    this.total_ingresados = total_ingresados;

  }


  obtenerPorcentaje() {
    let ingresaron = 0;
    let porcentaje = 0.0;

    if (this.listaInvitados.length > 0) {
      this.listaInvitados.forEach((invitado) => {
        if (invitado.categoria === 0) {
          this.cantidadEstandar += invitado.acompanhantes + 1;
        }
        if (invitado.categoria === 1) {
          this.cantidadVip += invitado.acompanhantes + 1;
        }
        if (invitado.categoria === 2) {
          this.cantidadSuperVip += invitado.acompanhantes + 1;
        }
        if (invitado.ingresos > 0) {
          ingresaron += invitado.ingresos;
          if (invitado.categoria === 0) {
            this.ingresosEstandar += invitado.ingresos;
          }
          if (invitado.categoria === 1) {
            this.ingresosVip += invitado.ingresos;
          }
          if (invitado.categoria === 2) {
            this.ingresosSuperVip += invitado.ingresos;
          }
        }
      });
      // console.log(ingresaron);
      this.ingresaron = ingresaron;
      const porcentajeEstandar =
        (this.ingresosEstandar * 100) / this.cantidadEstandar;
      const porcentajeVip = (this.ingresosVip * 100) / this.cantidadVip;
      const porcentajeSuperVip =
        (this.ingresosSuperVip * 100) / this.cantidadSuperVip;
      this.barra4 = porcentajeSuperVip + '%';
      this.barra3 = porcentajeVip + '%';
      this.barra2 = porcentajeEstandar + '%';
      porcentaje = (ingresaron * 100) / this.obtenerCantidadInvitados();
    }
    return Math.round(porcentaje);
  }

  eliminar(invitado) {
    const id = parseInt(invitado.id, 10);

    this.invitadosService
      .eliminarInvitado(id, this.token, this.usuarioDatos.correo)
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.mostrarToast('Invitado eliminado correctamente');
            this.obtenerDetallesEvento();
          } else {
            this.mostrarToast('No se pudo eliminar al invitado');
          }
        },
        (error) => {
          this.mostrarToast('Ocurrió un error al eliminar invitado');
        }
      );
  }

  async mostrarAlertaEliminar(invitado) {
    if (invitado.ingresos <= 0) {
      const alert = await this.alertController.create({
        cssClass: '',
        header:
          '¿Estás seguro que deseas eliminar a ' +
          invitado.nombres +
          ' ' +
          invitado.apellidos +
          '?',
        buttons: [
          {
            text: 'ACEPTAR',
            cssClass: '',
            id: 'btn-confirmar',
            handler: () => {
              this.eliminar(invitado);
            },
          },
          {
            text: 'CANCELAR',
            cssClass: '',
            id: 'btn-cancelar',
            handler: () => {},
          },
        ],
      });
      await alert.present();
    } else {
      this.mostrarToast('No se puede eliminar un invitado que ya ingresó');
    }
  }
  async mostrarToast(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1000,
    });
    toast.present();
  }

  share(slidingItem: IonItemSliding) {
    slidingItem.close();
  }

  buscar(b: any) {
    let busqueda = b.target.value.trim();
    this.listaBusqueda = [];
    if (b.target.value !== '' && b.target.value !== null) {
      this.buscando = true;
      this.listaInvitados.forEach((invitado) => {
        const nombre =
          invitado.nombres.toLowerCase() +
          ' ' +
          invitado.apellidos.toLowerCase();
        busqueda = busqueda.toLowerCase();
        if (nombre.includes(busqueda)) {
          this.listaBusqueda.push(invitado);
        }
      });
    } else {
      this.buscando = false;
      this.listaBusqueda = [];
    }
  }
  async ingresarInvitado(
    observaciones,
    observaciones_guardia,
    invitado_id,
    acompanhantes: any,
    ingresos: any,
    nombres: any,
    apellidos: any,
    categoria: any,
    telefono: any,
    correo: any,
    CategoriaInvitado: any
  ) {

    if (this.portero === 'true') {
      clearInterval(this.intervalo);
      if (acompanhantes - ingresos > -1) {
        let entradas_restantes = acompanhantes - ingresos;
        entradas_restantes++;
        const modal = await this.modalController.create({
          component: ModalIngresarInvitadoPage,
          cssClass: 'modal-agregar-invitado',
          componentProps: {
            // idEvento: this.idEvento,
            entradas_restantes,
            nombre_invitado: nombres + ' ' + apellidos,
            invitado_id,
            observaciones,
            observaciones_guardia,
            usuarioDatos: this.usuarioDatos,
            telefono,
            correo
          },
          backdropDismiss: true,
        });
        modal.onDidDismiss().then((res) => {
          // this.obtenerDetallesEvento();
          // this.intervalo = setInterval(() => {
          //   this.obtenerDetallesEvento();
          //  },120000);
        });
        return await modal.present();
      }
    } else {
      /// EDITAR INVITADO EN ROL ADMI
      const modal = await this.modalController.create({
        component: ModalAgregarInvitadoPage,
        cssClass: 'modal-ingresar-invitado',
        componentProps: {
          idEvento: this.idEvento,
          usuarioDatos: this.usuarioDatos,
          observaciones,
          observaciones_guardia,
          invitado_id,
          telefono,
          correo,
          CategoriaInvitado,
          acompanhantes,
          categorias: this.categorias,
          ingresos,
          nombres,
          categoria,
          apellidos,
          editar: true,
          eventoActivo: this.eventoActivo,
        },
        backdropDismiss: true,
      });

      modal.onDidDismiss().then((res) => {
        if (res.data.info === 'aceptar') {
          this.mostrarToast('Se ha editó correctamente a tu invitado.');
          this.obtenerDetallesEvento();
        } else if (res.data.info === 'token') {
          this.mostrarToast('Debes iniciar sesión nuevamente.');
          this.navController.navigateRoot('login');
          // this.mostrarToast('No se agregó ningún invitado, por favor intenta nuevamente.');
        } else {
          this.mostrarToast('Hubo un error, por favor intenta de nuevo.');
        }
      });
      return await modal.present();
    }
  }

  async mostrarGraficas() {
    if(this.total_registrado!=0){
      this.graficas = !this.graficas;
      console.log(this.categorias);
      this.progressTotal=0
      this.bufferTotal=0
      this.bufferTotal += 0.01;
      let maximoTotal  = this.total_ingresados/this.evento.cantidad_invitados
      let  maximoBuffer = this.total_registrado /this.evento.cantidad_invitados
      setTimeout(() => {
        let intervalo = setInterval(() => {
          if (this.progressTotal >= maximoTotal && this.bufferTotal >= maximoBuffer ) {
            clearInterval(intervalo);
          } else {
            if (this.bufferTotal <=maximoBuffer) {
              this.bufferTotal += 0.02;
            }
            if (this.progressTotal <maximoTotal) {
              this.progressTotal += 0.01;
            }
          }
        }, 12);
      }, 500);
      setTimeout(() => {
        // Comenzar a animar las gráficas
        this.categorias.forEach((categoria) => {
          categoria.progress = 0;
          const maximo = categoria.porcentaje_ingresados ;
          const intervalo = setInterval(() => {
            if (categoria.progress >= maximo) {
              clearInterval(intervalo);
            } else {
              categoria.progress += 0.01;
            }
          }, 12);
        });
      }, 400);
    }else{
      this.mostrarToast('No hay invitados registrados.')
    }
  }
  async agregarInvitado() { //ROL ADMIN
    const modal = await this.modalController.create({
      component: ModalAgregarInvitadoPage,
      cssClass: 'modal-ingresar-invitado',
      componentProps: {
        idEvento: this.idEvento,
        usuarioDatos: this.usuarioDatos,
        eventoActivo: true,
        categorias: this.categorias,
      },
      backdropDismiss: true,
    });
    modal.onDidDismiss().then((res) => {
      if (res.data.info === 'aceptar') {
        this.mostrarToast('Se ha agregado correctamente a tu invitado.');
        this.obtenerDetallesEvento();
      } else if (res.data.info === 'token') {
        this.mostrarToast('Debes iniciar sesión nuevamente.');
        this.navController.navigateRoot('login');
        // this.mostrarToast('No se agregó ningún invitado, por favor intenta nuevamente.');
      } else {
        this.mostrarToast('Hubo un error, por favor intenta de nuevo.');
      }
    });
    return await modal.present();
  }

  async abrirModalQR() {
    const modal = await this.modalController.create({
      component: ModalUsuarioQrEventoPage,
      cssClass: 'modal-agregar-invitado',
      componentProps: {
        idEvento: this.idEvento.toString(),
      },
      backdropDismiss: true,
    });
    modal.onDidDismiss().then((res) => {});
    return await modal.present();
  }

  verificarEventoActivo() {
    const fechaActual = moment().format('YYYY/MM/DD');
    const horaActual = moment().format('HH:mm');
    const fechaEvento = moment(this.evento.fecha_fin).format('YYYY/MM/DD');
    if (fechaActual < fechaEvento) {
      this.eventoActivo = true;
    } else if (
      fechaActual === fechaEvento &&
      horaActual <= this.evento.hora_fin
    ) {
      this.eventoActivo = true;
    } else {
      this.eventoActivo = false;
    }
  }

  obtenerCategorias() {
    this.invitadosService
      .obtenerCategorias(this.idEvento, this.token)
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.categorias = res.data;
          } else {
            this.mostrarToast('Error al obtener las  categorías');
          }
        },
        (error) => {
          this.mostrarToast('Error al obtener las  categorías');
        }
      );
  }
}

import { Component, OnInit,ViewChild ,ChangeDetectorRef  } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute ,NavigationExtras} from '@angular/router';
import { Platform ,NavController, AlertController,ToastController,LoadingController} from '@ionic/angular';

import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner/ngx';
import { LecturaQRService } from '../../services/lectura-qr.service';
import { TokenService } from '../../services/token.service';
import { PopoverMenuComponent } from '../../componets/popover-menu/popover-menu.component';
import { PopoverController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { IonSlides } from '@ionic/angular';
import { EventosService } from 'src/app/services/eventos.service';
import moment from 'moment';

@Component({
  selector: 'app-home-guardia',
  templateUrl: './home-guardia.page.html',
  styleUrls: ['./home-guardia.page.scss'],
})
export class HomeGuardiaPage implements OnInit {
  eventoSeleccionado :any;
  sliderLength: number;
  api = environment.API_URL;
  eventosActivos = true;
  listaEventos = [];
  listaEventosActivos = [];
  listaEventosFinalizados = [];
  
  img: any;
  token;
  usuario: any;
  private URL = environment.API_URL;
  @ViewChild('slides', { static: true }) slides: IonSlides;
  ListaEventos:any
  numAcompanhantesRestante: number = 0;
  // ListaEventos = [{
  //     active: true,
  //     tags: ['Privado', 'Gold'],
  //     name: 'Evento de prueba 1 ',
  //     date: '24/08/2023',
  //     attendance: {
  //       total: 100,
  //       current: 86,
  //     },
  //     start: '13/05/2022 15:00',
  //     end: '13/05/2022 23:00',
  //   },
  //   {
  //     active: true,
  //     tags: ['Privado', 'Gold'],
  //     name: 'Evento de prueba2',
  //     date: '24/08/2023',
  //     attendance: {
  //       total: 100,
  //       current: 86,
  //     },
  //     start: '13/05/2022 15:00',
  //     end: '13/05/2022 23:00',
  //   },
  // ]
  opcionesSlider = {
    initialSlide: 1,
    loop: false
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public platform: Platform,
    private barcodeScanner: BarcodeScanner,
    public lecturaQRService: LecturaQRService,
    private toastController: ToastController,
    public navController: NavController,
    private tokenService: TokenService,
    private loadingController: LoadingController,private cdr: ChangeDetectorRef,
    public popoverController: PopoverController,
    public alertController: AlertController,
    private loginService: LoginService,
    private eventosService: EventosService,

  ) { 
  }
  async obtenerTokens() {
    await this.tokenService.obtenerTokenDesdeStorage().then((value) => {
        this.token = value;
    });
    await this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
      this.usuario = JSON.parse(value);
    });
  }
  async obtenerListaEventosSinSlider() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    this.listaEventosActivos=[]
    await loading.present();
    this.listaEventos = [];
    await this.obtenerTokens();
    let id_enviar =''
    if(this.usuario.fk_rol ==2){
      id_enviar=this.usuario.id
    }else{
      id_enviar=this.usuario.id
    }
    this.eventosService.obtenerEventos(this.token,id_enviar).subscribe((res: any) => {

      if (res.success) {
        this.listaEventosActivos=[]
        this.ListaEventos = res.data;
        this.ListaEventos.map(item => {
          item.evento_activo = (this.verificarEventoActivo(item.fecha_inicio,item.hora_inicio,item.fecha_fin, item.hora_fin)) ? true : false;
          item.fecha_inicio_parseada = moment(item.fecha_incio).format('DD/MM/YYYY');
          item.imagen_fondo = `linear-gradient(to bottom, transparent 30%, #060606cc  90%), url('${this.URL}${item.imagen}')`;
          item.categoria_fondo = (item.categoria == 'Gold') ? 'linear-gradient(135deg, rgba(241,231,103,1) 0%, rgba(254,182,69,1) 79%, rgba(254,182,69,1) 100%)' : 'linear-gradient(135deg, rgba(226,226,226,1) 0%, rgba(219,219,219,1) 50%, rgba(209,209,209,1) 51%, rgba(254,254,254,1) 100%)' 
          if(item.evento_activo ){
            this.listaEventosActivos.push(item)
          }
        })
        if(this.listaEventosActivos.length>1 && this.slides!=null){ 
          this.listaEventosActivos = [this.listaEventosActivos[this.listaEventosActivos.length - 1], ...this.listaEventosActivos, this.listaEventosActivos[0]];
          this.opcionesSlider = {
            initialSlide: 1,
            loop: false
          };
          // var miElemento = document.getElementById("contenedorPrincipal");
          // miElemento.classList.add("animate__headShake");

        }else if(this.listaEventosActivos.length==1){
          this.eventoSeleccionado=this.listaEventosActivos[0]
        }
        loading.dismiss();
      } else {
        console.log(res);
        this.mostrarToast(res.message);
        loading.dismiss();
      }
    }, error => {
      console.error(error);
      this.mostrarToast('Hubo un error, por favor intenta nuevamente');
      loading.dismiss();
    });
  }
  async obtenerListaEventos() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    this.listaEventosActivos=[]
    await loading.present();
    this.listaEventos = [];
    await this.obtenerTokens();
    let id_enviar =''
    if(this.usuario.fk_rol ==2){
      id_enviar=this.usuario.id
    }else{
      id_enviar=this.usuario.id
    }
    this.eventosService.obtenerEventos(this.token,id_enviar).subscribe((res: any) => {

      if (res.success) {
        this.listaEventosActivos=[]
        this.ListaEventos = res.data;
        this.ListaEventos.map(item => {
          item.evento_activo = (this.verificarEventoActivo(item.fecha_inicio,item.hora_inicio,item.fecha_fin, item.hora_fin)) ? true : false;
          item.fecha_inicio_parseada = moment(item.fecha_incio).format('DD/MM/YYYY');
          item.imagen_fondo = `linear-gradient(to bottom, transparent 30%, #060606cc  90%), url('${this.URL}${item.imagen}')`;
          item.categoria_fondo = (item.categoria == 'Gold') ? 'linear-gradient(135deg, rgba(241,231,103,1) 0%, rgba(254,182,69,1) 79%, rgba(254,182,69,1) 100%)' : 'linear-gradient(135deg, rgba(226,226,226,1) 0%, rgba(219,219,219,1) 50%, rgba(209,209,209,1) 51%, rgba(254,254,254,1) 100%)' 
          if(item.evento_activo ){
            this.listaEventosActivos.push(item)
          }
        })
        if(this.listaEventosActivos.length>1 && this.slides!=null){ 
          this.listaEventosActivos = [this.listaEventosActivos[this.listaEventosActivos.length - 1], ...this.listaEventosActivos, this.listaEventosActivos[0]];
          this.slides.slideTo(1,0)
          this.opcionesSlider = {
            initialSlide: 1,
            loop: false
          };
          // var miElemento = document.getElementById("contenedorPrincipal");
          // miElemento.classList.add("animate__headShake");

        }else if(this.listaEventosActivos.length==1){
          this.eventoSeleccionado=this.listaEventosActivos[0]
        }
        loading.dismiss();
      } else {
        console.log(res);
        this.mostrarToast(res.message);
        loading.dismiss();
      }
    }, error => {
      console.error(error);
      this.mostrarToast('Hubo un error, por favor intenta nuevamente');
      loading.dismiss();
    });
  }
  async mostrarToast(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1000
    });
    toast.present();
  }
  verificarEventoActivo(eventoFechaInicio, eventoHoraInicio, eventoFechaFin, eventoHoraFin) {
    const fechaActual = moment().format('YYYY/MM/DD');
    const horaActual = moment().format('HH:mm');
    const fechaEventoInicio = moment(eventoFechaInicio).format('YYYY/MM/DD');
    const fechaEventoFin = moment(eventoFechaFin).format('YYYY/MM/DD');
    
    if ((fechaActual >= fechaEventoInicio) && (fechaActual <= fechaEventoFin)) {
      if ((fechaActual === fechaEventoFin) && (horaActual > eventoHoraFin)) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  
  ionViewWillEnter() {
    this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
      this.usuario = JSON.parse(value);
      this.img = this.URL + this.usuario.imagen;
      this.obtenerListaEventosSinSlider()
    });
  }

  ngOnInit() {
    this.obtenerListaEventos()
    setTimeout(() => {
      if(this.listaEventosActivos.length>1 ){ 
        var miElemento = document.getElementById("contenedorPrincipal");
          miElemento.classList.add("animate__shakeX");
            setTimeout(() => {
              miElemento.classList.remove("animate__shakeX");
            }, 5000);
      }
    }, 3000);
  }

  cambiarEventoFin(evento: any) {
    if(this.slides!=null){
      this.slides.getActiveIndex().then(index => {
        // Verificar si se alcanzó el primer slide
        if (index === 0) {
          this.slides.slideTo(this.listaEventosActivos.length - 2,0); // Ir al penúltimo slide
        }
        // Verificar si se alcanzó el último slide
        if (index === this.listaEventosActivos.length - 1) {
          this.slides.slideTo(1,0); // Ir al segundo slide
        }
      });
  }
  }

  cambiarEvento(evento: any) {
    if(this.slides!=null){
      this.slides.getActiveIndex().then(index => {
        this.eventoSeleccionado = this.listaEventosActivos[index];
      });
    }
  }


  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
  async abrirMenu(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverMenuComponent,
      cssClass: 'popover-menu',
      event: ev,
      dismissOnSelect: true,
      translucent: true,
      componentProps: { usuario: this.usuario }
    });
    await popover.present();
  }

  abrirNoCamaraQR(){
    let aux: any = '';
    aux ='19'
    if (isNaN(aux)==false){
      this.lecturaQRService.verificarQR(aux,this.usuario, this.token).subscribe((res: any) => {
          if (res.success) {
            //QR DENTRO DEL HORARIO
            if(res.data.fk_usuario == this.usuario.fk_anfitrion){
              let navigationextras: NavigationExtras = {
                state: {
                  nombreEvento : res.data.nombre,
                  mensaje: 'Su invitación tiene: 2 acompañantes Categoría: estándar',
                  valido :true,
                  titulo : '¡Bienvenid@!',
                  icono : 'icono_success_qr.png',
                }
              };
              // this.router.navigate(['/respuesta-lectura'], navigationextras);
              this.router.navigate(['/lista-invitados', {idEvento: res.data.id,portero:true}]);
          }else{
            this.navController.navigateForward('/respuesta-lectura');
            let navigationextras: NavigationExtras = {
              state: {
                nombreEvento :'El usuario no tiene permisos sobre este evento',
                mensaje: 'El usuario no pertenece al evento, comuníquese con administración',
                valido :false,
                titulo : 'Ingreso denegado',
                icono : 'icono_error_qr.png',
              }
            };
            this.router.navigate(['/respuesta-lectura'], navigationextras);
          }
          }else{
            // if (res.message == "El evento no corresponde a este fecha."){
              //CODIGO QR FUERA DE HORARIO 
              //CASO FALSE
              this.navController.navigateForward('/respuesta-lectura');
              let navigationextras: NavigationExtras = {
                state: {
                  nombreEvento : res.data,
                  mensaje: res.message,
                  valido :false,
                  titulo : 'Ingreso denegado',
                  icono : 'icono_error_qr.png',
                }
              };
              this.router.navigate(['/respuesta-lectura'], navigationextras);
            // }
          }
        }, error => {
          console.log(error);
      }); 
   }else{
    this.navController.navigateForward('/respuesta-lectura');
    let navigationextras: NavigationExtras = {
      state: {
        nombreEvento : '',
        mensaje:'Evento no encontrado o QR inválido.',
        valido :false,
        titulo : 'Ingreso denegado',
        icono : 'icono_error_qr.png',
      }
    };
    this.router.navigate(['/respuesta-lectura'], navigationextras);
   }
  }
  abrirCamaraQR(){
    const preferenciasAndroid: BarcodeScannerOptions = {
      prompt: 'Coloque un código QR en el interior del rectángulo del visor para escanear',
      resultDisplayDuration: 0
    };
    this.barcodeScanner.scan(preferenciasAndroid)
    .then(barcodeData => {
      if (barcodeData.cancelled) {
        //Se cancelo la lectura del QR 
        //this.utilitariosService.toastInformativo('Escaneo cancelado', 2000, 'Cerrar');
        return;
      }else{
        //EL QR FUE LEIDO CON EXITO VERIFICANDO SI ES VALIDO
        let aux :any =''
        aux =barcodeData.text
        // if (isNaN(aux)==false)  {
          
          this.lecturaQRService.verificarQR(barcodeData.text, this.usuario.username,this.token).subscribe((res: any) => {
            
            if (res.success) {
           
            if(res.data.fk_usuario == this.usuario.fk_anfitrion){
              //QR DENTRO DEL HORARIO
            if(res.data.invitadosLeido==null){
              let invitados = JSON.stringify(res.data.invitados)
              let evento = JSON.stringify(res.data)
              this.router.navigate(['/lista-invitados', {idEvento: res.data.id,portero:true,invitados:invitados,evento:evento}]);
            }else{
              this.navController.navigateForward('/respuesta-lectura');
            let mensajeAux ='';
            if (((res.data.invitadosLeido.acompanhantes - res.data.invitadosLeido.ingresos)+1)===0){
              mensajeAux ='Ya no tiene acompañantes restantes.';
            }
            else{
            this.numAcompanhantesRestante = res.data.invitadosLeido.acompanhantes - res.data.invitadosLeido.ingresos;
            mensajeAux = 'Esta invitación tiene  '+((this.numAcompanhantesRestante))+ ' acompañantes restantes.';
            }
            
            let navigationextras: NavigationExtras = {
              state: {
                nombreEvento : res.data.nombre,
                mensaje: mensajeAux,
                categoria :res.data.invitadosLeido.CategoriaInvitado.nombre,
                valido :true,
                titulo : '¡Bienvenid@!xdd',
                invitado : res.data.invitadosLeido.nombres + ' '+res.data.invitadosLeido.apellidos,
                icono : 'icono_success_qr.png',
                fk_evento :res.data.fk_evento,
                observacionesG: res.data.invitadosLeido.observaciones_guardia,
                acompanhantes: res.data.invitadosLeido.acompanhantes,
                ingresos: res.data.invitadosLeido.ingresos,
                idInvitado: res.data.invitadosLeido.id,
                // parametros para consultar directo a la api
                numAcompanhantesRestante: this.numAcompanhantesRestante,
                barcodeData: barcodeData.text,
                username: this.usuario.username,
                token: this.token,
                telefono: res.data.invitadosLeido.telefono,
                correo: res.data.invitadosLeido.correo
              }
            };
            debugger
            this.router.navigate(['/respuesta-lectura'], navigationextras);
            }

             
            }else{
              this.navController.navigateForward('/respuesta-lectura');
              let navigationextras: NavigationExtras = {
                state: {
                  nombreEvento :'El usuario no tiene permisos sobre este evento',
                  mensaje: 'El usuario no pertenece al evento, comuníquese con administración',
                  valido :false,
                  titulo : 'Ingreso denegado',
                  icono : 'icono_error_qr.png',
                }
            };
            this.router.navigate(['/respuesta-lectura'], navigationextras);
          }
            }else{
              // if (res.message == "El evento no corresponde a este fecha."){
                //CODIGO QR FUERA DE HORARIO 
                //CASO FALSE
                this.navController.navigateForward('/respuesta-lectura');
                let navigationextras: NavigationExtras = {
                  state: {
                    nombreEvento : res.data,
                    mensaje: res.message,
                    valido :false,
                    titulo : 'Ingreso denegado',
                    icono : 'icono_error_qr.png',
                  }
                };
                this.router.navigate(['/respuesta-lectura'], navigationextras);
              // }
            }
          }, error => {
            console.log(error);
          });
        // }else{
        //   this.navController.navigateForward('/respuesta-lectura');
        //   let navigationextras: NavigationExtras = {
        //     state: {
        //       nombreEvento : '',
        //       mensaje:'Evento no encontrado o QR inválido.',
        //       valido :false,
        //       titulo : 'Ingreso denegado',
        //       icono : 'icono_error_qr.png',
        //     }
        //   };
        //   this.router.navigate(['/respuesta-lectura'], navigationextras);
        // }
      }

    })
    .catch(err => {
      // this.utilitariosService.toastInformativo('Error al intentar escaner. Intente nuevamente', 2000, 'Cerrar');
      console.log('Error', err);
    });
  }  

  registroManual(){
    // this.router.navigate(['/lista-eventos']);
    if((this.eventoSeleccionado.total_acompanhantes+this.eventoSeleccionado.total_invitados)>0){
      this.router.navigate(['/lista-invitados', {idEvento:this.eventoSeleccionado.id,portero:true,evento:this.eventoSeleccionado,manual:true}]);
    }else{
      this.mostrarToast('El evento aun no tiene invitados registrados.')
    }
  }

  async alertSalir() {
    const alert = await this.alertController.create({
      cssClass: 'botones',
      header: '',
      message: '¿Estás seguro que desas cerrar sesión?',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'btn-adopciones',
          id: 'btn-cancelar',
          handler: () => {
            console.log('no');
          }
        }, {
          text: 'ACEPTAR',
          id: 'btn-confirmar',
          handler: () => {
            this.loginService.cerrarSesion();
            this.cerrarPopups();
          }
        }
      ]
    });

    await alert.present();
  }

  async cerrarPopups() {
    if (await this.popoverController.getTop()) this.popoverController.dismiss();
  }

}

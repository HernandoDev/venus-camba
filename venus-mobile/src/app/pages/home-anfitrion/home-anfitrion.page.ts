import { Component, OnInit } from '@angular/core';
import { LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { PopoverMenuComponent } from 'src/app/componets/popover-menu/popover-menu.component';
import { TokenService } from 'src/app/services/token.service';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';
import { EventosService } from 'src/app/services/eventos.service';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-anfitrion',
  templateUrl: './home-anfitrion.page.html',
  styleUrls: ['./home-anfitrion.page.scss'],
})
export class HomeAnfitrionPage implements OnInit {

  usuario: any;
  img: any;
  private URL = environment.API_URL;
  fechaInternet:any;
  eventosActivos = true;
  listaEventos = [];
  listaEventosActivos = [];
  listaEventosFinalizados = [];
  token: string;


  constructor(
    private router: Router,
    public popoverController: PopoverController,
    private tokenService: TokenService,
    public alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private loginService: LoginService,
    private eventosService: EventosService,
  ) { }

  ionViewWillEnter() {
    this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
      this.usuario = JSON.parse(value);
      this.img = this.URL + this.usuario.imagen;
    });
    this.obtenerHora()
    this.obtenerListaEventos();
  }

  ngOnInit() {
    this.obtenerHora()
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

  async obtenerListaEventos() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    await loading.present();
    this.listaEventos = [];
    await this.obtenerTokens();
    let id_enviar =''
    if(this.usuario.fk_rol ==2){
      id_enviar=this.usuario.fk_anfitrion
    }else{
      id_enviar=this.usuario.id
    }
    this.eventosService.obtenerEventos(this.token,id_enviar).subscribe((res: any) => {
      if (res.success) {
        this.listaEventos = res.data;
        this.listaEventos.map(item => {
          item.evento_activo = (this.verificarEventoActivo(item.fecha_fin, item.hora_fin)) ? true : false;
          item.fecha_inicio_parseada = moment(item.fecha_inicio).format('DD/MM/YYYY');
          item.imagen_fondo = `linear-gradient(to bottom, transparent 30%, #060606cc  90%), url('${this.URL}${item.imagen}')`;
          if (item.categoria === 'Gold') {
            item.categoria_fondo = 'linear-gradient(135deg, rgba(241,231,103,1) 0%, rgba(254,182,69,1) 79%, rgba(254,182,69,1) 100%)';
          }
          if (item.categoria === 'Free'){
            item.categoria_fondo = 'linear-gradient(135deg, rgba(226,226,226,1) 0%, rgba(219,219,219,1) 50%, rgba(209,209,209,1) 51%, rgba(254,254,254,1) 100%)';
          }

          if (item.categoria === 'Silver'){
            item.categoria_fondo = 'linear-gradient(135deg, rgba(148, 0, 211, 1) 0%, rgba(144, 12, 210, 1) 50%, rgba(121, 36, 205, 1) 51%, rgba(98, 60, 200, 1) 100%)';
          }
        })
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
  obtenerHora(){
    this.eventosService.obtenerHora('America/La_Paz').subscribe((respuesta: any) => {
         this.fechaInternet = new Date(respuesta.datetime);
         debugger
       },(error: string) => {
            console.log('Error', 'no se pudo validar la hora');
        });

  }
  verificarEventoActivo(eventoFechaFin, eventoHoraFin) {
    const fechaActual = moment(this.fechaInternet).format('YYYY/MM/DD');
    const horaActual = moment(this.fechaInternet).format('HH:mm');
    const fechaEvento = moment(eventoFechaFin).format('YYYY/MM/DD');
    if (fechaActual < fechaEvento) {
      return true;
    } else if ((fechaActual === fechaEvento) && (horaActual <= eventoHoraFin)) {
      return true;
    } else {
      return false;
    }
  }

  tipoEvento(id: number) {
    if (id === 1) {
      return 'Privado';
    } else {
      return 'Público';
    }
  }

  isEventoSilver(categoria: string): boolean {
    return categoria === 'Silver';
  }

  async obtenerTokens() {
    await this.tokenService.obtenerTokenDesdeStorage().then((value) => {
        this.token = value;
    });
    await this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
      this.usuario = JSON.parse(value);
    });
  }

  async mostrarToast(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1000
    });
    toast.present();
  }

  verEvento(id: number){
    if(this.usuario.fk_rol==1){
      this.router.navigate(['/ficha-evento', {idEvento: id}]);
    }else{
      this.router.navigate(['/lista-invitados', {idEvento:id,portero:true}]);
    }
  }
  ordenarArrayEventos(eventos: any[]): any[] {
    // Ordena los eventos en función del estado de evento_activo
    return eventos.sort((a, b) => {
      if (a.evento_activo && !b.evento_activo) {
        return -1;
      } else if (!a.evento_activo && b.evento_activo) {
        return 1;
      } else {
        return 0;
      }
    });
  }


}

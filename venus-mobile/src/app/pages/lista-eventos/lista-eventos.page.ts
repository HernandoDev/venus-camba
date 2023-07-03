/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import moment from 'moment';
import { EventosService } from '../../services/eventos.service';
import { environment } from '../../../environments/environment';
import { Storage } from '@capacitor/storage';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-lista-eventos',
  templateUrl: './lista-eventos.page.html',
  styleUrls: ['./lista-eventos.page.scss'],
})
export class ListaEventosPage implements OnInit {
  eventosActivos = true;
  listaEventos = [];
  listaEventosActivos = [];
  listaEventosFinalizados = [];
  token: string;
  rageBack = false
  usuario:any={fk_rol:null};

  private URL = environment.API_URL;

  constructor(private router: Router,
    private navController: NavController,
    private eventosService: EventosService,
    private tokenService: TokenService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private platform: Platform,
    ) {
  
    }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.obtenerListaEventos();
  }
  ionViewWillEnter(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.atras();
    });
  }

  async obtenerTokens() {
    await this.tokenService.obtenerTokenDesdeStorage().then((value) => {
        this.token = value;
    });
    await this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
      this.usuario = JSON.parse(value);
    });
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
        
        this.separarListasEventos();
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

  separarListasEventos() {
    this.listaEventosActivos = [];
    this.listaEventosFinalizados = [];
    const fechaActual = moment().format('YYYY/MM/DD');
    const horaActual = moment().format('HH:mm');
    this.listaEventos.forEach(evento => {
      const fechaEvento = moment(evento.fecha_fin).format('YYYY/MM/DD');
      if (fechaActual < fechaEvento) {
        this.listaEventosActivos.push(evento);
      } else if ((fechaActual === fechaEvento) && (horaActual <= evento.hora_fin)) {
        this.listaEventosActivos.push(evento);
      } else {
        this.listaEventosFinalizados.push(evento);
      }
    });
  }

  verEvento(id: number,evento:any){
    if(evento.habilitado == 1 ){
      if(this.usuario.fk_rol==1){
        this.router.navigate(['/ficha-evento', {idEvento: id}]);
      }else{
        // this.router.navigate(['/lista-invitados', {idEvento: res.data.id,portero:true,invitados:invitados,evento:evento}]);
        this.router.navigate(['/lista-invitados', {idEvento:id,portero:true,evento:evento,manual:true}]);
      }
    }
  }

  obtenerImagenEvento(imagen: any) {
    return this.URL+imagen;
  }

  tipoEvento(id: number) {
    if (id === 1) {
      return 'Privado';
    } else {
      return 'Público';
    }
  }

  atras() {
    if(this.rageBack==false){
      this.rageBack = true
      this.navController.back();
      setTimeout(() => {
        this.rageBack = false
    }, 3000);
      
    }
  }
  verEventosActivos() {
    this.eventosActivos = true;
    this.obtenerListaEventos();
  }

  verEventosFinalizados() {
    this.eventosActivos = false;
    this.obtenerListaEventos();
  }

  async mostrarToast(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1000
    });
    toast.present();
  }

}

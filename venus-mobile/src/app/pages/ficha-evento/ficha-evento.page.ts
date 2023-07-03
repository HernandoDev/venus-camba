/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit ,ViewChildren,QueryList,ViewChild,ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, LoadingController, ToastController ,AlertController,IonItemSliding } from '@ionic/angular';
import { ModalUsuarioQrEventoPage } from '../modal-usuario-qr-evento/modal-usuario-qr-evento.page';
import { EventosService } from '../../services/eventos.service';
import { Evento } from '../../models/Evento';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../services/token.service';
import moment from 'moment';
import { ModalParametrosRelacionadorEventoPage } from '../modal-parametros-relacionador-evento/modal-parametros-relacionador-evento.page';

@Component({
  selector: 'app-ficha-evento',
  templateUrl: './ficha-evento.page.html',
  styleUrls: ['./ficha-evento.page.scss'],
})
export class FichaEventoPage implements OnInit {
  idEvento: number;
  evento: any = {};
  listaInvitados = [];
  @ViewChildren('itemSliding') itemSlidings: QueryList<IonItemSliding>;
  @ViewChild('divGuardiasSinAsignar', {static: false}) divGuardiasSinAsignar: ElementRef;
  token;
  guardias:any;
  maximoGuardias:any;
  usuario:any;
  asignarNuevoGuardia:boolean=false
  asignarNuevoRelacionador:boolean=false
  relacionadores:any;
  relacionadoresAsignadosAux:any;
  buscadoRelacionadoresSinAsignar:string=''
  buscadoRelacionadores:string=''
  relacionadoresAux:any;
  relacionadoresAsignados:any;
  guardiasAsignados:any;
  buscadorGuardiasSinAsignar:string;
  guardiasAsignadosAux:any
  guardiasAux:any
  tituloHeader:string='Detalles del evento'
  ventanaActiva:string='detalle-evento'
  buscadorGuardias:any;
  eventoActivo = false;
  tabs=[
    {
      id:0,
      nombre:'detalle-evento',
      icono:'/assets/images/calendar-event.svg',
      color:'white',
      activo:true,
      tituloHeader:'Detalles del evento'
    },
    {
      id:1,
      nombre:'relacionadores',
      icono:'/assets/images/megaphone-fill.svg',
      color:'white',
      activo:false,
      tituloHeader:'Relacionadores'
    },
    {
      id:2,
      nombre:'guardias',
      icono:'/assets/images/shield-shaded.svg',
      color:'white',
      activo:false,
      tituloHeader:'Guardias'
    },
    {
      id:3,
      nombre:'opciones',
      icono:'/assets/images/three-dots-vertical.svg',
      color:'white',
      activo:false,
      tituloHeader:'Opciones'
    }
  ]
  private URL = environment.API_URL;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private navController: NavController,
    private modalController: ModalController,
    private alertController: AlertController,
    private eventosService: EventosService,
    private tokenService: TokenService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    ) { }

  ngOnInit() {
    this.idEvento = this.route.snapshot.params.idEvento;
    this.obtenerGuardias();
    this.obtenerRelacionadores()
    // this.obtenerToken();
    this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
      this.usuario = JSON.parse(value);
    });
    // this.obtenerDetallesEvento();
  }
  async obtenerRelacionadores(){
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    await loading.present();
        this.eventosService
        .obtenerRelacionadoresEvento(this.idEvento, this.token)
        .subscribe(
            (res: any) => {
                if (res.success) {
                    this.relacionadores = res.data.relacionadores;
                    this.relacionadoresAux = res.data.relacionadores;
                    this.relacionadoresAsignados = res.data.relacionadores_asignados;
                    this.relacionadoresAsignadosAux = res.data.relacionadores_asignados;
                    loading.dismiss();
                  } else {
                    this.mostrarToast(
                        "Error al obtener los relacionadores del evento",
                    );
                    loading.dismiss();
                  }
            },
            (error) => {
                this.mostrarToast(
                    "Error al obtener los relacionadores del evento",
                );
                console.log(error);
                loading.dismiss();
              }
        );
}    
  async obtenerToken() {
    await this.tokenService.obtenerTokenDesdeStorage().then((value) => {
        this.token = value;
    });
  }

  ionViewDidEnter() {
    this.obtenerDetallesEvento();
    
  }

  back() {
    if(this.ventanaActiva=='guardias' && this.asignarNuevoGuardia){
      this.tituloHeader='Guardias'
      this.asignarNuevoGuardia=false
    } else if(this.ventanaActiva=='relacionadores' && this.asignarNuevoRelacionador){
      this.tituloHeader='Relacionadores'
      this.asignarNuevoRelacionador=false
    }else{
      this.navController.back();
    }
  }
  async obtenerGuardias(){
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    await loading.present();
    await this.obtenerToken();
    this.eventosService.obtenerGuardiasEvento(this.idEvento, this.token).subscribe((res: any) => {
      if (res.success) {
        this.guardias = res.data.guardias;
        this.guardiasAux = res.data.guardias;
        this.guardiasAsignados = res.data.guardias_asignados;
        this.guardiasAsignadosAux = res.data.guardias_asignados;
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
        this.evento.imagen_fondo = `linear-gradient(to bottom, transparent 30%, #060606cc  90%), url('${this.URL}${this.evento.imagen}')`;
        this.evento.categoria_fondo = (this.evento.categoria == 'Gold') ? 'linear-gradient(135deg, rgba(241,231,103,1) 0%, rgba(254,182,69,1) 79%, rgba(254,182,69,1) 100%)' : 'linear-gradient(135deg, rgba(226,226,226,1) 0%, rgba(219,219,219,1) 50%, rgba(209,209,209,1) 51%, rgba(254,254,254,1) 100%)' 
        if (this.evento.categoria === 'Gold') {
          this.evento.categoria_fondo = 'linear-gradient(135deg, rgba(241,231,103,1) 0%, rgba(254,182,69,1) 79%, rgba(254,182,69,1) 100%)';
        }  
        if (this.evento.categoria === 'Free'){
          this.evento.categoria_fondo = 'linear-gradient(135deg, rgba(226,226,226,1) 0%, rgba(219,219,219,1) 50%, rgba(209,209,209,1) 51%, rgba(254,254,254,1) 100%)';
        }
        
        if (this.evento.categoria === 'Silver'){
          this.evento.categoria_fondo = 'linear-gradient(135deg, rgba(148, 0, 211, 1) 0%, rgba(144, 12, 210, 1) 50%, rgba(121, 36, 205, 1) 51%, rgba(98, 60, 200, 1) 100%)';
        }
        this.listaInvitados = this.evento.invitados;
        this.verificarEventoActivo();
        this.obtenerCantidadMaximaGuardias()
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
  isEventoSilver(categoria: string): boolean {
    return categoria === 'Silver';
  }

  verificarEventoActivo() {
    const fechaActual = moment().format('YYYY/MM/DD');
    const horaActual = moment().format('HH:mm');
    const fechaEvento = moment(this.evento.fecha_fin).format('YYYY/MM/DD');
    if (fechaActual < fechaEvento) {
      this.eventoActivo = true;
    } else if ((fechaActual === fechaEvento) && (horaActual <= this.evento.hora_fin)) {
      this.eventoActivo = true;
    } else {
      this.eventoActivo = false;
    }
  }

  obtenerImagenEvento(imagen: any) {
    return this.URL+imagen;
  }

  editarEvento(){
    this.router.navigate(['/editar-evento', {idEvento: this.idEvento}]);
  }

  tipoEvento(id: number) {
    if (id === 1) {
      return 'Privado';
    } else {
      return 'Público';
    }
  }
  obtenerTotalInvitados(){
    let totalInvitados = 0;
    this.listaInvitados.forEach(invitado => {
        totalInvitados = totalInvitados + invitado.acompanhantes+1;//Se suma uno por la entrada del invitado general. 
      });
    return totalInvitados;
  }
  obtenerInvitadosIngresados(){
    let ingresaron = 0;
    this.listaInvitados.forEach(invitado => {
        ingresaron = ingresaron + invitado.ingresos;
    });
    return ingresaron;
  }

  async abrirModalQR(){
    const modal = await this.modalController.create({
      component: ModalUsuarioQrEventoPage,
      cssClass: 'modal-agregar-invitado',
      componentProps: {
        idEvento: this.idEvento,
      },
      backdropDismiss: true
    });
    modal.onDidDismiss().then((res) => {
    });
    return await modal.present();
  }

  verInvitados(){
    this.router.navigate(['/lista-invitados', {idEvento: this.idEvento}]);
  }

  async mostrarToast(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1000
    });
    toast.present();
  }


// Esta función se ejecuta cuando se hace clic en una de las pestañas del footer recibe como parametro los datos del tab seleccionado
eventoTab(tab) {
  let idTab = tab.id; // Obtiene el ID del tab seleccionado 
  // Recorre todas las pestañas y establece la propiedad 'activo' del tab seleccionado a true y a false para los demás 
  // con la intencion de cambiar el color mediante ngStyle del icono
  this.tabs.forEach(tab_aux => {
    if (tab_aux.id === idTab) {
      // Si el tab seleccionado no es 'opciones', actualiza la variable ventanaActiva y tituloHeader
      if (tab.nombre != 'opciones') {
        this.ventanaActiva = tab.nombre;
        if( tab.nombre=='guardias'){
          if (this.guardiasAsignadosAux.length==0){
            setTimeout(() => {
              let elemento = document.getElementById('botonAgregarGuardia');
              elemento.classList.remove("animate__fadeInRight");
              elemento.classList.add("animate__heartBeat");
            }, 500);
          }
          if(!this.asignarNuevoGuardia ){
            this.tituloHeader = tab.tituloHeader;
          }else{
            this.tituloHeader='Asignar guardia'
          }
        }else if( tab.nombre=='relacionadores'){
          if (this.relacionadoresAsignadosAux.length==0){
            setTimeout(() => {
              let elemento = document.getElementById('botonAgregarRelacionador');
              elemento.classList.remove("animate__fadeInRight");
              elemento.classList.add("animate__heartBeat");
            }, 500);
          }
          if(!this.asignarNuevoRelacionador){
            this.tituloHeader = tab.tituloHeader;
          }else{
            this.tituloHeader='Asignar relacionador'
          }
        }else{
          this.tituloHeader = tab.tituloHeader;
        }
        
        tab_aux.activo = true;
      }
    } else {
      if (tab.nombre != 'opciones') {
        tab_aux.activo = false;
      }
    }
  });
}
buscarGuardiasSinAsignar (){
  let resultados = [];
  let busqueda = this.buscadorGuardiasSinAsignar.toLowerCase(); // Convertir a minúsculas para evitar problemas de mayúsculas/minúsculas
  // Verificar si la cadena de búsqueda no está vacía
  if(busqueda!=''&& busqueda!=' '){
    if (busqueda) {
      resultados = this.guardias.filter(function(guardia) {
        let nombreCompleto = (guardia.nombres + " " + guardia.apellidos).toLowerCase();
        let nombre = guardia.nombres.toLowerCase();
        let apellido = guardia.apellidos.toLowerCase();

        // Comprobar si el nombre completo, nombre o apellido del guardia contiene la cadena de búsqueda
        return (
          nombreCompleto.includes(busqueda) ||
          nombre.includes(busqueda) ||
          apellido.includes(busqueda)
        );
      });
    }
    this.guardias = resultados; // Actualizar la lista de guardias asignados con los resultados de la búsqueda
  }else{
    this.guardias=this.guardiasAux // Si la cadena de búsqueda está vacía, volver a mostrar todos los guardias asignados
  }
}
buscarRelacionadoresSinAsignar (){
  let resultados = [];
  let busqueda = this.buscadoRelacionadoresSinAsignar.toLowerCase(); // Convertir a minúsculas para evitar problemas de mayúsculas/minúsculas
  // Verificar si la cadena de búsqueda no está vacía
  if(busqueda!=''&& busqueda!=' '){
    if (busqueda) {
      resultados = this.relacionadores.filter(function(relacionador) {
        let nombreCompleto = (relacionador.nombres + " " + relacionador.apellidos).toLowerCase();
        let nombre = relacionador.nombres.toLowerCase();
        let apellido = relacionador.apellidos.toLowerCase();

        // Comprobar si el nombre completo, nombre o apellido del guardia contiene la cadena de búsqueda
        return (
          nombreCompleto.includes(busqueda) ||
          nombre.includes(busqueda) ||
          apellido.includes(busqueda)
        );
      });
    }
    this.relacionadores = resultados; // Actualizar la lista de guardias asignados con los resultados de la búsqueda
  }else{
    this.relacionadores=this.relacionadoresAux // Si la cadena de búsqueda está vacía, volver a mostrar todos los guardias asignados
  }
}
buscarGuardias() {
  let resultados = [];
  let busqueda = this.buscadorGuardias.toLowerCase(); // Convertir a minúsculas para evitar problemas de mayúsculas/minúsculas
  // Verificar si la cadena de búsqueda no está vacía
  if(busqueda!=''&& busqueda!=' '){
    if (busqueda) {
      resultados = this.guardiasAsignados.filter(function(guardia) {
        let nombreCompleto = (guardia.nombres + " " + guardia.apellidos).toLowerCase();
        let nombre = guardia.nombres.toLowerCase();
        let apellido = guardia.apellidos.toLowerCase();

        // Comprobar si el nombre completo, nombre o apellido del guardia contiene la cadena de búsqueda
        return (
          nombreCompleto.includes(busqueda) ||
          nombre.includes(busqueda) ||
          apellido.includes(busqueda)
        );
      });
    }
    this.guardiasAsignados = resultados; // Actualizar la lista de guardias asignados con los resultados de la búsqueda
  }else{
    this.guardiasAsignados=this.guardiasAsignadosAux // Si la cadena de búsqueda está vacía, volver a mostrar todos los guardias asignados
  }
}
buscarRelacionadores() {
  let resultados = [];
  let busqueda = this.buscadoRelacionadores.toLowerCase(); // Convertir a minúsculas para evitar problemas de mayúsculas/minúsculas
  // Verificar si la cadena de búsqueda no está vacía
  if(busqueda!=''&& busqueda!=' '){
    if (busqueda) {
      resultados = this.relacionadoresAsignados.filter(function(relacionador) {
        let nombreCompleto = (relacionador.nombres + " " + relacionador.apellidos).toLowerCase();
        let nombre = relacionador.nombres.toLowerCase();
        let apellido = relacionador.apellidos.toLowerCase();

        // Comprobar si el nombre completo, nombre o apellido del guardia contiene la cadena de búsqueda
        return (
          nombreCompleto.includes(busqueda) ||
          nombre.includes(busqueda) ||
          apellido.includes(busqueda)
        );
      });
    }
    this.relacionadoresAsignados = resultados; // Actualizar la lista de guardias asignados con los resultados de la búsqueda
  }else{
    this.relacionadoresAsignados=this.relacionadoresAsignadosAux // Si la cadena de búsqueda está vacía, volver a mostrar todos los guardias asignados
  }
}
async mostrarAlertaEliminar(usuario,tipoUsuario) {
    const alert = await this.alertController.create({
      cssClass: '',
      header:
        '¿Estás seguro que deseas eliminar a ' +
        usuario.nombres +
        ' ' +
        usuario.apellidos +
        '?',
      buttons: [
        {
          text: 'CANCELAR',
          cssClass: '',
          id: 'btn-cancelar',
          handler: () => {},
        },
        {
          text: 'ACEPTAR',
          cssClass: '',
          id: 'btn-confirmar',
          handler: () => {
            this.eliminarAsignacion(usuario,tipoUsuario);
          },
        },
       
      ],
    });
    await alert.present();
}
async eliminarAsignacion(usuario,stringTipoUsuario){
  const loading = await this.loadingController.create({
    spinner: 'crescent',
    translucent: false,
  });
  await loading.present();
  const id = parseInt(usuario.id, 10);
  this.eventosService.eliminarAsignacionUsuario(id, this.token, this.usuario.correo,this.idEvento).subscribe(
      (res: any) => {
          if (res.success) {
              this.obtenerGuardias();
              this.obtenerRelacionadores();
              // this.asignarNuevoGuardia=false
              // this.asignarNuevoRelacionador=false
              this.itemSlidings.forEach(item => item.close());
              stringTipoUsuario=stringTipoUsuario[0].toUpperCase() + stringTipoUsuario.substring(1);
              this.mostrarToast( stringTipoUsuario+" eliminado");
          } else {
              this.mostrarToast(
                  "No se pudo eliminar al "+stringTipoUsuario +
                    usuario.nombres +
                      " " +
                      usuario.apellidos,
              );
          }
          loading.dismiss();
        },
      (error) => {
        loading.dismiss();
        this.mostrarToast(
              "No se pudo eliminar al "+stringTipoUsuario +
                  usuario.nombres +
                  " " +
                  usuario.apellidos,
          );
      }
  );
}
mostrarAsignarNuevoRelacionador(){
  this.tituloHeader='Asignar relacionador'
  this.asignarNuevoRelacionador=true
  this.buscadoRelacionadoresSinAsignar=''
  this.relacionadores=this.relacionadoresAux
  this.buscadoRelacionadores=''
  this.relacionadoresAsignados=this.relacionadoresAsignadosAux
  setTimeout(() => {
    let elemento = document.getElementById('listaSinAsignarRelacionador');
    if(this.guardiasAsignados.length==0){
      elemento.style.maxHeight ='100%'
    }else if(this.guardiasAsignados.length==1){
      elemento.style.maxHeight ='80%'
    }else if(this.guardiasAsignados.length==2){
      elemento.style.maxHeight ='70%'
    }else {
      elemento.style.maxHeight ='62%'
    }
  }, 500);
}
mostrarAsignarNuevoGuardia(){
  this.tituloHeader='Asignar guardia'
  this.asignarNuevoGuardia=true
  this.buscadorGuardiasSinAsignar=''
  this.guardias=this.guardiasAux
  this.buscadorGuardias=''
  this.guardiasAsignados=this.guardiasAsignadosAux
  setTimeout(() => {
    let elemento = document.getElementById('listaSinAsignarGuardias');
    if(this.guardiasAsignados.length==0){
      elemento.style.maxHeight ='100%'
    }else if(this.guardiasAsignados.length==1){
      elemento.style.maxHeight ='80%'
    }else if(this.guardiasAsignados.length==2){
      elemento.style.maxHeight ='70%'
    }else {
      elemento.style.maxHeight ='62%'
    }
  }, 500);
}
async asignarGuardia(usuario: any,){
  if(this.guardiasAsignados.length<this.maximoGuardias){
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    await loading.present();
    this.eventosService
    .asignarGuardia(
        usuario,
        this.token,
        this.usuario.correo,
        this.idEvento
    )
    .subscribe(
        (res: any) => {
          if (res.success) {
            this.obtenerGuardias()
            this.obtenerRelacionadores()
            loading.dismiss();
            this.mostrarToast(
            "Asignado correctamente",
            );
            // this.asignarNuevoGuardia=false
            // this.asignarNuevoRelacionador=false
            } else {
              this.mostrarToast(
                  "Error al asignar.",
              );
              loading.dismiss();
            }
          },
          (error) => {
              this.mostrarToast(
                  "Error al asignar.",
              );
              loading.dismiss();
            }
    );
   }else{
      this.mostrarToast('Límite de guardias alcanzado para el plan de su evento.')
   }
  }

  async asignarRelacionador(relacionador: any){
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    await loading.present();   
    this.eventosService
    .asignarRelacionador(
        relacionador,
        this.token,
        this.usuario.correo,
        this.idEvento
    )
    .subscribe(
        (res: any) => {
            if (res.success) {
                this.obtenerRelacionadores()
                loading.dismiss();
                this.mostrarToast(
                    "Relacionador asignado correctamente",
                );
            } else {
                    this.mostrarToast(
                        "Error al asignar al relacionador.",
                    );
                    loading.dismiss();
                  }
            },
            (error) => {
                this.mostrarToast(
                    "Error al asignar al relacionador.",
                );
                loading.dismiss();
              }
        );
  }   
  obtenerCantidadMaximaGuardias(){
    this.evento.plan.asignacion_plan.forEach((parametro) => {
        if(parametro.fk_parametro==2){
            this.maximoGuardias =parametro.valor_parametro
            if (this.maximoGuardias==0){
                this.maximoGuardias=600
            }
        }
    });
  }  
  
  async listarInvitadosRelacionador(relacionador){
    let relacionadorID = relacionador.id
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    await loading.present();  
    this.eventosService.listarInvitadosRelacionadorService(relacionadorID,this.idEvento, this.token, this.usuario.correo)
    .subscribe(
        (res: any) => {
            if (res.success) {
                let invitadoAsignados =res.data.invitados
                let parametros_relacionador =res.data.parametros_relacionador
                this.parametrosRelacionador(relacionador,invitadoAsignados,parametros_relacionador)
            }else{

            }
            loading.dismiss();
        })
}
  async parametrosRelacionador(relacionador:any,invitadoAsignados:any,parametros_relacionador:any) {
    
    const modal = await this.modalController.create({
      component: ModalParametrosRelacionadorEventoPage,
      cssClass: 'modal-parametros-relacionador',
      componentProps: {
        idEvento: this.idEvento,
        usuarioDatos: this.usuario,
        relacionador:relacionador,
        invitadoAsignados:invitadoAsignados,
        parametros_relacionador:parametros_relacionador,
      },
      backdropDismiss: true,
    });
    modal.onDidDismiss().then((res) => {
      if (res.data.info === 'aceptar') {
        // this.mostrarToast('Se ha agregado correctamente a tu invitado.');
        // this.obtenerDetallesEvento();
        this.obtenerRelacionadores()
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

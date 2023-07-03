/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute ,NavigationExtras} from '@angular/router';
import { Platform ,NavController} from '@ionic/angular';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner/ngx';
import { LecturaQRService } from '../../services/lectura-qr.service';
import { TokenService } from '../../services/token.service';
import { PopoverMenuComponent } from '../../componets/popover-menu/popover-menu.component';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-menu-principal-seguridad',
  templateUrl: './menu-principal-seguridad.page.html',
  styleUrls: ['./menu-principal-seguridad.page.scss'],
})
export class MenuPrincipalSeguridadPage implements OnInit {
  img: any;
  token;
  usuario: any;
  private URL = environment.API_URL;
  constructor(private router: Router,
    private route: ActivatedRoute,
    public platform: Platform,
    private barcodeScanner: BarcodeScanner,
    public lecturaQRService: LecturaQRService,
    public navController: NavController,
    private tokenService: TokenService,
    public popoverController: PopoverController,
    ) { 
    }
    async ionViewDidEnter(){
      this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
        this.usuario = JSON.parse(value);
        this.img = this.URL + this.usuario.imagen;
        console.log(this.usuario);
      });
    }
  ngOnInit() {
    // this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
    //   this.usuario = JSON.parse(value);
    //   this.img = this.URL + this.usuario.imagen;
    //   console.log(this.usuario);
    // });
    // this.img = this.route.snapshot.paramMap.get('imagen');
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(10, () => {
    });
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
    let aux :any =''
    aux ='4'
    console.log(isNaN(aux))
    if (isNaN(aux)==false){    
      this.lecturaQRService.verificarQR(aux,this.usuario.username, this.token).subscribe((res: any) => {
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
              let invitados = JSON.stringify(res.data.invitados)
              let evento = JSON.stringify(res.data)
              this.router.navigate(['/lista-invitados', {idEvento: res.data.id,portero:true,invitados:invitados,evento:evento}]);
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
          debugger
          this.lecturaQRService.verificarQR(barcodeData.text, this.usuario.username,this.token).subscribe((res: any) => {
            debugger
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
            mensajeAux = 'Esta invitación tiene  '+((res.data.invitadosLeido.acompanhantes - res.data.invitadosLeido.ingresos)+1)+ ' acompañantes restantes.';
            }
            let navigationextras: NavigationExtras = {
              state: {
                nombreEvento : res.data.nombre,
                mensaje: mensajeAux,
                categoria :res.data.invitadosLeido.CategoriaInvitado.nombre,
                valido :true,
                titulo : '¡Bienvenid@!',
                invitado : res.data.invitadosLeido.nombres + ' '+res.data.invitadosLeido.apellidos,
                icono : 'icono_success_qr.png',
                fk_evento :res.data.fk_evento,
                observaciones: res.data.invitadosLeido.observaciones,
              }
            };     
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
    this.router.navigate(['/lista-eventos']);
  }
}

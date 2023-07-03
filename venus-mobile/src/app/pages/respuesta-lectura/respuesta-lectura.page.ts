/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { LecturaQRService } from '../../services/lectura-qr.service';
import { TokenService } from '../../services/token.service';
import {LoadingController, NavController, NavParams, Platform, ToastController} from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-respuesta-lectura',
  templateUrl: './respuesta-lectura.page.html',
  styleUrls: ['./respuesta-lectura.page.scss'],
})
export class RespuestaLecturaPage implements OnInit {
  valido: boolean;
  titulo: string;
  mensaje: string;
  icono: string;
  background: string;
  observacionesG:string='';
  fk_evento: any;
  invitado: string;
  categoria:any;
  nombreEvento: string;
  resInv: number;
//
  bardata: any;
  usernameGuardia: any;
  token: any;
  start: number = 1;
  numAconmpahantes: number;
  arrayNumeros: number[] = [];
  selectedNumber: number;
  idInvitado: number;
  telefonoInv: number;
  correoInv: any;

  customAlertOptions = {
    header: 'Personas',
    subHeader: 'Selecciona cantidad de personas a ingresar',
    message: '',
    translucent: true,
  };
  formularioEditarParametrosInvitado: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public platform: Platform,
    public lecturaQRService: LecturaQRService,
    private tokenService: TokenService,
    ) {
      //evento boton  atras
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.salir();
      });
    }

  ngOnInit() {
   
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state){
        this.valido = this.router.getCurrentNavigation().extras.state.valido;
        if (!this.valido){
          //QR NO VALIDO
          this.background ='linear-gradient(to bottom, #cc4b4b 0%, #662323 100%)';
          this.titulo = this.router.getCurrentNavigation().extras.state.titulo;
          this.nombreEvento = this.router.getCurrentNavigation().extras.state.nombreEvento;
          this.icono = this.router.getCurrentNavigation().extras.state.icono;
          this.mensaje = this.router.getCurrentNavigation().extras.state.mensaje;
        }else{
          //form
          this.formularioEditarParametrosInvitado = this.formBuilder.group({
            telefono: new FormControl(this.router.getCurrentNavigation().extras.state.telefono),
            observaciones_guardia: new FormControl( this.router.getCurrentNavigation().extras.state.observacionesG),
            correo: new FormControl( this.router.getCurrentNavigation().extras.state.correo, [Validators.email]),
          });
           //parametros para el subscriibe 
          
          this.idInvitado = this.router.getCurrentNavigation().extras.state.idInvitado;
          this.usernameGuardia = this.router.getCurrentNavigation().extras.state.username,
          this.token = this.router.getCurrentNavigation().extras.state.token,
          this.numAconmpahantes = this.router.getCurrentNavigation().extras.state.numAcompanhantesRestante+1,
          //Llena el array del 0 hasta numero de acompañantes sobrantes.
          this.arrayNumeros = Array.from({ length: this.numAconmpahantes - this.start + 1 }, (_, index) => index + this.start);
    
          this.background ='linear-gradient(to bottom, #4bcc78 0%, #22663f 100%)';
          this.titulo = this.router.getCurrentNavigation().extras.state.titulo;
          this.invitado = this.router.getCurrentNavigation().extras.state.invitado;
          this.fk_evento = this.router.getCurrentNavigation().extras.state.fk_evento;
          this.nombreEvento = this.router.getCurrentNavigation().extras.state.nombreEvento;
          this.icono = this.router.getCurrentNavigation().extras.state.icono;
          this.categoria = this.router.getCurrentNavigation().extras.state.categoria;
          this.mensaje = this.router.getCurrentNavigation().extras.state.mensaje;
          
        }
      }
    });
    this.selectedNumber = this.arrayNumeros[0]; //valor por defecto si NGmodel no es modificado
  }

  guardarSalir(){
    if (!this.valido){
      
      this.navCtrl.navigateBack(['/home-guardia']);
    }else{
     //
     this.lecturaQRService
      .marcarEntradaInvitado(
        this.idInvitado,
        this.selectedNumber,
        this.token,
        this.usernameGuardia,
        this.formularioEditarParametrosInvitado.value.observaciones_guardia,
        this.formularioEditarParametrosInvitado.value.correo,
        this.formularioEditarParametrosInvitado.value.telefono
      )
      .subscribe(
        (res: any) => {
      
          if (res.success) {
            
          } else {
          }
        },
        (error) => {
          console.log(error);
          debugger
        }
      );
     //
      this.navCtrl.navigateRoot(['/home-guardia']);
    }
  }
  salir(){
    this.navCtrl.navigateRoot(['/home-guardia']);
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LecturaQRService } from '../../services/lectura-qr.service';
import { InvitadosService } from '../../services/invitados.service';
import { TokenService } from '../../services/token.service';
@Component({
  selector: 'app-modal-ingresar-invitado',
  templateUrl: './modal-ingresar-invitado.page.html',
  styleUrls: ['./modal-ingresar-invitado.page.scss'],
})
export class ModalIngresarInvitadoPage implements OnInit {
  @Input() entradas_restantes: any;
  @Input() nombre_invitado: any;
  @Input() invitado_id: any;
  @Input() usuarioDatos: any;
  @Input() observaciones: any;
  @Input() observaciones_guardia: any; //editable
  @Input() telefono: any;
  @Input() correo: any;
  debugger;

  formularioAgregarInvitado: FormGroup;
  numeroSeleccionado: any = 0;
  arrayNumeros: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  customAlertOptions = {
    header: 'Personas',
    subHeader: 'Selecciona cantidad de personas a ingresar',
    message: '',
    translucent: true,
  };
  token;
  cargandoIngreso = false;
  constructor(
    public formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private invitadosService: InvitadosService,
    private modalController: ModalController,
    public lecturaQRService: LecturaQRService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.formularioAgregarInvitado = this.formBuilder.group({});
    debugger;
  }

  ngOnInit() {
    let contadorAux = 1;
    this.arrayNumeros = [];
    this.tokenService.obtenerTokenDesdeStorage().then((value) => {
      this.token = value;
    });
    setTimeout(() => {
      for (let i = 0; i < this.entradas_restantes; i++) {
        this.arrayNumeros.push(contadorAux);
        contadorAux++;
      }
    }, 1000);
    this.debugger
    this.formularioAgregarInvitado = this.formBuilder.group({
      telefono:  new FormControl(this.telefono),
      observaciones_guardia: new FormControl(this.observaciones_guardia),
      correo: new FormControl(this.correo, [Validators.email]),
      acompanhantes: new FormControl('', [Validators.required, Validators.min(1)]),
    });

  }
  limpiarFormulario() {
    this.formularioAgregarInvitado.reset();
  }

  marcarEntrada() {
    this.cargandoIngreso = false;
    console.log(this.usuarioDatos);
    this.lecturaQRService
      .marcarEntradaInvitado(
        this.invitado_id,
        this.formularioAgregarInvitado.value.acompanhantes,
        this.token,
        this.usuarioDatos.username,
        this.formularioAgregarInvitado.value.observaciones_guardia,
        this.formularioAgregarInvitado.value.correo,
        this.formularioAgregarInvitado.value.telefono,
      )
      .subscribe(
        (res: any) => {
          if (res.success) {
            let mensajeAux = '';
            if (
              res.data.dictado_invitado.acompanhantes -
                res.data.dictado_invitado.ingresos +
                1 ===
              0
            ) {
              mensajeAux = 'Ya no tiene acompañantes restantes.';
            } else {
              mensajeAux =
                'Esta invitación tiene  ' +
                (res.data.dictado_invitado.acompanhantes -
                  res.data.dictado_invitado.ingresos +
                  1) +
                ' acompañantes restantes.';
            }
            const navigationextras: NavigationExtras = {
              state: {
                nombreEvento: res.data.nombreEvento,
                mensaje: mensajeAux,
                categoria: res.data.dictado_invitado.CategoriaInvitado.nombre,
                valido: true,
                titulo: '¡Bienvenid@!',
                invitado:
                  res.data.dictado_invitado.nombres +
                  ' ' +
                  res.data.dictado_invitado.apellidos,
                icono: 'icono_success_qr.png',
                fk_evento: res.data.fk_evento,
                observaciones: this.observaciones,
                observaciones__guardia: this.observaciones_guardia,
              },
            };
            this.modalController.dismiss();
            setTimeout(() => {
              this.cargandoIngreso = false;
            }, 3200);
            this.limpiarFormulario();
            this.router.navigate(['/respuesta-lectura'], navigationextras);
          } else {
          }
        },
        (error) => {
          console.log(error);
        }
      );
      debugger
  }

  atras() {
    this.limpiarFormulario();
    this.modalController.dismiss();
  }
}

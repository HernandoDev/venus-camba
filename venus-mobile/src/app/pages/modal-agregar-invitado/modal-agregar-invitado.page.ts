/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController, NavController } from '@ionic/angular';
import { InvitadosService } from '../../services/invitados.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-modal-agregar-invitado',
  templateUrl: './modal-agregar-invitado.page.html',
  styleUrls: ['./modal-agregar-invitado.page.scss'],
})
export class ModalAgregarInvitadoPage implements OnInit {
  @Input() idEvento: number;
  @Input() usuarioDatos: any;
  @Input() nombres: any;
  @Input() telefono: any;
  @Input() correo: any;
  @Input() apellidos: any;
  @Input() invitado_id: number;
  @Input() acompanhantes: any;
  @Input() ingresos: any;
  @Input() observaciones_guardia: any;
  @Input() categoria: any;
  @Input() categorias: any;
  @Input() editar: any;
  @Input() eventoActivo: any;

  @Input() CategoriaInvitado: any;

  formularioAgregarInvitado: FormGroup;

  token;
  observaciones:string;
  acompanhantesAnterior:any=0;
  constructor(public formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private invitadosService: InvitadosService,
    private modalController: ModalController,
    private toastController: ToastController,
    private tokenService: TokenService,
    
    ) {
      this.formularioAgregarInvitado = this.formBuilder.group({
        nombres: new FormControl('', Validators.required),
        telefono: new FormControl('', Validators.required),
        correo: new FormControl('', [Validators.required, Validators.email]),
        apellidos: new FormControl('', Validators.required),
        acompanhantes: new FormControl(0, Validators.required),
        categoria: new FormControl( Validators.required),
        observaciones: new FormControl('0'),
        observaciones_guardia:new FormControl('0')
      });
    }

  ngOnInit() {
    this.tokenService.obtenerTokenDesdeStorage().then((value) => {
      this.token = value;
      let acompanhantesAux =0
      let categoriaAux ='0'

      if (this.acompanhantes == null){
         acompanhantesAux = 0
      }else{
         acompanhantesAux = this.acompanhantes
      }
      if (this.categoria == null){
        categoriaAux ='0'
     }else{
      categoriaAux = this.categoria
     }

    });
    
    console.log(this.nombres,this.apellidos);
    if (this.nombres!=null &&  this.apellidos!=null && this.acompanhantes!=null && this.categoria!=null){
      if(this.ingresos > 0){
        this.acompanhantesAnterior = this.acompanhantes
      }
      this.formularioAgregarInvitado = this.formBuilder.group({
        nombres: new FormControl(this.nombres, Validators.required),
        apellidos: new FormControl(this.apellidos, Validators.required),
        telefono: new FormControl(this.telefono, Validators.required),
        correo: new FormControl(this.correo, [Validators.required, Validators.email]),
        acompanhantes: new FormControl(this.acompanhantes, Validators.required),
        categoria: new FormControl(this.CategoriaInvitado.id, Validators.required),
        observaciones: new FormControl(this.observaciones),
        observaciones_guardia: new FormControl(this.observaciones_guardia),
      });
    }else{
      this.formularioAgregarInvitado = this.formBuilder.group({
        nombres: new FormControl('', Validators.required),
        apellidos: new FormControl('', Validators.required),
        telefono: new FormControl('', Validators.required),
        correo: new FormControl('', [Validators.required, Validators.email]),
        acompanhantes: new FormControl(0, Validators.required),
        categoria: new FormControl(this.categorias[0].id, Validators.required),
        observaciones: new FormControl(''),
      });
    }
  }

  limpiarFormulario() {
    this.formularioAgregarInvitado.controls.nombres.setValue('');
    this.formularioAgregarInvitado.controls.telefono.setValue('');
    this.formularioAgregarInvitado.controls.correo.setValue('');
    this.formularioAgregarInvitado.controls.apellidos.setValue('');
    this.formularioAgregarInvitado.controls.acompanhantes.setValue('');
    this.formularioAgregarInvitado.controls.categoria.setValue(this.categorias[0].id);
  }

  capitalizarPalabra(palabra) {
    if (!palabra) {return palabra;}
    palabra = palabra.trim();
    const arrayPalabra = palabra.split(' ');
    let valor = '';
    arrayPalabra.forEach(palabra => {
      valor += palabra[0].toUpperCase() + palabra.substr(1).toLowerCase() + ' ';
    });
    return valor.trim();
  }

  async agregarInvitado(){
    
    const formularioValores = this.formularioAgregarInvitado.value;
    const invitado = {
      nombres: this.capitalizarPalabra(formularioValores.nombres),
      apellidos: this.capitalizarPalabra(formularioValores.apellidos),
      acompanhantes: parseInt(formularioValores.acompanhantes, 10),
      fkcategoria: parseInt(formularioValores.categoria, 10),
      telefono: formularioValores.telefono,
      correo: formularioValores.correo,
      fk_evento: this.idEvento,
      observaciones :formularioValores.observaciones,
    };
    

    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    
    await loading.present();
    this.invitadosService.agregarInvitado(invitado, this.token,this.usuarioDatos.correo).subscribe((res: any) => {
      if (res.success) {
        this.modalController.dismiss({
          info: 'aceptar'
        });
        loading.dismiss();
      } else if (res.data === 'Error 403, token invalido') {
        this.modalController.dismiss({
          info: 'token'
        });
        loading.dismiss();
      } else if (!res.success) {
        loading.dismiss();
        this.mostrarToast(res.message);
        // this.modalController.dismiss();
      } else {
        this.mostrarToast('No se agregó ningún invitado, por favor intenta nuevamente.');
        loading.dismiss();
      }
    }, error => {
      loading.dismiss();
      this.mostrarToast('Hubo un error, por favor intenta de nuevo.');
    });
  }

  async editarInvitado(){
    if(this.eventoActivo){
      if(this.editar){
        const formularioValores = this.formularioAgregarInvitado.value;
        const invitado = {
          nombres: this.capitalizarPalabra(formularioValores.nombres),
          apellidos: this.capitalizarPalabra(formularioValores.apellidos),
          acompanhantes: parseInt(formularioValores.acompanhantes, 10),
          fkcategoria: parseInt(formularioValores.categoria, 10),
          fk_evento: this.idEvento,
          observaciones :formularioValores.observaciones,
          telefono :formularioValores.telefono,
          correo :formularioValores.correo,
          invitado_id:this.invitado_id
        };
        let validacionAcompanhantes = true
        if(this.ingresos > 0){
          if (invitado.acompanhantes <this.acompanhantes){
              validacionAcompanhantes=false
          }
        }
        if (validacionAcompanhantes){
          const loading = await this.loadingController.create({
            spinner: 'crescent',
            translucent: false,
          });

          await loading.present();
          this.invitadosService.editarInvitado(invitado, this.token,this.usuarioDatos.correo).subscribe((res: any) => {
            if (res.success) {
              this.modalController.dismiss({
                info: 'aceptar'
              });
              loading.dismiss();
            } else if (res.data === 'Error 403, token invalido') {
              this.modalController.dismiss({
                info: 'token'
              });
              loading.dismiss();
            } else if (!res.success) {
              loading.dismiss();
              this.mostrarToast(res.message);
              // this.modalController.dismiss();
            } else {
              this.mostrarToast('No se agregó ningún invitado, por favor intenta nuevamente.');
              loading.dismiss();
            }
          }, error => {
            loading.dismiss();
            this.mostrarToast('Hubo un error, por favor intenta de nuevo.');
          });
        }else{
          this.mostrarToast('No puedes eliminar acompañantes de un invitado que ya cuenta con ingresos.');
        }
      }
    }
  }  

  async mostrarToast(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1000,
      cssClass : 'toast-purple',
    });
    toast.present();
  }

  atras() {
    this.modalController.dismiss();
  }

}

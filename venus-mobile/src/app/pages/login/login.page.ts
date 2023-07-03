import { Component, OnInit, ViewChild, ElementRef} from  '@angular/core';

import { Storage } from '@capacitor/storage';
import { AuthService } from '../../services/auth.service';
import { NavController, LoadingController, Platform, ToastController, ModalController ,AlertController, AnimationController} from '@ionic/angular';
import {NavigationExtras, Router} from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('passwordEyeRegister', { read: ElementRef }) passwordEye: ElementRef
  passwordTypeInput  =  'password';

  formularioLogin: FormGroup;

  constructor(private loginService: LoginService,
    public formBuilder: FormBuilder,
    public platform: Platform,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public authService: AuthService,
    public navController: NavController,
    private animationController: AnimationController,
    private toastController: ToastController,
    private router: Router,
    ) {
      this.formularioLogin = this.formBuilder.group({
        usuario: new FormControl('', Validators.required),
        contrasenha: new FormControl('', Validators.required)
      });
    }

  ngOnInit() {

  }
  togglePasswordMode() {
    //cambiar tipo input
this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
   //obtener el input
   const nativeEl = this.passwordEye.nativeElement.querySelector('input');
   //obtener el indice de la posición del texto actual en el input
   const inputSelection = nativeEl.selectionStart;
   //ejecuto el focus al input
   nativeEl.focus();
  //espero un milisegundo y actualizo la posición del indice del texto
   setTimeout(() => {
       nativeEl.setSelectionRange(inputSelection, inputSelection);
   }, 1);
  }
  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(10, () => {

    });
  }

  cargarAnimaciones() {
    this.animationController.create()
    .addElement(document.querySelector('.square'))
    .duration(1000)
    .fromTo('opacity', '1', '0.5');
  }

  async iniciarSesion() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: false,
    });
    await loading.present();
    const formularioValores = this.formularioLogin.value;
    const usuario = {
      correo: formularioValores.usuario,
      contrasenha: formularioValores.contrasenha,
    };
    this.loginService.iniciarSesion(usuario).subscribe(async result => {
      if (result.success) {
        await Storage.set({
          key: 'token',
          value: result.data.usuario.token_jwt
        });
        await Storage.set({
          key: 'usuario',
          value: JSON.stringify(result.data.usuario)
        });
        setTimeout(() => {
          if (result.data.usuario.fk_rol === 1) {
            loading.dismiss();
            this.router.navigate(['home-anfitrion']);
            this.navController.navigateRoot('/home-anfitrion');
          } else {
            loading.dismiss();
            this.router.navigate(['home-guardia']);
            this.navController.navigateRoot('/home-guardia');
          }
          this.limpiarFormulario();
        }, 200);
      } else {
        loading.dismiss();
        this.mostrarAlerta('Error', result.message);
      }
    }, error => {
      // showToast("Ocurrió un error", 3000);
    });
  }

  limpiarFormulario() {
    this.formularioLogin.controls.usuario.setValue('');
    this.formularioLogin.controls.contrasenha.setValue('');
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
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

}

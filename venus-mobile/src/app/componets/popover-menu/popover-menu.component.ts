import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoginService } from '../../services/login.service';
import { TokenService } from '../../services/token.service';


@Component({
  selector: 'app-popover-menu',
  templateUrl: './popover-menu.component.html',
  styleUrls: ['./popover-menu.component.scss'],
})
export class PopoverMenuComponent implements OnInit {
  @Input() usuario;
  token;

  constructor(
    public router: Router,
    public alertController: AlertController,
    private loginService: LoginService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    // this.tokenService.obtenerTokenDesdeStorage().then((value) => {
    //   this.token = value;
    // });
  }
  async ionViewDidEnter(){
    this.tokenService.obtenerTokenDesdeStorage().then((value) => {
      this.token = value;
    });
  }

  cerrarSesion() {
    this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
      const usuario = JSON.parse(value);
      this.loginService.logOut(this.token,usuario.id).subscribe(async result => {
        // this.eliminarToken();
        // this.eliminarUsuario();
        this.eliminarStorage();
        this.router.navigate(['/login']);
      });
    });
  }

  async eliminarStorage() {
    await Storage.remove({ key: 'usuario' });
    await Storage.clear();
    await Storage.remove({ key: 'token' });

  }
  eliminarToken = async () => {
    await Storage.remove({ key: 'token' });
  };
  eliminarUsuario = async () => {
    await Storage.remove({ key: 'usuario' });
  };

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
            this.cerrarSesion();
          }
        }
      ]
    });

    await alert.present();
  }
}

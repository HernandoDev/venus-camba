import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
// import { SplashScreen } from '@capacitor/splash-screen';
import { Platform, NavController} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public router: Router,
    public platform: Platform,
    ) {
    this.verificarUsuario();
    this.platform.ready().then(() => {
      //SplashScreen.hide();
    });  }
  async verificarUsuario() {
    const { value } = await Storage.get({ key: 'usuario' });
    if (value === null) {
      this.router.navigate(['/login']);
    } else {
      const usuario = JSON.parse(value);
      if (usuario.fk_rol === 2) {
        this.router.navigate(['/home-guardia']);
      } else {
        this.router.navigate(['/home-anfitrion']);
      }
    }
  }
}

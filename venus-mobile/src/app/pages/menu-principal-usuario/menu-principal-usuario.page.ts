/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { PopoverMenuComponent } from '../../componets/popover-menu/popover-menu.component';
import { PopoverController } from '@ionic/angular';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-menu-principal-usuario',
  templateUrl: './menu-principal-usuario.page.html',
  styleUrls: ['./menu-principal-usuario.page.scss'],
})
export class MenuPrincipalUsuarioPage implements OnInit {
  img: any;
  usuario: any;
  private URL = environment.API_URL;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public platform: Platform,
    public popoverController: PopoverController,
    private tokenService: TokenService,

    ) { }

  ngOnInit() {
    // this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
    //   this.usuario = JSON.parse(value);
    //   this.img = this.URL + this.usuario.imagen;
    //   console.log(this.usuario);
    // });
    // this.img = this.route.snapshot.params.imagen;
  }

  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(10, () => {

    });
    this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
      this.usuario = JSON.parse(value);
      this.img = this.URL + this.usuario.imagen;
      console.log(this.usuario);
    });
    this.img = this.route.snapshot.params.imagen;


  }


  abrirEventos(){
    this.router.navigate(['/lista-eventos']);
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

}

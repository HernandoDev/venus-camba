/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit ,ViewChild ,ElementRef} from '@angular/core';
import { environment } from '../../../environments/environment';
import QRCode from 'easyqrcodejs';
import { AlertController, ToastController, NavController, Platform, ModalController } from '@ionic/angular';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-modal-usuario-qr-evento',
  templateUrl: './modal-usuario-qr-evento.page.html',
  styleUrls: ['./modal-usuario-qr-evento.page.scss'],
})
export class ModalUsuarioQrEventoPage implements OnInit {
  @Input() idEvento: any;
  @ViewChild('qrcode', {static: false}) qrcode: ElementRef;
  QRInvitacion: any;
  usuario:any;
  private URL = environment.API_URL;
  img:any;
  constructor(
    private platform: Platform,
    public socialSharing: SocialSharing,
    private tokenService: TokenService,
    private modalController: ModalController,
  ) { 

  }
  ngAfterViewInit(){

 this.crearQR()

  }

    crearQR(){
      this.tokenService.obtenerUsuarioDesdeStorage().then((value) => {
        this.usuario = JSON.parse(value);
        this.img = this.URL + this.usuario.imagen;
        let ruta = 'assets/images/slapp.png'
        if(this.idEvento ==5 || this.idEvento == 7){
           ruta = 'assets/images/beyond1.jpeg'
        }else if (this.idEvento ==6 || this.idEvento == 8){
          ruta = 'assets/images/beyondwhite.jpeg'
        }
      const options = {
          text: this.idEvento,
          width: 256,
          height: 256,
          quietZone: 10,
          logo: ruta, // Relative address, relative to `easy.qrcode.mi
          logoBackgroundTransparent: true,
          onRenderingEnd: (_qrCodeOptions, base64DataFn) => {
            //  After the QR code rendering is successful ...
            this.QRInvitacion = base64DataFn;
          }
      };
      // Create new QRCode Object
      new QRCode(this.qrcode.nativeElement, options);
    });
    }
  ngOnInit() {
    // this.generateBarCode()
    console.log(this.idEvento);


  }
  atras() {
    this.modalController.dismiss();
  }
  compartirInvitacion() {
    
    console.log(this.QRInvitacion);
    if(this.platform.is('ios')) {
      const opciones: any = {
        files: [this.QRInvitacion],
      };
      this.socialSharing.shareWithOptions(opciones);
    } else {
      // this.socialSharing.share('  ¡Te enviaron una invitación con MENCARGO! Preséntala en portería al llegar' +
      // ' al condominio. Aquí tienes la ubicación: \n¿Quieres MENCARGO en tu condominio?' +
      // '', 'Invitación', this.QRInvitacion, null);
      
      this.socialSharing.share('','', this.QRInvitacion, null);
    }
  }


}

/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  constructor(private camera: Camera, private actionSheetCtrl: ActionSheetController,) { }

  async menuOpcionesSubidaImagen() {
    return new Promise(async (resolve, reject) => {
      const actionSheet = await this.actionSheetCtrl.create({
        // header: this.personal.usuarioNombre + ' ' + this.personal.usuarioApellidos,
        cssClass: 'action-sheet-glass',
        buttons: [{
          text: 'Cámara',
          icon: 'camera',
          cssClass: 'actionSheetButtonPrimary',
          handler: () => {
            this.obtenerImagenCamara().then((imageData: any) => {
              resolve(imageData);
            }).catch((error) => {
              reject();
              // this.utilitariosSrv.toastInformativo(error, 2500, 'Cerrar');
            });
          }
        }, {
          text: 'Galería',
          icon: 'images',
          cssClass: 'actionSheetButtonPrimary',
          handler: () => {
            this.obtenerImagenGaleria().then((imageData: any) => {
              resolve(imageData);
            }).catch((error) => {
              reject();
              // this.utilitariosSrv.toastInformativo(error, 2500, 'Cerrar');
            });
          }
        }]
      });
      await actionSheet.present();
    });
  }
  async obtenerImagenCamara() {
    return new Promise((resolve, reject) => {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        cameraDirection: 1,
        // allowEdit: true,
        targetHeight: 800,
        targetWidth: 800
      };
      this.camera.getPicture(options).then((ImageData => {
        resolve(ImageData);
      }), error => {
        console.log(error);
      });
    });
  }
  async obtenerImagenGaleria() {
    return new Promise((resolve, reject) => {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        cameraDirection: 1,
        // allowEdit: true,
        targetHeight: 800,
        targetWidth: 800
      };
      this.camera.getPicture(options).then((ImageData => {
        resolve(ImageData);
      }), error => {
        console.log(error);
      });
    });
  }
}


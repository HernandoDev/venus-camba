import { ToastController } from '@ionic/angular';

export class Utils {

  constructor(private toastController: ToastController) {}

  async showToast(message, duration) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });

    await toast.present();
  }

}


import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qsm.ventu',
  appName: 'Ventu',
  webDir: 'www',
  bundledWebRuntime: false,
  // plugins:{
  //   SplashScreen: {
  //     launchAutoHide: true,
  //     showSpinner: false,
  //     launchShowDuration: 3000,
  //     splashFullScreen: false,
  //     splashImmersive: false,
  //     androidScaleType: 'CENTER_CROP' // Con esto se controla que el splashscreen no se estirey mantenga su relacion de aspecto
  //   }
  // }
};

export default config;

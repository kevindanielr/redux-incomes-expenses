import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'New Ionic App',
  webDir: 'dist/app/browser',
  bundledWebRuntime: false,
  "plugins": {
    "SplashScreen": {
        "launchAutoHide": false,
        "androidScaleType": "CENTER_CROP",
        "splashFullScreen": true,
        "splashImmersive": false,
        "showSpinner": false,
        "backgroundColor": "#ffffff" // YOUR SPLASH SCREEN MAIN COLOR
    }
}
};

export default config;

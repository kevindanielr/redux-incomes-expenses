import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { SeoService } from './utils/seo/seo.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HistoryHelperService } from './utils/history-helper.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import OneSignal from 'onesignal-cordova-plugin';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    './side-menu/styles/side-menu.scss',
    './side-menu/styles/side-menu.shell.scss',
    './side-menu/styles/side-menu.responsive.scss'
  ]
})
export class AppComponent {
  appPages = [
    {
      title: 'Home',
      url: '/home',
      ionicIcon: 'home-outline',
      roles: ['COR', 'SUP', 'OP']
    },
    {
      title: 'Diurno',
      url: '/listing-request-diurno',
      ionicIcon: 'sunny-outline',
      roles: ['COR', 'SUP', 'OP']
    },
    {
      title: 'Nocturno',
      url: '/app',
      ionicIcon: 'moon-outline',
      roles: ['CC','COR', 'SUP', 'OP', 'DR']
    },
    {
      title: 'VIP',
      url: '/app',
      ionicIcon: 'car-sport-outline',
      roles: ['EX']
    },
    {
      title: 'Alertas',
      url: '/app/notifications',
      ionicIcon: 'notifications-outline'
    }
  ];
  accountPages = [
    {
      title: 'Perfil de usuario',
      url: '/profile',
      ionicIcon: 'person-outline'
    }
  ];

  textDir = 'ltr';

  // Data del user
  userData: any;

  // Inject HistoryHelperService in the app.components.ts so its available app-wide
  constructor(
    public translate: TranslateService,
    public historyHelper: HistoryHelperService,
    private router: Router,
    private platform: Platform
  ) {
    this.initializeApp();
    this.setLanguage();
    platform.ready().then(() => {
      this.OneSignalInit();
    });
  }

  async initializeApp() {
    try {
     await SplashScreen.hide();
    
    if (localStorage.getItem('token') !== null) {
      this.router.navigate(['/home']);
    }

    if (localStorage.getItem('userExpress') !== null) {
      this.router.navigate(['/listing-express']);
    }

    } catch (err) {
     console.log('This is normal in a browser', err);
    }
  }

  

  // Call this function when your app starts
  OneSignalInit(): void {
    // NOTE: Update the setAppId value below with your OneSignal AppId.
    try {
      OneSignal.setAppId("daf2f77a-b2d5-4d09-9e86-2dfeb39244ab");

      OneSignal.setNotificationOpenedHandler(function(jsonData) {
          console.log('notificationOpenedCallback: ', jsonData);
      });
  
      OneSignal.getDeviceState( resp => {
        console.log("State: ", resp);
      });

      OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
          console.log("User accepted notifications: " + accepted);
      });
      
    } catch (error) {
      console.log(" *** Navegador Web activo - Notificaciones desactivadas ***"); 
    }
  }

  setLanguage() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');

    // this is to determine the text direction depending on the selected language
    // for the purpose of this example we determine that only arabic and hebrew are RTL.
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   this.textDir = (event.lang === 'ar' || event.lang === 'iw') ? 'rtl' : 'ltr';
    // });
  }

  menuOpened() {

    // this.getDataUser();
    this.userData = JSON.parse(localStorage.getItem('userData'));

    if (this.userData?.rolId?.rolId === 1) {

      this.appPages = [
        {
          title: 'Home',
          url: '/home',
          ionicIcon: 'home-outline',
          roles: ['COR', 'SUP', 'OP']
        },
        {
          title: 'Nocturno',
          url: '/app',
          ionicIcon: 'moon-outline',
          roles: ['CC','COR', 'SUP', 'OP', 'DR']
        },
        // {
        //   title: 'Alertas',
        //   url: '/app/alert',
        //   ionicIcon: 'notifications-outline'
        // }
      ];
      
    } else if (this.userData?.rolId?.rolId === 4) {

      this.appPages = [
        {
          title: 'Home',
          url: '/home',
          ionicIcon: 'home-outline',
          roles: ['COR', 'SUP', 'OP']
        },
        {
          title: 'Diurno',
          url: '/listing-request-diurno',
          ionicIcon: 'sunny-outline',
          roles: ['COR', 'SUP', 'OP']
        },
        {
          title: 'Nocturno',
          url: '/app',
          ionicIcon: 'moon-outline',
          roles: ['CC','COR', 'SUP', 'OP', 'DR']
        },
        {
          title: 'VIP',
          url: '/listing-express',
          ionicIcon: 'car-sport-outline',
          roles: ['EX']
        },
        {
          title: 'Búsqueda',
          url: '/find-employee',
          ionicIcon: 'search-outline',
          roles: ['EX']
        }
        // {
        //   title: 'Alertas',
        //   url: '/app/alert',
        //   ionicIcon: 'notifications-outline'
        // }
      ];
    } else if (this.userData?.rolId?.rolId === 5) {

      this.appPages = [
        {
          title: 'Home',
          url: '/home',
          ionicIcon: 'home-outline',
          roles: ['COR', 'SUP', 'OP']
        },
        {
          title: 'Mis rutas ',
          url: 'app/my-route',
          ionicIcon: 'analytics-outline',
          roles: ['CC','COR', 'SUP', 'OP', 'DR']
        },
        {
          title: 'Búsqueda',
          url: '/find-employee',
          ionicIcon: 'search-outline',
          roles: ['EX']
        }
        // {
        //   title: 'Alertas',
        //   url: '/app/alert',
        //   ionicIcon: 'notifications-outline'
        // }
      ];

    } else if (this.userData?.rolId?.rolId === 3) {

      this.appPages = [
        {
          title: 'Home',
          url: '/home',
          ionicIcon: 'home-outline',
          roles: ['COR', 'SUP', 'OP']
        },
        {
          title: 'Diurno',
          url: '/listing-request-diurno',
          ionicIcon: 'sunny-outline',
          roles: ['COR', 'SUP', 'OP']
        },
        {
          title: 'Nocturno',
          url: '/app',
          ionicIcon: 'moon-outline',
          roles: ['CC','COR', 'SUP', 'OP', 'DR']
        },
        {
          title: 'VIP',
          url: '/listing-express',
          ionicIcon: 'car-sport-outline',
          roles: ['EX']
        },
        {
          title: 'Búsqueda',
          url: '/find-employee',
          ionicIcon: 'search-outline',
          roles: ['EX']
        },
        // {
        //   title: 'Alertas',
        //   url: '/app/alert',
        //   ionicIcon: 'notifications-outline'
        // }
      ];
    } else if (this.userData?.rolId?.rolId === 2) {

      this.appPages = [
        {
          title: 'Home',
          url: '/home',
          ionicIcon: 'home-outline',
          roles: ['COR', 'SUP', 'OP']
        },
        {
          title: 'Diurno',
          url: '/listing-request-diurno',
          ionicIcon: 'sunny-outline',
          roles: ['COR', 'SUP', 'OP']
        },
        {
          title: 'Nocturno',
          url: '/app',
          ionicIcon: 'moon-outline',
          roles: ['CC','COR', 'SUP', 'OP', 'DR']
        },
        // {
        //   title: 'Alertas',
        //   url: '/app/alert',
        //   ionicIcon: 'notifications-outline'
        // }
      ];
    } else {
      this.userData = {
        "userName": JSON.parse(localStorage.getItem('userExpress'))?.name,
        "rolId":{
          "rolName": "USUARIO VIP"
        } 
      }
      
      this.appPages = [
        {
          title: 'VIP',
          url: '/listing-express',
          ionicIcon: 'car-sport-outline',
          roles: ['EX']
        }
      ];
    }
  }

  // Obteniendo data del user
  getDataUser() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }

  //Funcion para cerrar sesion
  logOut() {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }

}

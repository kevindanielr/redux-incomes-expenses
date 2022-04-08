import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, LoadingController } from '@ionic/angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from '@awesome-cordova-plugins/camera/ngx';
import { UiServiceService } from '../../../shared/ui-service.service';
import { RouteService } from '../route.service';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: [
    './styles/firebase-create-user.modal.scss',
    './styles/firebase-create-user.shell.scss'
  ],
})
export class ProfileComponent implements OnInit {

  employeeForm: FormGroup;

  employeeData: any;
  userData: any;
  tempImage: string;

  loading: any;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private uiService: UiServiceService,
    private routeService: RouteService,
    private loadingController: LoadingController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.employeeData = JSON.parse(localStorage.getItem('employeeData'));
    this.userData = JSON.parse(localStorage.getItem('userData'));

    this.createFormEmployee();
    this.setForm();
  }

  async ionViewWillEnter() {
    const valDataEmployee = await this.getEmployeeData(JSON.parse(localStorage.getItem('userData')).userId);
    if (valDataEmployee) {
      this.employeeData = JSON.parse(localStorage.getItem('employeeData'));
      this.userData = JSON.parse(localStorage.getItem('userData'));
  
      this.createFormEmployee();
      this.setForm();
    }
    
  }

   // Funcion para loading
   async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Espere por favor...',
      mode: 'ios',
      translucent: true
    });
    await this.loading.present();
  }

  createFormEmployee(){
    this.employeeForm = this.fb.group({
      employeeId: [''],
      employeeEmail: ['', Validators.required],
      employeeFirstName: ['', Validators.required],
      employeeLastName: ['', Validators.required],
      employeeNumber: ['', Validators.required],
      employeeAddress: ['', Validators.required],
      employeePhoto: [''],
      employeePhone: ['', Validators.required],
      statusId: this.fb.group({
        statusId: ['', Validators.required]
      }),
      userId: this.fb.group({
        userId: [''],
        password: ['', Validators.required],
        userEmail: [''],
        userName: [''],
        rolId: this.fb.group({
          rolId: ['']
        }),
        statusId: this.fb.group({
          statusId: ['']
        })
      }),
      companyId: this.fb.group({
        companyId: ['', Validators.required]
      }),
      accountId: this.fb.group({
        accountId: ['', Validators.required]
      })
    });

  }

  async getEmployeeData( userId ) {
    console.log("get Employee");
    this.presentLoading();
    return new Promise(resolve => {
      this.auth.getDataEmployee(userId).subscribe( resp => {
        console.log("data Employee", resp);
        
        localStorage.setItem('employeeData', JSON.stringify(resp));
        this.loading.dismiss();
        resolve(true);
      }, error => {
        this.loading.dismiss();
        resolve(false);
      });

    })
  }

  setForm() {
    let e = JSON.parse(localStorage.getItem('employeeData'));
    let u = JSON.parse(localStorage.getItem('userData'));

    console.log(u.rolId.rolId);
    

    this.tempImage = u.photo;
  
    this.employeeForm.patchValue({
      employeeEmail: e.employeeEmail,
      employeeFirstName: e.employeeFirstName,
      employeeId: e.employeeId,
      employeePhoto: u.photo,
      employeeLastName: e.employeeLastName,
      employeeAddress: e.employeeAddress,
      employeeNumber: e.employeeNumber,
      employeePhone: e.employeePhone,
      companyId: {
        companyId: e.companyId.companyId,
      },
      statusId: {
        statusId: e.statusId.statusId,
      }, 
      userId: {
        userId: u.userId,
        password: u.password,
        userEmail: u.userEmail,
        userName: u.userName,
        rolId: {
          rolId: u.rolId.rolId
        },
        statusId: {
          statusId: u.statusId.statusId,
        },
      },
      accountId: {
        accountId: e.accountId.accountId
      }
    });
    console.log(this.employeeForm.value);
    
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  createUser() {
    if ( this.employeeForm.invalid ) {
      this.uiService.toastInformativo('El formulario tiene campos requeridos.','warning','warning');
      return Object.values( this.employeeForm.controls ).forEach( control =>{

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() )
        }

        control.markAsTouched();
      });
      
    }

    this.presentLoading();

    this.routeService.onSaveUser(this.employeeForm.get('userId').value).subscribe(res => {
      console.log("userData: ", res);
      
      this.routeService.onSaveEmployee(this.employeeForm.value).subscribe( (resp: any) => {
        this.uiService.toastInformativo('Pefil modificado correctamente.','success','save');
        this.loading.dismiss();
      });
    }, error => {
      this.uiService.toastInformativo('Error al modificar el perfil, intentelo de nuevo.','danger','warning');
      this.loading.dismiss();
    });

  }

  async changeUserImage() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Galeria',
          icon: 'images',
          cssClass: 'action-dark',
          handler: () => {
            this.openCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Usar camara',
          icon: 'camera',
          cssClass: 'action-dark',
          handler: () => {
            this.openCamera(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancelar',
          icon: 'arrow-back',
          cssClass: 'action-dark',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  dismissModal() {
   this.modalController.dismiss();
  }

  openCamera(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      // allowEdit: true,
      sourceType
    };

    this.camera.getPicture(options).then( ( imagePath ) => {
      let base64Image = 'data:image/jpeg;base64,' + imagePath;
      this.tempImage = base64Image;
      this.employeeForm.controls['employeePhoto'].setValue(this.tempImage);
    }, (err) => {
      console.log("Error camera: ", err);
      
      this.uiService.toastInformativo('Error al intentar capturar una foto con la cámara, inténtalo de nuevo.','warning','warning');
    });
  }


}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { UiServiceService } from '../../../shared/ui-service.service';
import { RouteService } from '../route.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { dataURLtoFile, fileToBase64 } from '../../../app/utils/ImageHelper';

declare var window: any;

@Component({
  selector: 'app-form-equipment',
  templateUrl: './form-equipment.page.html',
  styleUrls: ['./form-equipment.page.scss'],
})
export class FormEquipmentPage implements OnInit {

  companys: any[];
  asignForm: FormGroup;
  loading: any;

  //Image
  tempImage: string = '';
  imageData: string = '';

  // Inputs
  @Input() scheduleRouteId;
  @Input() companyId;

  sliderOptions = {
    allowSlidePrev: false,
    allowSlideNext: false
  }

  constructor(
    private fb: FormBuilder,
    private uiService: UiServiceService,
    private modalCtrl: ModalController,
    private camera: Camera,
    private routeService: RouteService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.createForm();
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

  get equipmentNameNoValido() {
    return this.asignForm.get('equipmentName').invalid && this.asignForm.get('equipmentName').touched;
  }

  get equipmentDescriptionNoValido() {
    return this.asignForm.get('equipmentDescription').invalid && this.asignForm.get('equipmentDescription').touched;
  }

  get initialPhotoNoValido() {
    return this.asignForm.get('initialPhoto').invalid && this.asignForm.get('initialPhoto').touched;
  }

  onSubmit() {
    if ( this.asignForm.invalid ) {
      this.uiService.toastInformativo('El formulario tiene campos requeridos.','warning','warning');
      return Object.values( this.asignForm.controls ).forEach( control =>{
        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() )
        }
        control.markAsTouched();
      });
    }

    this.presentLoading();
    this.routeService.onSaveEquipment( this.asignForm.value ).subscribe( resp => {
      this.uiService.toastInformativo('¡Equipo agregado correctamente a la solicitud!','success','save');
      this.loading.dismiss();
      this.modalCtrl.dismiss({refresh: true});
    }, error => {
      this.loading.dismiss();
      this.uiService.toastInformativo('Error al intentar guardar una equipo en la solicitud diurna, inténtalo de nuevo.','danger','warning');
    });

  }

  // Creacion de formulario
  createForm() {
    this.asignForm = this.fb.group({
      companyId: this.fb.group({
        companyId: [this.companyId?.companyId, Validators.required],
      }),
      equipmentDescription: [null, Validators.required],
      equipmentId: [null],
      equipmentName: [null, Validators.required],
      initialPhoto: [null, Validators.required],
      scheduleRouteId: this.fb.group({
        scheduleRouteId: [this.scheduleRouteId, Validators.required]
      })
    })
  }

  // Función para cerrar modal
  closeModal(){
    this.modalCtrl.dismiss();
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    this.camera.getPicture(options).then( ( imagePath ) => {
      let base64Image = 'data:image/jpeg;base64,' + imagePath;
      this.tempImage = base64Image;
      this.asignForm.controls['initialPhoto'].setValue(this.tempImage);
    }, (err) => {
      this.uiService.toastInformativo('Error al intentar capturar una foto con la cámara, inténtalo de nuevo.','warning','warning');
    });
  }

}

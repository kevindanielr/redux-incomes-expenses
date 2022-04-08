import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { UiServiceService } from '../../../shared/ui-service.service';
import { RouteService } from '../route.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Geolocation, Geoposition } from '@awesome-cordova-plugins/geolocation/ngx';

declare var window: any;

@Component({
  selector: 'app-form-equipment-validate',
  templateUrl: './form-equipment-validate.page.html',
  styleUrls: ['./form-equipment-validate.page.scss'],
})
export class FormEquipmentValidatePage implements OnInit {

  companys: any[];
  asignForm: FormGroup;

  //Image
  tempImage: string = '';
  imageData: string = '';

  loading: any;

  @Input() equipmentId;

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
    private geolocation: Geolocation,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.createForm();
  }

  get finalPhotoNoValido() {
    return this.asignForm.get('finalPhoto').invalid && this.asignForm.get('finalPhoto').touched;
  }

  onSubmit() {
    
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      
      this.asignForm.controls['latitude'].setValue(geoposition.coords.latitude);
      this.asignForm.controls['longitude'].setValue(geoposition.coords.longitude);

      console.log(this.asignForm);
      
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
      this.routeService.verifyEquipment( this.asignForm.value ).subscribe( resp => {
        this.uiService.toastInformativo('¡Equipo verificado correctamente!','success','save');
        this.loading?.dismiss();
        this.modalCtrl.dismiss({refresh: true});
      }, error => {
        this.loading?.dismiss();
        this.uiService.toastInformativo('Error al intentar verificar una equipo en la solicitud diurna, inténtalo de nuevo.','danger','warning');
      });

    });



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

  // Creacion de formulario
  createForm() {
    this.asignForm = this.fb.group({
      equipmentNotes: [null],
      equipmentId: [this.equipmentId , Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      finalPhoto: [null, Validators.required],
      verified: [true]
    });
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
      this.asignForm.controls['finalPhoto'].setValue(this.tempImage);
    }, (err) => {
      this.uiService.toastInformativo('Error al intentar capturar una foto con la cámara, inténtalo de nuevo.','warning','warning');
    });
  }

}

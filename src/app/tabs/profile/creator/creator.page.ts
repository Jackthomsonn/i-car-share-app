import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geocoder, GoogleMap } from '@ionic-native/google-maps';
import { AlertController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Days } from 'src/app/enums/days';
import { ICarShare } from 'src/app/interfaces/ICarShare';
import { ICar } from '../../../interfaces/ICar';
import { PlaceNamePipe } from '../../../pipes/place-name/place-name.pipe';
import { CarShareProvider } from '../../../providers/car-share/car-share.provider';
import { CarProvider } from '../../../providers/car/car.provider';
import { LoadingProvider } from '../../../providers/loading/loading.provider';
import { BaseComponent } from '../../../shared/base/base.component';

@Component({
  selector: 'app-creator',
  templateUrl: 'creator.page.html',
  styleUrls: ['creator.page.scss']
})

export class CreatorPage extends BaseComponent implements OnInit {
  public carShare: ICarShare;
  public map: GoogleMap;
  public availableCars: ICar[];
  public locations: { origin: string, destination: string };
  public availableDays: string[];
  public isInUpdateMode: boolean;
  public originPlaceName: string;
  public destinationPlaceName: string;
  public isSaving: boolean;

  constructor(
    private carProvider: CarProvider,
    private carShareProvider: CarShareProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute,
    private placeName: PlaceNamePipe,
    private router: Router,
    protected loadingProvider: LoadingProvider) {
    super(loadingProvider);
  }

  public async manageCarShare() {
    this.showLoader();
    this.toggle('isSaving');

    const toast = await this.toastCtrl.create({
      message: `${this.isInUpdateMode ? 'Updating' : 'Creating'} car share..`,
      color: 'dark'
    });

    const toastSuccess = await this.toastCtrl.create({
      message: `Car share ${this.isInUpdateMode ? 'updated' : 'created'} successfully`,
      color: 'dark',
      duration: 2000
    });

    toast.present();

    try {
      await this.transformCoordinatesForLocation();
      const methodToInvokeUponSaving = this.isInUpdateMode ? 'updateCarShare' : 'createCarShare';

      this.carShareProvider[methodToInvokeUponSaving](this.carShare).subscribe(() => {
        toast.dismiss();
        toastSuccess.present();
        this.router.navigate(['tabs/profile'], { state: { forceRefresh: true } });
        this.hideLoader();
        this.toggle('isSaving');
        this.carShare = this.setDefaultCarShareObject();
        this.locations = this.setDefaultLocationsObject();
      }, async (err) => {
        if (err) {
          const alert = await this.alertCtrl.create({
            header: 'Missing fields',
            subHeader: 'Please check you have provided all required fields',
            mode: 'md',
            buttons: ['Ok']
          });

          alert.present();
          toast.dismiss();
          this.hideLoader();
          this.toggle('isSaving');
        }
      });
    } catch (err) {
      const alert = await this.alertCtrl.create({
        header: 'Unknow Locations',
        subHeader: 'It looks like the locations you entered do not exist',
        mode: 'md',
        buttons: ['Ok']
      });

      alert.present();
      toast.dismiss();
      this.hideLoader();
      this.toggle('isSaving');
    }
  }

  public formIsInvalid() {
    return !this.carShare.carId || !this.carShare.price || this.locations.origin === '' || this.locations.destination === '';
  }

  public setCustomInterfaceOptions(header: string) {
    return { header };
  }

  private toggle(key: string) {
    this[key] = !this[key];
  }

  private async transformCoordinatesForLocation() {
    const originResults = await Geocoder.geocode({ address: this.locations.origin });
    const destinationResults = await Geocoder.geocode({ address: this.locations.destination });

    this.carShare.origin.coordinates = [];
    this.carShare.destination.coordinates = [];
    this.carShare.origin.coordinates.push(originResults[0].position.lng, originResults[0].position.lat);

    this.carShare.destination.coordinates.push(destinationResults[0].position.lng, destinationResults[0].position.lat);
  }

  private setDefaultCarShareObject() {
    return {
      ownerId: '',
      carId: '',
      origin: {
        type: 'Point',
        coordinates: []
      },
      destination: {
        type: 'Point',
        coordinates: []
      },
      price: 1,
      runningDays: [Days.MONDAY]
    };
  }

  private setDefaultAvailableDaysObject() {
    return [Days.MONDAY, Days.TUESDAY, Days.WEDNESDAY, Days.THURSDAY, Days.FRIDAY, Days.SATURDAY, Days.SUNDAY];
  }

  private setDefaultLocationsObject() {
    return {
      origin: '',
      destination: ''
    };
  }

  private async setupExistingCarObject() {
    this.carShare = {
      ...this.carShare,
      carId: this.carShare.carInformation._id,
      runningDays: this.carShare.runningDays,
      ownerId: this.carShare.ownerInformation._id
    };
  }

  private async instantiateCarShareDefaults() {
    return new Promise(async (resolve) => {
      this.carShare = this.setDefaultCarShareObject();
      this.locations = this.setDefaultLocationsObject();

      this.availableCars = <ICar[]>await this.carProvider.getCarsThatBelongToUser();
      this.availableDays = this.setDefaultAvailableDaysObject();
      this.carShare.carId = this.availableCars[0]._id;

      resolve();
    });
  }

  async ngOnInit() {
    await this.instantiateCarShareDefaults();
  }

  ionViewWillEnter() {
    this.activatedRoute.paramMap
      .pipe(
        map(() => window.history.state)
      ).subscribe(async (data) => {
        if (data && data.carShare) {
          this.isInUpdateMode = true;
          this.carShare = data.carShare;

          this.originPlaceName = <any>await this.placeName.transform(this.carShare.origin.coordinates);
          this.destinationPlaceName = <any>await this.placeName.transform(this.carShare.destination.coordinates);

          this.setupExistingCarObject();
        }
      });
  }

  ionViewDidLeave() {
    this.originPlaceName = '';
    this.destinationPlaceName = '';
    this.isInUpdateMode = false;
  }
}

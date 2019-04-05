import { Component, OnInit } from '@angular/core';
import { Geocoder, GoogleMap } from '@ionic-native/google-maps';
import { AlertController, ToastController } from '@ionic/angular';
import { ICarShare } from 'src/app/interfaces/ICarShare';
import { ICar } from './../../interfaces/ICar';
import { CarShareProvider } from './../../providers/car-share/car-share.provider';
import { CarProvider } from './../../providers/car/car.provider';

@Component({
  selector: 'app-creator',
  templateUrl: 'creator.page.html',
  styleUrls: ['creator.page.scss']
})

export class CreatorPage implements OnInit {
  public carShare: ICarShare;
  public map: GoogleMap;
  public availableCars: ICar[];
  public locations: { origin: string, destination: string };
  public availableDays: string[];

  constructor(
    private carProvider: CarProvider,
    private carShareProvider: CarShareProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) { }

  public async createCarShare() {
    const toast = await this.toastCtrl.create({
      message: 'Creating car share..',
      color: 'dark'
    });

    const toastSuccess = await this.toastCtrl.create({
      message: 'Car share created successfully',
      color: 'dark',
      duration: 2000
    });

    toast.present();

    try {
      await this.transformCoordinatesForLocation();

      this.carShareProvider.createCarShare(this.carShare).subscribe(() => {
        toast.dismiss();
        toastSuccess.present();
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
    }
  }

  public formIsInvalid() {
    return !this.carShare.carId || !this.carShare.price || this.locations.origin === '' || this.locations.destination === '';
  }

  public setCustomInterfaceOptions(header: string) {
    return { header };
  }

  private async transformCoordinatesForLocation() {
    const originResults = await Geocoder.geocode({ address: this.locations.origin });
    const destinationResults = await Geocoder.geocode({ address: this.locations.destination });

    this.carShare.origin.coordinates.push(originResults[0].position.lng, originResults[0].position.lat);

    this.carShare.destination.coordinates.push(destinationResults[0].position.lng, destinationResults[0].position.lat);
  }

  private setDefaultCarShareObject() {
    return {
      carId: this.availableCars[0]._id,
      price: 1,
      origin: {
        type: 'Point',
        coordinates: []
      },
      destination: {
        type: 'Point',
        coordinates: []
      },
      runningDays: ['Monday']
    };
  }

  private setDefaultAvailableDaysObject() {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }

  private setDefaultLocationsObject() {
    return {
      origin: '',
      destination: ''
    };
  }

  async ngOnInit() {
    const carsThatBelongToUser: ICar[] = <ICar[]>await this.carProvider.getCarsThatBelongToUser();

    this.availableCars = carsThatBelongToUser;
    this.carShare = this.setDefaultCarShareObject();
    this.availableDays = this.setDefaultAvailableDaysObject();
    this.locations = this.setDefaultLocationsObject();
  }
}

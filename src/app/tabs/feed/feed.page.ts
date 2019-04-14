import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { StorageKeys } from 'src/app/enums/storage.enum';
import { IBooking } from 'src/app/interfaces/IBooking';
import { ICarShare } from '../../interfaces/ICarShare';
import { BookingProvider } from './../../providers/booking/booking.provider';
import { CarShareProvider } from './../../providers/car-share/car-share.provider';
import { LoadingProvider } from './../../providers/loading/loading.provider';
import { LocationProvider } from './../../providers/location/location.provider';
import { BaseComponent } from './../../shared/base/base.component';
// import { Push, PushObject, PushOptions, EventResponse } from '@ionic-native/push/ngx';

@Component({
  selector: 'app-feed',
  templateUrl: 'feed.page.html',
  styleUrls: ['feed.page.scss']
})

export class FeedPage extends BaseComponent implements OnInit {
  public availableCarShares: ICarShare[];
  public userId: string;

  constructor(
    private carShareProvider: CarShareProvider,
    private location: Geolocation,
    private bookingProvider: BookingProvider,
    private storage: Storage,
    protected loadingProvider: LoadingProvider,
    private locationProvider: LocationProvider
    // private push: Push
  ) {
    super(loadingProvider);
  }

  public async bookCarShare(carShare: ICarShare) {
    this.showLoader();

    const userId = await this.storage.get(StorageKeys.USER_ID);

    this.bookingProvider.bookCarShare({
      carShareId: carShare._id,
      userId: userId
    }).subscribe(() => {
      this.determineIfUserIsBookedOntoCarShare(userId);
    });
  }

  public cancelBooking(carShare: ICarShare) {
    this.bookingProvider.cancelBooking(carShare.bookingId).subscribe(() => {
      carShare['isBooked'] = false;
    });
  }

  public async getRefreshedData(event: any) {
    await this.getCarSharesInUsersGeoArea();
    event.target.complete();
  }

  private determineIfUserIsBookedOntoCarShare(userId: string) {
    this.bookingProvider.getCarSharesUserIsBookedOnto(userId).subscribe((bookings: IBooking[]) => {
      console.log(bookings);
      this.availableCarShares.forEach(carShare => {
        bookings.forEach(booking => {
          if (booking.carShareId === carShare._id) {
            carShare['isBooked'] = true;
            carShare.bookingId = booking._id;
          }
        });
      });

      this.hideLoader();
    });
  }

  private async getCarSharesInUsersGeoArea() {
    return new Promise(async (resolve) => {
      this.showLoader();

      const userId = await this.storage.get(StorageKeys.USER_ID);
      const position = await this.location.getCurrentPosition();

      this.userId = userId;

      this.carShareProvider
        .getCarSharesInUsersGeoArea(position.coords.longitude, position.coords.latitude)
        .subscribe((carShares: ICarShare[]) => {
          this.availableCarShares = carShares;

          resolve();

          this.locationProvider.setPickupLocation({
            userId: userId,
            location: {
              type: 'Point',
              coordinates: [position.coords.longitude.toString(), position.coords.latitude.toString()]
            }
          }).subscribe();

          this.determineIfUserIsBookedOntoCarShare(userId);
        });
    });
  }

  // private setupPushNotifications() {
  //   this.push.hasPermission()
  //     .then((res: any) => {
  //       if (res.isEnabled) {
  //         console.log('We have permission to send push notifications');
  //       } else {
  //         console.log('We do not have permission to send push notifications');
  //       }
  //     });

  //   const options: PushOptions = {
  //     android: {},
  //     ios: {
  //       alert: 'true',
  //       badge: true,
  //       sound: 'false'
  //     },
  //     windows: {},
  //     browser: {
  //       pushServiceURL: 'http://push.api.phonegap.com/v1/push'
  //     }
  //   };

  //   const pushObject: PushObject = this.push.init(options);

  //   pushObject.on('notification').subscribe((notification: any) => alert('Received a notification'));

  //   pushObject.on('registration').subscribe((registration: EventResponse) => {
  //     alert('Registered');
  //     this.authenticationProvider.registerPushToken(registration.registrationId).subscribe();
  //   });

  //   pushObject.on('error').subscribe(error => alert('Error with Push plugin'));
  // }

  ngOnInit() {
    this.getCarSharesInUsersGeoArea();

    // this.setupPushNotifications();
  }
}

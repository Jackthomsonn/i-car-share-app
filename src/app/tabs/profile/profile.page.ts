import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IBooking } from 'src/app/interfaces/IBooking';
import { ICarShare } from 'src/app/interfaces/ICarShare';
import { IUser } from 'src/app/interfaces/IUser';
import { StorageKeys } from './../../enums/storage.enum';
import { BookingProvider } from './../../providers/booking/booking.provider';
import { CarShareProvider } from './../../providers/car-share/car-share.provider';
import { UserProvider } from './../../providers/user/user.provider';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})

export class ProfilePage {
  public username: string;
  public carSharesUserOwns: ICarShare[];
  public carSharesUserIsBookedOnto: IBooking[];

  constructor(
    private storage: Storage,
    private userProvider: UserProvider,
    private carShareProvider: CarShareProvider,
    private bookingProvider: BookingProvider) { }

  async ionViewWillEnter() {
    const userId = await this.storage.get(StorageKeys.USER_ID);

    this.userProvider.getUserInformation(userId).subscribe((user: IUser) => {
      this.username = user.username;
    });

    this.carShareProvider.getCarSharesUserOwns(userId).subscribe((carShares: ICarShare[]) => {
      this.carSharesUserOwns = carShares;
    });

    this.bookingProvider.getCarSharesUserIsBookedOnto(userId).subscribe((bookings: IBooking[]) => {
      this.carSharesUserIsBookedOnto = bookings;
    });
  }
}

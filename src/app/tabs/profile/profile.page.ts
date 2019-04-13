import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { forkJoin } from 'rxjs';
import { IBooking } from 'src/app/interfaces/IBooking';
import { ICarShare } from 'src/app/interfaces/ICarShare';
import { IUser } from 'src/app/interfaces/IUser';
import { StorageKeys } from './../../enums/storage.enum';
import { BookingProvider } from './../../providers/booking/booking.provider';
import { CarShareProvider } from './../../providers/car-share/car-share.provider';
import { LoadingProvider } from './../../providers/loading/loading.provider';
import { UserProvider } from './../../providers/user/user.provider';
import { BaseComponent } from './../../shared/base/base.component';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})

export class ProfilePage extends BaseComponent {
  public username: string;
  public carSharesUserOwns: ICarShare[];
  public carSharesUserIsBookedOnto: IBooking[];

  constructor(
    private storage: Storage,
    private userProvider: UserProvider,
    private carShareProvider: CarShareProvider,
    private bookingProvider: BookingProvider,
    protected loadingProvider: LoadingProvider,
    private router: Router) {
    super(loadingProvider);
  }

  public async logout() {
    await this.storage.clear();
    this.router.navigate(['login']);
  }

  async ionViewWillEnter() {
    this.showLoader();

    const userId = await this.storage.get(StorageKeys.USER_ID);

    forkJoin([
      this.userProvider.getUserInformation(userId),
      this.carShareProvider.getCarSharesUserOwns(userId),
      this.bookingProvider.getCarSharesUserIsBookedOnto(userId)
    ]).subscribe((results) => {
      const [user, carShares, bookings] = results;

      this.username = (<IUser>user).username;
      this.carSharesUserOwns = <ICarShare[]>carShares;
      this.carSharesUserIsBookedOnto = <IBooking[]>bookings;
      this.hideLoader();
    });
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBooking } from 'src/app/interfaces/IBooking';
import { ICarShare } from 'src/app/interfaces/ICarShare';
import { IUser } from 'src/app/interfaces/IUser';
import { StorageKeys } from './../../enums/storage.enum';
import { BookingProvider } from './../../providers/booking/booking.provider';
import { CarShareProvider } from './../../providers/car-share/car-share.provider';
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
  public refreshedData: Subject<{ carSharesUserOwns: ICarShare[], carSharesUserIsBookedOnto: IBooking[] }> = new Subject();

  constructor(
    private storage: Storage,
    private userProvider: UserProvider,
    private carShareProvider: CarShareProvider,
    private bookingProvider: BookingProvider,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    super();
  }

  public async logout() {
    await this.storage.clear();
    this.router.navigate(['login']);
  }

  public async refreshData() {
    await this.populateData();

    this.refreshedData.next({
      carSharesUserOwns: this.carSharesUserOwns,
      carSharesUserIsBookedOnto: this.carSharesUserIsBookedOnto
    });
  }

  private async populateData() {
    return new Promise(async (resolve) => {
      const userId = await this.storage.get(StorageKeys.USER_ID);

      forkJoin([
        this.userProvider.getUserInformation(userId),
        this.carShareProvider.getCarSharesUserOwns(userId),
        this.bookingProvider.getCarSharesUserIsBookedOnto(userId)
      ]).pipe(
        takeUntil(this.destroyed)
      ).subscribe((results) => {
        const [user, carShares, bookings] = results;

        this.username = (<IUser>user).username;
        this.carSharesUserOwns = <ICarShare[]>carShares;
        this.carSharesUserIsBookedOnto = <IBooking[]>bookings;

        resolve();
      });
    });
  }

  ionViewWillEnter() {
    document.querySelector('ion-tab-bar').style.display = 'flex';
  }

  ionViewDidEnter() {
    this.populateData();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StorageKeys } from 'src/app/enums/storage.enum';
import { IUser } from 'src/app/interfaces/IUser';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { IBooking } from '../../interfaces/IBooking';
import { ICarShare } from '../../interfaces/ICarShare';
import { BookingProvider } from './../../providers/booking/booking.provider';
import { CarShareProvider } from './../../providers/car-share/car-share.provider';
import { UserProvider } from './../../providers/user/user.provider';

@Component({
  selector: 'app-profile-content',
  templateUrl: './profile-content.component.html',
  styleUrls: ['./profile-content.component.scss'],
})

export class ProfileContentComponent extends BaseComponent implements OnInit {
  public username: string;

  @Input() carSharesUserOwns: ICarShare[];
  @Input() carSharesUserIsBookedOnto: IBooking[];
  @Input() refreshedData: BehaviorSubject<any>;

  @Output() refreshData: EventEmitter<any> = new EventEmitter();

  constructor(
    private bookingProvider: BookingProvider,
    private router: Router,
    private alertCtrl: AlertController,
    private carShareProvider: CarShareProvider,
    private userProvider: UserProvider,
    private storage: Storage
  ) {
    super();
  }

  public cancelBooking(booking: IBooking) {
    const { _id } = booking;

    this.bookingProvider.cancelBooking(_id).pipe(takeUntil(this.destroyed)).subscribe(() => {
      const bookingIndex = this.carSharesUserIsBookedOnto.indexOf(booking);
      this.carSharesUserIsBookedOnto.splice(bookingIndex, 1);
    });
  }

  public goToCreator() {
    this.router.navigate(['tabs/profile/creator']);
  }

  public deleteCarShare(carShare: ICarShare) {
    this.presentAlert(
      carShare,
      'Delete Car Share?',
      // tslint:disable-next-line:max-line-length
      'Are you sure you want to delete this car share?',
      'Delete',
      () => {
        this.carShareProvider.deleteCarShare(carShare).pipe(takeUntil(this.destroyed)).subscribe(() => {
          this.refreshData.emit();
        });
      });
  }

  public getRefreshedData(event: any) {
    const refreshSubscription = this.refreshedData.pipe(takeUntil(this.destroyed)).subscribe((newData: {
      carSharesUserOwns: ICarShare[],
      carSharesUserIsBookedOnto: IBooking[]
    }) => {
      event.target.complete();

      this.carSharesUserOwns = newData.carSharesUserOwns;
      this.carSharesUserIsBookedOnto = newData.carSharesUserIsBookedOnto;

      refreshSubscription.unsubscribe();
    });

    this.refreshData.emit();
  }

  public userDoesntOwnAnyCarShares() {
    return this.carSharesUserOwns.length === 0;
  }

  public userIsNotBookedOntoAnyCarShares() {
    return this.carSharesUserIsBookedOnto.length === 0;
  }

  public updateCarShare(carShare: ICarShare) {
    this.router.navigateByUrl('tabs/profile/creator', { state: { carShare: carShare } });
  }

  public startCarShare(carShare: ICarShare) {
    this.presentAlert(
      carShare,
      'Start Car Share',
      // tslint:disable-next-line:max-line-length
      'You are about to start this car share. This will notify all passengers that you are beginning your journey. Are you sure you wish to continue?',
      'Lets go',
      () => {
        this.router.navigate(['tabs/profile/tracker'], { state: { carShare: carShare, isHost: true } });
      });
  }

  public goToFeedPage() {
    this.router.navigate(['tabs/feed']);
  }

  private async presentAlert(carShare: ICarShare, header: string, message: string, successText: string, fn: Function) {
    const alert = await this.alertCtrl.create({
      header: header,
      // tslint:disable-next-line:max-line-length
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: successText,
          handler: () => {
            fn();
          }
        }
      ]
    });

    return await alert.present();
  }

  async ngOnInit() {
    const userId = await this.storage.get(StorageKeys.USER_ID);

    this.userProvider.getUserInformation(userId).pipe(takeUntil(this.destroyed)).subscribe((user: IUser) => {
      this.username = user.username;
    });
  }
}

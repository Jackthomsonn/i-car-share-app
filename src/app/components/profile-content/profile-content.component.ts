import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IBooking } from 'src/app/interfaces/IBooking';
import { ICarShare } from 'src/app/interfaces/ICarShare';
import { BookingProvider } from './../../providers/booking/booking.provider';

@Component({
  selector: 'app-profile-content',
  templateUrl: './profile-content.component.html',
  styleUrls: ['./profile-content.component.scss'],
})

export class ProfileContentComponent {
  @Input() carSharesUserOwns: ICarShare[];
  @Input() carSharesUserIsBookedOnto: IBooking[];

  constructor(private bookingProvider: BookingProvider, private router: Router) { }

  public cancelBooking(booking: IBooking) {
    const { _id } = booking;

    this.bookingProvider.cancelBooking(_id).subscribe(() => {
      const bookingIndex = this.carSharesUserIsBookedOnto.indexOf(booking);
      this.carSharesUserIsBookedOnto.splice(bookingIndex, 1);
    });
  }

  public userDoesntOwnAnyCarShares() {
    return this.carSharesUserOwns.length === 0;
  }

  public userIsNotBookedOntoAnyCarShares() {
    return this.carSharesUserIsBookedOnto.length === 0;
  }

  public updateCarShare(carShare: ICarShare) {
    this.router.navigateByUrl('tabs/creator', { state: { carShare: carShare } });
  }

  public startCarShare(carShare: ICarShare) {
    this.router.navigate(['tracker'], { state: { carShare: carShare, isHost: true } });
  }
}

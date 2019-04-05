import { Component, Input } from '@angular/core';
import { IBooking } from 'src/app/interfaces/IBooking';
import { ICarShare } from 'src/app/interfaces/ICarShare';

@Component({
  selector: 'app-profile-content',
  templateUrl: './profile-content.component.html',
  styleUrls: ['./profile-content.component.scss'],
})

export class ProfileContentComponent {
  @Input() carSharesUserOwns: ICarShare[];
  @Input() carSharesUserIsBookedOnto: IBooking[];
}

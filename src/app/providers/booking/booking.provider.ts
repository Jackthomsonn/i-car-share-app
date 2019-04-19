import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBooking } from 'src/app/interfaces/IBooking';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class BookingProvider {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = `${environment.apiUri}/bookings`;
  }

  public getCarSharesUserIsBookedOnto(userId: string) {
    return this.http.get(`${this.uri}?userId=${userId}`);
  }

  public bookCarShare(booking: IBooking) {
    return this.http.post(`${this.uri}`, booking);
  }

  public cancelBooking(bookingId: string) {
    return this.http.delete(`${this.uri}/${bookingId}`);
  }

  public getBookings(carShareId: string) {
    return this.http.get(`${this.uri}?carShareId=${carShareId}`);
  }
}

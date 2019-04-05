import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BookingProvider {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = 'http://192.168.0.32:8080/bookings';
  }

  public getCarSharesUserIsBookedOnto(userId: string) {
    return this.http.get(`${this.uri}?userId=${userId}`);
  }
}

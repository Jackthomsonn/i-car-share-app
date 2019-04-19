import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LocationProvider {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = `${environment.apiUri}/locations`;
  }

  public setPickupLocation(data: any) {
    return this.http.post(this.uri, data);
  }
}

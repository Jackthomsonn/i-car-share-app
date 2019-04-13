import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LocationProvider {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = 'http://192.168.0.32:8080/locations';
  }

  public setPickupLocation(data: any) {
    return this.http.post(this.uri, data);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICarShare } from 'src/app/interfaces/ICarShare';

@Injectable({
  providedIn: 'root'
})
export class CarShareProvider {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = 'http://192.168.0.32:8080/car-shares';
  }

  public getCarShares() {
    return this.http.get(this.uri);
  }

  public getCarSharesInUsersGeoArea(lng: number, lat: number) {
    const radius = 10000;
    // 5 mile radius 1000 metres
    return this.http.get(`${this.uri}?lat=${lat}&lng=${lng}&distance=${radius}`);
  }

  public getCarSharesUserOwns(userId: string) {
    return this.http.get(`${this.uri}?ownerId=${userId}`);
  }

  public createCarShare(carShare: ICarShare) {
    return this.http.post(this.uri, carShare);
  }

  public updateCarShare(carShare: ICarShare) {
    return this.http.put(`${this.uri}/${carShare._id}`, carShare);
  }
}

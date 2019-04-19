import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StorageKeys } from 'src/app/enums/storage.enum';
import { UserProvider } from './../user/user.provider';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CarProvider {
  private uri: string;

  constructor(private http: HttpClient, private storage: Storage, private userProvider: UserProvider) {
    this.uri = `${environment.apiUri}/cars`;
  }

  public async getCarsThatBelongToUser() {
    const userId = await this.storage.get(StorageKeys.USER_ID);

    return this.http.get(`${this.uri}?ownerId=${userId}`).toPromise();
  }
}

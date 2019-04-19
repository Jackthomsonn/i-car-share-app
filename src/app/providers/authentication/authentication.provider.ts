import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../../interfaces/IUser';
import { StorageKeys } from './../../enums/storage.enum';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationProvider {
  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private storage: Storage, private router: Router) { }

  public login = (user: IUser) => {
    return this.http.post(`${environment.apiUri}/auth/login`, user);
  }

  public register = (user: IUser) => {
    return this.http.post(`${environment.apiUri}/auth/register`, user);
  }

  public resetPassword = (user: IUser) => {
    const { email } = user;

    return this.http.post(`${environment.apiUri}/auth/reset-password-request`, { email });
  }

  public updatePassword = (user: IUser, token: string) => {
    const { email, password } = user;

    return this.http.post(`${environment.apiUri}/auth/update-password`, { email, password }, {
      headers: new HttpHeaders({
        authorization: `Bearer ${token}`
      })
    });
  }

  public changePassword = (user: IUser) => {
    return this.http.post(`${environment.apiUri}/auth/change-password`, user);
  }

  public logout = () => {
    this.storage.remove(StorageKeys.ACCESS_TOKEN);

    this.router.navigate(['login']);
  }

  public getToken = async () => {
    const token = await this.storage.get(StorageKeys.ACCESS_TOKEN);

    return token;
  }

  public getRefreshToken = (token: string) => {
    return this.http.post(`${environment.apiUri}/auth/refreshtoken`, { token: token });
  }

  public registerPushToken = (registrationId: string) => {
    return this.http.post(`${environment.apiUri}/push-registration`, { registrationId });
  }
}

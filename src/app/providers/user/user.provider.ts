import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserProvider {
  public userInformation: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) { }

  public getUserInformation = (userId: string) => {
    return this.http.get(`${environment.apiUri}/auth/users/${userId}`);
  }
}

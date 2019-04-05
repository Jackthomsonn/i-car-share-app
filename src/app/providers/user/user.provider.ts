import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserProvider {
  public userInformation: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) { }

  public getUserInformation = (userId: string) => {
    return this.http.get(`http://192.168.0.32:8080/auth/users/${userId}`);
  }
}

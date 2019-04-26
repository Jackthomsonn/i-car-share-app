import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MessageProvider {
  private uri: string;

  constructor(private http: HttpClient) {
    this.uri = `${environment.apiUri}/messages`;
  }

  public sendMessage(body: any) {
    return this.http.post(this.uri, body);
  }

  public getMessagesForUser(userId: string) {
    return this.http.get(`${this.uri}?senderId=${userId}`);
  }
}

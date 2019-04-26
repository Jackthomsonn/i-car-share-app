import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as io from 'socket.io-client';
import { StorageKeys } from 'src/app/enums/storage.enum';
import { environment } from '../../../environments/environment';

@Injectable()
export class SocketServiceProvider {
  public partyId: string;
  public socketUri: string;
  public socket: io;

  constructor(private storage: Storage, private http: HttpClient) {
    this.socketUri = environment.apiUri;
    this.connectClientSocket();
  }

  private async connectClientSocket() {
    this.socket = io.connect(this.socketUri, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    const userId = await this.storage.get(StorageKeys.USER_ID);

    this.on('client:information', (data: any) => {
      this.registerSocketWithUser({
        socketId: data.socketId,
        userId: userId
      });
    });

    this.emit('client:connected', { userId });
  }

  public emit(event: string, data?: any) {
    this.socket.emit(event, data);
  }

  public on(event: string, callback: Function) {
    this.socket.on(event, callback);
  }

  public off(eventNames: string[]) {
    eventNames.forEach(eventName => {
      this.socket.off(eventName);
    });
  }

  private registerSocketWithUser(data: any) {
    this.http.post(`${environment.apiUri}/sockets`, data).subscribe();
  }
}

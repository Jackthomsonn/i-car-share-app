import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketServiceProvider {
  public partyId: string;
  public socketUri: string;
  public socket: io;

  constructor() {
    this.socketUri = 'http://192.168.0.32:8080';
    this.connectClientSocket();
  }

  private connectClientSocket() {
    this.socket = io.connect(this.socketUri, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });
  }

  public emit(event: string, data?: any) {
    this.socket.emit(event, data);
  }

  public on(event: string, callback: Function) {
    this.socket.on(event, callback);
  }
}

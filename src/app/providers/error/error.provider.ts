import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ErrorProvider {
  public exceptionCaught: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
}

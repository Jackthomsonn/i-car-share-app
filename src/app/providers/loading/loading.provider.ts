import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoadingProvider {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}

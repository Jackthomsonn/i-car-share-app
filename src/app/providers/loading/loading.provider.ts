import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoadingProvider {
  public isLoading: Subject<boolean> = new Subject<boolean>();
}

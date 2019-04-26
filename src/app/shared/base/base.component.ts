import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export class BaseComponent implements OnDestroy {
  public destroyed: Subject<any> = new Subject();

  constructor() { }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

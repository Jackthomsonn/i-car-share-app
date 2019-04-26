import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../shared/base/base.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})

export class TabsPage extends BaseComponent implements OnInit {

  constructor(private router: Router) {
    super();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
      map(() => this.router.getCurrentNavigation())
    ).pipe(takeUntil(this.destroyed)).subscribe();
  }
}

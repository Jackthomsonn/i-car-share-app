import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-car-share-counter',
  templateUrl: './car-share-counter.component.html',
  styleUrls: ['./car-share-counter.component.scss']
})

export class CarShareCounterComponent {
  @Input() availableCarShares: number;
}

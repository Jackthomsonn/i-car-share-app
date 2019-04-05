import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ICarShare } from '../../interfaces/ICarShare';
import { CarShareProvider } from './../../providers/car-share/car-share.provider';

@Component({
  selector: 'app-feed',
  templateUrl: 'feed.page.html',
  styleUrls: ['feed.page.scss']
})

export class FeedPage {
  public availableCarShares: ICarShare[];

  constructor(private carShareProvider: CarShareProvider, private location: Geolocation) { }

  async ionViewWillEnter() {
    const position = await this.location.getCurrentPosition();

    this.carShareProvider
      .getCarSharesInUsersGeoArea(position.coords.longitude, position.coords.latitude)
      .subscribe((carShares: ICarShare[]) => {
        this.availableCarShares = carShares;
      });
  }
}

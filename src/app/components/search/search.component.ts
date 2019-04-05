declare var google: any;

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent {
  private autoCompleteService: any;

  public predictiveLists = {
    origin: {
      show: false,
      predictions: undefined
    },
    destination: {
      show: false,
      predictions: undefined
    }
  };

  @Input() model: any;

  constructor() {
    this.autoCompleteService = new google.maps.places.AutocompleteService();
  }

  setLocation(location: string, direction: string) {
    this.model[direction] = location;
    this.predictiveLists[direction].show = false;
  }

  updateSearch(direction: string) {
    this.predictiveLists[direction].show = true;
    if (this.model[direction].length > 0) {
      this.autoCompleteService.getPlacePredictions({
        input: this.model[direction],
        componentRestrictions: {
          country: 'uk'
        }
      }, (predictions: string[], status: string) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }

        this.predictiveLists[direction].predictions = predictions;
      });
    }
  }
}

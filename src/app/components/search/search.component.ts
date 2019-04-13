declare const google: any;

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

  @Input() model: { origin: string, destination: string };
  @Input() originPlaceName: string;
  @Input() destinationPlaceName: string;

  constructor() {
    this.autoCompleteService = new google.maps.places.AutocompleteService();
  }

  setLocation(location: string, direction: string) {
    this.model[direction] = location;
    this.predictiveLists[direction].show = false;
  }

  private setupPredictionConfig(direction: string) {
    return {
      input: this.model[direction],
      componentRestrictions: {
        country: 'uk'
      }
    };
  }

  updateSearch(direction: string) {
    this.predictiveLists[direction].show = true;
    if (this.model[direction].length > 0) {
      this.autoCompleteService.getPlacePredictions(
        this.setupPredictionConfig(direction),
        (predictions: string[], status: string) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            return;
          }

          this.predictiveLists[direction].predictions = predictions;
        });
    }
  }
}

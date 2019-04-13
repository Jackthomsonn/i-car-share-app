import { Pipe, PipeTransform } from '@angular/core';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder/ngx';

@Pipe({
  name: 'placeName'
})
export class PlaceNamePipe implements PipeTransform {
  constructor(private nativeGeocoder: NativeGeocoder) { }

  transform(value: any) {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    return this.nativeGeocoder.reverseGeocode(value[1], value[0], options)
      .then((result: NativeGeocoderReverseResult[]) => {
        return `${result[0].thoroughfare}`;
      });
  }
}

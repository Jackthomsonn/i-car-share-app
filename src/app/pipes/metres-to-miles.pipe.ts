import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metresToMiles'
})

export class MetresToMilesPipe implements PipeTransform {
  transform(value: any): number {
    return Math.round(value / 1609.344);
  }
}

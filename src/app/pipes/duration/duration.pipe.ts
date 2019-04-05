import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'durationPipe'
})
export class DurationPipe implements PipeTransform {
  transform(createdDate: string) {
    return this.createTimeDifferenceString(createdDate);
  }

  private pluralise = (time: number, unit: string) => {
    if (time !== 1) {
      return `${time} ${unit}s ago`;
    } else {
      return `${time} ${unit} ago`;
    }
  }

  private createTimeDifferenceString = (createdDate: string) => {
    if (moment().diff(createdDate, 'seconds') < 60) {
      return `${this.pluralise(moment().diff(createdDate, 'seconds'), 'second')}`;
    }

    if (moment().diff(createdDate, 'seconds') >= 60 && moment().diff(createdDate, 'seconds') <= 3600) {
      return `${this.pluralise(moment().diff(createdDate, 'minutes'), 'minute')}`;
    }

    if (moment().diff(createdDate, 'seconds') >= 3600 && moment().diff(createdDate, 'hours') <= 24) {
      return `${this.pluralise(moment().diff(createdDate, 'hours'), 'hour')}`;
    }

    if (moment().diff(createdDate, 'hours') >= 24) {
      return `${this.pluralise(moment().diff(createdDate, 'days'), 'day')}`;
    }
  }
}

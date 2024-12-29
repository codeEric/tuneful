import { Pipe, PipeTransform } from '@angular/core';
import { DayjsDateUtils } from '../utils/dateUtils';

@Pipe({
  name: 'formatTime',
  standalone: true,
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    return DayjsDateUtils.formatSeconds(value).format(
      DayjsDateUtils.SHORT_TIME_FORMAT,
    );
  }
}

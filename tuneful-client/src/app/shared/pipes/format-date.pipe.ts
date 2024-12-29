import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import { DayjsDateUtils } from '../utils/dateUtils';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  transform(
    value: string | Date | number,
    format: string = DayjsDateUtils.LONG_DATE_FORMAT,
  ): string {
    const date = dayjs(value);

    if (!date.isValid()) {
      return 'Invalid Date';
    }

    return date.format(format);
  }
}

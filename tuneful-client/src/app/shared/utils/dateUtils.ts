import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration, { Duration } from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export class DayjsDateUtils {
  static readonly DATE_FORMAT = 'YYYY-MM-DD';
  static readonly SHORT_TIME_FORMAT = 'mm:ss';
  static readonly LONG_TIME_FORMAT = 'HH:mm:ss';
  static readonly DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  static readonly SHORT_DATE_FORMAT = 'MM/DD/YYYY';
  static readonly LONG_DATE_FORMAT = 'MMMM DD, YYYY';
  static readonly ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

  static formatDate(
    date: string | Date | number | dayjs.Dayjs,
    format: string = DayjsDateUtils.DATE_TIME_FORMAT,
  ): string {
    return dayjs(date).format(format);
  }

  static parseISO(dateStr: string): dayjs.Dayjs {
    return dayjs(dateStr);
  }

  static formatToUTC(date: string | Date | number | dayjs.Dayjs): string {
    return dayjs(date).utc().format(DayjsDateUtils.ISO_FORMAT);
  }

  static getCurrentDateInTimezone(timezoneStr: string): string {
    return dayjs().tz(timezoneStr).format(DayjsDateUtils.DATE_TIME_FORMAT);
  }

  static formatSeconds(seconds: number): Duration {
    return dayjs.duration(seconds, 'seconds');
  }
}

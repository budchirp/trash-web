export class DateUtil {
  static format(date: Date, locale: string = 'en-US') {
    return date.toLocaleString(locale, {
      weekday: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
}

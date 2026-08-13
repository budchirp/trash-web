export class DateUtil {
  static format(value: string | Date | null | undefined, locale: string = 'en-US'): string {
    if (value == null) return '—'

    const date = typeof value === 'string' ? new Date(value.replace(/(\.\d{3})\d+/, '$1')) : value

    if (Number.isNaN(date.getTime())) return '—'

    return date.toLocaleString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
}

import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date: string | number | Date, newFormat: string = 'dd MMM yyyy') {
  return date ? format(new Date(date), newFormat) : '';
}

export function fDateTime(date: string | number | Date, newFormat: string = 'dd MMM yyyy p') {
  return date ? format(new Date(date), newFormat) : '';
}

export function fTimestamp(date: string | number | Date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: string | number | Date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

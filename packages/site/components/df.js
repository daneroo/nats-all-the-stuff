import moment from 'moment'
// TODO replace with date-fns

// convert to Localtime
export function df (dateStr, fmt = 'HH:mm') {
  return moment(dateStr).format(fmt)
}
export function dfn (dateStr) {
  return moment(dateStr).fromNow()
}

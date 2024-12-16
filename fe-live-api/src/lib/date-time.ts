import moment from 'moment-timezone';

export const TIME_ZONE = 'Asia/Yangon';
const DATE_STRING_FORMAT = 'DD MMMM, YYYY';
const COMPLETE_DATE_TIME = 'DD MMM YYYY hh:mm A';

export const getFormattedDate = (date: Date, includeTime = false): string => {
  const format = includeTime ? COMPLETE_DATE_TIME : DATE_STRING_FORMAT;
  const a = moment.utc(date).tz(TIME_ZONE).format(format);
  return a;
};

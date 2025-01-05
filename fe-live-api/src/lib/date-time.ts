import moment from 'moment-timezone';

export const TIME_ZONE = 'Asia/Yangon';
const DATE_STRING_FORMAT = 'DD MMMM, YYYY';
const COMPLETE_DATE_TIME = 'DD MMM YYYY hh:mm A';

export const getFormattedDate = (date: Date, includeTime = false): string => {
  const format = includeTime ? COMPLETE_DATE_TIME : DATE_STRING_FORMAT;
  const a = moment.utc(date).tz(TIME_ZONE).format(format);
  return a;
};

export const getTimeAgoFormat = (date: string): string => {
  return moment(date).fromNow();
};

/**
 * Calculates elapsed time in seconds since the given start time.
 * @param {string} startedAt - ISO 8601 formatted timestamp (e.g., 2024-12-31T13:21:36.025162Z).
 * @returns {number} - Elapsed time in seconds.
 */
export const calculateElapsedTime = (startedAt: string): number => {
  const startTime = moment(startedAt);
  const now = moment();
  return now.diff(startTime, 'seconds');
};

/**
 * Formats a given elapsed time in seconds to HH:mm:ss.
 * @param {number} seconds - Elapsed time in seconds.
 * @returns {string} - Formatted time string.
 */
export const getFormattedElapsedTime = (seconds: number): string => {
  const duration = moment.duration(seconds, 'seconds');
  const hours = Math.floor(duration.asHours());

  if (hours >= 1) {
    return moment.utc(seconds * 1000).format('HH:mm:ss');
  } else {
    return moment.utc(seconds * 1000).format('mm:ss');
  }
};

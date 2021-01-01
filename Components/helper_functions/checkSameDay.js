export const checkSameDay = (toBeParsed, day2) => {
  const day1 = parseDate(toBeParsed);
  return (
    day1.getDate() === day2.getDate() &&
    day1.getMonth() === day2.getMonth() &&
    day1.getFullYear() === day2.getFullYear()
  );
};

export const parseDate = (date) => {
  let parsed = Date.parse(date);
  return new Date(parsed);
};

export const getTime = (_time) => {
  const time = new Date(_time).toISOString().substr(11, 8).split(':');
  if (time[0] === '00') {
    return `${time[1]} min`;
  } else if (time[1] === '00') {
    return `${time[0]} hr`;
  } else {
    return `${time[0]} hr ${time[1]} min`;
  }
};

export const getTimeFromSeconds = (_time, isFull) => {
  const hours = Math.floor(_time / (60 * 60 * 1000));
  const minsInSec = _time % (60 * 60 * 1000);
  const mins = minsInSec / (60 * 1000);
  // if (isFull) `${hours} hours and ${mins} minutes`;
  // return `${hours}h ${mins}m`;
  let displayHours = null;
  let displayMins = null;

  console.log(hours);

  if (hours > 1) {
    displayHours = isFull ? `${hours} hours` : `${hours}h`;
  } else if (hours === 1) {
    displayHours = isFull ? `${hours} hour` : `${hours}h`;
  }

  if (mins > 0) displayMins = isFull ? `${mins} minutes` : `${mins}m`;

  if (displayHours !== null && displayMins !== null) {
    return isFull
      ? `${displayHours} and ${displayMins}`
      : `${displayHours} ${displayMins}`;
  } else if (displayHours !== null) {
    return displayHours;
  } else if (displayMins !== null) {
    return displayMins;
  }
};

export const getHours = (time) => {
  return Math.floor(time / (60 * 60 * 1000));
};

export const getMins = (time) => {
  const minsInSec = time % (60 * 60 * 1000);
  return minsInSec / (60 * 1000);
};

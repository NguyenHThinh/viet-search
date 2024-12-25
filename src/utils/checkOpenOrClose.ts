import { IDayOfWeek, ITimeRange } from "@/models/iOpenHours";
import convertTimeToMilliseconds from "./convertTimeToMiliseconds";

const checkOpenOrClose = (openSchedule: IDayOfWeek) => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentTimeString = now.getHours() + ":" + now.getMinutes();
  const currentTime = convertTimeToMilliseconds(currentTimeString);

  const dayMap: { [key: number]: ITimeRange[] } = {
    0: openSchedule.sun,
    1: openSchedule.mon,
    2: openSchedule.tue,
    3: openSchedule.wed,
    4: openSchedule.thu,
    5: openSchedule.fri,
    6: openSchedule.sat,
  };

  // Get the time ranges for the current day
  const todayRanges = dayMap[currentDay];

  // get current time open range
  const openRange = todayRanges.find(
    (range) => currentTime >= range.from && currentTime < range.to,
  );

  if (openRange) {
    return {
      isOpen: true,
      timeRange: openRange,
      day: 0,
    };
  }

  // check open range next time in day
  const nextRangeToday = todayRanges.find((range) => currentTime < range.from);

  // return closed state and range next opentime
  if (nextRangeToday) {
    return {
      isOpen: false,
      timeRange: nextRangeToday,
      day: 0,
    };
  }

  // check range next opentime in week
  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7;
    const nextDayRanges = dayMap[nextDay];
    if (nextDayRanges.length > 0) {
      return {
        isOpen: false,
        timeRange: nextDayRanges[0],
        day: Math.abs(nextDay - currentDay),
      };
    }
  }

  return {
    isOpen: false,
    timeRange: undefined,
    day: 0,
  };
};

export default checkOpenOrClose;

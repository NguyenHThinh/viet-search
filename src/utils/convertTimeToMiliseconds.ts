const convertTimeToMilliseconds = (time: string): number => {
  if (!time) return 0;

  // Split the time string into hours and minutes
  const [hours, minutes] = time.split(":").map(Number);

  // Calculate
  const hoursInMilliseconds = hours * 3600000;
  const minutesInMilliseconds = minutes * 60000;

  // Sum
  return hoursInMilliseconds + minutesInMilliseconds;
};

export default convertTimeToMilliseconds;

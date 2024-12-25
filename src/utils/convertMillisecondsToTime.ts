const convertMillisecondsToTime = (milliseconds: number): string => {
  if (milliseconds < 0) return "--:--";

  // Calculate hours and minutes with seconds input
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);

  // Format two digits
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`; // example 07:11
};

export default convertMillisecondsToTime;

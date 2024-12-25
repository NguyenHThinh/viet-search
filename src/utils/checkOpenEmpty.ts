import { IOpenHours } from "@/models/iOpenHours";

const checkOpenEmpty = (open_hours: IOpenHours): boolean => {
  return Object.values(open_hours.dayOfWeek).every((day) => day.length === 0);
};

export default checkOpenEmpty;

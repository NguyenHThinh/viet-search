import { IDayOfWeek } from "@/models/iOpenHours";
import checkOpenEmpty from "./checkOpenEmpty";

const sortDaysOfWeek = (dayOfWeek: IDayOfWeek) => {
  const dayOrder: (keyof IDayOfWeek)[] = [
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "sun",
  ];

  // sorted object
  const sortedObject: IDayOfWeek = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  };

  // handle sorting
  dayOrder.forEach((day) => {
    sortedObject[day] = dayOfWeek[day];
  });

  return sortedObject;
};

export default sortDaysOfWeek;

export interface ITimeRange {
  from: number;
  to: number;
}

export interface IDayOfWeek {
  mon: ITimeRange[];
  tue: ITimeRange[];
  wed: ITimeRange[];
  thu: ITimeRange[];
  fri: ITimeRange[];
  sat: ITimeRange[];
  sun: ITimeRange[];
}

export interface IOpenHours {
  dayOfWeek: IDayOfWeek;
  note: string;
  type: string;
  publicHoliday: string;
}

export interface IClosedDay {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

"use client";

import { useTranslation } from "@/app/i18n/client";
import { IClosedDay, IOpenHours, ITimeRange } from "@/models/iOpenHours";
import convertMillisecondsToTime from "@/utils/convertMillisecondsToTime";
import convertTimeToMilliseconds from "@/utils/convertTimeToMiliseconds";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "react-use";
import RenderDayOfWeek from "./RenderDayOfWeek";
import Checkbox from "@/shared/Checkbox";
import { IBusiness } from "@/models/iBusiness";

const UpdateOpenHours = ({
  businessData,
}: {
  businessData?: IBusiness | null;
}) => {
  const { t } = useTranslation(["common", "openHours"]);
  const { getValues, setValue } = useFormContext();

  const OPEN_TYPES = [
    {
      text: t("openHours:openMainHours"),
      desc: t("openHours:openMainHoursDesc"),
      value: "mainHours",
    },
    {
      text: t("openHours:openNoMainHours"),
      desc: t("openHours:openNoMainHoursDesc"),
      value: "noMainHours",
    },
    {
      text: t("openHours:temporarilyClosed"),
      desc: t("openHours:temporarilyClosedDesc"),
      value: "temporaryClosed",
    },
    {
      text: t("openHours:permanentlyClosed"),
      desc: t("openHours:permanentlyClosedDesc"),
      value: "closed",
    },
  ];

  const [openHoursData, setOpenHoursData] = useState<IOpenHours>(
    getValues("open_hours") ?? {
      dayOfWeek: {
        mon: [{ from: 32400000, to: 64800000 }],
        tue: [{ from: 32400000, to: 64800000 }],
        wed: [{ from: 32400000, to: 64800000 }],
        thu: [{ from: 32400000, to: 64800000 }],
        fri: [{ from: 32400000, to: 64800000 }],
        sat: [{ from: 32400000, to: 64800000 }],
        sun: [{ from: 32400000, to: 64800000 }],
      },
      type: "mainHours",
      note: "",
      publicHoliday: "",
    },
  );

  useEffect(() => {
    if (businessData) {
      setOpenHoursData(businessData.open_hours);
      setIsClosed({
        mon: !businessData.open_hours?.dayOfWeek?.mon?.length,
        tue: !businessData.open_hours?.dayOfWeek?.tue?.length,
        wed: !businessData.open_hours?.dayOfWeek?.wed?.length,
        thu: !businessData.open_hours?.dayOfWeek?.thu?.length,
        fri: !businessData.open_hours?.dayOfWeek?.fri?.length,
        sat: !businessData.open_hours?.dayOfWeek?.sat?.length,
        sun: !businessData.open_hours?.dayOfWeek?.sun?.length,
      });
    }
  }, [businessData]);

  // debounce Value for data open hours
  const [debouncedValue, setDebouncedValue] = useState(openHoursData);

  // Store previous values of open hours when closing a day
  const [storedOpenRange, setStoredOpenRange] = useState(
    openHoursData.dayOfWeek,
  );

  // set debounce
  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(openHoursData);
    },
    500,
    [openHoursData],
  );

  const [isClosed, setIsClosed] = useState<IClosedDay>({
    mon: !openHoursData?.dayOfWeek?.mon?.length,
    tue: !openHoursData?.dayOfWeek?.tue?.length,
    wed: !openHoursData?.dayOfWeek?.wed?.length,
    thu: !openHoursData?.dayOfWeek?.thu?.length,
    fri: !openHoursData?.dayOfWeek?.fri?.length,
    sat: !openHoursData?.dayOfWeek?.sat?.length,
    sun: !openHoursData?.dayOfWeek?.sun?.length,
  });

  useEffect(() => {
    setValue("open_hours", debouncedValue);
  }, [debouncedValue]);

  //
  const handleChangeTime = (
    day: string,
    index: number,
    type: "from" | "to",
    time: string,
  ) => {
    const timeMiliseconds = convertTimeToMilliseconds(time);
    setOpenHoursData((prev) => {
      const dayHour = [...(prev.dayOfWeek[day as keyof IClosedDay] || [])];
      dayHour[index] = { ...dayHour[index], [type]: timeMiliseconds };
      return {
        ...prev,
        dayOfWeek: {
          ...prev.dayOfWeek,
          [day]: dayHour,
        },
      };
    });
  };

  //
  const handleClosedChange = (day: string) => {
    const prevStateOpen = isClosed?.[day as keyof IClosedDay];
    setIsClosed((prevIsClosed) => ({
      ...prevIsClosed,
      [day]: !prevIsClosed[day as keyof IClosedDay],
    }));
    setOpenHoursData((prev) => {
      if (!prevStateOpen) {
        // handle when open day
        setStoredOpenRange((prevStored) => ({
          ...prevStored,
          [day]: prev?.dayOfWeek?.[day as keyof IClosedDay] ?? [],
        }));
        return {
          ...prev,
          dayOfWeek: {
            ...prev.dayOfWeek,
            [day]: [],
          },
        };
      }
      // handle when close day
      return {
        ...prev,
        dayOfWeek: {
          ...prev.dayOfWeek,
          [day]: storedOpenRange[day as keyof IClosedDay].length
            ? storedOpenRange[day as keyof IClosedDay]
            : [{ from: 32400000, to: 64800000 }],
        },
      };
    });
  };

  //
  const addOpenTimeRange = (day: string) => {
    setOpenHoursData((prevData) => ({
      ...prevData,
      dayOfWeek: {
        ...prevData.dayOfWeek,
        [day]: [
          ...prevData.dayOfWeek[day as keyof IClosedDay],
          { from: 32400000, to: 64800000 },
        ], // default open at 9h and closed at 18h
      },
    }));
  };

  //
  const removeOpenTimeRange = (day: string, index: number) => {
    setOpenHoursData((prevData) => ({
      ...prevData,
      dayOfWeek: {
        ...prevData.dayOfWeek,
        [day]: prevData.dayOfWeek[day as keyof IClosedDay].filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  // render
  const renderSelection = () => {
    return (
      <div className="space-y-2">
        {OPEN_TYPES.map((option, index) => (
          <label
            htmlFor={option.value}
            key={index}
            className="flex w-max cursor-pointer items-center gap-3"
          >
            <div
              className={`flex aspect-1 w-5 items-center justify-center rounded-full border ${openHoursData.type === option.value ? "border-blue-500" : "border-neutral-700"}`}
            >
              <span
                className={`aspect-1 w-3 rounded-full bg-blue-400 ${openHoursData.type === option.value ? "block" : "hidden"}`}
              ></span>
            </div>
            <input
              className="hidden"
              type="radio"
              onChange={(e) => {
                setOpenHoursData((prev) => ({ ...prev, type: e.target.value }));
              }}
              name="open_types"
              id={option.value}
              value={option.value}
              checked={openHoursData.type === option.value}
            />
            <div className="">
              <h3 className="text-base font-medium">{option.text}</h3>
              <p className="text-sm text-neutral-6000">{option.desc}</p>
            </div>
          </label>
        ))}
      </div>
    );
  };

  const renderOpenHoursForm = () => {
    if (openHoursData.type !== OPEN_TYPES[0].value) return;

    return (
      <div className="space-y-4">
        {Object.keys(openHoursData?.dayOfWeek).map((day) => (
          <div key={day} className="grid grid-cols-4">
            <div>
              <label htmlFor="">
                <RenderDayOfWeek day={day} />
              </label>
              <div className="col-span-1 flex items-center gap-3">
                <Checkbox
                  name={day}
                  className="cursor-pointer"
                  defaultChecked={isClosed[day as keyof IClosedDay]}
                  onChange={() => handleClosedChange(day as keyof IClosedDay)}
                />
                <label htmlFor={day} className="cursor-pointer">
                  {t("common:closeBusiness")}
                </label>
              </div>
            </div>
            {!isClosed[day as keyof IClosedDay] && (
              <div className="col-span-3 flex flex-col justify-center space-y-4">
                {openHoursData?.dayOfWeek[day as keyof IClosedDay].length > 0 &&
                  openHoursData?.dayOfWeek[day as keyof IClosedDay].map(
                    (timeRange, index) => (
                      <div key={index}>
                        {renderSingleInput(day, timeRange, index)}
                      </div>
                    ),
                  )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSingleInput = (
    day: string,
    timeRange: ITimeRange,
    index: number,
  ) => {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="time"
            defaultValue={convertMillisecondsToTime(timeRange.from)}
            className="rounded-lg dark:bg-neutral-900"
            onChange={(e) =>
              handleChangeTime(
                day as keyof IClosedDay,
                index,
                "from",
                e.target.value,
              )
            }
          />
          <p className="absolute left-1 top-0 -translate-y-1/2 bg-neutral-50 px-2 text-xs dark:bg-neutral-900">
            {t("openHours:openAt")}
          </p>
        </div>
        <div className="relative">
          <input
            type="time"
            defaultValue={convertMillisecondsToTime(timeRange.to)}
            className="rounded-lg dark:bg-neutral-900"
            onChange={(e) =>
              handleChangeTime(
                day as keyof IClosedDay,
                index,
                "to",
                e.target.value,
              )
            }
          />
          <p className="absolute left-1 top-0 -translate-y-1/2 bg-neutral-50 px-2 text-xs dark:bg-neutral-900">
            {t("openHours:closeAt")}
          </p>
        </div>
        {index === 0 ? (
          <div
            className="aspect-1 cursor-pointer rounded-md border border-neutral-700 p-1 hover:bg-neutral-100 hover:shadow-md"
            onClick={() => addOpenTimeRange(day)}
          >
            <PlusIcon className="h-5 w-5 dark:hover:text-black" />
          </div>
        ) : (
          <div
            className="aspect-1 cursor-pointer rounded-md border border-neutral-700 bg-red-500 p-1 text-white hover:bg-opacity-80"
            onClick={() => removeOpenTimeRange(day, index)}
          >
            <TrashIcon className="h-5 w-5" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderSelection()}
      {renderOpenHoursForm()}
    </div>
  );
};

export default UpdateOpenHours;

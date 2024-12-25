import { useTranslation } from "@/app/i18n/client";
import ToolTip from "@/shared/ToolTip";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export interface ProfileField {
  key: number;
  label: string;
  value: boolean;
  weight: number;
}

interface ProgressTasksProps {
  profileFields?: ProfileField[];
}

const PROFILES_FIELD = [
  {
    key: 1,
    label: "BasicProfile",
    value: true,
    weight: 10,
  },
  { key: 2, label: "Avatar", value: true, weight: 10 },
  {
    key: 3,
    label: "Bio (100 chars)",
    value: true,
    weight: 10,
  },
  {
    key: 4,
    label: "Education",
    value: true,
    weight: 10,
  },
  {
    key: 5,
    label: "Experiences",
    value: true,
    weight: 10,
  },
  {
    key: 6,
    label: "Expertise",
    value: false,
    weight: 10,
  },
  { key: 7, label: "Skills", value: true, weight: 10 },
  {
    key: 8,
    label: "Languages",
    value: false,
    weight: 10,
  },
  {
    key: 9,
    label: "Publications",
    value: false,
    weight: 5,
  },
  {
    key: 10,
    label: "Patents",
    value: false,
    weight: 5,
  },
  {
    key: 11,
    label: "Contact Info",
    value: true,
    weight: 10,
  },
];

const ProgressTasks: React.FC<ProgressTasksProps> = ({
  profileFields = PROFILES_FIELD,
}) => {
  const { t } = useTranslation(["common", "dashBoard"]);
  const [percent, setPercent] = useState(0);
  const [fieldsAccomplished, setFieldsAccomplished] = useState<JSX.Element[]>(
    [],
  );
  const [fieldsUnfinished, setFieldsUnfinished] = useState<JSX.Element[]>([]);
  const [isShowTasks, setIsShowTasks] = useState(false);

  const renderProfileElement = (
    label: string,
    point: number,
    key: number,
    isSuccess = false,
  ) => (
    <div className="flex justify-between gap-2" key={key}>
      <ToolTip
        content={`${isSuccess ? t("common:hasExisted") : t("common:notExisted")} ${label}`}
      >
        <h3
          className={`${isSuccess ? "text-green-500" : "text-red-500"} cursor-default truncate`}
        >
          {label}
        </h3>
      </ToolTip>
      <p className="">+{point}%</p>
    </div>
  );

  useEffect(() => {
    const totalWeight = profileFields.reduce(
      (sum, field) => sum + field.weight,
      0,
    );
    let totalPoints = 0;
    const accomplished: JSX.Element[] = [];
    const unfinished: JSX.Element[] = [];

    profileFields.forEach(({ key, label, weight, value }) => {
      const point = (weight / totalWeight) * 100;
      if (value) {
        totalPoints += point;
        accomplished.push(
          renderProfileElement(label, Math.round(point), key, true),
        );
      } else {
        unfinished.push(renderProfileElement(label, Math.round(point), key));
      }
    });

    setPercent(Math.round(totalPoints));
    setFieldsAccomplished(accomplished);
    setFieldsUnfinished(unfinished);
  }, [profileFields]);

  return (
    <div className="space-y-5">
      {/* progressBar summary */}
      <div className="flex items-center space-x-3">
        <div className="relative h-6 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
          {!!(fieldsAccomplished.length || fieldsUnfinished.length) ===
            false && (
            <div className="animation-to-right absolute left-0 top-0 h-6 rounded-full bg-neutral-600 bg-opacity-30"></div>
          )}
          <div
            className="absolute left-0 top-0 h-6 rounded-full bg-primary-400"
            style={{ width: `${percent}%` }}
          >
            <div className="animation-to-right absolute left-0 top-0 h-6 rounded-full bg-neutral-200 bg-opacity-30"></div>
          </div>
        </div>
        <span className="text-gray-600 dark:text-neutral-200">{percent}%</span>
      </div>

      {/* grid tasks */}
      <div
        className={`grid grid-cols-2 gap-x-6 gap-y-4 ${isShowTasks ? "h-max" : "h-16 overflow-hidden"}`}
      >
        {fieldsUnfinished}
        {fieldsAccomplished}
      </div>

      {/* button on/off show tasks */}
      <button
        className="mt-2 flex w-max flex-row items-center gap-1 rounded-lg border px-2 py-1 text-sm shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-600"
        onClick={() => setIsShowTasks(!isShowTasks)}
      >
        {isShowTasks ? t("common:hidden") : t("dashBoard:seeAll")}
        {isShowTasks ? (
          <ChevronUpIcon className="block h-4 w-4" />
        ) : (
          <ChevronDownIcon className="block h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default ProgressTasks;

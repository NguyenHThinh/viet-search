import { IOpenHours } from "@/models/iOpenHours";
import { TFunction } from "i18next";
import * as Yup from "yup";

export interface iFormSchema {
  name: string;
  types: string[];
  description: string;
  descriptions: {
    [key: string]: string;
  };
  keywords: string[];
  categories: string[];
  contacts: {
    type: string;
    value: string;
  }[];
  address: {
    displayed: string;
    zipcode: string;
    country: string;
    street: string;
    state: string;
  };
  images: string[];
  thumbnail: string;
  open_hours: IOpenHours;
}

export const fullFormSchema = (t: TFunction) =>
  Yup.object().shape({
    name: Yup.string().required(t("addBusiness:error.nameRequired")),
    types: Yup.array().of(
      Yup.string().required(t("addBusiness:error.typesRequired")),
    ),
    description: Yup.string().required(
      t("addBusiness:error.descriptionRequired"),
    ),
    descriptions: Yup.object().shape({}),
    keywords: Yup.array().of(Yup.string()),
    categories: Yup.array()
      .of(Yup.string().required(t("addBusiness:error.categoriesRequired")))
      .min(1, t("addBusiness:error.atLeastOneCats")),
    contacts: Yup.array().of(
      Yup.object().shape({
        type: Yup.string(),
        value: Yup.string(),
      }),
    ),
    address: Yup.object().shape({
      displayed: Yup.string().required(
        t("addBusiness:error.displayedRequired"),
      ),
      zipcode: Yup.string(),
      country: Yup.string().required(t("addBusiness:error.countryRequired")),
      street: Yup.string(),
      state: Yup.string(),
    }),
    images: Yup.array().of(Yup.string()),
    thumbnail: Yup.string().required(t("addBusiness:error.thumbnailRequired")),
    open_hours: Yup.object().shape({
      dayOfWeek: Yup.object().shape({
        mon: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        tue: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        wed: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        thu: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        fri: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        sat: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        sun: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
      }),
      type: Yup.string(),
      note: Yup.string(),
      publicHoliday: Yup.string(),
    }),
  });

export const getStepSchemas = (t: TFunction) => {
  // Define your step schemas
  const step1Schema = Yup.object().shape({
    name: Yup.string().required(t("addBusiness:error.nameRequired")),
    types: Yup.array().of(
      Yup.string().required(t("addBusiness:error.typesRequired")),
    ),
    description: Yup.string().required(
      t("addBusiness:error.descriptionRequired"),
    ),
    descriptions: Yup.object().shape({}),
    keywords: Yup.array().of(Yup.string()),
    categories: Yup.array()
      .of(Yup.string().required(t("addBusiness:error.categoriesRequired")))
      .min(1, t("addBusiness:error.atLeastOneCats")),
  });

  const step2Schema = Yup.object().shape({
    contacts: Yup.array().of(
      Yup.object().shape({
        type: Yup.string(),
        value: Yup.string(),
      }),
    ),
    address: Yup.object().shape({
      displayed: Yup.string().required(
        t("addBusiness:error.displayedRequired"),
      ),
      zipcode: Yup.string(),
      country: Yup.string().required(t("addBusiness:error.countryRequired")),
      street: Yup.string(),
      state: Yup.string(),
    }),
  });

  const step4Schema = Yup.object().shape({
    images: Yup.array().of(Yup.string()),
    thumbnail: Yup.string().required(t("addBusiness:error.thumbnailRequired")),
  });

  const step3Schema = Yup.object().shape({
    open_hours: Yup.object().shape({
      dayOfWeek: Yup.object().shape({
        mon: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        tue: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        wed: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        thu: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        fri: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        sat: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
        sun: Yup.array().of(
          Yup.object().shape({
            from: Yup.number(),
            to: Yup.number(),
          }),
        ),
      }),
      type: Yup.string(),
      note: Yup.string(),
      publicHoliday: Yup.string(),
    }),
  });

  // Return an array of schema objects
  return [
    { schema: step1Schema, label: "Step 1: Category" },
    { schema: step2Schema, label: "Step 2: Contact" },
    { schema: step3Schema, label: "Step 3: Open Hours" },
    { schema: step4Schema, label: "Step 4: Images" },
  ];
};

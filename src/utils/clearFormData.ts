import { iFormSchema } from "@/app/[lng]/(business)/add-business/form-config";

const clearFormData = (formData: iFormSchema) => {
  const cleanedFormData = {
    ...formData,
    // clear empty contact value
    contacts: formData.contacts.filter(
      (contact: { type: string; value: string }) => contact.value.trim() !== "",
    ),
    open_hours: {
      ...formData.open_hours,
      dayOfWeek: Object.fromEntries(
        Object.entries(formData.open_hours.dayOfWeek).map(
          ([day, timeRanges]) => [
            day,
            timeRanges.filter(
              (timeRange: { from?: number; to?: number }) =>
                timeRange.from !== 0 || timeRange.to !== 0,
            ),
          ],
        ),
      ),
    },
  };
  return cleanedFormData;
};

export default clearFormData;

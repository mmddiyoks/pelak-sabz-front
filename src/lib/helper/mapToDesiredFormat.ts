import { AutocompleteItemType } from "@/models/AutocompleteItemType";

const mapToDesiredFormat = (
  array: { id: string; [key: string]: string }[],
  labelKey: string
): AutocompleteItemType[] => {
  return array.map((obj) => ({
    key: `${obj.id}`,
    label: obj[labelKey] || "", // Fallback to empty string if labelKey is not found
  }));
};

export default mapToDesiredFormat;

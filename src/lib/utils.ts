import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
export const isMObile = () => {};

export const deleteAdditinalsItemsInReq = (
  reqestData: [],
  property: string
) => {
  let fixedData: [] = [];
  for (const item of reqestData) {
    let existItem = fixedData.find(
      (fixedItem) => (fixedItem as any)[property] == (item as any)[property]
    );
    if (!existItem) {
      fixedData.push(item);
    }
  }
  return fixedData;
};
export const setLocalStoragePlateInfo = (data: any) => {
  try {
    window.localStorage.setItem("plate_info", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};
export const getLocalStoragePlateInfo = (): any | null => {
  try {
    const stored = window.localStorage.getItem("plate_info");
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed;
  } catch (error) {
    console.log(error);
    window.localStorage.removeItem("plate_info");
    return null;
  }
};

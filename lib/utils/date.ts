import { formatInTimeZone } from "date-fns-tz";
import { enUS } from "date-fns/locale";

export const PH_TIMEZONE = "Asia/Manila";

export function formatDateToPH(
  date: string | Date,
  formatStr: string = "MMM dd, yyyy HH:mm"
): string {
  return formatInTimeZone(new Date(date), PH_TIMEZONE, formatStr, {
    locale: enUS,
  });
}

export function getCurrentPHDateTime(): string {
  const now = new Date();
  return formatInTimeZone(now, PH_TIMEZONE, "yyyy-MM-dd HH:mm:ss");
}

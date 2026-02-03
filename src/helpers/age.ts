import { differenceInDays, differenceInMonths } from "date-fns";
import { defaultLang, ui } from "../i18n/ui";

const LEOS_BIRTHDAY = new Date("2024-01-01T21:45:00+09:00");
const AGE_PREFIX = "album.";

const getMonthKey = (months: number) =>
  months === 1 ? `${AGE_PREFIX}1_month_old` : `${AGE_PREFIX}${months}_months_old`;

export const getAgeFromPublishDate = (publishDate: Date): string => {
  const daysDiff = differenceInDays(publishDate, LEOS_BIRTHDAY);
  if (daysDiff < 0) return `${AGE_PREFIX}before_birth`;
  if (daysDiff < 7) return `${AGE_PREFIX}few_days_old`;

  const monthsDiff = differenceInMonths(publishDate, LEOS_BIRTHDAY);
  if (monthsDiff < 1) return `${AGE_PREFIX}few_weeks_old`;

  return getMonthKey(monthsDiff);
};

export const getAgeLabel = (
  ageKey: string,
  lang: keyof typeof ui,
): string => {
  if (ageKey.startsWith(AGE_PREFIX)) {
    const monthMatch = ageKey.match(/^album\.(\d+)_month(?:s)?_old$/);
    if (monthMatch) {
      const months = Number(monthMatch[1]);
      if (lang === "ja") {
        return `${months}ヶ月`;
      }
      return `${months} Month${months === 1 ? "" : "s"} Old`;
    }
  }

  const base = ui[lang] as Record<string, string>;
  const fallback = ui[defaultLang] as Record<string, string>;
  return base[ageKey] ?? fallback[ageKey] ?? ageKey;
};

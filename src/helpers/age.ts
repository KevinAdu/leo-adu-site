import { differenceInDays, differenceInMonths } from "date-fns";

export const getAgeFromPublishDate = (publishDate: Date): string => {
  const LEOS_BIRTHDAY = new Date(`January 1 2024 21:45:00`);
  if (differenceInDays(publishDate, LEOS_BIRTHDAY) < 0)
    return "album.before_birth";
  if (differenceInDays(publishDate, LEOS_BIRTHDAY) < 7)
    return "album.few_days_old";
  if (differenceInDays(publishDate, LEOS_BIRTHDAY) >= 7 
    && differenceInMonths(publishDate, LEOS_BIRTHDAY) < 1
  )
    return "album.few_weeks_old"
  if (differenceInMonths(publishDate, LEOS_BIRTHDAY) >= 1
    && differenceInMonths(publishDate, LEOS_BIRTHDAY) < 2
  )
    return "album.1_month_old"
  if (differenceInMonths(publishDate, LEOS_BIRTHDAY) >= 2
    && differenceInMonths(publishDate, LEOS_BIRTHDAY) < 3
  )
    return "album.2_months_old"
  if (differenceInMonths(publishDate, LEOS_BIRTHDAY) >= 3
    && differenceInMonths(publishDate, LEOS_BIRTHDAY) < 4
  )
    return "album.3_months_old"
  if (differenceInMonths(publishDate, LEOS_BIRTHDAY) >= 4
    && differenceInMonths(publishDate, LEOS_BIRTHDAY) < 5
  )
    return "album.4_months_old"
  if (differenceInMonths(publishDate, LEOS_BIRTHDAY) >= 5
    && differenceInMonths(publishDate, LEOS_BIRTHDAY) < 6
  )
    return "album.5_months_old"
  if (differenceInMonths(publishDate, LEOS_BIRTHDAY) >= 6
    && differenceInMonths(publishDate, LEOS_BIRTHDAY) < 7
  )
    return "album.6_months_old"
   
  return '';
}
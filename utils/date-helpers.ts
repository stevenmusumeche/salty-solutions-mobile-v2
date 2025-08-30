import {
  differenceInDays,
  format,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
} from "date-fns";

/**
 * Converts date strings into natural relative day names
 * Examples: "Today", "Yesterday", "Tomorrow", "Last Thursday", "Next Friday", "December 15"
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return "Today";
  }

  const dayName = format(date, "EEEE");
  const daysFromToday = differenceInDays(
    startOfDay(date),
    startOfDay(new Date())
  );

  // Future dates
  if (daysFromToday > 0) {
    if (isTomorrow(date)) {
      return "Tomorrow";
    }

    // Only use "Next" prefix for dates that are 7+ days away (truly next week)
    // This matches natural speech: "Sunday" (this weekend) vs "Next Friday" (week after)
    if (daysFromToday >= 7) {
      return `Next ${dayName}`;
    }

    return dayName;
  }

  // Past dates
  if (isYesterday(date)) {
    return "Yesterday";
  }

  const daysPast = Math.abs(daysFromToday);

  // For dates 2-6 days ago, use "Last [DayName]"
  if (daysPast >= 2 && daysPast <= 7) {
    return `Last ${dayName}`;
  }

  // For dates more than 7 days ago, use actual date
  if (daysPast >= 7) {
    return format(date, "MMMM d");
  }

  return dayName;
}

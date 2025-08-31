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

    // For dates within this week (2-6 days), just use day name
    if (daysFromToday <= 6) {
      return dayName;
    }

    // For dates 7-13 days away (next week), use "Next [DayName]"
    if (daysFromToday <= 13) {
      return `Next ${dayName}`;
    }

    // For dates more than 2 weeks away, show actual date
    return format(date, "MMMM d");
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

// Formats a date string to 'D MMM YYYY HH:MM AM/PM' format
export function formatDate(dateString: string): string {
  // Parse the input date string into a Date object
  const date = new Date(dateString);

  // Get the day, month, and year
  const day = date.getDate(); // Day of the month
  const year = date.getFullYear(); // Year

  // Convert month number to a month name
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()]; // Month name

  const rawHours = date.getHours();
  const minute = date.getMinutes();

  // Pads single digit numbers with leading zero
  function pad(number: number) {
    // add a leading zero if the number is less than 10
    return (number < 10 ? "0" : "") + number;
  }

  // Convert to 12-hour format and determine AM/PM
  const isPM = rawHours >= 12;
  const hour = rawHours % 12 === 0 ? 12 : rawHours % 12; // Convert to 12-hour format
  const amPm = isPM ? "PM" : "AM";

  // Return formatted string
  return `${day} ${month} ${year} ${pad(hour)}:${pad(minute)} ${amPm}`;
}

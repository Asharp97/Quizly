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

  // Return formatted string
  return `${day} ${month} ${year}`;
}

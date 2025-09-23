// Converts a date string or Date object to 'YYYY-MM-DDTHH:MM' format for input[type="datetime-local"]
function toDatetimeLocal(dateString: string | Date): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  // Pads single digit numbers with leading zero
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes())
  );
}

export { toDatetimeLocal };

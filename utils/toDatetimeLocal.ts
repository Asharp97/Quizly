function toDatetimeLocal(dateString: string | Date): string {
  if (!dateString) return "";
  const d = new Date(dateString);
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
export function formatBangkok(isoString) {
  if (!isoString) return "N/A";

  const date = new Date(isoString);

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!timeZone) {
    timeZone = "Asia/Bangkok";
  }

  const options = {
    day:    "2-digit",
    month:  "2-digit",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone,
  };

  try {
      const formatter = new Intl.DateTimeFormat("en-GB", options);
      const parts = formatter.formatToParts(date);

      const get = (type) => parts.find(p => p.type === type)?.value;

      const day    = get("day");
      const month  = get("month");
      const year   = get("year");
      const hour   = get("hour");
      const minute = get("minute");
      const second = get("second");

      return `${day}/${month}/${year}, ${hour}:${minute}:${second} (${timeZone})`;
  } catch (e) {
      console.error("Error formatting date:", e);
      return "N/A";
  }
}
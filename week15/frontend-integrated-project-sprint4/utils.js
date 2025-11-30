export function formatBangkok(isoString, showTimezone = true) {
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
      const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

      if (showTimezone) {
          return `${formattedDate} (${timeZone})`;
      }
     return formattedDate;
  } catch (e) {
      console.error("Error formatting date:", e);
      return "N/A";
  }
}
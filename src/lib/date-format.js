export function formatDate(date) {
  const parsed = new Date(date.replace(/-/g, "/"));
  const year = parsed.getFullYear();
  const month = parsed.toLocaleString("default", { month: "long" });
  const day = parsed.getDate();
  return `${month} ${day}, ${year}`;
}

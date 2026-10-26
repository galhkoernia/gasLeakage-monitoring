export const fmtTime = (ms: number, seconds = true) =>
  new Date(ms).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    ...(seconds ? { second: "2-digit" } : {}),
    hour12: false,
  });

export const fmtDateTime = (ms: number) =>
  `${new Date(ms).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${fmtTime(ms)}`;

export const fmtDuration = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
};

export const fmtAgo = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

export const fmtNumber = (n: number) => n.toLocaleString("en-US");

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const sharesFmt = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
});

const compactVol = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function money(value: number, kind: "fine" | "whole" = "fine"): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return kind === "whole" ? usdWhole.format(Math.round(value)) : usd.format(value);
}

export function signedMoney(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  const formatted = money(Math.abs(value));
  if (value > 0.005) {
    return `+${formatted}`;
  }
  if (value < -0.005) {
    return `−${formatted}`;
  }
  return money(0);
}

export function signedPct(value: number | null, digits = 1): string {
  if (value == null || !Number.isFinite(value)) {
    return "—";
  }
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(digits)}%`;
}

export function formatShares(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return sharesFmt.format(value);
}

export function formatVolume(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return compactVol.format(value);
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) {
    return iso;
  }
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) {
    return iso;
  }
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function pnlTone(value: number): "up" | "down" | "flat" {
  if (value > 0.005) {
    return "up";
  }
  if (value < -0.005) {
    return "down";
  }
  return "flat";
}

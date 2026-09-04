import type { Quality } from "../types";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdFine = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function money(value: number, kind: "auto" | "fine" = "auto"): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  const whole = Math.abs(value - Math.round(value)) < 0.005;
  if (kind === "auto" && value >= 100) {
    return usd.format(Math.round(value));
  }
  if (whole && value >= 10) {
    return usd.format(Math.round(value));
  }
  return usdFine.format(value);
}

export function signedPct(value: number | null): string {
  if (value == null || !Number.isFinite(value)) {
    return "—";
  }
  const rounded = Math.abs(value) < 10 ? value.toFixed(1) : value.toFixed(1);
  const sign = value > 0 ? "+" : "";
  return `${sign}${rounded}%`;
}

export function compactNumber(value: number, digits = 1): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  if (value >= 100) {
    return value.toFixed(0);
  }
  if (value >= 10) {
    return value.toFixed(1);
  }
  return value.toFixed(digits);
}

export function qualityLabel(quality: Quality | null): string {
  switch (quality) {
    case "official":
      return "Official";
    case "documented":
      return "Documented";
    case "interpolated":
      return "Estimate";
    case "cpi-scaled":
      return "CPI-scaled";
    case "ytd":
      return "Through Jul 2026";
    default:
      return "";
  }
}

export function inflationTone(yoy: number | null): "up" | "down" | "flat" | "none" {
  if (yoy == null) {
    return "none";
  }
  if (yoy > 0.15) {
    return "up";
  }
  if (yoy < -0.15) {
    return "down";
  }
  return "flat";
}

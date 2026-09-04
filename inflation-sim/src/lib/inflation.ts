import type { CpiYear } from "../types";

/** Official CPI-U index base used throughout the app and data notes. */
export const CPI_BASE_LABEL = "1982–84 = 100";

export function indexByYear(cpi: CpiYear[]): Map<number, CpiYear> {
  return new Map(cpi.map((row) => [row.year, row]));
}

/** Convert an amount from one year's dollars into another year's dollars. */
export function inflate(
  amount: number,
  fromIndex: number,
  toIndex: number,
): number {
  if (fromIndex <= 0) {
    throw new Error("CPI index must be positive");
  }
  return amount * (toIndex / fromIndex);
}

export function yearOverYearPct(thisIndex: number, prevIndex: number): number {
  if (prevIndex <= 0) {
    throw new Error("Previous CPI index must be positive");
  }
  return (thisIndex / prevIndex - 1) * 100;
}

/** Rebase the official CPI so a chosen year equals 100. */
export function rebasedIndex(officialIndex: number, baseOfficialIndex: number): number {
  if (baseOfficialIndex <= 0) {
    throw new Error("Base CPI index must be positive");
  }
  return (officialIndex / baseOfficialIndex) * 100;
}

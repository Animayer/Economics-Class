import type { Dataset, Good, PricePoint, ResolvedPrice } from "../types";

export function priceMap(series: PricePoint[]): Map<number, PricePoint> {
  return new Map(series.map((point) => [point.year, point]));
}

export function priceAtYear(good: Good, year: number): ResolvedPrice {
  if (year < good.availableFrom) {
    return {
      price: null,
      quality: null,
      reason: good.unavailableReason ?? "No data for this year.",
    };
  }
  const point = priceMap(good.series).get(year);
  if (!point) {
    return { price: null, quality: null, reason: "No estimate for this year." };
  }
  return { price: point.price, quality: point.quality, reason: null };
}

export function findGood(dataset: Dataset, id: string): Good | undefined {
  return dataset.goods.find((good) => good.id === id);
}

export function unitsAffordable(
  paycheck: number,
  unitPrice: number | null,
): number | null {
  if (unitPrice == null || unitPrice <= 0) {
    return null;
  }
  return paycheck / unitPrice;
}

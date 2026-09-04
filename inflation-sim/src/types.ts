export type Quality = "official" | "documented" | "interpolated" | "cpi-scaled" | "ytd";

export interface CpiYear {
  year: number;
  index: number;
  yoyPct: number | null;
  quality: Quality;
}

export interface PricePoint {
  year: number;
  price: number;
  quality: Quality;
}

export interface Good {
  id: string;
  name: string;
  unit: string;
  shortLabel: string;
  icon: string;
  notes: string;
  availableFrom: number;
  unavailableReason: string | null;
  series: PricePoint[];
}

export interface Episode {
  id: string;
  label: string;
  start: number;
  end: number;
  headline: string;
  cue: string;
}

export interface DatasetMeta {
  title: string;
  class: string;
  startYear: number;
  endYear: number;
  cpiBase: string;
  cpiSeries: string;
  cpiSource: string;
  latestCompleteYear: number;
  latestThrough: string;
  latestNote: string;
  displayYear: number;
  builtFrom: string;
}

export interface Dataset {
  meta: DatasetMeta;
  cpi: CpiYear[];
  goods: Good[];
  episodes: Episode[];
}

export interface ResolvedPrice {
  price: number | null;
  quality: Quality | null;
  reason: string | null;
}

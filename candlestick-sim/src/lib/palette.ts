export type Palette = "classic" | "colorblind";

export type PaletteColors = {
  up: string;
  down: string;
  flat: string;
  label: string;
  hint: string;
};

export const PALETTES: Record<Palette, PaletteColors> = {
  classic: {
    up: "#3ddc97",
    down: "#ff5c6c",
    flat: "#e3b341",
    label: "Green / red",
    hint: "Green means the close finished above the open. Red means it finished below.",
  },
  colorblind: {
    up: "#2ec4b6",
    down: "#ff9a62",
    flat: "#e3b341",
    label: "Teal / coral",
    hint: "Teal means the close finished above the open. Coral means it finished below. Coral candles also wear stripes.",
  },
};

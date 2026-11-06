import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Palette: light beige, creamy white, dusty pink (green from the invitation replaced by beige).
export const C = {
  cream: "#FBF6EE",
  paper: "#F6EEE2",
  beige: "#E6D5BE",
  beigeDeep: "#CDB596",
  sand: "#B89B78",
  pink: "#E8C4C2",
  pinkDeep: "#D4A3A3",
  rose: "#C98E8F",
  ink: "#7A5E4A",
  gold: "#BFA27E",
};

export const TITLE_FONT = "ArefRuqaa";
export const BODY_FONT = "Amiri";

const fonts = [
  { family: TITLE_FONT, file: "aref-ruqaa-arabic-400-normal.woff2", weight: "400" },
  { family: TITLE_FONT, file: "aref-ruqaa-arabic-700-normal.woff2", weight: "700" },
  { family: BODY_FONT, file: "amiri-arabic-400-normal.woff2", weight: "400" },
  { family: BODY_FONT, file: "amiri-arabic-700-normal.woff2", weight: "700" },
];

for (const f of fonts) {
  loadFont({
    family: f.family,
    url: staticFile(`fonts/${f.file}`),
    weight: f.weight,
    format: "woff2",
  });
}

// Layout: the footage window inside the classic frame.
export const W = 1920;
export const H = 1080;
export const VW = 1600;
export const VH = 900;
export const VX = (W - VW) / 2; // 160
export const VY = (H - VH) / 2; // 90

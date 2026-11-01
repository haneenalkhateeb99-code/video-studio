import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are stored locally in public/fonts so rendering works without
// downloading anything at render time. Cairo supports Arabic + Latin.
export const fontFamily = "Cairo";

const files = [
  { weight: "400", subset: "arabic" },
  { weight: "400", subset: "latin" },
  { weight: "800", subset: "arabic" },
  { weight: "800", subset: "latin" },
] as const;

const ranges = {
  arabic: "U+0600-06FF, U+0750-077F, U+0870-08FF, U+200C-200E, U+2010-2011, U+FB50-FDFF, U+FE70-FEFC",
  latin: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2212, U+FEFF, U+FFFD",
};

for (const f of files) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/Cairo-${f.weight}-${f.subset}.woff2`),
    weight: f.weight,
    format: "woff2",
    unicodeRange: ranges[f.subset],
  });
}

# Video Studio — instructions for Claude

The user works from an iPad only. All setup, rendering and delivery happens in the cloud
session; the user downloads finished videos from GitHub. Reply to the user in Arabic.

## Workflow for a new video request
1. `npm install` if `node_modules/` is missing.
2. Create a component in `src/<Name>.tsx` and register a `<Composition>` in `src/Root.tsx`
   (id, fps 30, width/height, durationInFrames = seconds × fps, defaultProps).
3. `npm run typecheck`, then `npx remotion render <Id> out/<kebab-name>.mp4`.
4. Verify: `ffprobe` (h264, yuv420p, expected duration), and extract a frame with ffmpeg and look
   at it to check the text and layout.
5. Commit the source **and** the MP4 in `out/`, push, and give the user the GitHub link to the file
   in `out/` plus the iPad download steps from README.md.

## Gotchas
- Headless Chromium in this sandbox does NOT trust the proxy CA: any remote URL loaded inside
  a composition (Google Fonts, remote images, remote audio) fails with ERR_CERT_AUTHORITY_INVALID
  and the render times out. Download assets with `curl` into `public/` and use `staticFile()`.
- Fonts: use `src/fonts.ts` (Cairo, Arabic + Latin, weights 400/800). For other fonts, download
  the woff2 into `public/fonts` and register them with `@remotion/fonts`.
- Arabic text: set `dir="rtl"` on the element.
- Keep codec h264 + yuv420p (set in remotion.config.ts) so files play on iPad/iPhone.
- Keep each MP4 well under GitHub's 100 MB file limit (aim < 50 MB). For long videos lower `--crf`
  quality (e.g. `--crf 28`) or the resolution.

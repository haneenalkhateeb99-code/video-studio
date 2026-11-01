# Video Studio — instructions for Claude

The user works from an iPad only. All setup, rendering and delivery happens in the cloud
session; the user downloads finished videos from GitHub. Reply to the user in Arabic.

## Remotion skills (official, installed in `.claude/skills/`)
The official Remotion Agent Skills (`remotion-dev/skills`, v4.0.539, pinned in `skills-lock.json`)
are committed to this repo. **Use them for every video task:**
- Start with the `remotion-best-practices` skill (router), then load what it points to:
  `remotion-create` for a new video/composition, `remotion-markup` for writing the React markup
  (animation, sequencing, transitions, text, images, audio), `remotion-render` for export options,
  `remotion-captions`, `remotion-maps`, `remotion-multimedia` when relevant, and `remotion-docs`
  to look up current APIs instead of answering from memory.
- For Arabic text always read `.claude/skills/remotion-markup/arabic-text.md`
  (animate words, not letters; `dir="rtl"` + `lang="ar"`).
- To update the skills: `npx skills update -p -y` (or `remotion-upgrade` skill together with Remotion).

### Overrides — this file wins where the skills disagree
- **A project already exists.** Never scaffold (`create-video`) or create a new project/subfolder;
  add compositions to this one.
- **Always render the MP4.** The skills say "don't render unless explicit, open Studio instead".
  Here the user is on an iPad and cannot reach Studio (localhost inside the cloud container), so
  every video request implicitly means "render it to MP4 and deliver it". Do not start Studio as the
  delivery method.
- **No Google Fonts / remote URLs** (see Gotchas) even though `google-fonts.md` recommends
  `@remotion/google-fonts`; use local fonts via `@remotion/fonts` as in `local-fonts.md`.

## Workflow for a new video request
1. `npm install` if `node_modules/` is missing. Load the `remotion-best-practices` skill.
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

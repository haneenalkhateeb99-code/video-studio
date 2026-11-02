"""Generate the Lab 13 bilingual voice-over (Arabic narration + English terms).

Usage (from the repo root):
  pip install edge-tts numpy
  node scripts/lab13-export-narration.cjs > /tmp/narration.json
  python3 -I scripts/lab13-tts.py /tmp/narration.json [--only id1,id2]

Each sentence's parts are synthesised separately ("ar" → Arabic voice, "en" → English
voice), trimmed, loudness-matched and joined (scripts/lab13_mix.py).
Writes public/lab13/vo/<id>.mp3, src/lab13/vo-durations.json, src/lab13/vo-words.json.
To use a human recording instead: put <id>.mp3 files in public/lab13/vo/ and run with
--durations-only (scenes then fall back to sentence fractions for the animations).
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(sys.argv[0]))
sys.path.insert(0, HERE)
import lab13_mix  # noqa: E402

ROOT = os.path.dirname(HERE)
VO = os.path.join(ROOT, "public", "lab13", "vo")
DUR = os.path.join(ROOT, "src", "lab13", "vo-durations.json")
WORDS = os.path.join(ROOT, "src", "lab13", "vo-words.json")


def duration(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path])
    return round(float(out.decode().strip()), 3)


def main():
    data = json.load(open(sys.argv[1]))
    durations_only = "--durations-only" in sys.argv
    only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
    os.makedirs(VO, exist_ok=True)
    words = json.load(open(WORDS)) if (only and os.path.exists(WORDS)) else {}
    durs = {}
    for scene, segs in data.items():
        for s in segs:
            path = os.path.join(VO, s["id"] + ".mp3")
            if not durations_only and (only is None or s["id"] in only):
                y, w = lab13_mix.build(s["parts"])
                lab13_mix.save(y, path)
                words[s["id"]] = [[t, txt] for t, txt, _ in w]
            durs[s["id"]] = duration(path)
            print(scene, s["id"], durs[s["id"]])
    json.dump(durs, open(DUR, "w"), indent=1)
    json.dump({} if durations_only else words, open(WORDS, "w"), ensure_ascii=False, indent=1)
    print("total speech", round(sum(durs.values()), 1))


main()

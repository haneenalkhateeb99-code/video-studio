"""Generate the Lab 13 Arabic voice-over with Microsoft neural TTS (edge-tts).

Usage (from the repo root):
  pip install edge-tts
  node scripts/lab13-export-narration.cjs > /tmp/narration.json
  python3 -I scripts/lab13-tts.py /tmp/narration.json

Writes public/lab13/vo/<id>.mp3, src/lab13/vo-durations.json and src/lab13/vo-words.json.
Speech rate is fixed (RATE); only the silence at the end of each clip is trimmed.
To use a human recording instead: put <id>.mp3 files in public/lab13/vo/ and run with
--durations-only (word timings are then dropped and scenes fall back to sentence fractions).
"""
import asyncio, json, os, ssl, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VO = os.path.join(ROOT, "public", "lab13", "vo")
DUR = os.path.join(ROOT, "src", "lab13", "vo-durations.json")
WORDS = os.path.join(ROOT, "src", "lab13", "vo-words.json")
VOICE = "ar-SA-HamedNeural"
RATE = "-6%"

def duration(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path])
    return round(float(out.decode().strip()), 3)

def trim_tail(path):
    """Remove trailing silence (keeps 0.25 s); speed and start are untouched."""
    tmp = path + ".tmp.mp3"
    af = "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.25,areverse"
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", path, "-af", af, "-c:a", "libmp3lame", "-b:a", "96k", tmp])
    os.replace(tmp, path)

async def synth(text, out):
    import edge_tts, edge_tts.communicate as c
    ca = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
    if os.path.exists(ca):  # cloud sandbox: trust the egress proxy CA
        c._SSL_CTX = ssl.create_default_context(cafile=ca)
    words = []
    with open(out, "wb") as f:
        async for ch in edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary").stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append([round(ch["offset"] / 1e7, 3), ch["text"]])
    return words

def main():
    data = json.load(open(sys.argv[1]))
    durations_only = "--durations-only" in sys.argv
    os.makedirs(VO, exist_ok=True)
    words = {} if durations_only else {}
    durs = {}
    for scene, segs in data.items():
        for s in segs:
            path = os.path.join(VO, s["id"] + ".mp3")
            if not durations_only:
                words[s["id"]] = asyncio.run(synth(s.get("tts") or s["text"], path))
                trim_tail(path)
            durs[s["id"]] = duration(path)
            print(scene, s["id"], durs[s["id"]])
    json.dump(durs, open(DUR, "w"), indent=1)
    json.dump(words, open(WORDS, "w"), ensure_ascii=False, indent=1)
    print("total speech", round(sum(durs.values()), 1))

main()

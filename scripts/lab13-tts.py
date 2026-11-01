"""Generate the Lab 13 Arabic voice-over with Microsoft neural TTS (edge-tts).

Usage (from the repo root):
  pip install edge-tts
  node scripts/lab13-export-narration.cjs > /tmp/narration.json
  python3 -I scripts/lab13-tts.py /tmp/narration.json [--only id1,id2]

Writes public/lab13/vo/<id>.mp3 and src/lab13/vo-durations.json.
To use a human recording instead, replace the mp3 files (same ids) and rerun
with --durations-only so the scene timing follows the new audio.
"""
import asyncio, json, os, ssl, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VO = os.path.join(ROOT, "public", "lab13", "vo")
DUR = os.path.join(ROOT, "src", "lab13", "vo-durations.json")
VOICE = "ar-SA-HamedNeural"
RATE = "-6%"

def duration(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path])
    return round(float(out.decode().strip()), 3)

async def synth(text, out):
    import edge_tts, edge_tts.communicate as c
    ca = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
    if os.path.exists(ca):  # cloud sandbox: trust the egress proxy CA
        c._SSL_CTX = ssl.create_default_context(cafile=ca)
    await edge_tts.Communicate(text, VOICE, rate=RATE).save(out)

def main():
    data = json.load(open(sys.argv[1]))
    only = None
    if "--only" in sys.argv:
        only = set(sys.argv[sys.argv.index("--only") + 1].split(","))
    os.makedirs(VO, exist_ok=True)
    durs = {}
    for scene, segs in data.items():
        for s in segs:
            path = os.path.join(VO, s["id"] + ".mp3")
            if "--durations-only" not in sys.argv and (only is None or s["id"] in only):
                asyncio.run(synth(s.get("tts") or s["text"], path))
            durs[s["id"]] = duration(path)
            print(scene, s["id"], durs[s["id"]])
    json.dump(durs, open(DUR, "w"), indent=1)

main()

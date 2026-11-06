#!/usr/bin/env python3
"""Build the gender-reveal edit: cut + grade + clean every selected shot with ffmpeg,
then write src/GenderReveal/edl.json which the Remotion composition reads.

Usage: python3 scripts/gender-reveal/build.py RAW_DIR [--only ID,ID] [--plan]
"""
import json, os, subprocess, sys, wave
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RAW = sys.argv[1]
OUT = os.path.join(ROOT, "public", "gender-reveal")
CACHE = os.path.join(OUT, "_audio")
FPS = 30
os.makedirs(OUT, exist_ok=True)
os.makedirs(CACHE, exist_ok=True)

# Per-source grade (after HLG->SDR tonemap). Keeps skin natural; evens out the brighter wide camera.
GRADE = {
    "default": "eq=saturation=1.06:gamma=1.04,colorbalance=rm=0.015:bm=-0.015",
    "IMG_7514.MOV": "eq=contrast=1.12:brightness=-0.035:saturation=1.12:gamma=0.97,colorbalance=rm=0.015:bm=-0.015",
    "IMG_2871.MOV": "eq=contrast=1.05:brightness=-0.015:saturation=1.06:gamma=1.0,colorbalance=rm=0.015:bm=-0.015",
}

# kind -> (music level, clip-audio gain)
LEVELS = {
    "decor": (0.55, 0.18),
    "guest": (0.45, 0.30),
    "voice": (0.10, 1.00),
    "suspense": (0.12, 1.00),
    "reveal": (0.05, 1.00),
    "react": (0.08, 1.00),
    "hug": (0.42, 0.00),
    "after": (0.45, 0.25),
}

# trans = transition INTO this shot: "fade" (soft dissolve) or "cut" (hard cut, used in the synced multicam reveal)
# T(x) for the second angle: IMG_2871 time = IMG_7514 time + 6.15
OFF = 6.15
EDL = [
    # ---- Arrival & decor ----
    dict(id="s01", src="IMG_2831.MOV", a=0.00, b=1.75, kind="decor", zoom="in"),
    dict(id="s02", src="IMG_2822.MOV", a=0.00, b=3.00, kind="decor", portrait=True),
    dict(id="s03", src="IMG_2823.MOV", a=0.40, b=5.80, kind="decor"),
    dict(id="s04", src="IMG_2824.MOV", a=0.20, b=3.55, kind="decor"),
    dict(id="s05", src="IMG_2829.MOV", a=0.00, b=2.60, kind="decor", zoom="in"),
    dict(id="s06", src="IMG_2826.MOV", a=0.60, b=4.20, kind="decor"),
    dict(id="s07", src="IMG_2830.MOV", a=0.00, b=2.20, kind="decor"),
    dict(id="s08", src="IMG_2828.MOV", a=0.00, b=3.30, kind="decor"),
    dict(id="s09", src="IMG_2835.MOV", a=0.20, b=3.30, kind="decor"),
    # ---- Guests & family ----
    dict(id="s10", src="IMG_2836.MOV", a=0.00, b=2.50, kind="guest"),
    dict(id="s11", src="IMG_2838.MOV", a=0.30, b=3.30, kind="guest"),
    dict(id="s12", src="IMG_2842.MOV", a=3.20, b=6.60, kind="guest"),
    dict(id="s13", src="IMG_2848.MOV", a=0.00, b=2.60, kind="guest"),
    dict(id="s14", src="IMG_2860.MOV", a=0.00, b=2.80, kind="guest"),
    dict(id="s15", src="IMG_2867.MOV", a=0.40, b=3.50, kind="guest"),
    dict(id="s16", src="IMG_2862.MOV", a=6.20, b=9.20, kind="guest"),
    dict(id="s17", src="IMG_2870.MOV", a=0.00, b=2.60, kind="guest", zoom="in"),
    dict(id="s18", src="IMG_2827.MOV", a=1.00, b=4.00, kind="guest"),
    # mother: "ولد أو بنت، إن شاء الله يكون صحة سليمة، ومرحبًا فيهم كثير"
    dict(id="s19", src="IMG_2865.MOV", a=1.45, b=5.35, kind="voice"),
    # ---- Card: لحظة ننتظرها بكل حب ---- (inserted by Remotion before s20)
    # ---- Suspense ----
    dict(id="s20", src="IMG_2871.MOV", a=1.60, b=8.40, kind="suspense"),   # countdown, family + father at the box
    dict(id="s21", src="IMG_2871.MOV", a=12.40, b=19.10, kind="suspense", trans="fade"),  # "يلا" chants
    dict(id="s22", src="IMG_7514.MOV", a=25.40, b=32.20, kind="suspense"),  # couple opening the box
    dict(id="s23", src="IMG_2871.MOV", a=42.40, b=44.0 + OFF, kind="suspense"),  # family waiting (ends exactly at T=44)
    # ---- Reveal: synced multicam, natural speed, original sound ----
    dict(id="s24", src="IMG_7514.MOV", a=44.00, b=49.50, kind="reveal", trans="cut"),
    dict(id="s25", src="IMG_2871.MOV", a=49.50 + OFF, b=52.50 + OFF, kind="reveal", trans="cut"),
    dict(id="s26", src="IMG_7514.MOV", a=52.50, b=59.90, kind="reveal", trans="cut"),  # scroll: "الأمير الصغير"
    dict(id="s27", src="IMG_2871.MOV", a=59.90 + OFF, b=62.15 + OFF, kind="react", trans="cut"),
    dict(id="s28", src="IMG_7514.MOV", a=62.15, b=67.50, kind="react", trans="cut"),
    dict(id="s29", src="IMG_2871.MOV", a=67.50 + OFF, b=84.40, kind="react", trans="cut"),
    # ---- Hugs: light slow motion ----
    dict(id="s30", src="IMG_2871.MOV", a=95.40, b=98.60, kind="hug", speed=0.65),
    dict(id="s31", src="IMG_2871.MOV", a=98.60, b=101.60, kind="hug", speed=0.65),
    dict(id="s32", src="IMG_2871.MOV", a=102.00, b=105.20, kind="hug", speed=0.7),
    dict(id="s33", src="IMG_2871.MOV", a=108.00, b=111.20, kind="hug", speed=0.7),
    dict(id="s34", src="IMG_2871.MOV", a=112.80, b=115.40, kind="hug", speed=0.7),
    # ---- After ----
    dict(id="s35", src="IMG_2879.MOV", a=2.40, b=8.50, kind="after"),
    dict(id="s36", src="IMG_2874.MOV", a=0.00, b=2.00, kind="after"),
    dict(id="s37", src="IMG_2883.MOV", a=1.40, b=3.90, kind="after"),
    dict(id="s38", src="IMG_2884.MOV", a=0.50, b=3.30, kind="after"),
    dict(id="s39", src="IMG_2885.MOV", a=29.90, b=32.10, kind="after", speed=0.6),  # mother laughing with the onesies
]

FADE = 18  # frames for soft dissolves


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(" ".join(cmd) + "\n" + r.stderr[-3000:] + "\n")
        raise SystemExit(1)
    return r


def probe(path, entries):
    r = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", entries, "-of", "json", path])
    return json.loads(r.stdout)


def clean_audio(src):
    """Whole-source cleaned audio: high-pass, light FFT denoise, two-pass linear loudnorm to -20 LUFS."""
    out = os.path.join(CACHE, os.path.splitext(src)[0] + ".wav")
    if os.path.exists(out):
        return out
    path = os.path.join(RAW, src)
    pre = "highpass=f=90,lowpass=f=12000,afftdn=nf=-30:nr=10:tn=1"
    r = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", path, "-vn", "-af", pre + ",loudnorm=I=-20:TP=-2:LRA=11:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    js = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
    ln = (
        f"loudnorm=I=-20:TP=-2:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
        f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true"
    )
    run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vn", "-af", pre + "," + ln, "-ar", "48000", "-ac", "2", out])
    return out


def build(seg):
    src = os.path.join(RAW, seg["src"])
    out = os.path.join(OUT, seg["id"] + ".mp4")
    speed = seg.get("speed", 1.0)
    a, b = seg["a"], seg["b"]
    dur_out = (b - a) / speed
    info = probe(src, "stream=color_transfer,width,height")["streams"][0]
    hlg = info.get("color_transfer") == "arib-std-b67"
    portrait = seg.get("portrait", False)
    w, h = (506, 900) if portrait else (1600, 900)
    if hlg:
        vf = (
            f"zscale=w={w}:h={h}:t=linear:npl=140,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,"
            f"zscale=t=bt709:m=bt709:r=tv,format=yuv420p"
        )
    else:
        vf = f"scale={w}:{h}:flags=lanczos,format=yuv420p"
    vf += "," + GRADE.get(seg["src"], GRADE["default"])
    vf += f",setpts=(PTS-STARTPTS)/{speed},fps={FPS},trim=duration={dur_out:.4f},setsar=1"
    aud = clean_audio(seg["src"])
    af = f"atrim={a:.4f}:{b:.4f},asetpts=PTS-STARTPTS"
    if speed != 1.0:
        af += f",atempo={speed}"  # (muted in the mix; kept only for timing)
    af += f",apad,atrim=duration={dur_out:.4f}"
    if os.path.exists(out) and "--force" not in sys.argv:
        return seg["id"], dur_out
    run([
        "ffmpeg", "-v", "error", "-y", "-ss", f"{a:.4f}", "-t", f"{(b - a) + 0.5:.4f}", "-i", src, "-i", aud,
        "-filter_complex", f"[0:v]{vf}[v];[1:a]{af}[a]", "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", out,
    ])
    return seg["id"], dur_out


def music():
    out = os.path.join(OUT, "music.m4a")
    if os.path.exists(out):
        return out
    src = sys.argv[sys.argv.index("--music") + 1]
    # Even out the very quiet opening of the live recording; no hard limiting.
    af = "acompressor=threshold=-30dB:ratio=2.5:attack=200:release=1500:makeup=6,loudnorm=I=-18:TP=-2:LRA=8"
    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vn", "-t", "200", "-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "192k", out])
    return out


def main():
    only = None
    if "--only" in sys.argv:
        only = set(sys.argv[sys.argv.index("--only") + 1].split(","))
    segs = [s for s in EDL if only is None or s["id"] in only]
    srcs = sorted({s["src"] for s in segs})
    with ThreadPoolExecutor(4) as ex:
        list(ex.map(clean_audio, srcs))
    with ThreadPoolExecutor(3) as ex:
        durs = dict(ex.map(build, segs))
    if "--music" in sys.argv:
        music()
    # ---- Timeline for Remotion (cards + shots), cuts snapped to piano onsets in the music-led parts ----
    onsets = music_onsets()
    items = [dict(id="intro", type="card", frames=150, title="حكاية حب تكبر", music=0.6, trans="fade")]
    for s in EDL:
        if s["id"] == "s20":
            items.append(dict(id="mid", type="card", frames=105, title="لحظة ننتظرها بكل حب", music=0.25, trans="fade"))
        speed = s.get("speed", 1.0)
        d = (s["b"] - s["a"]) / speed
        mus, gain = LEVELS[s["kind"]]
        items.append(dict(
            id=s["id"], type="shot", file=f"gender-reveal/{s['id']}.mp4", frames=int(d * FPS) - 1, kind=s["kind"],
            trans=s.get("trans", "fade" if s["kind"] not in ("reveal", "react") else "cut"),
            music=mus, gain=gain, zoom=s.get("zoom"), portrait=s.get("portrait", False), speed=speed,
            src=s["src"], a=s["a"], b=s["b"],
        ))
    items.append(dict(id="end", type="card", frames=210, title="أهلًا بالأمير الصغير", subtitle="حكاية حب تكبر",
                      music=0.6, trans="fade"))
    t = 0
    for i, it in enumerate(items):
        ov = FADE if (i > 0 and it["trans"] == "fade") else 0
        it["start"] = t - ov if i > 0 else 0
        nxt = items[i + 1] if i + 1 < len(items) else None
        if nxt is not None and it.get("kind") in ("decor", "guest") and nxt["trans"] == "fade" and onsets:
            # cut point = middle of the dissolve into the next shot; may only shorten by up to 12 frames
            nominal = it["start"] + it["frames"] - FADE / 2
            cands = [o for o in onsets if nominal - 12 <= o <= nominal]
            if cands:
                best = max(cands)
                it["frames"] -= int(round(nominal - best))
        t = it["start"] + it["frames"]
    total = t
    json.dump(dict(fps=FPS, fade=FADE, total=total, items=items),
              open(os.path.join(ROOT, "src", "GenderReveal", "edl.json"), "w"), ensure_ascii=False, indent=1)
    print(f"{len(items)} items, total {total} frames = {total / FPS:.1f}s")


def music_onsets():
    """Strong piano onsets (in timeline frames) of music.m4a, which starts at frame 0."""
    import numpy as np
    m = os.path.join(OUT, "music.m4a")
    if not os.path.exists(m):
        return []
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", m, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                         capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    hop = 160
    n = len(x) // hop
    X = x[: n * hop].reshape(n, hop)
    F = np.abs(np.fft.rfft(X * np.hanning(hop), axis=1))
    fl = np.r_[0, np.maximum(0, np.diff(np.log(F + 1e-4), axis=0)).sum(1)]
    fl = np.convolve(fl, np.ones(3) / 3, "same")
    thr = np.percentile(fl, 85)
    peaks = [i for i in range(6, len(fl) - 7) if fl[i] > thr and fl[i] == fl[i - 6:i + 7].max()]
    return [p / 100 * FPS for p in peaks]


if __name__ == "__main__":
    main()

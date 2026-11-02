"""Bilingual voice-over builder for Lab 13.

A sentence is a list of parts: ("ar", text) is spoken by an Arabic voice,
("en", text) by an English voice, so English terms are never read by the Arabic engine.
Each part is synthesised separately, its silences are trimmed, its loudness is matched
to a common target, and the parts are joined with short pauses and soft fades.

Used by scripts/lab13-tts.py; can also be run directly to build a sample:
  python3 -I scripts/lab13_mix.py sample.json out.m4a
"""
import asyncio, json, os, ssl, subprocess, sys
import numpy as np

SR = 24000
AR_VOICE, AR_RATE = "ar-SA-HamedNeural", "-6%"
EN_VOICE, EN_RATE = "en-GB-RyanNeural", "-8%"
TARGET_DBFS = -20.0  # RMS of the voiced part of every piece
PAUSE = {("ar", "en"): 0.14, ("en", "ar"): 0.16, ("ar", "ar"): 0.12, ("en", "en"): 0.12}
FADE = 0.012


def _ssl():
    import edge_tts.communicate as c
    ca = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
    if os.path.exists(ca):  # cloud sandbox: trust the egress proxy CA
        c._SSL_CTX = ssl.create_default_context(cafile=ca)


async def _tts(text, voice, rate):
    import edge_tts
    _ssl()
    audio, words = b"", []
    async for ch in edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary").stream():
        if ch["type"] == "audio":
            audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            words.append([ch["offset"] / 1e7, ch["text"]])
    return audio, words


def _decode(mp3_bytes):
    out = subprocess.run(["ffmpeg", "-v", "error", "-i", "pipe:0", "-f", "f32le", "-ac", "1", "-ar", str(SR), "pipe:1"],
                         input=mp3_bytes, capture_output=True, check=True).stdout
    return np.frombuffer(out, np.float32).copy()


def _trim(x, thr_db=-42.0, win=0.01):
    """Cut leading/trailing silence; returns (audio, seconds cut at the start)."""
    n = int(SR * win)
    frames = len(x) // n
    if frames == 0:
        return x, 0.0
    rms = np.sqrt(np.mean(x[: frames * n].reshape(frames, n) ** 2, axis=1) + 1e-12)
    on = np.where(20 * np.log10(rms) > thr_db)[0]
    if len(on) == 0:
        return x, 0.0
    a = max(0, on[0] - 2) * n
    b = min(len(x), (on[-1] + 3) * n)
    return x[a:b], a / SR


def _level(x, thr_db=-42.0):
    n = int(SR * 0.02)
    frames = len(x) // n
    if frames == 0:
        return x
    blocks = x[: frames * n].reshape(frames, n)
    rms = np.sqrt(np.mean(blocks ** 2, axis=1) + 1e-12)
    voiced = rms[20 * np.log10(rms) > thr_db]
    if len(voiced) == 0:
        return x
    cur = 20 * np.log10(np.sqrt(np.mean(voiced ** 2)))
    return x * (10 ** ((TARGET_DBFS - cur) / 20))


def _fade(x):
    n = min(int(SR * FADE), len(x) // 2)
    if n > 0:
        r = np.linspace(0, 1, n, dtype=np.float32)
        x[:n] *= r
        x[-n:] *= r[::-1]
    return x


def build(parts):
    """parts: list of [lang, text]. Returns (audio float32, word timings [[sec, text, lang]])."""
    out, words, t, prev = [], [], 0.0, None
    for lang, text in parts:
        voice, rate = (EN_VOICE, EN_RATE) if lang == "en" else (AR_VOICE, AR_RATE)
        mp3, w = asyncio.run(_tts(text, voice, rate))
        x, cut = _trim(_decode(mp3))
        x = _fade(_level(x))
        if prev is not None:
            gap = np.zeros(int(SR * PAUSE[(prev, lang)]), np.float32)
            out.append(gap)
            t += len(gap) / SR
        for off, txt in w:
            words.append([round(t + max(0.0, off - cut), 3), txt, lang])
        out.append(x)
        t += len(x) / SR
        prev = lang
    y = np.concatenate(out) if out else np.zeros(1, np.float32)
    peak = float(np.max(np.abs(y)))
    if peak > 0.97:
        y *= 0.97 / peak
    return y, words


def save(y, path, tail=0.25):
    y = np.concatenate([y, np.zeros(int(SR * tail), np.float32)])
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "pipe:0",
                    "-c:a", "libmp3lame", "-b:a", "128k", path], input=y.tobytes(), check=True)


if __name__ == "__main__":
    sentences = json.load(open(sys.argv[1]))
    chunks = []
    for parts in sentences:
        y, _ = build(parts)
        chunks += [y, np.zeros(int(SR * 0.7), np.float32)]
    y = np.concatenate(chunks)
    tmp = sys.argv[2] + ".tmp.mp3"
    save(y, tmp)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-c:a", "aac", "-b:a", "160k", sys.argv[2]], check=True)
    os.remove(tmp)

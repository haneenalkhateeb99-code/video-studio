import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { MiniColumn, Mode } from "./MiniColumn";
import { C, FONT, Pt, appear, fadeUp, polyD, ramp } from "./theme";
import { cues, word } from "./timing";
import { Arrow, Card, Slide, T } from "./ui";

/* ───────────────────────── 7. Manometer ───────────────────────── */
const ZOOM_RINGS: Pt[] = [];
[200, 250, 300, 350, 400, 450, 500, 550].forEach((y, r) => {
  for (let c = 0; c < 4; c++) {
    const x = 160 + (r % 2 ? 22 : 0) + c * 44;
    if (x < 320) ZOOM_RINGS.push([x, y]);
  }
});

const ManometerDrawing: React.FC<{ dh: number; air: number }> = ({ dh, air }) => {
  const f = useCurrentFrame();
  const lL = 350 - dh / 2; // top-tap leg (lower pressure) → higher
  const lR = 350 + dh / 2; // bottom-tap leg (higher pressure) → lower
  const bubbles = [];
  for (let i = 0; i < 16; i++) {
    const y = 700 - ((f * (2 + air * 3) + i * 41) % 650);
    const x = 140 + ((i * 53) % 175) + Math.sin((f + i * 7) / 8) * 6;
    const edge = Math.min(1, (700 - y) / 20, (y - 50) / 20);
    bubbles.push(<circle key={i} cx={x} cy={y} r={7} fill={C.air} stroke={C.white} strokeWidth={1.5} opacity={air > 0 ? edge : 0} />);
  }
  const tag = (x: number, y: number, txt: string, sub: string) => (
    <g>
      <rect x={x - 6} y={y - 34} width={150} height={46} rx={10} fill={C.white} stroke={C.title} strokeWidth={2} />
      <text x={x + 8} y={y - 2} fontFamily={FONT} fontSize={28} fontWeight={800} fill={C.title}>
        {txt}
        <tspan fontSize={18} dy={6}>
          {sub}
        </tspan>
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 900 760" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <rect x={110} y={30} width={230} height={700} rx={20} fill={C.glass} stroke={C.title} strokeWidth={4} />
      <rect x={122} y={175} width={206} height={400} rx={4} fill={C.pack} stroke={C.sage} strokeWidth={2} />
      {ZOOM_RINGS.map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={16} ry={11} fill="none" stroke={C.sage} strokeWidth={3.4} />
      ))}
      <line x1={118} x2={332} y1={590} y2={590} stroke={C.title} strokeWidth={6} />
      {bubbles}
      <text x={225} y={20} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={700} fill={C.air}>
        Air ↑
      </text>
      {/* tap lines */}
      <path d="M340,130 H560 V200" stroke={C.title} strokeWidth={5} fill="none" />
      <path d="M340,640 H860 V160 H700 V200" stroke={C.title} strokeWidth={5} fill="none" />
      <circle cx={340} cy={130} r={9} fill={C.title} />
      <circle cx={340} cy={640} r={9} fill={C.title} />
      {tag(372, 112, "P", "top")}
      {tag(372, 696, "P", "bottom")}
      {/* U tube */}
      <path d="M560,200 V500 A70,70 0 0 0 700,500 V200" stroke={C.title} strokeWidth={34} fill="none" />
      <path d="M560,200 V500 A70,70 0 0 0 700,500 V200" stroke={C.white} strokeWidth={26} fill="none" />
      <path d={`M560,${lL} V500 A70,70 0 0 0 700,500 V${lR}`} stroke={C.water} strokeWidth={26} fill="none" />
      {[230, 260, 290, 320, 350, 380, 410, 440, 470].map((y) => (
        <line key={y} x1={612} x2={648} y1={y} y2={y} stroke={C.muted} strokeWidth={y === 350 ? 3 : 1.5} />
      ))}
      {dh > 4 ? (
        <g>
          <line x1={480} x2={770} y1={lL} y2={lL} stroke={C.note} strokeWidth={2.5} strokeDasharray="8 6" />
          <line x1={480} x2={770} y1={lR} y2={lR} stroke={C.note} strokeWidth={2.5} strokeDasharray="8 6" />
          <text x={782} y={lL + 9} fontFamily={FONT} fontSize={28} fontWeight={800} fill={C.note}>
            H1
          </text>
          <text x={782} y={lR + 9} fontFamily={FONT} fontSize={28} fontWeight={800} fill={C.note}>
            H2
          </text>
          <line x1={500} x2={500} y1={lL} y2={lR} stroke={C.title} strokeWidth={3} />
          <line x1={488} x2={512} y1={lL} y2={lL} stroke={C.title} strokeWidth={3} />
          <line x1={488} x2={512} y1={lR} y2={lR} stroke={C.title} strokeWidth={3} />
          <text x={480} y={(lL + lR) / 2 + 10} textAnchor="end" fontFamily={FONT} fontSize={32} fontWeight={800} fill={C.title}>
            Δh
          </text>
          <Arrow from={[700, lR - 70]} to={[700, lR - 18]} color={C.air} width={8} head={18} opacity={Math.min(1, dh / 60)} />
        </g>
      ) : null}
      <text x={630} y={612} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800} fill={C.title}>
        U-tube manometer
      </text>
    </svg>
  );
};

export const ManometerScene: React.FC = () => {
  const f = useCurrentFrame();
  const q = cues("manometer");
  const M = {
    p: q.s.m2,
    big: word(q, "m2", "أكبر", 1, 0.35),
    dh: word(q, "m2", "المنسوب", 1, 0.8),
    dp: q.s.m3,
    unit: word(q, "m3", "بالمتر", 1, 0.9),
  };
  const air = ramp(f, M.p - 30, M.p + 10, 0, 0.7);
  const dh = 170 * appear(f, M.p, 80);
  const formula = (start: number, children: React.ReactNode, color: string = C.title, size = 44) => (
    <div dir="ltr" style={{ fontSize: size, fontWeight: 800, color, textAlign: "center", ...fadeUp(f, start) }}>
      {children}
    </div>
  );
  return (
    <Slide title="Reading the Manometer" subtitle="المانومتر وحساب هبوط الضغط" page="07">
      <div style={{ position: "absolute", left: 60, top: 268, width: 860, height: 726 }}>
        <ManometerDrawing dh={dh} air={air} />
      </div>
      <div style={{ position: "absolute", right: 80, top: 280, width: 840, display: "flex", flexDirection: "column", gap: 18 }}>
        <Card start={q.s.m1} color={C.title} title={<>طرفا المانومتر (<T>Pressure taps</T>)</>}>
          أسفل الحشوة وأعلاها
        </Card>
        <Card start={M.p - 6} color={C.air} title="فرق المنسوب = هبوط الضغط">
          <T>
            P<sub>bottom</sub> &gt; P<sub>top</sub>
          </T>
        </Card>
        <div
          style={{
            padding: "22px 26px",
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.85)",
            border: `2px solid ${C.note}`,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            opacity: appear(f, M.big - 10),
          }}
        >
          {formula(M.big, <>ΔP = P<sub style={{ fontSize: 26 }}>bottom</sub> − P<sub style={{ fontSize: 26 }}>top</sub></>)}
          {formula(M.dh, <>Δh = |H<sub style={{ fontSize: 26 }}>1</sub> − H<sub style={{ fontSize: 26 }}>2</sub>|</>, C.note)}
          {formula(M.dp, <>ΔP ≈ ρ<sub style={{ fontSize: 26 }}>water</sub> × g × Δh</>)}
          <div dir="rtl" lang="ar" style={{ fontSize: 28, color: C.body, textAlign: "center", lineHeight: 1.5, ...fadeUp(f, M.unit) }}>
            استخدم <T>Δh</T> بالمتر للحصول على <T>ΔP</T> بوحدة <T>Pa</T>
          </div>
          {formula(M.unit + 18, <>1 cm H₂O ≈ 98.1 Pa</>, C.sage, 38)}
        </div>
      </div>
    </Slide>
  );
};

/* ───────────────────────── 8. Dry / Wet / Loading / Flooding ───────────────────────── */
const REGIMES: { mode: Mode; en: string; ar: React.ReactNode; dp: number }[] = [
  { mode: "dry", en: "Dry packing", ar: <>الهواء وحده بين الحلقات</>, dp: 0.18 },
  { mode: "wet", en: "Wet packing", ar: <>طبقة ماء على الحلقات ← ΔP أكبر</>, dp: 0.34 },
  {
    mode: "loading",
    en: "Loading",
    ar: (
      <>
        يزداد <T>Liquid holdup</T> ويرتفع ΔP أسرع
      </>
    ),
    dp: 0.62,
  },
  { mode: "flooding", en: "Flooding", ar: <>تراكم الماء ← ارتفاع حاد في ΔP</>, dp: 0.95 },
];

export const RegimesScene: React.FC = () => {
  const f = useCurrentFrame();
  const q = cues("regimes");
  const starts = [q.s.r1, q.s.r2, q.s.r3, q.s.r4].map((x) => x - 6);
  const cur = starts.filter((x) => f >= x).length - 1;
  return (
    <Slide title="Dry, Wet, Loading & Flooding" subtitle="من الحشوة الجافة إلى الفيضان" page="08">
      <div dir="rtl" style={{ position: "absolute", left: 70, right: 70, top: 272, display: "flex", gap: 28 }}>
        {REGIMES.map((r, i) => {
          const start = starts[i];
          const lvl = appear(f, start, 90);
          const active = f >= start;
          const isCur = i === cur;
          return (
            <div
              key={r.mode}
              style={{
                flex: 1,
                padding: "16px 14px 14px",
                borderRadius: 18,
                backgroundColor: isCur ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                border: r.mode === "flooding" ? `3px dashed ${isCur ? C.off : C.muted}` : `3px solid ${isCur ? C.note : "transparent"}`,
                opacity: active ? 1 : 0.35,
                position: "relative",
              }}
            >
              <div dir="ltr" style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 18, height: 440 }}>
                <MiniColumn mode={r.mode} level={lvl} style={{ width: 206, height: 440 }} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.title }}>ΔP</div>
                  <div style={{ width: 30, height: 340, borderRadius: 15, backgroundColor: "#E4E8E5", position: "relative", overflow: "hidden" }}>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${r.dp * 100 * lvl}%`,
                        backgroundColor: r.mode === "flooding" ? C.off : C.note,
                        borderRadius: 15,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div dir="ltr" style={{ fontSize: 36, fontWeight: 800, color: C.title, textAlign: "center", marginTop: 10 }}>
                {r.en}
              </div>
              <div lang="ar" style={{ fontSize: 26, color: C.body, textAlign: "center", lineHeight: 1.45, marginTop: 4 }}>
                {r.ar}
              </div>
              {r.mode === "flooding" ? (
                <div
                  style={{
                    position: "absolute",
                    top: -18,
                    left: "50%",
                    translate: "-50% 0",
                    whiteSpace: "nowrap",
                    backgroundColor: C.off,
                    color: C.white,
                    fontSize: 22,
                    fontWeight: 800,
                    padding: "4px 16px",
                    borderRadius: 14,
                    opacity: active ? 1 : 0,
                  }}
                >
                  محاكاة تفسيرية فقط
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        dir="rtl"
        lang="ar"
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 72,
          textAlign: "center",
          fontSize: 28,
          fontWeight: 800,
          color: C.off,
          ...fadeUp(f, word(q, "r4", "محاكاة", 1, 0.5)),
        }}
      >
        مشهد <T color={C.off}>Flooding</T> محاكاة تفسيرية فقط، وليس توجيهًا لتشغيل الجهاز حتى الفيضان.
      </div>
    </Slide>
  );
};

/* ───────────────────────── 9. Illustrative curves ───────────────────────── */
const dryY = (x: number) => 0.3 * Math.pow(x, 1.9);
const wetY = (x: number) =>
  0.4 * Math.pow(x, 1.9) + (x > 0.55 ? 3 * Math.pow(x - 0.55, 2.4) : 0) + (x > 0.8 ? 8 * Math.pow(x - 0.8, 2.5) : 0);
const PX = (x: number) => 120 + x * 820;
const PY = (y: number) => 560 - y * 500;
const curvePts = (fn: (x: number) => number, p: number): Pt[] => {
  const pts: Pt[] = [];
  const n = Math.max(2, Math.round(120 * p));
  for (let i = 0; i <= n; i++) {
    const x = (i / 120) * 1;
    if (x > p) break;
    pts.push([PX(x), PY(fn(x))]);
  }
  return pts;
};

export const CurvesScene: React.FC = () => {
  const f = useCurrentFrame();
  const q = cues("curves");
  const K = {
    wet: q.s.c2,
    rise: word(q, "c2", "ويرتفع", 1, 0.6),
    load: word(q, "c2", "Loading", 1, 0.9),
  };
  const pDry = ramp(f, q.s.c1, q.s.c1 + 90, 0.001, 1);
  const pWet = ramp(f, K.wet - 10, K.wet + 80, 0.001, 1);
  const a1 = appear(f, K.load - 6);
  const a2 = appear(f, K.load + 18);
  const txt = (x: number, y: number, s: string, size = 24, color: string = C.title, anchor: "start" | "middle" | "end" = "start", weight = 700) => (
    <text x={x} y={y} fontFamily={FONT} fontSize={size} fontWeight={weight} fill={color} textAnchor={anchor}>
      {s}
    </text>
  );
  return (
    <Slide title="Pressure Drop vs Air Flow Rate" subtitle="منحنيات توضيحية للحشوة الجافة والمبللة" page="09">
      <div style={{ position: "absolute", left: 50, top: 300, width: 1000, height: 680, opacity: appear(f, 10) }}>
        <svg viewBox="0 0 1000 680" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <line x1={120} y1={30} x2={120} y2={560} stroke={C.title} strokeWidth={3} />
          <line x1={120} y1={560} x2={960} y2={560} stroke={C.title} strokeWidth={3} />
          <polygon points="120,18 112,34 128,34" fill={C.title} />
          <polygon points="972,560 956,552 956,568" fill={C.title} />
          {txt(540, 612, "Air Flow Rate", 28, C.title, "middle", 800)}
          <text x={540} y={654} fontFamily={FONT} fontSize={26} fill={C.body} textAnchor="middle" direction="rtl">
            معدل تدفق الهواء
          </text>
          <g transform="rotate(-90 60 300)">
            {txt(60, 290, "Pressure Drop (ΔP)", 28, C.title, "middle", 800)}
            <text x={60} y={326} fontFamily={FONT} fontSize={26} fill={C.body} textAnchor="middle" direction="rtl">
              هبوط الضغط
            </text>
          </g>
          {/* legend */}
          <line x1={160} x2={210} y1={60} y2={60} stroke={C.sage} strokeWidth={7} strokeLinecap="round" />
          {txt(224, 68, "Dry packing")}
          <line x1={160} x2={210} y1={102} y2={102} stroke={C.note} strokeWidth={7} strokeLinecap="round" />
          {txt(224, 110, "Wet packing (fixed water flow)")}
          <path d={polyD(curvePts(dryY, pDry))} stroke={C.sage} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={polyD(curvePts(wetY, pWet))} stroke={C.note} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <g opacity={a1}>
            <circle cx={PX(0.55)} cy={PY(wetY(0.55))} r={10} fill={C.white} stroke={C.title} strokeWidth={3} />
            <line x1={PX(0.55) - 14} y1={PY(wetY(0.55)) - 14} x2={PX(0.4)} y2={PY(0.5)} stroke={C.title} strokeWidth={2} />
            {txt(PX(0.4), PY(0.5) - 12, "Loading begins", 26, C.title, "middle")}
          </g>
          <g opacity={a2}>
            <circle cx={PX(0.93)} cy={PY(wetY(0.93))} r={10} fill={C.white} stroke={C.off} strokeWidth={3} />
            <line x1={PX(0.93) - 14} y1={PY(wetY(0.93)) - 6} x2={PX(0.72)} y2={PY(0.92)} stroke={C.off} strokeWidth={2} />
            {txt(PX(0.72), PY(0.92) - 12, "Approach to flooding", 26, C.off, "middle")}
          </g>
        </svg>
      </div>
      <div style={{ position: "absolute", right: 80, top: 276, width: 760, display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          dir="rtl"
          lang="ar"
          style={{
            padding: "16px 22px",
            borderRadius: 14,
            border: `3px dashed ${C.off}`,
            backgroundColor: "rgba(255,255,255,0.85)",
            fontSize: 34,
            fontWeight: 800,
            color: C.off,
            textAlign: "center",
            ...fadeUp(f, q.s.c1),
          }}
        >
          «منحنيات توضيحية وليست نتائج مقاسة»
        </div>
        <Card start={q.s.c1 + 20} color={C.sage} title="يزداد ΔP بزيادة تدفق الهواء" />
        <Card start={q.s.c1 + 50} color={C.title} title="للعمود الجاف حسب الدليل">
          <bdi dir="ltr">
            ΔP ∝ (air flow)<sup>n</sup> , n ≈ 1.8–2.0
          </bdi>
        </Card>
        <Card start={K.wet} color={C.note} title={<><T>Wet packing</T> أعلى عادةً</>} />
        <Card start={K.rise} color={C.off} title={<><T>Loading</T> ← <T>Flooding</T></>}>
          ارتفاع حاد في ΔP
        </Card>
      </div>
    </Slide>
  );
};

/* ───────────────────────── 10. Reliable readings ───────────────────────── */
const IconSteady: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame() - start;
  const amp = 40 * Math.exp(-f / 60);
  const pts: Pt[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = f - (60 - i) * 2;
    const a = 40 * Math.exp(-Math.max(0, t) / 60);
    pts.push([20 + i * 6, 120 + a * Math.sin(t / 4)]);
  }
  return (
    <svg viewBox="0 0 400 240" style={{ width: "100%", height: "100%" }}>
      <polygon points="38,220 58,220 68,30 28,30" fill="#FBFCFC" stroke={C.title} strokeWidth={3} />
      <rect x={34} y={124 + amp * Math.sin(f / 4) - 8} width={28} height={16} rx={4} fill={C.air} />
      <path d={polyD(pts.map(([x, y]) => [x + 80, y] as Pt))} stroke={C.note} strokeWidth={5} fill="none" />
      <line x1={100} x2={400} y1={120} y2={120} stroke={C.sage} strokeWidth={2} strokeDasharray="6 6" />
    </svg>
  );
};
const IconEye: React.FC = () => {
  const f = useCurrentFrame();
  const y = 120 + 3 * Math.sin(f / 10);
  return (
    <svg viewBox="0 0 400 240" style={{ width: "100%", height: "100%" }}>
      <rect x={250} y={20} width={44} height={210} rx={22} fill={C.white} stroke={C.title} strokeWidth={4} />
      <rect x={256} y={y} width={32} height={224 - y} rx={10} fill={C.water} />
      <path d={`M256,${y} Q272,${y + 10} 288,${y}`} stroke={C.title} strokeWidth={2} fill="none" />
      <path d={`M40,${y} Q80,${y - 38} 120,${y} Q80,${y + 38} 40,${y} Z`} fill={C.white} stroke={C.title} strokeWidth={4} />
      <circle cx={80} cy={y} r={14} fill={C.title} />
      <line x1={126} x2={246} y1={y} y2={y} stroke={C.note} strokeWidth={3} strokeDasharray="10 7" />
    </svg>
  );
};
const IconLeak: React.FC = () => {
  const f = useCurrentFrame();
  const mx = 90 + ((f * 2.4) % 240);
  return (
    <svg viewBox="0 0 400 240" style={{ width: "100%", height: "100%" }}>
      <rect x={30} y={100} width={340} height={36} rx={10} fill={C.waterPipe} />
      <rect x={180} y={86} width={40} height={64} rx={6} fill={C.title} />
      <rect x={60} y={86} width={30} height={64} rx={6} fill={C.title} />
      <rect x={310} y={86} width={30} height={64} rx={6} fill={C.title} />
      <circle cx={mx} cy={118} r={46} fill="rgba(255,255,255,0.35)" stroke={C.note} strokeWidth={6} />
      <line x1={mx + 32} y1={152} x2={mx + 62} y2={196} stroke={C.note} strokeWidth={10} strokeLinecap="round" />
    </svg>
  );
};

export const ReadingsScene: React.FC = () => {
  const f = useCurrentFrame();
  const q = cues("readings");
  const items = [
    { icon: <IconSteady start={q.s.g1} />, ar: "انتظر استقرار التدفق", en: "Wait for steady flow" },
    { icon: <IconEye />, ar: "اقرأ المانومتر بمستوى العين", en: "Read at eye height" },
    { icon: <IconLeak />, ar: "تحقّق من عدم وجود تسرب", en: "Check for leaks" },
  ];
  return (
    <Slide title="Reliable Readings" subtitle="إرشادات القراءة" page="10">
      <div dir="rtl" style={{ position: "absolute", left: 90, right: 90, top: 310, display: "flex", gap: 40 }}>
        {items.map((it, i) => (
          <div
            key={it.en}
            style={{
              flex: 1,
              padding: "26px 26px 30px",
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.85)",
              border: `2px solid ${C.pack}`,
              textAlign: "center",
              ...fadeUp(f, [q.s.g1, q.s.g2, q.s.g3][i] - 6),
            }}
          >
            <div style={{ height: 270 }}>{it.icon}</div>
            <div lang="ar" style={{ fontSize: 36, fontWeight: 800, color: C.title, marginTop: 16, whiteSpace: "nowrap" }}>
              {it.ar}
            </div>
            <div dir="ltr" style={{ fontSize: 30, fontWeight: 700, color: C.note, marginTop: 4 }}>
              {it.en}
            </div>
          </div>
        ))}
      </div>
    </Slide>
  );
};

/* ───────────────────────── 11. Shutdown ───────────────────────── */

const PumpStop: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  // impeller angle: runs until `start`, then decelerates to a stop over 40 frames
  const t = Math.max(0, f - start);
  const ang = f < start ? f * 14 : start * 14 + 14 * (t - (t * t) / 80) * (t < 40 ? 1 : 0) + (t >= 40 ? 14 * 20 : 0);
  const off = f >= start + 30;
  return (
    <svg viewBox="0 0 300 260" style={{ width: "100%", height: "100%" }}>
      <circle cx={150} cy={130} r={90} fill="#E3EBE6" stroke={C.title} strokeWidth={6} />
      <g transform={`rotate(${ang} 150 130)`}>
        {[0, 120, 240].map((a) => (
          <path key={a} d="M150,130 Q186,90 150,58" stroke={C.title} strokeWidth={9} fill="none" transform={`rotate(${a} 150 130)`} />
        ))}
        <circle cx={150} cy={130} r={12} fill={C.title} />
      </g>
      <rect x={200} y={20} width={90} height={44} rx={22} fill={off ? C.off : C.sage} />
      <text x={245} y={51} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800} fill={C.white}>
        {off ? "OFF" : "ON"}
      </text>
    </svg>
  );
};

const Drain: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  const lvl = ramp(f, start, start + 70, 1, 0.05);
  const top = 30 + (1 - lvl) * 200;
  return (
    <svg viewBox="0 0 300 260" style={{ width: "100%", height: "100%" }}>
      <rect x={100} y={20} width={100} height={220} rx={14} fill={C.glass} stroke={C.title} strokeWidth={5} />
      <rect x={106} y={top} width={88} height={234 - top} rx={8} fill={C.water} opacity={0.5} />
      {[60, 100, 140, 180].map((y) => (
        <ellipse key={y} cx={150} cy={y} rx={16} ry={10} fill="none" stroke={C.sage} strokeWidth={3} />
      ))}
      <Arrow from={[150, 244]} to={[150, 262]} color={C.water} width={8} head={14} opacity={f > start && lvl > 0.06 ? 1 : 0} />
    </svg>
  );
};

const Toggle: React.FC<{ x: number; y: number; on: boolean; label: string }> = ({ x, y, on, label }) => (
  <g>
    <rect x={x} y={y} width={110} height={54} rx={27} fill={on ? C.sage : C.off} />
    <circle cx={on ? x + 83 : x + 27} cy={y + 27} r={21} fill={C.white} />
    <text x={x + 130} y={y + 36} fontFamily={FONT} fontSize={26} fontWeight={800} fill={C.title}>
      {label}
    </text>
  </g>
);
const Switches: React.FC<{ airOff: number; masterOff: number }> = ({ airOff, masterOff }) => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="0 0 300 260" direction="ltr" style={{ width: "100%", height: "100%", direction: "ltr" }}>
      <Toggle x={10} y={60} on={f < airOff + 6} label="Air" />
      <Toggle x={10} y={150} on={f < masterOff + 10} label="Master switch" />
    </svg>
  );
};

export const ShutdownScene: React.FC = () => {
  const f = useCurrentFrame();
  const q = cues("shutdown");
  const SD = [word(q, "s1", "أوقف", 1, 0.3), word(q, "s1", "واسمح", 1, 0.65), q.s.s2];
  const airOff = word(q, "s2", "الهواء", 1, 0.35);
  const masterOff = word(q, "s2", "والمفتاح", 1, 0.6);
  const steps = [
    { icon: <PumpStop start={SD[0] + 10} />, ar: "أوقف مضخة الماء", en: "Stop the water pump" },
    { icon: <Drain start={SD[1] + 6} />, ar: "اسمح بتصريف الماء", en: "Allow drainage" },
    { icon: <Switches airOff={airOff} masterOff={masterOff} />, ar: "أوقف الهواء ثم المفتاح الرئيسي", en: "Stop air, then the master switch" },
  ];
  return (
    <Slide title="Shutdown" subtitle="إيقاف الجهاز حسب العرض" page="11">
      <div dir="rtl" style={{ position: "absolute", left: 90, right: 90, top: 300, display: "flex", alignItems: "stretch", gap: 20 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.en}>
            <div
              style={{
                flex: 1,
                padding: "24px 20px",
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.85)",
                border: `3px solid ${f >= SD[i] && f < (SD[i + 1] ?? 9999) ? C.note : C.pack}`,
                textAlign: "center",
                ...fadeUp(f, SD[i]),
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  margin: "0 auto",
                  backgroundColor: C.title,
                  color: C.white,
                  fontSize: 30,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <div style={{ height: 250, marginTop: 10 }}>{s.icon}</div>
              <div lang="ar" style={{ fontSize: 38, fontWeight: 800, color: C.title, marginTop: 10 }}>
                {s.ar}
              </div>
              <div dir="ltr" style={{ fontSize: 28, fontWeight: 700, color: C.note, marginTop: 4 }}>
                {s.en}
              </div>
            </div>
            {i < 2 ? (
              <div style={{ alignSelf: "center", fontSize: 64, color: C.sage, opacity: appear(f, SD[i + 1] - 10) }}>←</div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
      <div
        dir="rtl"
        lang="ar"
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          bottom: 92,
          padding: "18px 28px",
          borderRadius: 16,
          backgroundColor: "rgba(102,147,172,0.14)",
          textAlign: "center",
          fontSize: 38,
          fontWeight: 800,
          color: C.note,
          ...fadeUp(f, q.s.s3),
        }}
      >
        اتبع دائمًا تعليمات المدرس وإجراءات المختبر.
      </div>
    </Slide>
  );
};

/* ───────────────────────── 12. Closing ───────────────────────── */
export const EndScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Img src={staticFile("lab13/plant-bg.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", left: 60, width: 1120, top: 300, textAlign: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: C.title, lineHeight: 1.2, whiteSpace: "nowrap", ...fadeUp(f, 5) }}>
          Small experiments, big dreams
        </div>
        <div dir="rtl" lang="ar" style={{ fontSize: 56, fontWeight: 800, color: C.sage, marginTop: 24, ...fadeUp(f, 20) }}>
          تجارب صغيرة… وأحلام كبيرة
        </div>
        <div style={{ fontSize: 40, color: C.body, marginTop: 40, ...fadeUp(f, 35) }}>CMET 205 · Lab 13</div>
      </div>
    </AbsoluteFill>
  );
};

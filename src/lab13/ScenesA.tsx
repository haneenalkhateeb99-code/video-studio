import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { MiniColumn } from "./MiniColumn";
import { Part, Schematic } from "./Schematic";
import { C, FONT, appear, fadeUp, ramp } from "./theme";
import { at, cues } from "./timing";
import { Card, Slide, T } from "./ui";

// Every animation event is tied to the voice-over cue that explains it (q.s[id] = start frame).

const SCHEMATIC_BOX: React.CSSProperties = { position: "absolute", left: 40, top: 268, width: 1000, height: 727 };
const PANEL: React.CSSProperties = {
  position: "absolute",
  right: 80,
  top: 276,
  width: 780,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};
const SIMPLIFIED = "مخطط مبسّط للتوضيح، وليس نسخة دقيقة من توصيلات الجهاز (Simplified schematic)";

/* ───────────────────────── 1. Title ───────────────────────── */
export const TitleScene: React.FC = () => {
  const f = useCurrentFrame();
  const q = cues("title");
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Img
        src={staticFile("lab13/plant-bg.jpg")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          scale: String(1.06 - 0.06 * ramp(f, 0, q.dur, 0, 1)),
        }}
      />
      <div style={{ position: "absolute", left: 120, width: 1060, top: 230, textAlign: "center" }}>
        <div style={{ fontSize: 86, fontWeight: 800, color: C.title, lineHeight: 1.12, ...fadeUp(f, 6) }}>
          MEASUREMENT OF
          <br />
          PRESSURE DROP IN
          <br />A PACKED COLUMN
        </div>
        <div dir="rtl" lang="ar" style={{ fontSize: 52, fontWeight: 800, color: C.sage, marginTop: 22, ...fadeUp(f, 26) }}>
          قياس هبوط الضغط في عمود محشو
        </div>
        <div style={{ fontSize: 46, fontWeight: 800, color: C.title, marginTop: 40, ...fadeUp(f, at(q, "t1", 0.45)) }}>LAB 13</div>
        <div style={{ fontSize: 40, color: C.body, marginTop: 20, lineHeight: 1.3, ...fadeUp(f, at(q, "t1", 0.6)) }}>
          CMET 205
          <br />
          Mass Transfer Operations
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────────────────── 2. Objectives ───────────────────────── */
const OBJECTIVES: { en: string; ar: React.ReactNode }[] = [
  { en: "1. Pressure drop", ar: <>قياس هبوط الضغط عبر عمود محشو</> },
  { en: "2. Flow conditions", ar: <>تأثير تدفق الهواء والماء على هبوط الضغط</> },
  {
    en: "3. Loading & Flooding",
    ar: (
      <>
        فهم <T>Loading</T> و <T>Flooding</T>
      </>
    ),
  },
];

export const ObjectivesScene: React.FC = () => {
  const f = useCurrentFrame();
  const q = cues("objectives");
  return (
    <Slide title="Objectives" subtitle="أهداف التجربة" page="02">
      <div style={{ position: "absolute", left: 170, top: 300, width: 360, height: 680, opacity: appear(f, 10, 30) }}>
        <MiniColumn mode="wet" style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", right: 110, top: 330, width: 1080, display: "flex", flexDirection: "column", gap: 44 }}>
        {OBJECTIVES.map((o, i) => (
          <div key={o.en} style={{ ...fadeUp(f, q.s[`o${i + 1}`] - 4) }}>
            <div dir="ltr" style={{ fontSize: 48, fontWeight: 800, color: C.title, textAlign: "right" }}>
              {o.en}
            </div>
            <div dir="rtl" lang="ar" style={{ fontSize: 40, color: C.body, marginTop: 6, lineHeight: 1.45 }}>
              {o.ar}
            </div>
          </div>
        ))}
      </div>
    </Slide>
  );
};

/* ───────────────────────── 3. Equipment diagram ───────────────────────── */
const PARTS: { key: Part; en: string; ar: string }[] = [
  { key: "column", en: "Packed glass column", ar: "عمود زجاجي (CE 400 gas absorption unit)" },
  { key: "rings", en: "Raschig rings", ar: "حشوات تزيد مساحة التلامس" },
  { key: "tank", en: "Water tank", ar: "خزان الماء" },
  { key: "pump", en: "Pump", ar: "مضخة طاردة مركزية (Centrifugal pump)" },
  { key: "wmeter", en: "Water flow meter", ar: "عدّاد تدفق الماء" },
  { key: "dist", en: "Distributor", ar: "يوزّع الماء فوق الحشوة" },
  { key: "air", en: "Air control valve + Air flow meter", ar: "التحكم في الهواء وقياس تدفقه" },
  { key: "mano", en: "U-tube manometer", ar: "يقيس فرق الضغط عبر الحشوة" },
];

export const DiagramScene: React.FC = () => {
  const f = useCurrentFrame();
  const q = cues("diagram");
  const starts = PARTS.map((_, i) => q.s[`d${i + 1}`] - 6);
  const vis: Partial<Record<Part, number>> = {};
  PARTS.forEach((p, i) => (vis[p.key] = appear(f, starts[i], 22)));
  const cur = starts.filter((s) => f >= s).length - 1;
  const glow = cur >= 0 && f < q.e.d8 + 15 ? PARTS[cur].key : null;
  return (
    <Slide title="Process Diagram" subtitle="مخطط الجهاز" page="03" footnote={SIMPLIFIED}>
      <div style={SCHEMATIC_BOX}>
        <Schematic vis={vis} glow={glow} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ ...PANEL, gap: 10, top: 272 }}>
        {PARTS.map((p, i) => {
          const on = i === cur && glow !== null;
          return (
            <div
              key={p.key}
              dir="rtl"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "8px 18px",
                borderRadius: 12,
                backgroundColor: on ? "rgba(102,147,172,0.14)" : "transparent",
                ...fadeUp(f, starts[i], 16),
              }}
            >
              <div
                style={{
                  width: 44,
                  minWidth: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: on ? C.note : C.sage,
                  color: C.white,
                  fontSize: 24,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <div>
                <div dir="ltr" style={{ fontSize: 31, fontWeight: 800, color: C.title, textAlign: "right" }}>
                  {p.en}
                </div>
                <div lang="ar" style={{ fontSize: 25, color: C.body, lineHeight: 1.3 }}>
                  {p.ar}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Slide>
  );
};

/* ───────────────────────── 4. Flow paths ───────────────────────── */
export const FlowScene: React.FC = () => {
  const f = useCurrentFrame();
  const q = cues("flow");
  const water = ramp(f, q.s.w0, q.s.w0 + 40, 0, 1);
  const air = ramp(f, q.s.w2, q.s.w2 + 40, 0, 0.55);
  const arrows = appear(f, q.s.w3, 25);
  let glow: Part | null = null;
  if (f >= q.s.w0 && f < at(q, "w0", 0.45)) glow = "pump";
  else if (f >= at(q, "w0", 0.45) && f < at(q, "w0", 0.7)) glow = "wmeter";
  else if (f >= at(q, "w0", 0.7) && f < q.e.w0) glow = "dist";
  else if (f >= q.s.w1 && f < q.e.w1) glow = "rings";
  else if (f >= q.s.w2 && f < q.e.w2) glow = "air";
  else if (f >= q.s.w4) glow = "rings";
  return (
    <Slide title="Water & Air Flow" subtitle="مسار الماء والهواء داخل الجهاز" page="04" footnote={SIMPLIFIED}>
      <div style={SCHEMATIC_BOX}>
        <Schematic water={water} air={air} pumpOn={f > q.s.w0} arrows={arrows} holdup={0.15} glow={glow} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={PANEL}>
        <Card start={q.s.w0} color={C.water} title="مسار الماء ↓">
          <T>Pump</T> ← <T>Water flow meter</T> ← <T>Distributor</T>
          <br />← الحشوات ← الخزان
        </Card>
        <Card start={q.s.w2} color={C.air} title="مسار الهواء ↑">
          <T>Air control valve</T> ← <T>Air flow meter</T>
          <br />← أسفل العمود ← أعلى العمود
        </Card>
        <Card start={q.s.w3} color={C.title} title={<T>Countercurrent flow</T>}>
          الماء ينزل ↓ والهواء يصعد ↑
        </Card>
        <Card start={q.s.w4} color={C.sage} title={<T>Raschig rings</T>}>
          مساحة تلامس أكبر بين الغاز والسائل
        </Card>
      </div>
    </Slide>
  );
};

/* ───────────────────────── readings tracker (dry + wet) ───────────────────────── */
const levelFor = (k: number) => 0.22 + k * 0.15;

export const readingState = (f: number, start: number, each: number) => {
  const t = f - start;
  if (t < 0) return { k: -1, ph: 0, air: levelFor(0) };
  const k = Math.min(5, Math.floor(t / each));
  const ph = Math.min(1, (t - k * each) / each);
  const prev = levelFor(Math.max(0, k - 1));
  const air = k === 0 ? levelFor(0) : prev + (levelFor(k) - prev) * Math.min(1, ph / 0.3);
  return { k, ph: k === 5 && t >= 6 * each ? 1 : ph, air };
};

const PHASES = ["ضبط تدفق الهواء", "انتظار الاستقرار", "تسجيل H1 و H2"];

const Tracker: React.FC<{ start: number; each: number }> = ({ start, each }) => {
  const f = useCurrentFrame();
  const { k, ph } = readingState(f, start, each);
  const phase = ph < 0.3 ? 0 : ph < 0.75 ? 1 : 2;
  return (
    <div style={{ marginTop: 12 }}>
      <div dir="rtl" style={{ display: "flex", gap: 18 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const done = i < k || (i === k && phase === 2);
          const curr = i === k && !done;
          return (
            <div
              key={i}
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                border: `4px solid ${done ? C.sage : curr ? C.note : "#C9D2D0"}`,
                backgroundColor: done ? C.sage : "transparent",
                color: done ? C.white : curr ? C.note : C.muted,
                fontSize: 30,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                scale: curr ? String(1 + 0.05 * Math.sin(f / 5)) : "1",
              }}
            >
              {done ? "✓" : i + 1}
            </div>
          );
        })}
      </div>
      <div dir="rtl" style={{ display: "flex", gap: 12, marginTop: 18 }}>
        {PHASES.map((p, i) => (
          <div
            key={p}
            style={{
              fontSize: 25,
              padding: "6px 16px",
              borderRadius: 20,
              backgroundColor: k >= 0 && i === phase ? C.note : "rgba(120,150,138,0.15)",
              color: k >= 0 && i === phase ? C.white : C.body,
            }}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ───────────────────────── 5. Dry column test ───────────────────────── */
export const DryScene: React.FC = () => {
  const f = useCurrentFrame();
  const q = cues("dry");
  const rStart = at(q, "y2", 0.35); // readings begin while "adjust → wait → record" is explained
  const each = (q.e.y3 + 20 - rStart) / 6;
  const rs = readingState(f, rStart, each);
  const air = f < rStart ? ramp(f, q.s.y1 + 15, q.s.y1 + 55, 0, levelFor(0)) : rs.air;
  const dh = air > 0.01 ? 20 + 130 * Math.pow(air, 1.9) : 0;
  const glow: Part | null = f < q.s.y1 ? "pump" : f < q.s.y2 ? "air" : "mano";
  return (
    <Slide title="Dry Column Test" subtitle="اختبار العمود الجاف" page="05" footnote={SIMPLIFIED}>
      <div style={SCHEMATIC_BOX}>
        <Schematic air={air} dh={dh} pumpBadge="OFF" glow={glow} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={PANEL}>
        <Card start={q.s.y0} color={C.off} title={<>المضخة متوقفة (<T>Water pump OFF</T>)</>} />
        <Card start={q.s.y1} color={C.air} title={<>ابدأ الهواء قرب <T>20 L/min</T></>}>
          حسب العرض
        </Card>
        <Card start={q.s.y2} color={C.note} title="6 قراءات مختلفة لتدفق الهواء">
          <Tracker start={rStart} each={each} />
        </Card>
      </div>
    </Slide>
  );
};

/* ───────────────────────── 6. Wet column test ───────────────────────── */
export const WetScene: React.FC = () => {
  const f = useCurrentFrame();
  const q = cues("wet");
  const water = ramp(f, at(q, "e0", 0.55), at(q, "e0", 0.55) + 40, 0, 1);
  const rStart = q.s.e2 + 20;
  const each = (q.e.e3 + 20 - rStart) / 6;
  const rs = readingState(f, rStart, each);
  const air = f < rStart ? ramp(f, q.s.e2, rStart, 0, levelFor(0)) : rs.air;
  const dh = air > 0.01 ? 28 + 175 * Math.pow(air, 1.9) : 0;
  const pumpOn = f > at(q, "e0", 0.55);
  const glow: Part | null = f < q.s.e1 ? "pump" : f < q.s.e2 ? "wmeter" : "mano";
  return (
    <Slide title="Wet Column Test" subtitle="اختبار العمود المبلل" page="06" footnote={SIMPLIFIED}>
      <div style={SCHEMATIC_BOX}>
        <Schematic
          water={water}
          pumpOn={pumpOn}
          pumpBadge={pumpOn ? "ON" : "OFF"}
          air={air}
          dh={dh}
          holdup={0.25}
          glow={glow}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div style={PANEL}>
        <Card start={q.s.e0} color={C.water} title={<>شغّل دوران الماء (<T>Water pump ON</T>)</>} />
        <Card start={q.s.e1} color={C.note} title="ثبّت تدفق الماء">
          <div
            style={{
              marginTop: 8,
              padding: "12px 16px",
              borderRadius: 12,
              backgroundColor: "rgba(102,147,172,0.13)",
              color: C.title,
              fontSize: 28,
              lineHeight: 1.5,
              ...fadeUp(f, at(q, "e1", 0.25)),
            }}
          >
            تعارض في المصدر:
            <br />
            الإجراء: <T color={C.note}>75 L/h</T> &nbsp;·&nbsp; الجدول: <T color={C.note}>200 L/h</T>
            <br />
            <b>القيمة تُؤكَّد مع المدرس.</b>
          </div>
        </Card>
        <Card start={q.s.e2} color={C.air} title="كرّر قراءات الهواء الست">
          <Tracker start={rStart} each={each} />
        </Card>
      </div>
    </Slide>
  );
};

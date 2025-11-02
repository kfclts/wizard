
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// ── CIS Colors ────────────────────────────────────────────────────────────────
const BRAND_PRIMARY = '#204677';
const BRAND_ACCENT  = '#DE8634';
const BRAND_SOFT    = '#ECDA73';

// ── Config ───────────────────────────────────────────────────────────────────
const LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDcgNjQ2Ij48cGF0aCBkPSJNNDg1LjAwLDQ1Ni4wMCBMNDYyLjAwLDQ1NS4wMCBMNDQwLjAwLDQ3Mi4wMCBMNDE5LjAwLDQ4Mi4wMCBMNDE5LjAwLDQ4NS4wMCBMNDMyLjAwLDQ4Ni4wMCBMNDI0LjAwLDQ4OS4wMCBMNDI4LjAwLDQ5NS4wMCBMNDE5LjAwLDQ5Mi4wMCBMNDEzLjAwLDQ5NS4wMCBMNDA4LjAwLDUxMi4wMCBMNDExLjAwLDQ5My4wMCBMNDEwLjAwLDQ5MC4wMCBMNDA1LjAwLDQ5MC4wMCBMMzk5LjAwLDUwMS4wMCBMMzk5LjAwLDUxNS4wMCBMNDA1LjAwLDUzNC4wMCBMNDExLjAwLDUzMS4wMCBMNDE3LjAwLDUyMC4wMCBMNDIwLjAwLDUwMy4wMCBMNDQ3LjAwLDUxNS4wMCBMNDYzLjAwLDUxNi4wMCBMNDc0LjAwLDUyMC4wMCBMNDY5LjAwLDUwOS4wMCBMNDU5LjAwLDQ5OS4wMCBMNDQyLjAwLDQ5MC4wMCBaIiBmaWxsPSIjNUQ1RDZCIiAvPjxwYXRoIGQ9Ik05MC4wMCw0NTUuMDAgTDkxLjAwLDQ2MC4wMCBMMTMyLjAwLDQ5MC4wMCBMMTEzLjAwLDUwMC4wMCBMMTAyLjAwLDUxMy4wMCBMMTAwLjAwLDUyMC4wMCBMMTExLjAwLDUxNi4wMCBMMTMwLjAwLDUxNC4wMCBMMTU0LjAwLDUwMy4wMCBMMTU3LjAwLDUyMS4wMCBMMTY0LjAwLDUzMy4wMCBMMTY4LjAwLDUzNS4wMCBMMTc1LjAwLDUxMy4wMCBMMTc0LjAwLDQ5OS4wMCBMMTcwLjAwLDQ5MS4wMCBMMTYzLjAwLDQ5MS4wMCBMMTY1LjAwLDUxMS4wMCBMMTYwLjAwLDQ5NC4wMCBMMTU0LjAwLDQ5Mi4wMCBMMTQ2LjAwLDQ5NS4wMCBMMTQ5LjAwLDQ4OS4wMCBMMTQxLjAwLDQ4Ni4wMCBMMTU1LjAwLDQ4NS4wMCBMMTU1LjAwLDQ4Mi4wMCBMMTMyLjAwLDQ3MS4wMCBMMTExLjAwLDQ1NS4wMCBaIiBmaWxsPSIjNUQ1RDZCIiAvPjxwYXRoIGQ9Ik0yNzMuMDAsMTY1LjAwIEwyMTYuMDAsMTg5LjAwIEwxNzguMDAsMjQ0LjAwIEwxNjIuMDAsMjA0LjAwIEwxNjIuMDAsMjI2LjAwIEwxNDkuMDAsMjI3LjAwIEwxNzQuMDAsMjU0LjAwIEwxNDUuMDAsMjMyLjAwIEw5MS4wMCwyMzguMDAgTDE0My4wMCwyNTEuMDAgTDk5LjAwLDI1NC4wMCBMMTMyLjAwLDI1NC4wMCBMMTE0LjAwLDI2OS4wMCBMMTY2LjAwLDI2MS4wMCBMMTA0LjAwLDMwNS4wMCBMODQuMDAsMzc2LjAwIEwxMDkuMDAsNDQxLjAwIEwxNzYuMDAsNDgwLjAwIEwyMTMuMDAsNTQzLjAwIEwyOTUuMDAsNTcwLjAwIEwzNTcuMDAsNTQ2LjAwIEwzOTguMDAsNDgwLjAwIEw0NjQuMDAsNDQyLjAwIEw0ODkuMDAsMzU1LjAwIEw0NjIuMDAsMjk1LjAwIEw0MDcuMDAsMjYwLjAwIEw0NTkuMDAsMjY5LjAwIEw0MzkuMDAsMjU2LjAwIEw0NzQuMDAsMjU0LjAwIEw0MzAuMDAsMjUxLjAwIEw0ODIuMDAsMjM4LjAwIEw0MjguMDAsMjMzLjAwIEwzOTkuMDAsMjU0LjAwIEw0MzUuMDAsMjE3LjAwIEw0MTMuMDAsMjI4LjAwIEw0MDYuMDAsMjA0LjAwIEwzOTUuMDAsMjQ0LjAwIEwzNDguMDAsMTgyLjAwIFoiIGZpbGw9IiM1RDVENkIiIC8+PHBhdGggZD0iTTQ4NS4wMCwxMC4wMCBMNDc5LjAwLDguMDAgTDQ2MC4wMCwxMC4wMCBMNDQyLjAwLDI1LjAwIEw0MTkuMDAsMzYuMDAgTDQyMS4wMCw0MC4wMCBMNDMzLjAwLDQwLjAwIEw0MjQuMDAsNDMuMDAgTDQyOC4wMCw0OS4wMCBMNDIyLjAwLDQ3LjAwIEw0MTMuMDAsNDkuMDAgTDQwOC4wMCw2Ni4wMCBMNDExLjAwLDQ3LjAwIEw0MTAuMDAsNDQuMDAgTDQwNS4wMCw0NC4wMCBMMzk5LjAwLDU2LjAwIEwzOTkuMDAsNjkuMDAgTDQwNS4wMCw4OC4wMCBMNDExLjAwLDg1LjAwIEw0MTcuMDAsNzQuMDAgTDQxOS4wMCw1OC4wMCBMNDQzLjAwLDY4LjAwIEw0NzQuMDAsNzQuMDAgTDQ3MS4wMCw2Ni4wMCBMNDU5LjAwLDUzLjAwIEw0NDIuMDAsNDQuMDAgTDQ4My4wMCwxNC4wMCBaIiBmaWxsPSIjNUQ1RDZCIiAvPjxwYXRoIGQ9Ik04OC4wMCwxMC4wMCBMMTMyLjAwLDQ0LjAwIEwxMTIuMDAsNTUuMDAgTDEwMi4wMCw2Ny4wMCBMMTAwLjAwLDc0LjAwIEwxMzAuMDAsNjguMDAgTDE1NS4wMCw1OC4wMCBMMTU3LjAwLDc1LjAwIEwxNjQuMDAsODcuMDAgTDE2OS4wMCw4OC4wMCBMMTc1LjAwLDY3LjAwIEwxNzQuMDAsNTMuMDAgTDE3MC4wMCw0NS4wMCBMMTYzLjAwLDQ1LjAwIEwxNjUuMDAsNjUuMDAgTDE2MC4wMCw0OC4wMCBMMTQ2LjAwLDQ5LjAwIEwxNTAuMDAsNDMuMDAgTDE0MS4wMCw0MC4wMCBMMTU1LjAwLDM5LjAwIEwxNTUuMDAsMzYuMDAgTDEzNS4wMCwyNy4wMCBMMTExLjAwLDkuMDAgWiIgZmlsbD0iIzVENUQ2QiIgLz48cGF0aCBkPSJNMTE2LjAwLDAuMDAgTDE0My4wMCwyMi4wMCBMMTc2LjAwLDMzLjAwIEwxOTIuMDAsNzEuMDAgTDIxNy4wMCw5OS4wMCBMMjQ3LjAwLDExNi4wMCBMMjc4LjAwLDEyMy4wMCBMMzE4LjAwLDExOS4wMCBMMzUwLjAwLDEwNC4wMCBMMzc3LjAwLDc4LjAwIEwzOTguMDAsMzMuMDAgTDQzNi4wMCwxOS4wMCBMNDU4LjAwLDEuMDAgTDI5Ny4wMCwwLjAwIEwzMDguMDAsNDcuMDAgTDI4Ny4wMCw1Ny4wMCBMMjg1LjAwLDY4LjAwIEwyOTEuMDAsNzIuMDAgTDI4NC4wMCw3NC4wMCBMMjc0LjAwLDY2LjAwIEwyNzIuMDAsNTEuMDAgTDI2My4wMCw1Mi4wMCBMMjgzLjAwLDI2LjAwIEwyODkuMDAsMjYuMDAgTDI3Ny4wMCw1NC4wMCBMMjkwLjAwLDM0LjAwIEwyOTAuMDAsMC4wMCBaIiBmaWxsPSIjNUQ1RDZCIiAvPjwvc3ZnPg=="; // 企業 LOGO，可換成任意 URL 或 data:URL
const ASK_IN_ORDER = true;            // true 依序 Q1→Q7；false 隨機出題
const TYPE_SPEED_MS = 120;            // 打字速度（毫秒/字）
const OPTIONS_REVEAL_DELAY_MS = 600;  // 問題打完後多久顯示選項
const PREP_ROTATE_MS = 2200;          // 準備中文提示輪替速度
const PREP_TOTAL_MS = 5200;           // 準備階段總時長
const MAX_SCORE = 21;                 // 總分上限（Gauge 用）

// ── 題庫（固定 7 題） ─────────────────────────────────────────────────────
type Opt = { key: string; label: string; score?: number; focus?: string; };
type Q = { id: string; title: string; options: Opt[]; };

const QUESTIONS_7: Q[] = [
  { id: 'Q1', title: '您最近氣色如何？', options: [
      { key: 'A', label: '紅潤光澤', score: 3 },
      { key: 'B', label: '普通', score: 2 },
      { key: 'C', label: '蒼白乾黃', score: 1 },
    ] },
  { id: 'Q2', title: '您近期作息最接近哪一種？', options: [
      { key: 'A', label: '規律', score: 3 },
      { key: 'B', label: '偶爾熬夜', score: 2 },
      { key: 'C', label: '經常晚睡', score: 1 },
    ] },
  { id: 'Q3', title: '您認為自己的體質傾向是？', options: [
      { key: 'A', label: '手腳冰冷', score: 1 },
      { key: 'B', label: '易出汗', score: 2 },
      { key: 'C', label: '偏熱體質', score: 3 },
    ] },
  { id: 'Q4', title: '請問您的飲食習慣最接近哪一種？', options: [
      { key: 'A', label: '清淡且均衡', score: 3 },
      { key: 'B', label: '喜油炸甜食', score: 1 },
      { key: 'C', label: '蔬果多但蛋白質偏少', score: 2 },
    ] },
  { id: 'Q5', title: '您的壓力狀況如何？', options: [
      { key: 'A', label: '很放鬆', score: 3 },
      { key: 'B', label: '偶爾焦慮', score: 2 },
      { key: 'C', label: '壓力大且常緊繃', score: 1 },
    ] },
  { id: 'Q6', title: '最近是否感覺…', options: [
      { key: 'A', label: '容易疲倦', score: 1 },
      { key: 'B', label: '輕鬆有精神', score: 3 },
      { key: 'C', label: '有時頭暈或氣短', score: 2 },
    ] },
  { id: 'Q7', title: '想改善的重點', options: [
      { key: 'A', label: '氣色', focus: '氣色' },
      { key: 'B', label: '體力', focus: '體力' },
      { key: 'C', label: '睡眠', focus: '睡眠' },
      { key: 'D', label: '消化', focus: '消化' },
    ] },
];

// 題目變體（Q1~Q6 部分）
const Q_VARIANTS: Record<string, { title: string; options: { label: string; score: number }[] }[]> = {
  Q1: [
    { title: '您最近的氣色狀況？', options: [{ label: '容光煥發', score: 3 }, { label: '普通', score: 2 }, { label: '偏蒼白或蠟黃', score: 1 }] },
    { title: '此刻的氣色表現如何？', options: [{ label: '紅潤有光澤', score: 3 }, { label: '尚可', score: 2 }, { label: '蒼白乾黃', score: 1 }] },
  ],
  Q2: [
    { title: '您近期的作息節奏最接近？', options: [{ label: '規律、固定時間就寢起床', score: 3 }, { label: '偶爾晚睡或熬夜', score: 2 }, { label: '經常晚睡或不規律', score: 1 }] },
  ],
  Q3: [
    { title: '您覺得自己的體質傾向？', options: [{ label: '手腳容易冰冷', score: 1 }, { label: '容易出汗', score: 2 }, { label: '偏熱、常覺得燥熱', score: 3 }] },
  ],
  Q4: [
    { title: '平時飲食型態較接近？', options: [{ label: '清淡且均衡', score: 3 }, { label: '偏好油炸或甜食', score: 1 }, { label: '蔬果多但蛋白質偏少', score: 2 }] },
  ],
  Q5: [
    { title: '近來的壓力感受？', options: [{ label: '以放鬆為主，壓力不大', score: 3 }, { label: '偶爾緊張或焦慮', score: 2 }, { label: '壓力大且經常緊繃', score: 1 }] },
  ],
  Q6: [
    { title: '最近身體的整體感受？', options: [{ label: '輕鬆有精神', score: 3 }, { label: '有時頭晕或氣短', score: 2 }, { label: '容易疲倦', score: 1 }] },
  ],
};

const PREPARING_TEXTS = ['思考中…', '為您挑選關鍵題目…', '生成題目中…'];

// Utils
const shuffle = <T,>(arr: T[]): T[] => { const a = arr.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };
const sumScore = (answers: any[]) => answers.filter(a => a.qid !== 'Q7').reduce((acc,a)=>acc+(a.option.score||0),0);
const pickFocus = (answers: any[]) => (answers.find(a=>a.qid==='Q7')||{}).option?.focus;

function profileByScore(total: number){
  if (total >= 18) return {
    key: '✨ 旭日曜靈系（Radiant Spirit）',
    range: '18–21分',
    feature: '天生靈氣飽滿、能量流轉如光。靈膳只需溫潤平衡，維持明亮與和諧。特徵： 體質均衡，氣血旺盛，但需持續保養以維持亮麗光澤。',
    bird: '凰啼初盞',
    plan: '每週 2–3 次，早晨空腹食用「凰啼初盞」；可加入少量安永鮮物「山藥竹笙排骨湯」作為氣養搭配。',
    quote: '持盈保泰，乃養生之道。氣滿，則神明自華。',
    soups: ['山藥竹笙排骨湯'],
    time: '早晨空腹',
  };
  if (total >= 13) return {
    key: '🌸 晨露花靈系（Bloom Spirit）',
    range: '13–17分',
    feature: '體能易消散、靈氣需滋養。以花果與燕窩為伴，重新喚醒生命之息。特徵： 容易疲倦、頭暈，女性常有氣色不佳現象。',
    bird: '凰啼初盞',
    plan: '每週 3–4 次，晚餐後 1 小時食用「凰啼初盞」；可搭配安永鮮物「黨蔘蓮子雞湯」。',
    quote: '氣為血帥，血為氣母；兩虛之時，燕窩溫養最宜。',
    soups: ['黨蔘蓮子雞湯'],
    time: '晚餐後',
  };
  if (total >= 9) return {
    key: '🔥 赤焰月靈系（Crimson Moon Spirit）',
    range: '9–12分',
    feature: '內心燃燒、思緒易躁。以潤養之湯鎮月火，讓能量回歸柔光。特徵： 熬夜多、睡眠差、口乾舌燥，容易長痘或燥熱。',
    bird: '凰啼初盞',
    plan: '每週 3 次，晚間食用「凰啼初盞」；搭配安永鮮物「山藥竹笙排骨湯」。',
    quote: '夜深時，讓月華與燕窩一同撫平你的燥與火。',
    soups: ['山藥竹笙排骨湯'],
    time: '晚間',
  };
  if (total >= 7) return {
    key: '🌞 晨曦木靈系（Dawnwood Spirit）',
    range: '7–8分',
    feature: '活力未滿、寒意易生。以根莖靈草溫補陽能，讓朝氣重生。特徵： 手腳冰冷、代謝低、容易疲倦。',
    bird: '凰啼初盞',
    plan: '每週 4 次，早晨溫熱食用「凰啼初盞」；搭配安永鮮物「黃耆枸杞雞湯」。',
    quote: '陽升則生，陽退則衰。溫一盞晨光，重啟體內暖流。',
    soups: ['黃耆枸杞雞湯'],
    time: '早晨',
  };
  return {
    key: '🌿 青藤風靈系（Verdant Wind Spirit）',
    range: '6分以下',
    feature: '情緒易滯、氣脈不暢。以芳香草本舒展身心，讓靈氣自在流轉。特徵： 壓力大、睡不安、情緒起伏、消化不良。',
    bird: '凰啼初盞',
    plan: '每週 2–3 次，午後食用「凰啼初盞」；搭配安永鮮物「山藥竹笙排骨湯」。',
    quote: '情緒為氣之主。養氣即養心，心開則百脈順。',
    soups: ['山藥竹笙排骨湯'],
    time: '午後',
  };
}

const focusTip = (focus?: string) => {
  switch (focus) {
    case '氣色': return '可加強鐵質與優質蛋白來源，並維持規律作息。';
    case '體力': return '建議早晨或運動後補充，並留意蛋白質與碳水的均衡。';
    case '睡眠': return '晚間清淡、避免刺激性飲食，搭配安神湯品更佳。';
    case '消化': return '少量多餐、減少油炸甜食，四神健脾類湯品有助。';
    default: return undefined;
  }
};

// ── Typewriter ───────────────────────────────────────────────────────────────
const TYPE_SPEED_DEFAULT = TYPE_SPEED_MS;
const Typewriter: React.FC<{ text: string; speed?: number; startKey?: string; className?: string; onDone?: () => void }> = ({ text, speed = TYPE_SPEED_DEFAULT, startKey, className, onDone }) => {
  const [i, setI] = useState(0);
  useEffect(() => { setI(0); }, [text, startKey]);
  useEffect(() => {
    if (i >= text.length) { onDone && onDone(); return; }
    const id = setTimeout(() => setI(i + 1), speed);
    return () => clearTimeout(id);
  }, [i, text, speed, onDone]);
  return <span className={className}>{text.slice(0, i)}</span>;
};

// ── AnimatedNumber ──────────────────────────────────────────────────────────
const AnimatedNumber: React.FC<{ value: number; duration?: number; className?: string }> = ({ value, duration = 1000, className }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0, start = 0;
    const from = 0, to = value;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const v = Math.round(from + (to - from) * p);
      setDisplay(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  const padded = String(display).padStart(2, '0');
  return <span className={className}>{padded}</span>;
};

// ── Circular Gauge ──────────────────────────────────────────────────────────
const ScoreGauge: React.FC<{ value: number; max?: number; size?: number; stroke?: number }> = ({ value, max = MAX_SCORE, size = 144, stroke = 10 }) => {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, (max === 0 ? 0 : value / max)));
  const offset = C * (1 - pct);
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size/2}
          cy={size/2}
          r={r}
          stroke={BRAND_PRIMARY}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0 }} className="flex items-center justify-center">
        <AnimatedNumber value={value} className="text-5xl md:text-6xl font-extrabold tracking-wider" />
      </div>
    </div>
  );
};

// ── 主組件 ─────────────────────────────────────────────────────────────────
export default function App(){
  const [phase, setPhase] = useState<'intro'|'preparing'|'asking'|'analyzing'|'result'>('intro');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [questionTyped, setQuestionTyped] = useState(false);
  const [optionsForIdx, setOptionsForIdx] = useState<number | null>(null);
  const [preparingIdx, setPreparingIdx] = useState(0);
  const [questions, setQuestions] = useState<Q[]>(QUESTIONS_7);
  const [logoOk, setLogoOk] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{ document.title='神農原養 — AI靈膳魔導師'; },[]);

  const withVariants = () => QUESTIONS_7.map(q => {
    const vs = (Q_VARIANTS as any)[q.id];
    if (!vs) return q;
    const v = vs[Math.floor(Math.random()*vs.length)];
    const opts = v.options.map((o: any, i: number)=>({ key: q.options[i]?.key || String.fromCharCode(65+i), label: o.label, score: o.score }));
    return { id: q.id, title: v.title, options: opts } as Q;
  });

  const shuffleLocal = <T,>(arr: T[]): T[] => { const a = arr.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };

  const start = () => {
    const base = withVariants();
    const arr = ASK_IN_ORDER ? base : shuffleLocal(base);
    setQuestions(arr);
    setAnswers([]);
    setIdx(0);
    setQuestionTyped(false);
    setOptionsForIdx(null);
    setPhase('preparing');
  };

  // 準備動畫
  useEffect(()=>{
    if (phase !== 'preparing') return;
    setQuestionTyped(false); setOptionsForIdx(null); setPreparingIdx(0);
    const rot = setInterval(()=> setPreparingIdx(i => (i+1)%PREPARING_TEXTS.length), PREP_ROTATE_MS);
    const t = setTimeout(()=>{ clearInterval(rot); setPhase('asking'); }, PREP_TOTAL_MS);
    return ()=>{ clearInterval(rot); clearTimeout(t); };
  },[phase]);

  // 自動捲到最底
  useEffect(()=>{
    const el = scrollRef.current; if (!el) return;
    try { el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); } catch { el.scrollTop = el.scrollHeight; }
  },[answers.length, idx, phase, questionTyped, optionsForIdx]);

  const onChoose = (q: Q, opt: Opt) => {
    setAnswers(prev => [...prev, { qid: q.id, title: q.title, option: opt }]);
    setTimeout(()=>{ (idx+1 >= questions.length) ? setPhase('analyzing') : setIdx(i=>i+1); setQuestionTyped(false); setOptionsForIdx(null); }, 200);
  };

  const total = useMemo(()=> sumScore(answers), [answers]);
  const focus = useMemo(()=> pickFocus(answers), [answers]);
  const prof  = useMemo(()=> profileByScore(total||0), [total]);
  const score2 = useMemo(()=> String(total).padStart(2,'0'), [total]);

  useEffect(()=>{
    if (phase !== 'analyzing') return;
    const t = setTimeout(()=> setPhase('result'), 1800);
    return ()=> clearTimeout(t);
  },[phase]);

  const totalQuestions = questions.length;
  const progressPct = useMemo(()=>{
    const done = phase==='result' || phase==='analyzing';
    const answered = done ? totalQuestions : answers.length;
    if (totalQuestions<=0) return 0; return Math.max(0, Math.min(100, Math.round((answered/totalQuestions)*100)));
  },[answers.length, phase, totalQuestions]);

  const lineDeepLink = useMemo(()=>{
    const LINE_ID_ENC = '%40081cvuqw';
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const msg = `${score2}`; // 僅分數（兩位數）
    const mobile = `https://line.me/R/oaMessage/${LINE_ID_ENC}/?${encodeURIComponent(msg)}`;
    const desktop = `https://line.me/ti/p/${LINE_ID_ENC}`;
    return isMobile ? mobile : desktop;
  },[score2]);

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900">
      {/* 固定頂端 Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-3">
            {logoOk ? (
              <img src={LOGO_URL} alt="logo" className="h-6 w-auto" onError={() => setLogoOk(false)} />
            ) : (
              <div className="h-6 w-6 rounded text-white flex items-center justify-center text-[10px] font-bold" style={{ background: BRAND_PRIMARY }}>LOGO</div>
            )}
            <div>
              <h1 className="text-base md:text-lg font-semibold leading-tight" style={{ color: BRAND_PRIMARY }}>神農原養 — AI靈膳魔導師</h1>
              <p className="text-sm md:text-base" style={{ color: BRAND_ACCENT }}>專屬燕窩攻略與搭配建議</p>
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full" style={{ width: progressPct + '%', background: BRAND_PRIMARY, transition: 'width .3s ease' }} />
          </div>
        </div>
      </div>

      {/* 主體 */}
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-8">
        <div className="rounded-2xl bg-white shadow-sm">
          <div ref={scrollRef} className="p-4 md:p-6 space-y-3 overflow-y-auto no-scrollbar" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)', height: 'calc(100dvh - 140px)' }}>
            <AnimatePresence initial={false}>
              {phase === 'intro' && (
                <motion.div key="intro" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  <div className="w-full flex justify-start">
                    <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                      <p className="mt-2 text-[15px] md:text-base leading-7 text-gray-800 max-w-prose">透過簡單問答，「靈膳魔導師」將為您分析您來自哪一個靈系，結束後請依指示領取您專屬的「靈膳魔法捲軸」，內有適合您的「凰啼初盞 燕窩即食瓶」搭配建議，打造您的每日靈膳儀式感。</p>
                      <button className="mt-3 px-4 py-2 rounded-xl shadow-sm border transition" style={{ borderColor: BRAND_PRIMARY, color: BRAND_PRIMARY }} onClick={start}>開始測驗</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === 'preparing' && (
                <motion.div key="preparing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  <div className="w-full">
                    <div className="text-base font-medium" style={{ color: BRAND_PRIMARY }}>AI靈膳魔導師</div>
                    <div className="mt-1 text-base text-gray-900 flex items-center gap-2">
                      <span>{PREPARING_TEXTS[preparingIdx % PREPARING_TEXTS.length]}</span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: BRAND_SOFT }} />
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: BRAND_SOFT }} />
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: BRAND_SOFT }} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === 'asking' && (
                <motion.div key="asking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  {answers.map((a, i) => (
                    <motion.div key={`a-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.02 }}>
                      <div className="w-full">
                        <div className="text-base font-medium" style={{ color: BRAND_PRIMARY }}>{a.title}</div>
                      </div>
                      <div className="h-1" />
                      <div className="w-full flex justify-end">
                        <div className="max-w-[85%] rounded-2xl p-4 shadow-sm text-base" style={{ background: BRAND_SOFT }}>
                          <span style={{ color: BRAND_PRIMARY }}>{a.option.label}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {idx < questions.length && (
                    <motion.div key={`q-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-3">
                      <div className="w-full">
                        <div className="text-base font-medium" style={{ color: BRAND_PRIMARY }}>AI靈膳魔導師</div>
                        <div className="mt-1 text-base font-medium" style={{ color: BRAND_PRIMARY }}>
                          <Typewriter text={questions[idx].title} startKey={`${idx}-${phase}`} onDone={() => { setQuestionTyped(true); setTimeout(() => setOptionsForIdx(idx), OPTIONS_REVEAL_DELAY_MS); }} />
                        </div>
                      </div>
                      {optionsForIdx === idx && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {questions[idx].options.map((opt) => (
                            <button key={opt.key} className="px-4 py-2 rounded-xl shadow-sm border transition text-left text-base" style={{ borderColor: BRAND_PRIMARY, color: BRAND_PRIMARY }} onClick={() => onChoose(questions[idx], opt)}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {phase === 'analyzing' && (
                <motion.div key="analyzing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  <div className="w-full">
                    <div className="text-base font-medium" style={{ color: BRAND_PRIMARY }}>AI靈膳魔導師</div>
                    <div className="mt-1 text-base text-gray-900 flex items-center gap-2">
                      <span>分析中…</span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: BRAND_SOFT }} />
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: BRAND_SOFT }} />
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: BRAND_SOFT }} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === 'result' && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-4">
                  <div className="space-y-3">
                    {answers.map((a, i) => (
                      <div key={`r-${i}`} className="space-y-2">
                        <div className="w-full">
                          <div className="text-base font-medium" style={{ color: BRAND_PRIMARY }}>{a.title}</div>
                        </div>
                        <div className="w-full flex justify-end">
                          <div className="max-w-[85%] rounded-2xl p-4 shadow-sm text-base" style={{ background: BRAND_SOFT }}>
                            <div style={{ color: BRAND_PRIMARY }}>{a.option.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full flex justify-start">
                    <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                      <h3 className="m-0 font-medium" style={{ color: BRAND_PRIMARY }}>AI靈膳魔導師分析</h3>
                      <div className="mt-4 space-y-4">
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl font-extrabold" style={{ color: BRAND_PRIMARY }}>{prof.key}</div>
                          <div className="mt-3 flex justify-center items-center">
                            <ScoreGauge value={total} max={MAX_SCORE} />
                          </div>
                        </div>
                        <p className="text-gray-800 leading-7">{(prof.feature.split('特徵：')[0] || prof.feature)}</p>
                        <div className="text-base md:text-lg font-semibold" style={{ color: BRAND_PRIMARY }}>靈膳魔導師語錄：{prof.quote}</div>
                        <div className="text-sm text-gray-700">點擊下方按鈕加入官方 LINE，獲取更多資訊</div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <a className="inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm border transition text-white text-base" style={{ background: BRAND_ACCENT, borderColor: BRAND_ACCENT }} href="#" onClick={(e) => { e.preventDefault(); window.open(lineDeepLink,'_blank'); }}>
                            <svg width="20" height="20" viewBox="0 0 64 64" aria-hidden>
                              <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="#06C755" />
                              <text x="32" y="42" fontSize="22" fontFamily="Arial, Helvetica, sans-serif" fill="#fff" textAnchor="middle">LINE</text>
                            </svg>
                            <span>加入 LINE</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

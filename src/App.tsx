import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// ── CIS Colors ────────────────────────────────────────────────────────────────
const BRAND_PRIMARY = '#204677';
const BRAND_ACCENT  = '#DE8634';
const BRAND_SOFT    = '#ECDA73';

// ── Config ───────────────────────────────────────────────────────────────────
const LOGO_URL = '/logo.svg';        // 之後你可換成企業 LOGO
const ASK_IN_ORDER = true;           // true 依序 Q1→Q7；false 隨機出題
const TYPE_SPEED_MS = 120;           // 打字速度（毫秒/字）
const OPTIONS_REVEAL_DELAY_MS = 600; // 問題打完後多久顯示選項
const PREP_ROTATE_MS = 2200;         // 準備中文提示輪替速度
const PREP_TOTAL_MS = 5200;          // 準備階段總時長
const MAX_SCORE = 21;                // Gauge 正規化上限

// ── Types ────────────────────────────────────────────────────────────────────
type Focus = '氣色' | '體力' | '睡眠' | '消化';
type Option = { key: string; label: string; score?: number; focus?: Focus };
type Question = { id: string; title: string; options: Option[] };
type Answer = { qid: string; title: string; option: Option };

// ── Opening ──────────────────────────────────────────────────────────────────
const OPENING = {
  body:
    '透過幾題簡單問答，靈膳魔導師將為您分析體質屬性，並依結果推薦專屬燕窩食用攻略與安永鮮物藥膳湯品搭配建議，打造您的每日靈膳儀式感。',
  cta: '開始測驗',
};

// ── Base Questions ───────────────────────────────────────────────────────────
const QUESTIONS_7: Question[] = [
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
      { key: 'C', label: '愛蔬果但少蛋白質', score: 2 },
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

// ── Variants (Q1~Q6) ────────────────────────────────────────────────────────
type QuestionVariant = { title: string; options: { label: string; score?: number }[] };
const Q_VARIANTS: Record<string, QuestionVariant[]> = {
  Q1: [
    { title: '您最近的氣色狀況？', options: [{ label: '容光煥發', score: 3 }, { label: '普通', score: 2 }, { label: '偏蒼白或蠟黃', score: 1 }] },
    { title: '此刻的氣色表現如何？', options: [{ label: '紅潤有光澤', score: 3 }, { label: '尚可', score: 2 }, { label: '蒼白乾黃', score: 1 }] },
    { title: '近期觀察到的氣色狀態？', options: [{ label: '明亮紅潤', score: 3 }, { label: '中等', score: 2 }, { label: '氣色偏差', score: 1 }] },
  ],
  Q2: [
    { title: '您近期的作息節奏最接近？', options: [{ label: '規律、固定時間就寢起床', score: 3 }, { label: '偶爾晚睡或熬夜', score: 2 }, { label: '經常晚睡或不規律', score: 1 }] },
    { title: '最近的睡眠作息型態？', options: [{ label: '作息穩定', score: 3 }, { label: '偶爾打亂', score: 2 }, { label: '長期紊亂', score: 1 }] },
  ],
  Q3: [
    { title: '您覺得自己的體質傾向？', options: [{ label: '手腳容易冰冷', score: 1 }, { label: '容易出汗', score: 2 }, { label: '偏熱、常覺得燥熱', score: 3 }] },
    { title: '平常自覺的體質走向？', options: [{ label: '畏寒怕冷', score: 1 }, { label: '動則易汗', score: 2 }, { label: '上火體質', score: 3 }] },
  ],
  Q4: [
    { title: '平時飲食型態較接近？', options: [{ label: '清淡且均衡', score: 3 }, { label: '偏好油炸或甜食', score: 1 }, { label: '蔬果多但蛋白質偏少', score: 2 }] },
    { title: '您的日常飲食習慣？', options: [{ label: '以清爽均衡為主', score: 3 }, { label: '常吃油膩與甜點', score: 1 }, { label: '蔬果充足但蛋白質不足', score: 2 }] },
  ],
  Q5: [
    { title: '近來的壓力感受？', options: [{ label: '以放鬆為主，壓力不大', score: 3 }, { label: '偶爾緊張或焦慮', score: 2 }, { label: '壓力大且經常緊繃', score: 1 }] },
    { title: '您最近的心理壓力程度？', options: [{ label: '心情平穩、較放鬆', score: 3 }, { label: '偶有煩悶', score: 2 }, { label: '常覺得壓力山大', score: 1 }] },
  ],
  Q6: [
    { title: '最近身體的整體感受？', options: [{ label: '輕鬆有精神', score: 3 }, { label: '有時頭暈或氣短', score: 2 }, { label: '容易疲倦', score: 1 }] },
    { title: '您近來的精力狀態？', options: [{ label: '精神充沛', score: 3 }, { label: '偶爾覺得頭暈乏力', score: 2 }, { label: '常感到疲憊', score: 1 }] },
  ],
};

const PREPARING_TEXTS = ['思考中…', '為您挑選關鍵題目…', '生成題目中…'];

// ── Utils ───────────────────────────────────────────────────────────────────
function sumScore(answers: Answer[]): number {
  return answers.filter(a => a.qid !== 'Q7').reduce((acc, a) => acc + (a.option.score ?? 0), 0);
}
function pickFocus(answers: Answer[]): Focus | undefined {
  const a7 = answers.find(a => a.qid === 'Q7');
  return a7?.option.focus as Focus | undefined;
}
function profileByScore(total: number) {
  if (total >= 18) return {
    key: '靈氣充盈型', range: '18–21分',
    feature: '體質均衡，氣血旺盛，但需持續保養以維持亮麗光澤。',
    bird: '凰啼初盞',
    plan: '每週 2–3 次，早晨空腹食用「凰啼初盞」；可加入少量安永鮮物「花旗蔘氣養湯」或「四神健脾湯」作為氣養搭配。',
    quote: '持盈保泰，乃養生之道。氣滿，則神明自華。',
    soups: ['花旗蔘氣養湯','四神健脾湯'], time: '早晨',
  } as const;
  if (total >= 13) return {
    key: '氣血雙虛型', range: '13–17分',
    feature: '容易疲倦、頭暈，女性常有氣色不佳現象。',
    bird: '潤若朝霞',
    plan: '每週 3–4 次，晚餐後 1 小時食用「潤若朝霞」；可搭配安永鮮物「當歸鴨湯」或「藥膳排骨湯」溫補氣血。',
    quote: '氣為血帥，血為氣母；兩虛之時，燕窩溫養最宜。',
    soups: ['當歸鴨湯','藥膳排骨湯'], time: '晚餐後',
  } as const;
  if (total >= 9) return {
    key: '陰虛火旺型', range: '9–12分',
    feature: '熬夜多、睡眠差、口乾舌燥，容易長痘或燥熱。',
    bird: '瑤光夜盞',
    plan: '每週 3 次，晚間食用「瑤光夜盞」；搭配安永鮮物「蓮子百合養心湯」或「枸杞雞湯」有助滋陰養心。',
    quote: '夜深時，讓月華與燕窩一同撫平你的燥與火。',
    soups: ['蓮子百合養心湯','枸杞雞湯'], time: '晚間',
  } as const;
  if (total >= 7) return {
    key: '陽氣不足型', range: '7–8分',
    feature: '手腳冰冷、代謝低、容易疲倦。',
    bird: '凰啼初盞',
    plan: '每週 4 次，早晨溫熱食用「凰啼初盞」；搭配安永鮮物「薑母雞湯」或「人蔘燉雞湯」，助陽生氣。',
    quote: '陽升則生，陽退則衰。溫一盞晨光，重啟體內暖流。',
    soups: ['薑母雞湯','人蔘燉雞湯'], time: '早晨',
  } as const;
  return {
    key: '氣鬱體滯型', range: '6分以下',
    feature: '壓力大、睡不安、情緒起伏、消化不良。',
    bird: '潤若朝霞',
    plan: '每週 2–3 次，午後食用「潤若朝霞」；搭配安永鮮物「養肝舒氣湯」或「香附平衡湯」舒緩氣鬱。',
    quote: '情緒為氣之主。養氣即養心，心開則百脈順。',
    soups: ['養肝舒氣湯','香附平衡湯'], time: '午後',
  } as const;
}
function focusTip(focus?: Focus): string | undefined {
  switch (focus) {
    case '氣色': return '可加強鐵質與優質蛋白來源，並維持規律作息。';
    case '體力': return '建議早晨或運動後補充，並留意蛋白質與碳水的均衡。';
    case '睡眠': return '晚間清淡、避免刺激性飲食，搭配安神湯品更佳。';
    case '消化': return '少量多餐、減少油炸甜食，四神健脾類湯品有助。';
    default: return undefined;
  }
}
function shuffle<T>(arr: T[]): T[] { const a = arr.slice(); for (let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

// ── Typewriter ───────────────────────────────────────────────────────────────
const Typewriter: React.FC<{ text: string; speed?: number; startKey?: string; className?: string; onDone?: ()=>void; }>
= ({ text, speed = TYPE_SPEED_MS, startKey, className, onDone }) => {
  const [i, setI] = useState(0);
  useEffect(() => { setI(0); }, [text, startKey]);
  useEffect(() => {
    if (i >= text.length) { onDone?.(); return; }
    const id = setTimeout(() => setI(i + 1), speed);
    return () => clearTimeout(id);
  }, [i, text, speed, onDone]);
  return <span className={className}>{text.slice(0, i)}</span>;
};

// ── AnimatedNumber (00 → XX) ────────────────────────────────────────────────
const AnimatedNumber: React.FC<{ value: number; duration?: number; className?: string }>
= ({ value, duration = 1000, className }) => {
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
const ScoreGauge: React.FC<{ value: number; max?: number; size?: number; stroke?: number }>
= ({ value, max = MAX_SCORE, size = 144, stroke = 10 }) => {
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

// ── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState<'intro'|'preparing'|'asking'|'analyzing'|'result'>('intro');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionTyped, setQuestionTyped] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [preparingIdx, setPreparingIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS_7);
  const [logoOk, setLogoOk] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerH, setHeaderH] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = '神農原養 — AI靈膳魔導師'; }, []);
  useEffect(() => {
    const update = () => setHeaderH(headerRef.current?.getBoundingClientRect().height || 0);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    try { el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }
    catch { el.scrollTop = el.scrollHeight; }
  }, [answers.length, idx, phase, questionTyped, showOptions]);

  function withVariants(): Question[] {
    return QUESTIONS_7.map(q => {
      const vs = Q_VARIANTS[q.id as keyof typeof Q_VARIANTS];
      if (!vs) return q;
      const v = vs[Math.floor(Math.random() * vs.length)];
      const opts: Option[] = v.options.map((o, i) => ({
        key: q.options[i]?.key ?? String.fromCharCode(65 + i),
        label: o.label,
        score: o.score
      }));
      return { id: q.id, title: v.title, options: opts };
    });
  }
  function start() {
    const base = withVariants();
    const arr = ASK_IN_ORDER ? base : shuffle(base);
    setQuestions(arr);
    setAnswers([]);
    setIdx(0);
    setQuestionTyped(false);
    setShowOptions(false);
    setPhase('preparing');
  }

  useEffect(() => {
    if (phase !== 'preparing') return;
    setQuestionTyped(false); setShowOptions(false); setPreparingIdx(0);
    const rot = setInterval(() => setPreparingIdx(i => (i + 1) % PREPARING_TEXTS.length), PREP_ROTATE_MS);
    const t = setTimeout(() => { clearInterval(rot); setPhase('asking'); }, PREP_TOTAL_MS);
    return () => { clearInterval(rot); clearTimeout(t); };
  }, [phase]);

  useEffect(() => { if (phase === 'asking') { setQuestionTyped(false); setShowOptions(false); } }, [idx, phase]);
  useEffect(() => {
    if (!questionTyped) return;
    const t = setTimeout(() => setShowOptions(true), OPTIONS_REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [questionTyped, idx]);

  const onChoose = (q: Question, opt: Option) => {
    setAnswers(prev => [...prev, { qid: q.id, title: q.title, option: opt }]);
    setTimeout(() => { (idx + 1 >= questions.length) ? setPhase('analyzing') : setIdx(i => i + 1); }, 200);
  };

  const total = useMemo(() => sumScore(answers), [answers]);
  const focus = useMemo(() => pickFocus(answers), [answers]);
  const prof  = useMemo(() => profileByScore(total || 0), [total]);
  const score2 = useMemo(() => String(total).padStart(2, '0'), [total]);

  const lineDeepLink = useMemo(() => {
    const LINE_ID_ENC = '%40081cvuqw';
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const msg = `${score2}`; // 只帶分數，例如 09
    const mobile = `https://line.me/R/oaMessage/${LINE_ID_ENC}/?${encodeURIComponent(msg)}`;
    const desktop = `https://line.me/ti/p/${LINE_ID_ENC}`;
    return isMobile ? mobile : desktop;
  }, [score2]);

  useEffect(() => {
    if (phase !== 'analyzing') return;
    const t2 = setTimeout(() => setPhase('result'), 2000);
    return () => { clearTimeout(t2); };
  }, [phase]);

  const totalQuestions = questions.length;
  const progressPct = useMemo(() => {
    const isDone = phase === 'result' || phase === 'analyzing';
    const answered = isDone ? totalQuestions : answers.length;
    if (totalQuestions <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((answered / totalQuestions) * 100)));
  }, [answers.length, phase, totalQuestions]);

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900">
      {/* Header */}
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-3">
            {logoOk ? (
              <img src={LOGO_URL} alt="logo" className="h-6 w-auto" onError={() => setLogoOk(false)} />
            ) : (
              <div className="h-6 w-6 rounded text-white flex items-center justify-center text-[10px] font-bold" style={{ background: BRAND_PRIMARY }}>LOGO</div>
            )}
            <div>
              <h1 className="text-base md:text-lg font-semibold leading-tight" style={{ color: BRAND_PRIMARY }}>神農原養 — AI靈膳魔導師</h1>
              <p className="text-xs" style={{ color: BRAND_ACCENT }}>專屬食用攻略與藥膳搭配</p>
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full" style={{ width: progressPct + '%', background: BRAND_PRIMARY, transition: 'width .3s ease' }} />
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-3xl px-4 pt-4 pb-8" style={{ paddingTop: headerH + 16 }}>
        <div className="rounded-2xl bg-white shadow-sm">
          <div
            ref={scrollRef}
            className="p-4 md:p-6 space-y-3 overflow-y-auto no-scrollbar"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)', height: `calc(100dvh - ${headerH + 64}px)` }}
          >
            <AnimatePresence initial={false}>
              {phase === 'intro' && (
                <motion.div key="intro" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  <div className="w-full flex justify-start">
                    <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                      <p className="mt-2">{OPENING.body}</p>
                      <button
                        className="px-4 py-2 rounded-xl shadow-sm border transition"
                        style={{ borderColor: BRAND_PRIMARY, color: BRAND_PRIMARY }}
                        onClick={start}
                      >
                        {OPENING.cta}
                      </button>
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
                          <Typewriter text={questions[idx].title} startKey={`${idx}-${phase}`} onDone={() => setQuestionTyped(true)} />
                        </div>
                      </div>
                      {showOptions && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {questions[idx].options.map((opt) => (
                            <button
                              key={opt.key}
                              className="px-4 py-2 rounded-xl shadow-sm border transition text-left text-base"
                              style={{ borderColor: BRAND_PRIMARY, color: BRAND_PRIMARY }}
                              onClick={() => onChoose(questions[idx], opt)}
                            >
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
                          <div className="text-sm md:text-base font-medium text-gray-700">您的氣血分數</div>
                          <div className="mt-3 flex justify-center items-center">
                            <ScoreGauge value={total} max={MAX_SCORE} />
                          </div>
                        </div>
                        <div className="text-base md:text-lg font-semibold" style={{ color: BRAND_PRIMARY }}>
                          靈膳魔導師語錄：{prof.quote}
                        </div>
                        <p className="text-gray-800">{prof.feature}</p>
                        {focus && <p className="text-gray-800">{focusTip(focus)}</p>}
                        <div className="text-sm text-gray-700">點擊下方按鈕加入官方 LINE，獲取更多資訊</div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <a
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm border transition text-white text-base"
                            style={{ background: BRAND_ACCENT, borderColor: BRAND_ACCENT }}
                            href={lineDeepLink}
                            target="_blank"
                            rel="noreferrer"
                          >
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

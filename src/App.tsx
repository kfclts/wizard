import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** ================= Brand / Config ================= */
const LOGO_URL = "/logo.svg"; // ← 只要改這裡即可切換 Logo 路徑（支援 svg/png/jpg）

/** ================= Types ================= */
type Focus = "氣色" | "體力" | "睡眠" | "消化";
type Option = { key: string; label: string; score?: number; focus?: Focus };
type Question = { id: string; title: string; options: Option[] };
type Answer = { qid: string; title: string; option: Option };

/** ================= Opening ================= */
const OPENING = {
  title: "",
  body:
    "透過幾題簡單問答，靈膳魔導師將為您分析體質屬性，並依結果推薦專屬燕窩食用攻略與安永鮮物藥膳湯品搭配建議，打造您的每日靈膳儀式感。",
  cta: "開始測驗",
};

/** ================= Dev Console ================= */
type DevLog = { ts: number; msg: string };
function useDevConsole() {
  const [logs, setLogs] = useState<DevLog[]>([]);
  const [visible, setVisible] = useState(false);
  const log = (...args: any[]) => {
    const msg = args
      .map((v) => {
        if (typeof v === "string") return v;
        try {
          return JSON.stringify(v);
        } catch {
          return String(v);
        }
      })
      .join(" ");
    setLogs((prev) => [...prev, { ts: Date.now(), msg }]);
    try {
      console.log("%c[Wizard]", "color:#06C755;font-weight:bold", msg);
    } catch {}
  };
  const clear = () => setLogs([]);
  return { logs, visible, setVisible, log, clear };
}

const DevConsolePanel: React.FC<{
  logs: DevLog[];
  visible: boolean;
  setVisible: (v: boolean) => void;
  clear: () => void;
}> = ({ logs, visible, setVisible, clear }) => {
  return (
    <>
      <button
        className="fixed bottom-4 right-4 z-30 px-3 py-2 rounded-xl shadow border bg-white hover:shadow-md text-xs"
        onClick={() => setVisible(!visible)}
      >
        🧪 控制台
      </button>
      {visible && (
        <div className="fixed bottom-16 right-4 z-30 w-[22rem] max-h-[50vh] rounded-xl border bg-white shadow-lg flex flex-col">
          <div className="px-3 py-2 border-b flex items-center justify-between">
            <div className="font-medium text-sm">Dev Console</div>
            <div className="flex items-center gap-2">
              <button className="text-xs px-2 py-1 rounded border" onClick={clear}>
                清空
              </button>
              <button className="text-xs px-2 py-1 rounded border" onClick={() => setVisible(false)}>
                關閉
              </button>
            </div>
          </div>
          <div className="p-2 overflow-auto text-xs space-y-1 no-scrollbar">
            {logs.length === 0 && <div className="text-gray-400">（無訊息）</div>}
            {logs.map((l, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-gray-400 mr-2">{new Date(l.ts).toLocaleTimeString()}</span>
                <span>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

/** ================= Base Questions (scores & focus) ================= */
const QUESTIONS_7: Question[] = [
  {
    id: "Q1",
    title: "您最近氣色如何？",
    options: [
      { key: "A", label: "紅潤光澤", score: 3 },
      { key: "B", label: "普通", score: 2 },
      { key: "C", label: "蒼白乾黃", score: 1 },
    ],
  },
  {
    id: "Q2",
    title: "您近期作息最接近哪一種？",
    options: [
      { key: "A", label: "規律", score: 3 },
      { key: "B", label: "偶爾熬夜", score: 2 },
      { key: "C", label: "經常晚睡", score: 1 },
    ],
  },
  {
    id: "Q3",
    title: "您認為自己的體質傾向是？",
    options: [
      { key: "A", label: "手腳冰冷", score: 1 },
      { key: "B", label: "易出汗", score: 2 },
      { key: "C", label: "偏熱體質", score: 3 },
    ],
  },
  {
    id: "Q4",
    title: "請問您的飲食習慣最接近哪一種？",
    options: [
      { key: "A", label: "清淡且均衡", score: 3 },
      { key: "B", label: "喜油炸甜食", score: 1 },
      { key: "C", label: "愛蔬果但少蛋白質", score: 2 },
    ],
  },
  {
    id: "Q5",
    title: "您的壓力狀況如何？",
    options: [
      { key: "A", label: "很放鬆", score: 3 },
      { key: "B", label: "偶爾焦慮", score: 2 },
      { key: "C", label: "壓力大且常緊繃", score: 1 },
    ],
  },
  {
    id: "Q6",
    title: "最近是否感覺…",
    options: [
      { key: "A", label: "容易疲倦", score: 1 },
      { key: "B", label: "輕鬆有精神", score: 3 },
      { key: "C", label: "有時頭暈或氣短", score: 2 },
    ],
  },
  {
    id: "Q7",
    title: "想改善的重點",
    options: [
      { key: "A", label: "氣色", focus: "氣色" },
      { key: "B", label: "體力", focus: "體力" },
      { key: "C", label: "睡眠", focus: "睡眠" },
      { key: "D", label: "消化", focus: "消化" },
    ],
  },
];

/** ================= Variants (Q1~Q6 random) ================= */
type QuestionVariant = { title: string; options: { label: string; score?: number }[] };
const Q_VARIANTS: Record<string, QuestionVariant[]> = {
  Q1: [
    { title: "您最近的氣色狀況？", options: [{ label: "容光煥發", score: 3 }, { label: "普通", score: 2 }, { label: "偏蒼白或蠟黃", score: 1 }] },
    { title: "此刻的氣色表現如何？", options: [{ label: "紅潤有光澤", score: 3 }, { label: "尚可", score: 2 }, { label: "蒼白乾黃", score: 1 }] },
    { title: "近期觀察到的氣色狀態？", options: [{ label: "明亮紅潤", score: 3 }, { label: "中等", score: 2 }, { label: "氣色偏差", score: 1 }] },
    { title: "最近照鏡子的臉色感覺？", options: [{ label: "光澤度佳", score: 3 }, { label: "還行", score: 2 }, { label: "面色暗沉", score: 1 }] },
    { title: "現在的面色與光澤如何？", options: [{ label: "氣色紅潤", score: 3 }, { label: "一般", score: 2 }, { label: "蠟黃無光", score: 1 }] },
    { title: "近一週的氣色整體評估？", options: [{ label: "臉色水嫩透亮", score: 3 }, { label: "平常", score: 2 }, { label: "蒼白無血色", score: 1 }] },
    { title: "您覺得目前的氣色？", options: [{ label: "面色紅潤", score: 3 }, { label: "普普", score: 2 }, { label: "暗沉偏黃", score: 1 }] },
  ],
  Q2: [
    { title: "您近期的作息節奏最接近？", options: [{ label: "規律、固定時間就寢起床", score: 3 }, { label: "偶爾晚睡或熬夜", score: 2 }, { label: "經常晚睡或不規律", score: 1 }] },
    { title: "最近的睡眠作息型態？", options: [{ label: "作息穩定", score: 3 }, { label: "偶爾打亂", score: 2 }, { label: "長期紊亂", score: 1 }] },
    { title: "近一個月的作息狀況？", options: [{ label: "規律早睡早起", score: 3 }, { label: "偶有熬夜", score: 2 }, { label: "常常熬夜", score: 1 }] },
    { title: "平日作息規律程度？", options: [{ label: "固定且規律", score: 3 }, { label: "偶爾延後睡覺", score: 2 }, { label: "常常延後到很晚", score: 1 }] },
    { title: "這陣子的睡眠時間安排？", options: [{ label: "時段固定、睡眠充足", score: 3 }, { label: "偶爾短少或錯位", score: 2 }, { label: "不固定且不足", score: 1 }] },
    { title: "你的作息是否固定？", options: [{ label: "大致固定", score: 3 }, { label: "偶有波動", score: 2 }, { label: "經常不固定", score: 1 }] },
    { title: "最近夜晚作息如何？", options: [{ label: "多半按時就寢", score: 3 }, { label: "偶爾晚睡", score: 2 }, { label: "常常晚睡", score: 1 }] },
  ],
  Q3: [
    { title: "您覺得自己的體質傾向？", options: [{ label: "手腳容易冰冷", score: 1 }, { label: "容易出汗", score: 2 }, { label: "偏熱、常覺得燥熱", score: 3 }] },
    { title: "平常自覺的體質走向？", options: [{ label: "畏寒怕冷", score: 1 }, { label: "動則易汗", score: 2 }, { label: "上火體質", score: 3 }] },
    { title: "目前體感較接近？", options: [{ label: "四肢冰冷", score: 1 }, { label: "出汗偏多", score: 2 }, { label: "容易燥熱", score: 3 }] },
    { title: "你對體質的自我感受？", options: [{ label: "易冷、需要保暖", score: 1 }, { label: "易汗、代謝較旺", score: 2 }, { label: "偏熱、容易上火", score: 3 }] },
    { title: "近來體質傾向為？", options: [{ label: "手腳常冰冰的", score: 1 }, { label: "流汗較他人多", score: 2 }, { label: "常感體內燥熱", score: 3 }] },
    { title: "身體冷熱體感屬於？", options: [{ label: "偏冷型", score: 1 }, { label: "容易冒汗型", score: 2 }, { label: "偏熱型", score: 3 }] },
    { title: "這陣子體質的狀態？", options: [{ label: "手腳冰冷明顯", score: 1 }, { label: "輕微出汗偏多", score: 2 }, { label: "燥熱較明顯", score: 3 }] },
  ],
  Q4: [
    { title: "平時飲食型態較接近？", options: [{ label: "清淡且均衡", score: 3 }, { label: "偏好油炸或甜食", score: 1 }, { label: "蔬果多但蛋白質偏少", score: 2 }] },
    { title: "您的日常飲食習慣？", options: [{ label: "以清爽均衡為主", score: 3 }, { label: "常吃油膩與甜點", score: 1 }, { label: "蔬果充足但蛋白質不足", score: 2 }] },
    { title: "最近的飲食取向？", options: [{ label: "清爽少油、注重均衡", score: 3 }, { label: "喜歡重口味與甜食", score: 1 }, { label: "吃蔬果多、蛋白質偏少", score: 2 }] },
    { title: "一天三餐大致如何？", options: [{ label: "均衡飲食、少油少鹽", score: 3 }, { label: "高油高糖較常見", score: 1 }, { label: "纖維足夠但蛋白偏少", score: 2 }] },
    { title: "飲食風格你會如何形容？", options: [{ label: "清淡為主、注重配比", score: 3 }, { label: "偏好炸物與甜品", score: 1 }, { label: "植物性為主但蛋白不足", score: 2 }] },
    { title: "近來餐食偏好？", options: [{ label: "清淡均衡、選擇健康", score: 3 }, { label: "重油重甜較多", score: 1 }, { label: "常缺蛋白質配比", score: 2 }] },
    { title: "平日營養攝取的習慣？", options: [{ label: "注重均衡、少油清爽", score: 3 }, { label: "愛吃零食甜點與炸物", score: 1 }, { label: "蔬果多於蛋白質", score: 2 }] },
  ],
  Q5: [
    { title: "近來的壓力感受？", options: [{ label: "以放鬆為主，壓力不大", score: 3 }, { label: "偶爾緊張或焦慮", score: 2 }, { label: "壓力大且經常緊繃", score: 1 }] },
    { title: "您最近的心理壓力程度？", options: [{ label: "心情平穩、較放鬆", score: 3 }, { label: "偶有煩悶", score: 2 }, { label: "常覺得壓力山大", score: 1 }] },
    { title: "這陣子的緊繃程度？", options: [{ label: "輕鬆自在", score: 3 }, { label: "有時會緊繃", score: 2 }, { label: "長期緊繃", score: 1 }] },
    { title: "近期情緒與壓力狀態？", options: [{ label: "壓力感低", score: 3 }, { label: "壓力偶爾上升", score: 2 }, { label: "壓力明顯偏高", score: 1 }] },
    { title: "現在對壓力的主觀感受？", options: [{ label: "多半放鬆", score: 3 }, { label: "時而煩悶焦慮", score: 2 }, { label: "時常焦慮不安", score: 1 }] },
    { title: "工作與生活壓力感？", options: [{ label: "掌控得宜、壓力小", score: 3 }, { label: "偶有壓力但可調適", score: 2 }, { label: "壓力沉重影響情緒", score: 1 }] },
    { title: "近一週的壓力整體評估？", options: [{ label: "放鬆居多", score: 3 }, { label: "偶發壓力", score: 2 }, { label: "壓力偏大", score: 1 }] },
  ],
  Q6: [
    { title: "最近身體的整體感受？", options: [{ label: "輕鬆有精神", score: 3 }, { label: "有時頭暈或氣短", score: 2 }, { label: "容易疲倦", score: 1 }] },
    { title: "您近來的精力狀態？", options: [{ label: "精神充沛", score: 3 }, { label: "偶爾覺得頭暈乏力", score: 2 }, { label: "常感到疲憊", score: 1 }] },
    { title: "過去一週的身體感覺？", options: [{ label: "整體輕盈、狀態佳", score: 3 }, { label: "偶發暈眩或呼吸不順", score: 2 }, { label: "動不動就累", score: 1 }] },
    { title: "目前精神與體力如何？", options: [{ label: "活力不錯", score: 3 }, { label: "偶有氣不足", score: 2 }, { label: "易乏力", score: 1 }] },
    { title: "這陣子的體能感覺？", options: [{ label: "體力良好", score: 3 }, { label: "間歇性頭昏", score: 2 }, { label: "精神不濟", score: 1 }] },
    { title: "白天精神與體感？", options: [{ label: "醒腦有勁", score: 3 }, { label: "偶爾喘不過氣", score: 2 }, { label: "容易累", score: 1 }] },
    { title: "你覺得最近的活力？", options: [{ label: "狀態穩定、精神佳", score: 3 }, { label: "偶爾感到不適", score: 2 }, { label: "常覺疲憊想休息", score: 1 }] },
  ],
};

const PREPARING_TEXTS = ["思考中…", "為您挑選關鍵題目…", "生成題目中…"];

/** ================= Utils ================= */
function sumScore(answers: Answer[]): number {
  return answers
    .filter((a) => a.qid !== "Q7")
    .reduce((acc, a) => acc + (a.option.score ?? 0), 0);
}
function pickFocus(answers: Answer[]): Focus | undefined {
  const a7 = answers.find((a) => a.qid === "Q7");
  return a7?.option.focus as Focus | undefined;
}
function profileByScore(total: number) {
  if (total >= 18)
    return {
      key: "靈氣充盈型",
      range: "18–21分",
      feature: "體質均衡，氣血旺盛，但需持續保養以維持亮麗光澤。",
      bird: "凰啼初盞",
      plan:
        "每週 2–3 次，早晨空腹食用『凰啼初盞』；可加入少量安永鮮物『花旗蔘氣養湯』或『四神健脾湯』作為氣養搭配。",
      quote: "持盈保泰，乃養生之道。氣滿，則神明自華。",
      soups: ["花旗蔘氣養湯", "四神健脾湯"],
      time: "早晨",
    } as const;
  if (total >= 13)
    return {
      key: "氣血雙虛型",
      range: "13–17分",
      feature: "容易疲倦、頭暈，女性常有氣色不佳現象。",
      bird: "潤若朝霞",
      plan:
        "每週 3–4 次，晚餐後 1 小時食用『潤若朝霞』；可搭配安永鮮物『當歸鴨湯』或『藥膳排骨湯』溫補氣血。",
      quote: "氣為血帥，血為氣母；兩虛之時，燕窩溫養最宜。",
      soups: ["當歸鴨湯", "藥膳排骨湯"],
      time: "晚餐後",
    } as const;
  if (total >= 9)
    return {
      key: "陰虛火旺型",
      range: "9–12分",
      feature: "熬夜多、睡眠差、口乾舌燥，容易長痘或燥熱。",
      bird: "瑤光夜盞",
      plan:
        "每週 3 次，晚間食用『瑤光夜盞』；搭配安永鮮物『蓮子百合養心湯』或『枸杞雞湯』有助滋陰養心。",
      quote: "夜深時，讓月華與燕窩一同撫平你的燥與火。",
      soups: ["蓮子百合養心湯", "枸杞雞湯"],
      time: "晚間",
    } as const;
  if (total >= 7)
    return {
      key: "陽氣不足型",
      range: "7–8分",
      feature: "手腳冰冷、代謝低、容易疲倦。",
      bird: "凰啼初盞",
      plan:
        "每週 4 次，早晨溫熱食用『凰啼初盞』；搭配安永鮮物『薑母雞湯』或『人蔘燉雞湯』，助陽生氣。",
      quote: "陽升則生，陽退則衰。溫一盞晨光，重啟體內暖流。",
      soups: ["薑母雞湯", "人蔘燉雞湯"],
      time: "早晨",
    } as const;
  return {
    key: "氣鬱體滯型",
    range: "6分以下",
    feature: "壓力大、睡不安、情緒起伏、消化不良。",
    bird: "潤若朝霞",
    plan:
      "每週 2–3 次，午後食用『潤若朝霞』；搭配安永鮮物『養肝舒氣湯』或『香附平衡湯』舒緩氣鬱。",
    quote: "情緒為氣之主。養氣即養心，心開則百脈順。",
    soups: ["養肝舒氣湯", "香附平衡湯"],
    time: "午後",
  } as const;
}
function focusTip(focus?: Focus): string | undefined {
  switch (focus) {
    case "氣色":
      return "可加強鐵質與優質蛋白來源，並維持規律作息。";
    case "體力":
      return "建議早晨或運動後補充，並留意蛋白質與碳水的均衡。";
    case "睡眠":
      return "晚間清淡、避免刺激性飲食，搭配安神湯品更佳。";
    case "消化":
      return "少量多餐、減少油炸甜食，四神健脾類湯品有助。";
    default:
      return undefined;
  }
}
function cleanLabel(s: string) {
  if (!s) return s;
  const c = s.charCodeAt(0);
  if (c >= 65 && c <= 90 && s.length > 1 && s[1] === " ") return s.slice(2);
  return s;
}
function buildActiveQuestions(): Question[] {
  return QUESTIONS_7.map((q) => {
    const variants = Q_VARIANTS[q.id as keyof typeof Q_VARIANTS];
    if (!variants) return q;
    const v = variants[Math.floor(Math.random() * variants.length)];
    const keys = q.options.map((o) => o.key);
    const opts: Option[] = v.options.map((o, i) => ({
      key: keys[i] || String.fromCharCode(65 + i),
      label: o.label,
      score: o.score,
    }));
    return { id: q.id, title: v.title, options: opts };
  });
}

/** ================= Typewriter ================= */
const Typewriter: React.FC<{
  text: string;
  speed?: number;
  startKey?: string;
  className?: string;
  onDone?: () => void;
}> = ({ text, speed = 90, startKey, className, onDone }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
  }, [text, startKey]);
  useEffect(() => {
    if (i >= text.length) {
      onDone?.();
      return;
    }
    const id = setTimeout(() => setI(i + 1), speed);
    return () => clearTimeout(id);
  }, [i, text, speed, onDone]);
  return <span className={className}>{text.slice(0, i)}</span>;
};

/** ================= App ================= */
export default function App() {
  const [phase, setPhase] = useState<"intro" | "preparing" | "asking" | "analyzing" | "result">("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionTyped, setQuestionTyped] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [preparingIdx, setPreparingIdx] = useState(0);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS_7);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [logoOk, setLogoOk] = useState(true);

  // Dev Console
  const { logs, visible, setVisible, log, clear } = useDevConsole();
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      if (params.get("debug") === "1") setVisible(true);
    } catch {}
  }, [setVisible]);

  useEffect(() => {
    document.title = "神農原養 — AI靈膳魔導師";
  }, []);

  // Auto scroll like chat
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } catch {
      el.scrollTop = el.scrollHeight;
    }
  }, [answers.length, idx, phase, questionTyped, showOptions]);

  const start = () => {
    setQuestions(buildActiveQuestions());
    setAnswers([]);
    setIdx(0);
    setQuestionTyped(false);
    setShowOptions(false);
    setPhase("preparing");
    log("Start test");
  };

  // Preparing phase text rotator (slower)
  useEffect(() => {
    log("Phase =>", phase);
    if (phase !== "preparing") return;
    setQuestionTyped(false);
    setShowOptions(false);
    setPreparingIdx(0);
    const rot = setInterval(
      () => setPreparingIdx((i) => (i + 1) % PREPARING_TEXTS.length),
      1400
    );
    const t = setTimeout(() => {
      clearInterval(rot);
      setPhase("asking");
    }, 3800);
    return () => {
      clearInterval(rot);
      clearTimeout(t);
    };
  }, [phase]);

  // When moving to a new question, reset typing/options
  useEffect(() => {
    if (phase === "asking") {
      setQuestionTyped(false);
      setShowOptions(false);
    }
  }, [idx, phase]);

  // After question finishes typing, reveal options
  useEffect(() => {
    if (!questionTyped) return;
    const t = setTimeout(() => setShowOptions(true), 250);
    return () => clearTimeout(t);
  }, [questionTyped, idx]);

  const onChoose = (q: Question, opt: Option) => {
    log("Answer:", q.id, cleanLabel(opt.label), "score:", opt.score ?? "-");
    setAnswers((prev) => [...prev, { qid: q.id, title: q.title, option: opt }]);
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setPhase("analyzing");
      } else {
        setIdx((i) => i + 1);
      }
    }, 200);
  };

  const total = useMemo(() => sumScore(answers), [answers]);
  const focus = useMemo(() => pickFocus(answers), [answers]);
  const prof = useMemo(() => profileByScore(total || 0), [total]);

  useEffect(() => {
    if (answers.length === 0) return;
    log("Total =>", total, "Profile =>", prof.key, prof.range, "Focus =>", focus ?? "-");
  }, [total, prof, focus, answers.length]);

  const score2 = useMemo(() => String(total).padStart(2, "0"), [total]);
  const lineDeepLink = useMemo(() => {
    const LINE_ID_ENC = "%40081cvuqw"; // @081cvuqw
    const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const msg = `${score2}`; // 只帶數字，例如 "09"
    const mobile = `https://line.me/R/oaMessage/${LINE_ID_ENC}/?${encodeURIComponent(msg)}`;
    const desktop = `https://line.me/ti/p/${LINE_ID_ENC}`; // 桌面無法預填訊息，導向加好友/聊天
    return isMobile ? mobile : desktop;
  }, [score2]);
  useEffect(() => {
    log("LINE link =>", lineDeepLink);
  }, [lineDeepLink]);

  // Fake analyzing steps
  useEffect(() => {
    if (phase !== "analyzing") return;
    setAnalyzingStep(0);
    const t1 = setTimeout(() => setAnalyzingStep(1), 1000);
    const t2 = setTimeout(() => setPhase("result"), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  const totalQuestions = questions.length;
  const progressPct = useMemo(() => {
    const isDone = phase === "result" || phase === "analyzing";
    const answered = isDone ? totalQuestions : answers.length;
    if (totalQuestions <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((answered / totalQuestions) * 100)));
  }, [answers.length, phase, totalQuestions]);

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900">
      {/* Dev Console Floating */}
      <DevConsolePanel logs={logs} visible={visible} setVisible={setVisible} clear={clear} />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-2xl bg-white border border-gray-200 p-0 shadow-sm">
          {/* Scroll Container with sticky header inside */}
          <div
            ref={scrollRef}
            className="p-4 md:p-6 space-y-3 overflow-y-auto no-scrollbar"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)", maxHeight: "70vh" }}
          >
            {/* Sticky top header (logo + titles + progress) */}
            <div className="sticky top-0 z-20 -mx-4 md:-mx-6 px-4 md:px-6 py-3 md:py-4 bg-white/90 backdrop-blur border-b border-gray-200">
              <div className="flex items-center gap-3">
                {logoOk ? (
                  <img src={LOGO_URL} alt="logo" className="h-6 w-auto" onError={() => setLogoOk(false)} />
                ) : (
                  <div className="h-6 w-6 rounded bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">LOGO</div>
                )}
                <div>
                  <h1 className="text-base md:text-lg font-semibold leading-tight">神農原養 — AI靈膳魔導師</h1>
                  <p className="text-xs text-gray-500">專屬食用攻略與藥膳搭配</p>
                </div>
              </div>
              <div
                className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-full bg-gray-800" style={{ width: progressPct + "%", transition: "width .3s ease" }} />
              </div>
            </div>

            {/* Conversation / Flow */}
            <AnimatePresence initial={false}>
              {phase === "intro" && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="space-y-4">
                    <div className="w-full flex justify-start">
                      <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                        {OPENING.title && <h3 className="m-0 font-medium">{OPENING.title}</h3>}
                        <p className="mt-2">{OPENING.body}</p>
                        <button
                          className="px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow transition"
                          onClick={start}
                        >
                          🪄 {OPENING.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === "preparing" && (
                <motion.div
                  key="preparing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="w-full flex justify-start">
                    <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">AI靈膳魔導師</span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <span>{PREPARING_TEXTS[preparingIdx]}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === "asking" && (
                <motion.div key="asking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  {answers.map((a, i) => (
                    <motion.div key={`a-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.02 }}>
                      <div className="w-full flex justify-start">
                        <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                          <strong>{a.title}</strong>
                        </div>
                      </div>
                      <div className="h-1" />
                      <div className="w-full flex justify-end">
                        <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-gray-100">
                          <span>{cleanLabel(a.option.label)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {idx < questions.length && (
                    <motion.div key={`q-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-3">
                      <div className="w-full flex justify-start">
                        <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                          <div className="mt-1 text-base font-medium">
                            <Typewriter text={questions[idx].title} startKey={`${idx}-${phase}`} speed={95} onDone={() => setQuestionTyped(true)} />
                          </div>
                        </div>
                      </div>
                      {showOptions && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {questions[idx].options.map((opt) => (
                            <button
                              key={opt.key}
                              className="px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow transition text-left"
                              onClick={() => onChoose(questions[idx], opt)}
                            >
                              {cleanLabel(opt.label)}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {phase === "analyzing" && (
                <motion.div key="analyzing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  <div className="w-full flex justify-start">
                    <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">AI靈膳魔導師分析中</span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      </div>
                      {analyzingStep >= 1 && (
                        <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                          生成建議卡片
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === "result" && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-4">
                  <div className="space-y-3">
                    {answers.map((a, i) => (
                      <div key={`r-${i}`} className="space-y-2">
                        <div className="w-full flex justify-start">
                          <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                            <strong>{a.title}</strong>
                          </div>
                        </div>
                        <div className="w-full flex justify-end">
                          <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-gray-100">
                            <div>{cleanLabel(a.option.label)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full flex justify-start">
                    <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                      <h3 className="m-0 font-medium">AI靈膳魔導師分析</h3>
                      <div className="mt-4 space-y-4">
                        <div className="text-center">
                          <div className="text-sm md:text-base font-medium text-gray-700">您的氣血分數</div>
                          <div className="mx-auto mt-3 w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-gray-300 flex items-center justify-center shadow-sm">
                            <span className="text-5xl md:text-6xl font-extrabold tracking-wider">{score2}</span>
                          </div>
                        </div>
                        <div className="text-base md:text-lg text-gray-800 font-medium">靈膳魔導師語錄：{prof.quote}</div>
                        <p className="text-gray-800">{prof.feature}</p>
                        {focus && <p className="text-gray-800">{focusTip(focus)}</p>}
                        <div className="text-sm text-gray-600">點擊下方按鈕加入官方 LINE，獲取更多資訊</div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <a
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow transition"
                            href={lineDeepLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <svg width="20" height="20" viewBox="0 0 64 64" aria-hidden>
                              <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="#06C755" />
                              <text x="32" y="42" fontSize="22" fontFamily="Arial, Helvetica, sans-serif" fill="#fff" textAnchor="middle">
                                LINE
                              </text>
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

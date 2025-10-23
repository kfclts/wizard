import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as QR from "qrcode";
import './index.css';

import {
  Answer, Focus, Option, Question,
  encodeState, decodeState, sumScore, pickFocus, profileByScore, focusTip
} from './logic';

const OPENING = {
  title: "靈膳魔導師",
  body: "透過 7 題簡單問答，靈膳魔導師將為您分析體質屬性，並依結果推薦專屬燕窩食用攻略與安永鮮物藥膳湯品搭配建議，打造您的每日靈膳儀式感。",
  cta: "開始測驗",
};

const QUESTIONS_7: Question[] = [
  { id: "Q1", title: "您最近氣色如何？", prompt: "請選擇最貼近的描述：", options: [
    { key: "A", label: "A 紅潤光澤", score: 3 },
    { key: "B", label: "B 普通", score: 2 },
    { key: "C", label: "C 蒼白乾黃", score: 1 },
  ]},
  { id: "Q2", title: "您近期作息最接近哪一種？", prompt: "請選擇最貼近的描述：", options: [
    { key: "A", label: "A 規律", score: 3 },
    { key: "B", label: "B 偶爾熬夜", score: 2 },
    { key: "C", label: "C 經常晚睡", score: 1 },
  ]},
  { id: "Q3", title: "您認為自己的體質傾向是？", prompt: "請選擇最貼近的描述：", options: [
    { key: "A", label: "A 手腳冰冷", score: 1 },
    { key: "B", label: "B 易出汗", score: 2 },
    { key: "C", label: "C 偏熱體質", score: 3 },
  ]},
  { id: "Q4", title: "請問您的飲食習慣最接近哪一種？", prompt: "請選擇最貼近的描述：", options: [
    { key: "A", label: "A 清淡均衡", score: 3 },
    { key: "B", label: "B 喜油炸甜食", score: 1 },
    { key: "C", label: "C 愛蔬果但少蛋白質", score: 2 },
  ]},
  { id: "Q5", title: "您的壓力狀況如何？", prompt: "請選擇最貼近的描述：", options: [
    { key: "A", label: "A 很放鬆", score: 3 },
    { key: "B", label: "B 偶爾焦慮", score: 2 },
    { key: "C", label: "C 壓力大且常緊繃", score: 1 },
  ]},
  { id: "Q6", title: "最近是否感覺…", prompt: "請選擇最貼近的描述：", options: [
    { key: "A", label: "A 容易疲倦", score: 1 },
    { key: "B", label: "B 輕鬆有精神", score: 3 },
    { key: "C", label: "C 有時頭晕或氣短", score: 2 },
  ]},
  { id: "Q7", title: "想改善的重點", prompt: "請選擇最想優先改善的面向：", options: [
    { key: "A", label: "A 氣色", focus: "氣色" },
    { key: "B", label: "B 體力", focus: "體力" },
    { key: "C", label: "C 睡眠", focus: "睡眠" },
    { key: "D", label: "D 消化", focus: "消化" },
  ]},
];

function runSelfTests() {
  try {
    console.assert(profileByScore(18).key === "靈氣充盈型", "18 應為靈氣充盈型");
    console.assert(profileByScore(13).key === "氣血雙虛型", "13 應為氣血雙虛型");
    console.assert(profileByScore(9).key === "陰虛火旺型", "9 應為陰虛火旺型");
    console.assert(profileByScore(7).key === "陽氣不足型", "7 應為陽氣不足型");
    console.assert(profileByScore(6).key === "氣鬱體滯型", "6 應為氣鬱體滯型");

    const mock: Answer[] = [
      { qid: "Q1", title: "", option: { key: "A", label: "", score: 3 } },
      { qid: "Q7", title: "", option: { key: "A", label: "", focus: "氣色" } },
      { qid: "Q2", title: "", option: { key: "C", label: "", score: 1 } },
    ];
    console.assert(sumScore(mock) === 4, "sumScore 應為 4（忽略 Q7）");

    const payload = { a: 1, b: "測試" };
    const enc = encodeState(payload);
    const dec = decodeState(enc);
    console.assert(dec.a === 1 && dec.b === "測試", "encode/decode 應可往返");
  } catch (e) {
    console.warn("Self tests warning:", e);
  }
}

export default function App() {
  const [phase, setPhase] = useState<"intro" | "asking" | "result">("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [linkBase, setLinkBase] = useState<string>("");
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    runSelfTests();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("answers");
    if (encoded) {
      const data = decodeState(encoded);
      if (data?.answers) {
        setAnswers(data.answers as Answer[]);
        setPhase("result");
      }
    }
    setLinkBase(window.location.origin + window.location.pathname);
  }, []);

  const start = () => {
    setAnswers([]);
    setIdx(0);
    setPhase("asking");
  };

  const onChoose = (q: Question, opt: Option) => {
    setAnswers(prev => [...prev, { qid: q.id, title: q.title, option: opt }]);
    setTimeout(() => {
      if (idx + 1 >= QUESTIONS_7.length) {
        setPhase("result");
      } else {
        setIdx(i => i + 1);
      }
    }, 200);
  };

  const total = useMemo(() => sumScore(answers), [answers]);
  const focus = useMemo(() => pickFocus(answers), [answers]);
  const prof = useMemo(() => profileByScore(total || 0), [total]);

  const summaryText = useMemo(() => {
    if (!prof) return "";
    const tip = focusTip(focus);
    return (
      `✨ 體質分析：【${prof.key}】（${prof.range}）\n` +
      `特徵：${prof.feature}\n` +
      `燕窩建議：${prof.plan}\n` +
      (tip ? `重點改善（${focus}）：${tip}\n` : "") +
      `—— 靈膳魔導師：「${prof.quote}」`
    );
  }, [prof, focus]);

  const sharePayload = { answers, total, prof, focus, summaryText };
  const shareEncoded = encodeState(sharePayload);
  const shareLink = linkBase ? `${linkBase}?answers=${shareEncoded}` : "#";

  useEffect(() => {
    let cancelled = false;
    async function makeQR() {
      try {
        if (!shareLink || shareLink === "#") return;
        const url = await QR.toDataURL(shareLink, { width: 180, margin: 1 });
        if (!cancelled) setQrUrl(url);
      } catch {
        if (!cancelled) setQrUrl("");
      }
    }
    makeQR();
    return () => { cancelled = true; };
  }, [shareLink]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            神農原養 — 靈膳魔導師 7 題測驗
          </h1>
          <p className="text-sm text-gray-500">
            固定 7 題 · 一問一答 · 依分數產生專屬食用攻略與藥膳搭配
          </p>
        </header>

        <div className="rounded-2xl bg-white/70 backdrop-blur border border-rose-100 p-4 md:p-6 space-y-3 shadow-sm">
          <AnimatePresence initial={false}>
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <div className="space-y-4">
                  <div className="w-full flex justify-start">
                    <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                      <h3 className="m-0 font-medium">{OPENING.title}</h3>
                      <p className="mt-2">{OPENING.body}</p>
                      <button className="px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow transition" onClick={start}>
                        🪄 {OPENING.cta}
                      </button>
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
                        <span>{a.option.label}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {idx < QUESTIONS_7.length && (
                  <motion.div key={`q-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-3">
                    <div className="w-full flex justify-start">
                      <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                        <div className="text-xs uppercase tracking-wide text-rose-500 font-semibold">
                          {QUESTIONS_7[idx].id} · 第 {idx + 1} / 7 題
                        </div>
                        <div className="mt-1 text-base font-medium">{QUESTIONS_7[idx].title}</div>
                        <div className="mt-1 text-sm text-gray-600">{QUESTIONS_7[idx].prompt}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {QUESTIONS_7[idx].options.map((opt) => (
                        <button key={opt.key} className="px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow transition text-left" onClick={() => onChoose(QUESTIONS_7[idx], opt)}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {phase === "result" && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-4">
                {/* 問答摘要 */}
                <div className="space-y-3">
                  {answers.map((a, i) => (
                    <div key={`r-${i}`} className="space-y-2">
                      <div className="w-full flex justify-start">
                        <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                          <strong>{a.qid} · {a.title}</strong>
                        </div>
                      </div>
                      <div className="w-full flex justify-end">
                        <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-gray-100">
                          <div>{a.option.label}</div>
                          {typeof a.option.score === "number" && (
                            <div className="text-xs text-gray-500">配分：+{a.option.score}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI 養生師在最底 */}
                <div className="w-full flex justify-start">
                  <div className="max-w-[85%] rounded-2xl p-4 shadow-sm bg-white">
                    <h3 className="m-0 font-medium">AI 養生師：</h3>
                    <p className="mt-2 whitespace-pre-line">{summaryText}</p>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="p-4 rounded-xl border bg-white flex items-center justify-center">
                        {qrUrl ? (
                          <img src={qrUrl} alt="QR" width={180} height={180} />
                        ) : (
                          <div className="text-xs text-gray-400">QR 生成中…</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">掃描 QR 或分享連結，保存您的「專屬靈膳卷軸」：</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button className="px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow transition" onClick={() => navigator.clipboard.writeText(shareLink)}>
                            複製分享連結
                          </button>
                          <a className="inline-block" href={shareLink} target="_blank" rel="noreferrer">
                            <button className="px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow transition">在新分頁開啟</button>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button className="px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow transition"
                        onClick={() => { window.location.href = "https://example.com"; }}>
                        前往官網
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-6 text-xs text-gray-500 space-y-1">
          <div>✅ 固定 7 題，Q1–Q6 以配分計算總分，Q7 作為個人化重點建議。</div>
          <div>🛠️ 技術：React + Tailwind + Framer Motion + qrcode（DataURL）— 純前端可部署於任意靜態主機。</div>
        </footer>
      </div>
    </div>
  );
}

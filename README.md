# 神農原養 — AI靈膳魔導師

React + Vite + Tailwind + Framer Motion（純前端）。

## 快速開始
```bash
npm i
npm run dev
```

## 可調整參數（src/App.tsx 最上方）
- `LOGO_URL`：可放企業 SVG / data:URL
- `ASK_IN_ORDER`：true 依序出題；false 隨機
- `TYPE_SPEED_MS`、`OPTIONS_REVEAL_DELAY_MS`：打字與選項出現節奏
- `PREP_ROTATE_MS`、`PREP_TOTAL_MS`：「思考中／挑選題目／生成題目中」輪替與總時長
- `MAX_SCORE`：Gauge 圓形徽章滿分（預設 21）

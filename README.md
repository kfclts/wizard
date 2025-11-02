# 神農原養 — AI靈膳魔導師（React + Vite + Tailwind + Framer Motion）

## 使用
```bash
npm i
npm run dev
# http://localhost:5173
```

### 可調整參數（src/App.tsx）
- LOGO_URL：預設 /logo.svg（放在 public/logo.svg），若載入失敗自動使用備援向量
- ASK_IN_ORDER：true 依序出題；false 隨機
- TYPE_SPEED_MS：題目打字速度
- OPTIONS_REVEAL_DELAY_MS：打完題目後，選項出現的延遲
- PREP_ROTATE_MS / PREP_TOTAL_MS：「思考中／挑選題目／生成題目中」輪替與總時長
- MAX_SCORE：圓形徽章滿分（預設 21）

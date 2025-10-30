# 神農原養 — AI靈膳魔導師

## 安裝與啟動
```bash
npm i
npm run dev
```

## 可調整參數（src/App.tsx 檔案上方）
- `LOGO_URL`：左上角 Logo 路徑
- `ASK_IN_ORDER`: `true` 依序出題；`false` 隨機出題
- `TYPE_SPEED_MS`、`OPTIONS_REVEAL_DELAY_MS`、`PREP_ROTATE_MS`、`PREP_TOTAL_MS`：打字/顯示速度
- `MAX_SCORE`：Gauge 的滿分（預設 21）

# 神農原養 — AI靈膳魔導師

Vite + React + TypeScript + Tailwind + Framer Motion

## 安裝與啟動
```bash
npm i
npm run dev
# 打開 http://localhost:5173
```

## 可調整參數（`src/App.tsx` 開頭）
- `LOGO_URL`：Logo 圖檔位置（預設 `/logo.svg`）
- `ENABLE_DEV_CONSOLE_UI`：是否顯示控制台 UI（預設 `false` 完全隱藏）
- `ASK_IN_ORDER`：`true` 依序 Q1→Q7；`false` 題目順序洗牌
- `RANDOM_SEED`：固定亂數種子（數字）或 `null`（不固定）
- `USE_TIME_BASED_SEED`：當 `RANDOM_SEED=null` 時是否用時間戳產生種子
- `TYPE_SPEED_MS`：題目打字速度（毫秒/字）
- `OPTIONS_REVEAL_DELAY_MS`：題目打完至選項出現的延遲
- `PREPARING_ROTATE_INTERVAL_MS`：準備階段輪播間隔
- `PREPARING_TOTAL_MS`：準備階段總時長

## 部署到 Netlify
直接將整個專案資料夾上傳，或連結 Git 儲存庫後設定 build command：`npm run build`，publish 目錄：`dist`。

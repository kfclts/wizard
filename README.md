
# 神農原養 — AI靈膳魔導師（Gauge 版）

互動式 7 題問答，產出體質分析與建議，並以圓形 Gauge 動畫顯示氣血分數。

## 開發環境
- Vite + React + TypeScript
- TailwindCSS
- Framer Motion

## 快速開始
```bash
npm i
npm run dev
```

## 可調整參數（`src/App.tsx` 檔案頂部）
- `LOGO_URL`：左上角品牌 Logo 圖檔路徑
- `ASK_IN_ORDER`：`true` 依序 Q1→Q7；`false` 問題隨機排序
- `TYPE_SPEED_MS`：打字機速度（毫秒/字）
- `OPTIONS_REVEAL_DELAY_MS`：問題打完後多久顯示選項
- `PREP_ROTATE_MS` / `PREP_TOTAL_MS`：準備階段文案輪替/總時長
- `MAX_SCORE`：Gauge 正規化的最高分（預設 21）

## 顏色（Tailwind）
於 `tailwind.config.js` 調整：
- `brand-primary`：#204677
- `brand-accent`：#DE8634
- `brand-soft`：#ECDA73

## 注意
- 「再測一次」按鈕 **無 icon**（只有純文字）。
- LINE 連結：手機使用 `oaMessage` 自動帶入分數，桌機導向官方頁面。

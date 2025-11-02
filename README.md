# 神農原養 — AI靈膳魔導師

以 React + Vite + Tailwind + Framer Motion 實作的問答式體驗。
- 問題打字機效果，打完才出現選項
- 準備階段「思考中／為您挑選關鍵題目…／生成題目中…」
- 固定頂端標題 + 進度條（行動裝置支援 100dvh & safe-area）
- 結果頁：顯示靈系名稱 → 圓形分數徽章 → 描述（換行顯示「特徵：」）→ 語錄 → 加入 LINE（不帶分數）

## 開發
```bash
npm i
npm run dev
# http://localhost:5173
```

## 可調整參數（src/App.jsx）
- `ASK_IN_ORDER`：true 依序出題；false 隨機
- `TYPE_SPEED_MS`、`OPTIONS_REVEAL_DELAY_MS`：打字速度與選項延遲
- `PREP_ROTATE_MS`、`PREP_TOTAL_MS`：準備階段輪替與總時長
- `LOGO_URL`：預設 `/logo.svg`（把你的品牌 SVG 放到 public/logo.svg 即可）
- `LINE_URL`：官方 LINE 鏈結（不帶分數）

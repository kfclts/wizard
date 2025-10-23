# 神農原養 — AI靈膳魔導師

Vite + React + TypeScript + Tailwind + Framer Motion

## 安裝 & 執行
```bash
npm i
npm run dev
```

打開 `http://localhost:5173`

## 自訂
- **LOGO**：修改 `src/App.tsx` 最上方常數 `LOGO_URL`，並把檔案放到 `public/`。
- **控制台**：右下角 🧪 按鈕；網址加 `?debug=1` 預設開啟。
- **Sticky 進度條**：採用容器內 `position: sticky`，對 iOS/Android 友好。
- **行動遮擋**：滾動容器已加入 `env(safe-area-inset-bottom)` 留白避免被工具列擋到。

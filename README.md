# 神農原養 — AI靈膳魔導師（前端專案）

互動式 7 題問答，聊天流體驗：題目逐字打字、題目打完才出選項、隨機變體、分析動效、結果顯示圓形分數徽章、LINE 直開（手機帶入訊息）。

## 下載這個專案
在本對話中點擊下方的 **下載 ZIP** 連結。

## 本機執行
需要 Node.js 18+
```bash
npm i
npm run dev
```
打開瀏覽器：`http://localhost:5173`

## 修改 Logo（左上角）
1. 用你的檔案覆蓋 `public/logo.svg`（或改名 logo.png 也可以）。
2. 若要顯示 logo，請在 `src/App.tsx` 的標題區塊改成：
   ```tsx
   <div className="flex items-center gap-3">
     <img src="/logo.svg" alt="logo" className="h-6 w-auto" />
     <div>
       <h1 className="text-base md:text-lg font-semibold leading-tight">神農原養 — AI靈膳魔導師</h1>
       <p className="text-xs text-gray-500">專屬食用攻略與藥膳搭配</p>
     </div>
   </div>
   ```

## 修改配色
- 在 `tailwind.config.js` 中調整品牌色：
  ```js
  colors: { brand: { DEFAULT: "#111827" } }
  ```
- 進度條顏色：將 `src/App.tsx` 內 `bg-gray-800` 改成 `bg-brand` 或你喜歡的顏色類名。
- 按鈕顏色：找到 `<a className="inline-flex ...">`，自行加入 `bg-brand text-white` 等類名。

## 題庫與出題
- 固定配分在 `QUESTIONS_7`；
- 文案變體在 `Q_VARIANTS`（Q1~Q6 每次開始會隨機挑一組）；
- Q7 決定 **重點改善** 類別（氣色/體力/睡眠/消化）。

## LINE 連結（手機帶入分數 / 桌面加好友）
- 手機（iOS/Android）：`https://line.me/R/oaMessage/%40081cvuqw/?<兩位數分數>`
- 桌面：`https://line.me/ti/p/%40081cvuqw`
- 若要改用你的 LINE ID，請把 `%40081cvuqw` 改成你的 LINE 官方帳號（記得 `@` 要改 `%40`）。

## 打包與部署
```bash
npm run build
```
上傳 `dist/` 到任意靜態主機（Netlify、Vercel、GitHub Pages）即可。

---
Made with React + Vite + Tailwind + Framer Motion.

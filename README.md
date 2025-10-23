# 神農原養 — 靈膳魔導師（7 題配分版）

單頁應用（SPA）：React + TypeScript + Tailwind + Framer Motion + qrcode（DataURL）。  
特色：一問一答、Q1–Q6 配分 → 自動判定體質、Q7 個人化建議、結果卡 + 分享連結 + QR。

## 事前工作
```shell=
###	•	Node：^18.17.0 或 ^20.9.0（LTS 版最穩）
###	•	npm：>= 9（Node 18 內建 npm 9；Node 20 內建 npm 10）


$ npm -v
10.8.2
$ node -v
v22.5.1

$ npm i -D @vitejs/plugin-react

```

## 開發
```bash

npm i
npm run dev
```

## 測試（Vitest）
```bash
npm run test
```

## 打包
```bash
npm run build
npm run preview
```

## 部署建議

### Netlify
1. 連結 Git repo → New site from Git
2. Build command: `npm run build`
3. Publish directory: `dist`
4. 新增 `netlify.toml`（已處理 SPA 重寫）：
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Vercel
1. Import 專案 → Framework: **Vite**
2. Build Command: `vite build`（或 `npm run build`）
3. Output: `dist`
4. 新增 `vercel.json`（可選，確保 SPA 重寫）：
   ```json
   { "rewrites": [ { "source": "/(.*)", "destination": "/" } ] }
   ```

### GitHub Pages
1. 若部署在 `https://USER.github.io/REPO`，請在 `vite.config.ts` 設定：
   ```ts
   export default defineConfig({ base: '/REPO/' })
   ```
2. 建議使用 GitHub Actions 或 `npm run build` 後把 `dist/` 推到 `gh-pages` 分支。

### Nginx（或任何靜態伺服器）
- 指向 `dist/` 作為根目錄，並設定 SPA fallback：
  ```nginx
  location / {
    try_files $uri /index.html;
  }
  ```

## 自訂
- 問題與配分：編輯 `src/App.tsx` 內的 `QUESTIONS_7`。
- 文案與語錄：`profileByScore` 與 `focusTip` 在 `src/logic.ts`。
- 品牌/樣式：Tailwind className 或新增 CSS。

---
若你要我幫你把 **官網連結** 或 **導購連結** 接上，或要我改成 **多語**/**AB 測試**，請開 Issue 或直接留言給我。

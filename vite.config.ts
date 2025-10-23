import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // If deploying to GitHub Pages under a repo (e.g., user.github.io/repo),
  // set base: '/repo/' . For Netlify/Vercel leave as default '/'.
  // base: '/your-repo-name/',
})

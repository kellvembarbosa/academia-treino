import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serve em /academia-treino/; Vercel serve na raiz
const BASE = process.env.VERCEL ? '/' : '/academia-treino/';

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      workbox: {
        // pré-cacheia tudo, inclusive os GIFs — app inteiro offline após 1ª visita
        globPatterns: ['**/*.{js,css,html,svg,png,gif,webmanifest}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: BASE + 'index.html'
      },
      manifest: {
        name: 'Team Ferreira — Treino',
        short_name: 'Treino TF',
        description: 'Treino, dieta e lista de compras — Team Ferreira',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        background_color: '#101014',
        theme_color: '#111114',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ]
});

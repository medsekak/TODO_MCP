import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()
  ],
  server: {
    host: true, // 👈 Ajoute cette ligne pour autoriser l'accès réseau local (Wi-Fi)
    port: 5173, // Optionnel : Tu peux aussi figer le port si tu veux
  }
})

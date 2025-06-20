
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Lumatori Mindful Flow',
        short_name: 'Mindful Flow',
        description: 'Your personal mindfulness and habit tracking companion',
        start_url: '/',
        display: 'standalone',
        background_color: '#111827',
        theme_color: '#3B82F6',
        orientation: 'portrait-primary',
        categories: ['health', 'lifestyle', 'productivity'],
        icons: [
          {
            src: 'placeholder.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'placeholder.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'placeholder.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'New Journal Entry',
            short_name: 'Journal',
            description: 'Create a new journal entry',
            url: '/journal?action=new',
            icons: [
              {
                src: 'placeholder.svg',
                sizes: '192x192',
                type: 'image/svg+xml'
              }
            ]
          },
          {
            name: 'Track Habits',
            short_name: 'Habits',
            description: 'View and track your habits',
            url: '/goals',
            icons: [
              {
                src: 'placeholder.svg',
                sizes: '192x192',
                type: 'image/svg+xml'
              }
            ]
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

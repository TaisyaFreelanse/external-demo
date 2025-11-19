// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Compatibility date для Nitro
  compatibilityDate: '2025-11-14',
  
  // Настройка для работы с внешним API
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  },
  
  // Отключаем SSR для простоты (можно включить позже)
  ssr: false,
  
  // CSS
  css: ['~/assets/css/main.css'],
  
  // PostCSS конфигурация (вместо postcss.config.cjs)
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  
  // Модули
  modules: ['@nuxtjs/tailwindcss'],
  
  // Vite конфигурация для корректной работы с client-only библиотеками
  vite: {
    optimizeDeps: {
      include: ['jspdf', 'jspdf-autotable', 'jszip']
    }
  },
  
  // Мета-теги
  app: {
    head: {
      title: 'External API Demo - Event Management API Playground',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Demo site for testing External Event Management API' }
      ]
    }
  }
})


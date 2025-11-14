<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#1A1F2E] to-[#0A0F1E] text-white">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-[#007AFF] to-[#5E5CE6] bg-clip-text text-transparent">
          External API Playground
        </h1>
        <p class="text-white/60 text-sm mb-4">
          Тестовая площадка для проверки работы внешнего API создания и публикации мероприятий
        </p>
        
        <!-- API Key Info -->
        <div v-if="apiKey" class="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-green-300 text-sm font-medium mb-1">API ключ активен</p>
              <p class="text-green-200/70 text-xs font-mono break-all">{{ apiKey }}</p>
            </div>
            <button
              @click="copyApiKey"
              class="ml-4 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-300 text-sm transition-colors"
            >
              {{ copied ? 'Скопировано!' : 'Копировать' }}
            </button>
            <button
              @click="clearApiKey"
              class="ml-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 text-sm transition-colors"
            >
              Очистить
            </button>
          </div>
        </div>
        
        <div v-else class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
          <p class="text-yellow-300 text-sm">
            Для работы с API необходимо получить API ключ через форму регистрации ниже
          </p>
        </div>
      </div>

      <!-- Форма регистрации -->
      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">Регистрация и получение API ключа</h2>
        <p class="text-white/60 text-sm mb-4">
          Зарегистрируйтесь и получите уникальный API ключ для работы с API. Producer Code будет автоматически привязан к вашему ключу.
        </p>
        
        <form @submit.prevent="register" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">
              Producer Code <span class="text-red-400">*</span>
            </label>
            <input 
              v-model="registerForm.producerCode"
              type="text" 
              required
              placeholder="PROD001"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
            >
            <p class="text-xs text-white/50 mt-1">Уникальный код продюсера (будет привязан к API ключу)</p>
          </div>

          <button
            type="submit"
            :disabled="isRegistering"
            class="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isRegistering ? 'Регистрация...' : 'Зарегистрироваться и получить API ключ' }}
          </button>
        </form>

        <div v-if="registerResponse" class="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p class="text-green-300 text-sm font-medium mb-2">Регистрация успешна!</p>
          <p class="text-green-200/70 text-xs mb-2">Ваш API ключ (сохранен автоматически):</p>
          <pre class="text-green-200 text-xs font-mono break-all bg-black/30 p-2 rounded">{{ registerResponse.apiKey }}</pre>
        </div>

        <div v-if="registerError" class="mt-4 bg-red-500/20 border border-red-500/50 rounded-xl p-4">
          <p class="text-red-300 text-sm font-medium mb-2">Ошибка регистрации</p>
          <ul class="space-y-1">
            <li v-for="(errorMessage, index) in formattedRegisterErrors" :key="index" class="text-red-300 text-xs">
              {{ errorMessage }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Форма создания/обновления -->
      <div v-if="apiKey" class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">Создание/обновление черновика</h2>
        
        <form @submit.prevent="submitEvent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">
              ID мероприятия (для обновления)
            </label>
            <input 
              v-model="formData.id"
              type="text" 
              placeholder="Оставьте пустым для создания нового"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">
              Producer Name <span class="text-red-400">*</span>
            </label>
            <input 
              v-model="formData.producerName"
              type="text" 
              required
              placeholder="прод1"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
            >
            <p class="text-xs text-white/50 mt-1">Отображаемое имя продюсера (будет видно пользователям)</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">
              Название мероприятия <span class="text-red-400">*</span>
            </label>
            <input 
              v-model="formData.title"
              type="text" 
              required
              placeholder="Кулинарный интенсив"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">
              Имя автора (authorName) <span class="text-red-400">*</span>
            </label>
            <input 
              v-model="formData.authorName"
              type="text" 
              required
              placeholder="Шеф Иванов"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">
              Место проведения <span class="text-red-400">*</span>
            </label>
            <input 
              v-model="formData.location"
              type="text" 
              required
              placeholder="Москва, ул. Поварская, 12"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">
              Описание <span class="text-red-400">*</span>
            </label>
            <textarea 
              v-model="formData.description"
              required
              rows="3"
              placeholder="Погружаемся в гастрономию с шефом Ивановым"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white/80 mb-2">
                Количество участников <span class="text-red-400">*</span>
              </label>
              <input 
                v-model.number="formData.seatLimit"
                type="number" 
                required
                min="1"
                placeholder="12"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-white/80 mb-2">
                Цена за место (₽) <span class="text-red-400">*</span>
              </label>
              <input 
                v-model.number="formData.pricePerSeat"
                type="number" 
                required
                min="0"
                step="0.01"
                placeholder="7500"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">
              Часовой пояс (IANA) <span class="text-red-400">*</span>
            </label>
            <select
              v-model="formData.timezone"
              required
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all appearance-none cursor-pointer select-arrow"
            >
              <option value="">Выберите часовой пояс</option>
              <option value="Europe/Moscow">Europe/Moscow (МСК)</option>
              <option value="Asia/Sakhalin">Asia/Sakhalin (Сахалин)</option>
              <option value="Asia/Vladivostok">Asia/Vladivostok (Владивосток)</option>
              <option value="Asia/Yekaterinburg">Asia/Yekaterinburg (Екатеринбург)</option>
              <option value="Asia/Krasnoyarsk">Asia/Krasnoyarsk (Красноярск)</option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white/80 mb-2">
                Создание на клиенте (t0) <span class="text-red-400">*</span>
              </label>
              <input 
                v-model="formData.createdAtClient"
                type="datetime-local" 
                required
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-white/80 mb-2">
                Начало приема заявок (ti10) <span class="text-red-400">*</span>
              </label>
              <input 
                v-model="formData.startApplicationsAt"
                type="datetime-local" 
                required
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-white/80 mb-2">
                Окончание приема заявок (ti20) <span class="text-red-400">*</span>
              </label>
              <input 
                v-model="formData.endApplicationsAt"
                type="datetime-local" 
                required
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-white/80 mb-2">
                Начало оформления договоров (ti30) <span class="text-red-400">*</span>
              </label>
              <input 
                v-model="formData.startContractsAt"
                type="datetime-local" 
                required
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-white/80 mb-2">
                Начало мероприятия (ti40) <span class="text-red-400">*</span>
              </label>
              <input 
                v-model="formData.startAt"
                type="datetime-local" 
                required
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-white/80 mb-2">
                Окончание мероприятия (ti50) <span class="text-red-400">*</span>
              </label>
              <input 
                v-model="formData.endAt"
                type="datetime-local" 
                required
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
              >
            </div>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 bg-gradient-to-r from-[#007AFF] to-[#5E5CE6] text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Отправка...' : (formData.id ? 'Обновить черновик' : 'Создать черновик') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Форма публикации -->
      <div v-if="apiKey && lastEventId" class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">Публикация черновика</h2>
        
        <form @submit.prevent="publishEvent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">
              ID мероприятия <span class="text-red-400">*</span>
            </label>
            <input 
              v-model="publishForm.id"
              type="text" 
              required
              :placeholder="lastEventId"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
            >
          </div>

          <button
            type="submit"
            :disabled="isPublishing"
            class="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isPublishing ? 'Публикация...' : 'Опубликовать мероприятие' }}
          </button>
        </form>
      </div>

      <!-- Результаты -->
      <div v-if="response" class="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 class="text-2xl font-semibold mb-4">Ответ сервера</h2>
        <pre class="bg-black/30 rounded-xl p-4 text-sm overflow-auto max-h-96">{{ JSON.stringify(response, null, 2) }}</pre>
      </div>

      <!-- Ошибки -->
      <div v-if="error" class="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 mt-6">
        <h2 class="text-xl font-semibold mb-4 text-red-400">Ошибки валидации</h2>
        <ul class="space-y-2">
          <li v-for="(errorMessage, index) in formattedErrors" :key="index" class="text-red-300 text-sm">
            {{ errorMessage }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

// API Key management
const apiKey = ref<string>('')
const copied = ref(false)

// Загрузка API ключа из localStorage при монтировании
onMounted(() => {
  const stored = localStorage.getItem('external_api_key')
  if (stored) {
    apiKey.value = stored
  }
  
  // Установка значений по умолчанию для дат
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const twoWeeks = new Date(now)
  twoWeeks.setDate(twoWeeks.getDate() + 14)

  const formatLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  formData.value.createdAtClient = formatLocal(now)
  formData.value.startApplicationsAt = formatLocal(tomorrow)
  formData.value.endApplicationsAt = formatLocal(nextWeek)
  formData.value.startContractsAt = formatLocal(nextWeek)
  formData.value.startAt = formatLocal(twoWeeks)
  formData.value.endAt = formatLocal(twoWeeks)
})

// Сохранение API ключа
const saveApiKey = (key: string) => {
  apiKey.value = key
  localStorage.setItem('external_api_key', key)
}

// Очистка API ключа
const clearApiKey = () => {
  apiKey.value = ''
  localStorage.removeItem('external_api_key')
  response.value = null
  error.value = null
  lastEventId.value = ''
}

// Копирование API ключа
const copyApiKey = async () => {
  if (apiKey.value) {
    try {
      await navigator.clipboard.writeText(apiKey.value)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
}

// Форма регистрации
const registerForm = ref({
  producerCode: ''
})

const isRegistering = ref(false)
const registerResponse = ref<any>(null)
const registerError = ref<any>(null)

const formattedRegisterErrors = computed(() => {
  if (!registerError.value) return []
  
  if (registerError.value.errors && Array.isArray(registerError.value.errors)) {
    return registerError.value.errors.map((err: any) => err.message || err)
  }
  
  if (registerError.value.message) {
    return [registerError.value.message]
  }
  
  if (typeof registerError.value === 'string') {
    return [registerError.value]
  }
  
  return ['Произошла ошибка при регистрации']
})

const register = async () => {
  isRegistering.value = true
  registerError.value = null
  registerResponse.value = null

  try {
    const res = await fetch(`${apiBaseUrl}/api/external/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerForm.value)
    })

    const data = await res.json()
    
    if (res.ok && data.success) {
      registerResponse.value = data
      if (data.data?.apiKey) {
        saveApiKey(data.data.apiKey)
      }
    } else {
      registerError.value = data
    }
  } catch (err: any) {
    registerError.value = { message: err.message || 'Неизвестная ошибка' }
  } finally {
    isRegistering.value = false
  }
}

// Форма создания события
const formData = ref({
  id: '',
  title: 'Кулинарный интенсив',
  authorName: 'Шеф Иванов',
  location: 'Москва, ул. Поварская, 12',
  seatLimit: 12,
  pricePerSeat: 7500,
  description: 'Погружаемся в гастрономию с шефом Ивановым',
  timezone: 'Europe/Moscow',
  producerName: 'прод1',
  createdAtClient: '',
  startApplicationsAt: '',
  endApplicationsAt: '',
  startContractsAt: '',
  startAt: '',
  endAt: ''
})

const publishForm = ref({
  id: ''
})

const lastEventId = ref('')
const response = ref<any>(null)
const error = ref<any>(null)
const isSubmitting = ref(false)
const isPublishing = ref(false)

// Форматирование ошибок для отображения
const formattedErrors = computed(() => {
  if (!error.value) return []
  
  if (error.value.errors && Array.isArray(error.value.errors)) {
    return error.value.errors.map((err: any) => err.message || err)
  }
  
  if (error.value.message) {
    return [error.value.message]
  }
  
  if (typeof error.value === 'string') {
    return [error.value]
  }
  
  return ['Произошла ошибка при обработке запроса']
})

// Преобразование локальной даты в ISO строку с учетом timezone
const toISOString = (localDateTime: string, timezone: string): string => {
  if (!localDateTime) return ''
  
  const [datePart, timePart] = localDateTime.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)
  
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
  
  const date = new Date(dateStr)
  return date.toISOString()
}

// Получение заголовков с API ключом
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  
  if (apiKey.value) {
    headers['Authorization'] = `Bearer ${apiKey.value}`
  }
  
  return headers
}

const submitEvent = async () => {
  if (!apiKey.value) {
    error.value = { message: 'API ключ не установлен. Пожалуйста, зарегистрируйтесь и получите API ключ.' }
    return
  }

  isSubmitting.value = true
  error.value = null
  response.value = null

  try {
    const payload = {
      ...formData.value,
      id: formData.value.id || undefined,
      createdAtClient: toISOString(formData.value.createdAtClient, formData.value.timezone),
      startApplicationsAt: toISOString(formData.value.startApplicationsAt, formData.value.timezone),
      endApplicationsAt: toISOString(formData.value.endApplicationsAt, formData.value.timezone),
      startContractsAt: toISOString(formData.value.startContractsAt, formData.value.timezone),
      startAt: toISOString(formData.value.startAt, formData.value.timezone),
      endAt: toISOString(formData.value.endAt, formData.value.timezone)
    }

    const res = await fetch(`${apiBaseUrl}/api/external/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    
    if (res.ok && data.success) {
      response.value = data
      lastEventId.value = data.data.id
      publishForm.value.id = data.data.id
    } else {
      error.value = data
    }
  } catch (err: any) {
    error.value = { message: err.message || 'Неизвестная ошибка' }
  } finally {
    isSubmitting.value = false
  }
}

const publishEvent = async () => {
  if (!apiKey.value) {
    error.value = { message: 'API ключ не установлен. Пожалуйста, зарегистрируйтесь и получите API ключ.' }
    return
  }

  isPublishing.value = true
  error.value = null
  response.value = null

  try {
    const res = await fetch(`${apiBaseUrl}/api/external/events/publish`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(publishForm.value)
    })

    const data = await res.json()
    
    if (res.ok && data.success) {
      response.value = data
    } else {
      error.value = data
    }
  } catch (err: any) {
    error.value = { message: err.message || 'Неизвестная ошибка' }
  } finally {
    isPublishing.value = false
  }
}
</script>

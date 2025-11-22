
export type ControlPointCode = 't0'|'ti10'|'ti20'|'ti30'|'ti40'|'ti50'|'t999'
export type EventCategory = 'master-class' | 'training' | 'excursion' | 'gastro-show' | 'lecture' | 'cruise'
export type EventStatus = 'draft' | 'published'
export type UserRole = 'applicant' | 'producer' | 'moderator'

// Автор мероприятия
export interface Author {
  id: string
  lastName: string   // Фамилия
  firstName: string  // Имя
  middleName?: string // Отчество (опционально)
  title: string      // Титул (например: "Шеф-повар", "Мастер спорта")
}

export interface EventItem {
  id: string
  author: string // ID автора из справочника авторов (для внутреннего использования)
  authorName?: string // Имя автора в свободной форме (для внешнего API)
  title: string
  location: string
  startAt: string // ti40 - начало проведения мероприятия
  endAt?: string // ti50 - окончание проведения мероприятия
  seatLimit?: number
  priceTotal: number
  pricePerSeat?: number
  image?: string
  controlPlan: ControlPointCode[]
  category?: EventCategory
  description?: string
  activities?: string[]
  startApplicationsAt?: string // ti10 - начало приема заявок
  endApplicationsAt?: string // ti20 - окончание приема заявок
  startContractsAt?: string // ti30 - начало оформления договоров
  status?: EventStatus // draft (черновик) | published (опубликовано)
  producerName?: string // Имя продюсера, создавшего мероприятие
  producerCode?: string // Идентификатор продюсера (для проверки прав)
  timezone?: string // IANA timezone identifier (например, "Europe/Moscow", "Asia/Sakhalin")
  createdAt?: string // Дата создания мероприятия
  updatedAt?: string // Дата последнего обновления
}
export interface FavoriteItem { eventId: string; pinnedAt: string }
export interface PaymentEntry {
  amount: number
  createdAt: string
  paymentId?: string // ID платежа (опционально)
  status?: string // Статус платежа (опционально)
}
export interface Applicant {
  code: string
  login?: string // Логин заявителя (на платформе все заявители авторизованы, логин всегда доступен)
  seats: number
  paidAmount: number
  payments?: PaymentEntry[]
}
// Персональный расчет для участника (рассчитывается на сервере)
export interface PersonalCalculation {
  applicantCode: string
  applicantLogin?: string // Логин заявителя
  status: 'success' | 'overflow' | 'failed' // Успешно в лимите | Сверх лимита | Сбор не состоялся
  expectedPayment?: number // Ожидаемый платеж (в копейках)
  totalPaid: number // Фактически внесено (в копейках)
  extraContribution?: number // Переплата (в копейках)
  deficit?: number // Недоплата (в копейках)
  share?: number // Доля в распределении профицита (0-1)
  refundFromSurplus?: number // Возврат из профицита (в копейках)
  refundTotal: number // Итого к возврату (в копейках)
  pricePerSeat?: number // Цена за место (в копейках)
  surplusAvailable?: number // Доступный профицит для распределения (в копейках)
  overflowTotal?: number // Сумма возврата сверхлимитчикам (в копейках)
  // Для статуса 'overflow':
  reason?: 'lower' | 'late' // Причина выхода за лимит: меньшая сумма или поздний платеж
  thresholdAmount?: number | null // Пороговая ставка (в копейках)
  thresholdTime?: number | null // Время порогового платежа (timestamp)
  selectedTime?: number | null // Время платежа участника (timestamp)
}

export interface MonitoringSnapshot {
  eventId: string
  nowPoint: ControlPointCode
  collected?: number
  deficit?: number
  surplus?: number
  isCancelled?: boolean
  applicants: Applicant[]
  deadlineNext?: string
  // Готовые персональные расчеты для всех участников (рассчитываются на сервере)
  personalCalculations?: PersonalCalculation[]
}


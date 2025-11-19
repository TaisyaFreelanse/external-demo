/**
 * Payment entry represents a single payment made by an applicant
 */
export interface PaymentEntry {
  amount?: number
  createdAt: string
  paymentId?: string
  status?: string
}

/**
 * Applicant represents a person who applied for the event
 */
export interface Applicant {
  code?: string
  login?: string
  seats?: number
  paidAmount?: number
  payments?: PaymentEntry[]
}

/**
 * MonitoringSnapshot represents the current state of event monitoring data
 */
export interface MonitoringSnapshot {
  applicants: Applicant[]
  collected?: number
}


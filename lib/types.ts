export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  email: string
  name: string
  businessName?: string
  logo?: string
  taxId?: string
  createdAt: Date
}

export interface Customer {
  id: string
  userId: string
  name: string
  email: string
  phone?: string
  address?: string
  taxId?: string
  createdAt: Date
}

export interface InvoiceItem {
  id?: string
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  userId: string
  customerId: string
  invoiceNumber: string
  description?: string
  amount: number
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED'
  dueDate?: Date
  issueDate: Date
  paidDate?: Date
  items: InvoiceItem[]
  notes?: string
  terms?: string
  emailSent: boolean
  createdAt: Date
}

export interface Payment {
  id: string
  userId: string
  invoiceId: string
  amount: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  method: 'CARD' | 'ACH' | 'WIRE' | 'CHECK'
  stripePaymentIntentId?: string
  createdAt: Date
}

export interface Settings {
  id: string
  userId: string
  autoReminder: boolean
  reminderDays: number
  timezone: string
  emailTemplate: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

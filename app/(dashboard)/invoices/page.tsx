'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils'

interface Invoice {
  id: string
  invoiceNumber: string
  amount: string
  status: string
  dueDate?: string
  customer: {
    name: string
  }
  createdAt: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchInvoices()
  }, [statusFilter])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const url = new URL('/api/invoices', window.location.origin)
      if (statusFilter) {
        url.searchParams.set('status', statusFilter)
      }

      const response = await fetch(url)
      const result = await response.json()
      if (result.success) {
        setInvoices(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'badge-gray',
      SENT: 'badge-warning',
      VIEWED: 'badge-warning',
      PAID: 'badge-success',
      PARTIALLY_PAID: 'badge-warning',
      OVERDUE: 'badge-danger',
      CANCELLED: 'badge-gray',
    }
    return colors[status] || 'badge-gray'
  }

  const statuses = [
    'DRAFT',
    'SENT',
    'VIEWED',
    'PAID',
    'PARTIALLY_PAID',
    'OVERDUE',
    'CANCELLED',
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage your invoices and track payments</p>
        </div>
        <Link
          href="/invoices/create"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + Create Invoice
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
        >
          <option value="">All Invoices</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="card p-12 text-center">
          <div className="text-lg text-gray-600">Loading invoices...</div>
        </div>
      ) : invoices.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-lg text-gray-600 mb-4">No invoices found</div>
          <Link
            href="/invoices/create"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Your First Invoice
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {invoice.customer?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(Number(invoice.amount))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(new Date(invoice.createdAt))}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

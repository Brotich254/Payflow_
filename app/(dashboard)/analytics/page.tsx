'use client'

import { useEffect, useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface AnalyticsData {
  pending: {
    invoices: any[]
    total: number
    count: number
  }
  overdue: {
    invoices: any[]
    total: number
    count: number
  }
  revenue: {
    totalRevenue: number
    totalOutstanding: number
    invoiceCount: number
    paidPercentage: number
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [revenueRes, pendingRes, overdueRes] = await Promise.all([
        fetch('/api/analytics/revenue'),
        fetch('/api/analytics/pending'),
        fetch('/api/analytics/overdue'),
      ])

      const [revenue, pending, overdue] = await Promise.all([
        revenueRes.json(),
        pendingRes.json(),
        overdueRes.json(),
      ])

      if (revenue.success && pending.success && overdue.success) {
        setData({
          revenue: revenue.data,
          pending: pending.data,
          overdue: overdue.data,
        })
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">View your financial metrics and insights</p>
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="text-lg text-gray-600">Loading analytics...</div>
        </div>
      ) : data ? (
        <>
          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(Number(data.revenue.totalRevenue))}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {data.revenue.paidPercentage}% paid
              </div>
            </div>

            <div className="card p-6">
              <div className="text-sm text-gray-600 mb-2">Outstanding</div>
              <div className="text-3xl font-bold text-orange-600">
                {formatCurrency(Number(data.revenue.totalOutstanding))}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {data.pending.count} pending
              </div>
            </div>

            <div className="card p-6">
              <div className="text-sm text-gray-600 mb-2">Overdue Invoices</div>
              <div className="text-3xl font-bold text-red-600">
                {formatCurrency(Number(data.overdue.total))}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {data.overdue.count} invoices
              </div>
            </div>

            <div className="card p-6">
              <div className="text-sm text-gray-600 mb-2">Total Invoices</div>
              <div className="text-3xl font-bold text-blue-600">
                {data.revenue.invoiceCount}
              </div>
              <div className="text-xs text-gray-500 mt-2">All time</div>
            </div>
          </div>

          {/* Pending Invoices */}
          <div className="card p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Pending Invoices ({data.pending.count})
            </h3>
            {data.pending.invoices.length === 0 ? (
              <p className="text-gray-600">No pending invoices</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Invoice
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Customer
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.pending.invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-4 py-2 text-gray-900">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {invoice.customer?.name}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {formatCurrency(Number(invoice.amount))}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {invoice.dueDate
                            ? formatDate(new Date(invoice.dueDate))
                            : 'No due date'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Overdue Invoices */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Overdue Invoices ({data.overdue.count})
            </h3>
            {data.overdue.invoices.length === 0 ? (
              <p className="text-gray-600">No overdue invoices</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Invoice
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Customer
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Days Overdue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.overdue.invoices.map((invoice) => {
                      const daysOverdue = Math.floor(
                        (Date.now() -
                          new Date(invoice.dueDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                      return (
                        <tr key={invoice.id}>
                          <td className="px-4 py-2 text-gray-900">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {invoice.customer?.name}
                          </td>
                          <td className="px-4 py-2 text-gray-900">
                            {formatCurrency(Number(invoice.amount))}
                          </td>
                          <td className="px-4 py-2">
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              {daysOverdue} days
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}

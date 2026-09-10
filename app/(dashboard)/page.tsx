'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface DashboardData {
  totalRevenue: number
  totalOutstanding: number
  invoiceCount: number
  paidPercentage: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics/revenue')
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {session?.user?.name}!</h1>
        <p className="text-gray-600">Here's your business overview</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      ) : data ? (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(Number(data.totalRevenue))}
              </div>
              <div className="text-xs text-gray-500 mt-2">{data.invoiceCount} invoices</div>
            </div>

            <div className="card p-6">
              <div className="text-sm text-gray-600 mb-2">Outstanding</div>
              <div className="text-3xl font-bold text-orange-600">
                {formatCurrency(Number(data.totalOutstanding))}
              </div>
              <div className="text-xs text-gray-500 mt-2">Awaiting payment</div>
            </div>

            <div className="card p-6">
              <div className="text-sm text-gray-600 mb-2">Payment Rate</div>
              <div className="text-3xl font-bold text-blue-600">
                {data.paidPercentage}%
              </div>
              <div className="text-xs text-gray-500 mt-2">Invoices paid</div>
            </div>

            <div className="card p-6">
              <div className="text-sm text-gray-600 mb-2">Actions</div>
              <Link
                href="/invoices/create"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Create Invoice
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/invoices/create"
                  className="block p-3 rounded-lg hover:bg-blue-50 text-blue-600 font-medium transition-colors"
                >
                  + Create New Invoice
                </Link>
                <Link
                  href="/customers"
                  className="block p-3 rounded-lg hover:bg-gray-100 text-gray-900 font-medium transition-colors"
                >
                  + Add Customer
                </Link>
                <Link
                  href="/invoices"
                  className="block p-3 rounded-lg hover:bg-gray-100 text-gray-900 font-medium transition-colors"
                >
                  → View All Invoices
                </Link>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Getting Started</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Account created successfully</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-400">○</span>
                  <span>Create your first invoice</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-400">○</span>
                  <span>Setup Stripe payments</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-400">○</span>
                  <span>Configure email templates</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

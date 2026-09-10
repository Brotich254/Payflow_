'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  invoices: any[]
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      const result = await response.json()
      if (result.success) {
        setCustomers(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: '', email: '', phone: '', address: '', taxId: '' })
        setShowForm(false)
        fetchCustomers()
      }
    } catch (error) {
      console.error('Failed to create customer:', error)
    }
  }

  const deleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure?')) return

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCustomers()
      }
    } catch (error) {
      console.error('Failed to delete customer:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customers and their invoices</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? '✕ Close' : '+ Add Customer'}
        </button>
      </div>

      {/* Add Customer Form */}
      {showForm && (
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">New Customer</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Customer Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="input"
            />
            <input
              type="text"
              name="taxId"
              placeholder="Tax ID"
              value={formData.taxId}
              onChange={handleChange}
              className="input"
            />
            <button
              type="submit"
              className="btn-primary md:col-span-2"
            >
              Create Customer
            </button>
          </form>
        </div>
      )}

      {/* Customers Grid */}
      {loading ? (
        <div className="card p-12 text-center">
          <div className="text-lg text-gray-600">Loading customers...</div>
        </div>
      ) : customers.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-lg text-gray-600 mb-4">No customers yet</div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Add Your First Customer
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {customer.name}
                  </h3>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
              </div>

              {customer.phone && (
                <p className="text-sm text-gray-600 mb-2">📱 {customer.phone}</p>
              )}
              {customer.address && (
                <p className="text-sm text-gray-600 mb-3">📍 {customer.address}</p>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  {customer.invoices?.length || 0} invoices
                </p>
                <div className="flex space-x-2">
                  <Link
                    href={`/invoices/create?customerId=${customer.id}`}
                    className="flex-1 text-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    New Invoice
                  </Link>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

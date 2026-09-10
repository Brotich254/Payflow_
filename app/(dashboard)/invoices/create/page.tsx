'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

interface Customer {
  id: string
  name: string
  email: string
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    customerId: searchParams.get('customerId') || '',
    description: '',
    dueDate: '',
    notes: '',
    terms: '',
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
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.customerId || items.some((i) => !i.description || !i.unitPrice)) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: calculateTotal(),
          items: items.map(({ id, ...item }) => item),
        }),
      })

      if (response.ok) {
        router.push('/invoices')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create invoice')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Invoice</h1>

      {error && (
        <div className="card p-4 mb-6 bg-red-50 border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Selection */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer *
              </label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                required
                className="input"
              >
                <option value="">Select a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Invoice description (optional)"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Line Items</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(item.id, 'description', e.target.value)
                    }
                    placeholder="e.g., Consulting Services"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(item.id, 'quantity', parseInt(e.target.value))
                    }
                    min="1"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value))
                    }
                    step="0.01"
                    placeholder="0.00"
                    className="input"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            + Add Item
          </button>
        </div>

        {/* Total */}
        <div className="card p-6 bg-blue-50">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Total Amount:</span>
            <span className="text-3xl font-bold text-blue-600">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Info</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any notes to include on the invoice"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms & Conditions
              </label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleInputChange}
                rows={3}
                placeholder="Payment terms, conditions, etc."
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

'use client'

export default function PaymentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
      <p className="text-gray-600 mb-8">Track and manage your payments</p>

      <div className="card p-12 text-center">
        <div className="text-lg text-gray-600 mb-4">💳 Payment History</div>
        <p className="text-gray-500">Payment records will appear here as customers pay your invoices</p>
      </div>
    </div>
  )
}
